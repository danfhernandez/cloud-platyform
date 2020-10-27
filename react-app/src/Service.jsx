import React, { useEffect, useState, useCallback } from "react";
import ServiceInstance from "./ServiceInstance";
import axios from "axios";

function Service(props) {
    const [serviceInstances, setServiceInstances] = useState([{}]);
    const [newInstanceName, setNewInstanceName] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { serviceName, updateServices } = props;

    function updateServiceData() {
        fetch("http://localhost:3000/services/" + serviceName)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("Service result: ")
                    console.log(result);
                    setServiceInstances(result.instances ?? []);
                }
            );
    }
    useEffect(() => {
        updateServiceData();
    }, []);

    function newInstanceHandler() {
        setLoading(true);
        axios.post("http://localhost:3000/services/" + serviceName + "/instances", { "name": newInstanceName })
            .then(function (response) {
                console.log('Success:', response);
                updateServiceData();
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            });
    }

    function handleChangeNewInstanceName(event) {
        setNewInstanceName(event.target.value);
    }

    function handleDeleteService() {
        setDeleting(true);
        axios.delete("http://localhost:3000/services/" + serviceName)
            .then(function (response) {
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