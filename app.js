//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var nodeGit = require("nodegit");

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
        // TODO: grab the github url and create an s3 bucket with the information
        // maybe make it a pulumi program??
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
        // otherwise, block the delete
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
    .post((req, res) => {
        // TODO: THIS IS WHERE THE MAGIC HAPPENS
        // pull the s3 bucket locally and run pulumi up with the inputs
        // create a new project and stack if a project doesn't already exist
        // set inputs to config file

        // create object that includes all body that aren't name
        const serviceInstance = new ServiceInstance({
            name: req.body.name,
            inputs: {something: "put inputs here"}, // maybe collect all inputs from other params?
            outputs: {something: "put outputs of running pulumi here..."}
        });
        Service.findOne({ name: req.params.serviceName }, (err, service) => {
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
    // // TODO: probably just delete this.
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
    .put((req, res) => {
        // TODO: this will entail pulling down the stack updating config and 
        // running pulumi up again 
        // 2nd Priortity
        Service.findOne({ name: req.params.serviceName }, (err, service) => {
            if (!err) {
                if (service) {
                    const instance = service.instances.find((i) => {
                        return i.name == req.params.instanceName 
                    });
                    if (instance) {
                        instance.name = req.body.name;
                        instance.inputs = {something: "put inputs here"}, // maybe collect all inputs from other params?
                        instance.outputs = {something: "put outputs of running pulumi here..."}
                        service.save((err) => {
                            if (!err) {
                                res.send("Successfully updated "+req.params.serviceName+" instance.");
                            } else {
                                res.send(err)
                            }
                        });
                    } else {
                        res.send("No instance for " + service.name + " found with name: " + req.params.instanceName + ".");
                    }
                } else {
                    res.send("No service matching that name was found.");
                }
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
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