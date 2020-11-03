import React, { useEffect, useState } from "react";
import ServiceInstance from "./ServiceInstance";
import axios from "axios";
import { Card, Button, Table, Form, Modal } from "react-bootstrap"
function Service(props) {
    const [serviceInstances, setServiceInstances] = useState([{}]);
    const [newInstanceName, setNewInstanceName] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { serviceName, updateServices, githubUrl, displayName } = props;

    //modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function updateServiceData() {
        axios.get("http://localhost:3000/services/" + serviceName)
            .then(response => {
                console.log("Service result: ")
                console.log(response.data);
                console.log("Setting loading false in updateServiceData");
                setLoading(false);
                setServiceInstances(response.data.instances ?? []);
            }
            ).catch(err => {
                console.log("Setting loading false in updateServiceData catch");
                console.log(err);
                setLoading(false);
            })
    }
    useEffect(() => {
        updateServiceData();
    }, []);

    function newInstanceHandler() {
        console.log("Setting loading true in new instance handler");
        setLoading(true);
        axios.post("http://localhost:3000/services/" + serviceName + "/instances", { "name": newInstanceName })
            .then(response => {
                console.log('Success:', response);
                console.log("Setting loading false in newInstanceHandler");
                setLoading(false);
                handleClose();
                updateServiceData();
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }

    function handleChangeNewInstanceName(event) {
        setNewInstanceName(event.target.value);
    }

    function handleDeleteService() {
        setDeleting(true);
        axios.delete("http://localhost:3000/services/" + serviceName)
            .then(response => {
                console.log('Success:', response);
                updateServices()
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <div id="page-content-wrapper">
            <div class="container-fluid">
                <h2 class="my-4 mx-4 text-muted"> {displayName}
                        <a class="btn btn-outline-l-purp ml-3 mr-2 btn-sm" href={githubUrl} target="_blank">View Docs</a>
                    {deleting ? <Button disabled onClick={handleDeleteService} size="sm" variant="outline-red">Deleting...</Button> : <Button onClick={handleDeleteService} size="sm" variant="outline-red">Delete</Button>}
                    <Button onClick={handleShow} className="float-right mt-2" variant="outline-green" size="sm">New Instance</Button>
                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Create {serviceName} Instance</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {loading ? (
                                <Form.Control disabled className="mb-2" value={newInstanceName} type="text" onChange={handleChangeNewInstanceName} placeholder="Instance Name" />
                            ) : (
                                <Form.Control className="mb-2" value={newInstanceName} type="text" onChange={handleChangeNewInstanceName} placeholder="Instance Name" />
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            {loading ? (
                                <Button disabled variant="outline-green">
                                    Creating...
                                </Button>
                            ) : (
                                <Button variant="outline-green" onClick={newInstanceHandler}>
                                    Create
                                </Button>
                            )}
                            
                        </Modal.Footer>
                    </Modal>
                </h2>
                <Card className="mt-4 mx-4 w-90">
                    {serviceInstances.length === 0 ? <p className="text-muted text-center mt-3 mb-3">No Service Instances</p> : (
                        <Card.Body className="px-0 py-0">
                            <Table responsive className="mb-0">
                                <thead>
                                    <tr class='text-muted'>
                                        <th class="text-left pl-4">Name</th>
                                        <th class="text-center">Status</th>
                                        <th class="text-center">Owner</th>
                                        <th class="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceInstances.map((serviceInstance, i) => {
                                        return (
                                            <ServiceInstance
                                                key={i}
                                                serviceName={serviceName}
                                                instanceName={serviceInstance.name}
                                                outputs={JSON.stringify(serviceInstance.outputs)}
                                                updateServiceData={updateServiceData}
                                            />
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Card.Body>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default Service;