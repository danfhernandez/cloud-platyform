//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var nodeGit = require("nodegit");
const pulumiAutoApi = require("@pulumi/pulumi/x/automation");
const upath = require("upath");
const request = require("superagent");
const fs = require("fs");
const extract = require('extract-zip')
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/platyDB", { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
 });


//////////////////////////// Schemas / Models //////////////////////////////


const serviceInstancesSchema = {
    name: String,
    inputs: Object,
    outputs: Object
}

const ServiceInstance = mongoose.model("ServiceInstance", serviceInstancesSchema);
 
const serviceSchema = {
    name: String,
    displayName: String,
    githubUrl: String, 
    instances: [serviceInstancesSchema] 
}

const Service = mongoose.model("Service", serviceSchema);


//////////////////////////// Services //////////////////////////////


app.route("/services")
    .get((req, res) => {
        Service.find((err, services) => {
            if (!err) {
                res.send(services);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        // TODO: save to s3 bucket for versioning
        // TODO: make s3 bucket pulumi program for service?
        // create an inline pulumi program for the s3 bucket after creating
        const service = new Service({
            githubUrl: req.body.githubUrl,
            name: req.body.name, 
            displayName: req.body.displayName,
            inputs: {}, // gather from the config file in the repo
            pulumi: {
                project: "",
                stack: ""
            }
        });
        service.save((err) => {
            if (!err) {
                res.send("Successfully added a new service.");
            } else {
                res.send(err);
            }
        });
    })

app.route("/services/:serviceName")
    .get((req, res) => {
        Service.findOne({ name: req.params.serviceName }, (err, service) => {
            if (!err) {
                if (service) {
                    res.send(service);
                } else {
                    res.send("No services matching that name was found.");
                }
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        // TODO: Make sure there are no running instances of this service 
        // otherwise, block the delete.
        Service.deleteOne({name: req.params.serviceName}, (err) => {
            if (!err) {
                res.send("Successfully deleted article.")
            } else {
                res.send(err);
            }
        })
    });


///////////////////////////// Service Instances //////////////////////////////


app.route("/services/:serviceName/instances")
    .get((req, res) => {
        Service.findOne({ name: req.params.serviceName }, (err, service) => {
            if (!err) {
                if (service) {
                    res.send(service.instances);
                } else {
                    res.send("No services matching that name was found.");
                }
            } else {
                res.send(err);
            }
        });
    })
    .post(async (req, res) => {
        // TODO: S3
        // TODO: figure out how to handle inputs / config
        // TODO: setup nodemon to ignore the tmp directory
        Service.findOne({ name: req.params.serviceName }, async (err, service) => {
            const zipFile = 'master.zip';
            const href = `${service.githubUrl}/archive/${zipFile}`;
            const guid = uuidv4();
            const outputDir = upath.joinSafe(__dirname, "tmp", `${service.name}-master-${guid}`);

            const args = {
                stackName: req.body.name,
                workDir: outputDir + "/" + `${service.name}-master`,
            };

            console.info("retrieving program from github...");
            await new Promise((resolve) => {
                request(href)
                .pipe(fs.createWriteStream(zipFile))
                .on('finish', () => {
                    extract(zipFile, { dir: outputDir }).then(() => {
                        console.info("finished retrieving program from github.");
                        
                        console.info("installing dependencies...");
                        exec("npm i", { cwd: args.workDir , shell: true},(error, stdout, stderr) => {
                            if (error) {
                                console.log(`error: ${error.message}`);
                            } else {
                                console.log(`stderr: ${stderr}`);
                                console.log(`stdout: ${stdout}`);
                                console.info("dependencies installed");
                            }
                            resolve();
                        });
                    });
                })
            });

            // create (or select if one already exists) a stack that uses our local program
            console.info("initializing stack...");
            const stack = await pulumiAutoApi.LocalWorkspace.createOrSelectStack(args);
            console.info("successfully initialized stack");
            
            console.info("setting up config");
            await stack.setConfig("aws:region", { value: "us-east-1" });
            console.info("config set");
            
            // is this step necessary because of the config step?
            // possible to setup config as part of create stack?
            console.info("refreshing stack...");
            await stack.refresh({ onOutput: console.info });
            console.info("refresh complete");
            
            console.info("updating stack...");
            const upRes = await stack.up({ onOutput: console.info });
            console.info(`update summary object: ${JSON.stringify(upRes.summary)}`);
            console.log(`update summary: \n${JSON.stringify(upRes.summary.resourceChanges, null, 4)}`);
            console.log(`outputs: ${JSON.stringify(upRes.outputs)}`);

            const serviceInstance = new ServiceInstance({
                name: req.body.name,
                inputs: {something: "put inputs here"}, // maybe collect all inputs from other body args
                outputs: upRes.outputs
            });
        
            service.instances.push(serviceInstance);
            service.save((err) => {
                if (!err) {
                    res.send("Successfully added a new instance for "+service.name+".");
                } else {
                    res.send(err);
                }
            });
        });
    })
    // // TODO: probably just delete this
    // .delete((req, res) => {
    //     Service.deleteMany((err) => {
    //         if (!err) {
    //             res.send("Successfully deleted all " + req.params.serviceName + " instances.");
    //         } else {
    //             res.send(err);
    //         }
    //     });
    // });

app.route("/services/:serviceName/instances/:instanceName")
    .get((req, res) => {
        Service.findOne({ name: req.params.serviceName }, (err, service) => {
            if (!err) {
                if (service) {
                    const instance = service.instances.find((i) => {
                        return i.name == req.params.instanceName 
                    });
                    if (instance) {
                        res.send(instance)
                    } else {
                        res.send("No instance with name for " + service.name + " found.");
                    }
                } else {
                    res.send("No services matching that name was found.");
                }
            } else {
                res.send(err);
            }
        });
    })
    // .put((req, res) => {
    //     // TODO: this will entail pulling down the stack updating config and 
    //     // running pulumi up again 
    //     Service.findOne({ name: req.params.serviceName }, (err, service) => {
    //         if (!err) {
    //             if (service) {
    //                 const instance = service.instances.find((i) => {
    //                     return i.name == req.params.instanceName 
    //                 });
    //                 if (instance) {
    //                     instance.name = req.body.name;
    //                     instance.inputs = {something: "put inputs here"}, // maybe collect all inputs from other params?
    //                     instance.outputs = {something: "put outputs of running pulumi here..."}
    //                     service.save((err) => {
    //                         if (!err) {
    //                             res.send("Successfully updated "+req.params.serviceName+" instance.");
    //                         } else {
    //                             res.send(err)
    //                         }
    //                     });
    //                 } else {
    //                     res.send("No instance for " + service.name + " found with name: " + req.params.instanceName + ".");
    //                 }
    //             } else {
    //                 res.send("No service matching that name was found.");
    //             }
    //         } else {
    //             res.send(err);
    //         }
    //     });
    // })
    .delete(async (req, res) => {
        const guid = uuidv4();
        const outputDir = upath.joinSafe(__dirname, "tmp", `${req.params.serviceName}-master-${guid}`);
        const args = {
            stackName: req.params.instanceName,
            workDir: outputDir + "/" + `${req.params.serviceName}-master`,
        };

        console.info("retrieving program from github...");
        await new Promise((resolve) => {
            Service.findOne({ name: req.params.serviceName }, async (err, service) => {
                const zipFile = 'master.zip';
                const href = `${service.githubUrl}/archive/${zipFile}`;
                request(href)
                .pipe(fs.createWriteStream(zipFile))
                .on('finish', () => {
                    extract(zipFile, { dir: outputDir }).then(() => {
                        console.info("finished retrieving program from github.");
                        
                        console.info("installing dependencies...");
                        exec("npm i", { cwd: args.workDir , shell: true},(error, stdout, stderr) => {
                            if (error) {
                                console.log(`error: ${error.message}`);
                            } else {
                                console.log(`stderr: ${stderr}`);
                                console.log(`stdout: ${stdout}`);
                                console.info("dependencies installed");
                            }
                            resolve();
                        });
                    });
                })
            });
        });

        console.info("initializing stack...");
        const stack = await pulumiAutoApi.LocalWorkspace.selectStack(args);
        console.info("successfully initialized stack");

        console.info("destroying stack...");
        const destroyResult = await stack.destroy({onOutput: console.info});
        console.info("stack destroy complete");
        console.log(`destroy result: ${JSON.stringify(destroyResult)}`);

        console.info("removing stack...");
        await stack.workspace.removeStack(args.stackName);
        console.info("stack removal complete");
        Service.findOneAndUpdate({ name: req.params.serviceName }, { $pull: { "instances": { name: req.params.instanceName } } }, (err) => {
            if (!err) {
                res.send("Successfully deleted instance of " + req.params.serviceName + ".");
            } else {
                res.send(err);
            }
        });
    });


///////////////////////////// SERVER SETUP //////////////////////////////


app.listen(3000, function() {
  console.log("Server started on port 3000");
});