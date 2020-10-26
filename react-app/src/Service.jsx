import React, { useEffect, useState } from "react";
import ServiceInstance from "./ServiceInstance";

function Service(props) {
    const [serviceInstances, setServiceInstances] = useState([{}]);
    const { serviceName } = props;

    useEffect(() => {
        fetch("http://localhost:3000/services/" + serviceName)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("Service Instances result: ")
                    console.log(result);
                    if (result.instances.length > 0) {
                        setServiceInstances(result.instances);
                    }
                }
            );
    }, []);

    function onClickHandler() {

    }
    return (
        <div>
            <li> {serviceName}
                <ol>
                    {serviceInstances.map((serviceInstance, i) => {
                        return (
                            <ServiceInstance
                                key={i}
                                name={serviceInstance.name}
                                outputs={JSON.stringify(serviceInstance.outputs)}
                            />
                        )
                    })}
                </ol>
                <ul>
                    <li>
                        <input type="text" placeholder="Name">

                        </input>
                        <button onClick={onClickHandler}>Provision Service Instance</button>
                    </li>
                </ul>
            </li>
            <li>
                <button>Delete Service</button>
            </li>
        </div>


    );
}

export default Service;