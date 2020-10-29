import React, { useEffect, useState } from "react";
import ServiceInstance from "./ServiceInstance";
import axios from "axios";

function Service(props) {
    const [serviceInstances, setServiceInstances] = useState([{}]);
    const [newInstanceName, setNewInstanceName] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { serviceName, updateServices } = props;

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
        <div>
            <li> {serviceName} {deleting ? "(deleting...)" : null}
                <ol>
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
                </ol>
                <ul>
                    <li>
                        {loading ? "creating new instance of service..." : (
                            <div>
                                <input value={newInstanceName} onChange={handleChangeNewInstanceName} type="text" placeholder="Name" />
                                <button onClick={newInstanceHandler}>Provision Service Instance</button>
                            </div>

                        )}

                    </li>
                </ul>
            </li>
            <li>
                <button onClick={handleDeleteService}>Delete Service</button>
            </li>
        </div>


    );
}

export default Service;