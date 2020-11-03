import Axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import Service from "./Service";
import { Button, Form, Card, Modal } from "react-bootstrap";
import axios from "axios";

function Services() {
    const [services, setServices] = useState([]);
    const [githubUrl, setGithubUrl] = useState("");
    const [currentServiceName, setCurrentServiceName] = useState("");
    const [displayName, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function updateServices() {
        // use service here and check it for null if it's not set... 
        // that means that we don't have to set the currentServiceName to it.. 
        // then choose the first in the list of services
        // or there could be a services overview page (do this later)
        fetch("http://localhost:3000/services")
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
                setServices(result);
                if (result.find(s => s.name === currentServiceName) === undefined && services.length > 0) {
                    console.log("Setting service name to the first in the list since there was a delete likely...");
                    setCurrentServiceName(services[0].name);
                }
                handleClose();
            }
        );
    }
    useEffect(() => {
        updateServices();
    }, []);
    function handleCreateService() {
        // TODO: verify that the url is in the right format.. 
        const name = githubUrl.split("/").pop();
        axios.post("http://localhost:3000/services", {name: name, githubUrl: githubUrl, displayName: displayName})
            .then(function (response) {
                console.log('Success:', response);
                updateServices();
                setGithubUrl("");
                setCurrentServiceName(name);
              })
              .catch(function (error) {
                console.log(error);
              });
    }

    function serviceNameChanged(event) {
        setName(event.target.value);
    }

    function githubRepoChanged(event) {
        setGithubUrl(event.target.value);
    }

    function updateCurrentService(event) {
        let s = services.find(s => s.name === event.target.value);
        console.log("service found: " + JSON.stringify(s));
        setCurrentServiceName(s.name);
    }
    return (
        
        <div>
            <div className="d-flex" id="wrapper">
                <div className="border-right font-weight-bold" id="sidebar-wrapper">
                    <div className="sidebar-heading  text-center"><i className="fas fa-bolt mr-1" /></div>
                    <div className="list-group list-group-flush ml-2">
                        {services.map((service, i) => <button key={i} onClick={updateCurrentService} value={service.name} className="list-group-item list-group-item-action color-dark-purp font-weight-bold">{service.displayName}</button>)}
                        <a href="#" className="py-4 list-group-item list-group-item-action color-dark-purp text-center">
                        <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Service</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                                <Form.Control className="mb-2" value={displayName} type="text" onChange={serviceNameChanged} placeholder="Display Name" />
                                <Form.Control className="mb-2" value={githubUrl} type="text" onChange={githubRepoChanged} placeholder="Github URL" />
                        </Modal.Body>
                        <Modal.Footer>
                            {loading ? (
                                <Button disabled variant="outline-green">
                                    Creating...
                                </Button>
                            ) : (
                                <Button variant="outline-green" onClick={handleCreateService}>
                                    Create
                                </Button>
                            )}
                            
                        </Modal.Footer>
                    </Modal>
                        <Button onClick={handleShow} variant="outline-green">Create New Service</Button>
                        </a>
                    </div>
                </div>
                {services.length === 0 ? (
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <Card className="mt-5 mx-4 w-90"><p className="text-muted text-center mt-3 mb-3">No Services</p></Card>
                        </div>
                    </div>
                    ) : (
                        currentServiceName === "" ? <Service key={services[0].name} updateServices={updateServices} serviceName={services[0].name}/> : <Service key={currentServiceName} updateServices={updateServices} serviceName={currentServiceName}/>
                    )}
            </div>
        </div>

    );
}

export default Services;