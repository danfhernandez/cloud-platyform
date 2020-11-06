import React, { useEffect, useState } from "react";
import ServiceInstance from "./ServiceInstance";
import axios from "axios";
import { Card, Button, Table, Form, Modal, Accordion} from "react-bootstrap"
function Service(props) {
    const [serviceInstances, setServiceInstances] = useState([{}]);
    const [service, setService] = useState({});
    const [newInstanceName, setNewInstanceName] = useState("");
    const [newInstanceDisplayName, setNewInstanceDisplayName] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { serviceName, updateServices } = props;

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
                setService(response.data);
            }
            ).catch(err => {
                console.log("Setting loading false in updateServiceData catch");
                console.log(err);
                setLoading(false);
            })
    }
    useEffect(() => {
        console.log("In use effect with serviceName: " + serviceName );
        updateServiceData();
    }, []);

    function newInstanceHandler() {
        console.log("Setting loading true in new instance handler");
        setLoading(true);
        axios.post("http://localhost:3000/services/" + serviceName + "/instances", { "name": newInstanceName, "displayName": newInstanceDisplayName })
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
    function handleChangeNewInstanceDisplayName(event) {
        setNewInstanceDisplayName(event.target.value);
    }

    function handleDeleteService() {
        setDeleting(true);
        axios.delete("http://localhost:3000/services/" + serviceName)
            .then(response => {
                console.log('Success:', response);
                setDeleting(false);
                updateServices();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <div id="page-content-wrapper">
            <div class="container-fluid">
                <h2 class="my-4 mx-4 text-muted"> {service.displayName}
                        <a class="btn btn-outline-l-purp ml-3 mr-2 btn-sm" href={service.githubUrl} target="_blank">View Docs</a>
                    {deleting ? (
                        <Button disabled onClick={handleDeleteService} size="sm" variant="outline-red">Deleting...</Button>) : (
                        serviceInstances.length === 0 ? (
                        <Button onClick={handleDeleteService} size="sm" variant="outline-red">Delete</Button>) : (
                            null
                        ))}
                    <Button onClick={handleShow} className="float-right mt-2" variant="outline-green" size="sm">New Instance</Button>
                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Create {serviceName} Instance</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control disabled={loading} className="mb-2" value={newInstanceDisplayName} type="text" onChange={handleChangeNewInstanceDisplayName} placeholder="Display Name" />
                            <Form.Control disabled={loading} className="mb-2" value={newInstanceName} type="text" onChange={handleChangeNewInstanceName} placeholder="Instance Name (Must be unique)" />
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
                                        <th class="text-left pl-4">Display Name</th>
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
                                                displayName={serviceInstance.displayName}
                                                instanceName={serviceInstance.name}
                                                outputs={serviceInstance.outputs}
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