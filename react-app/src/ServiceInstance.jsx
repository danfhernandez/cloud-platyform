import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion"
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';


function ServiceInstance(props) {
    const [deleting, setDeleting] = useState(false);
    const [showOutputs, setShowOutputs] = useState(false);
    const { instanceName, outputs, updateServiceData, serviceName, displayName} = props;

    function deleteInstanceHandler() {
        setDeleting(true);
        axios.delete("http://localhost:3000/services/" + serviceName + "/instances/" + instanceName)
            .then(function (response) {
                console.log('Success:', response);
                setDeleting(false);
                updateServiceData();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function handleShowOutputs() {
        setShowOutputs(!showOutputs);
    }
    console.log("OUTPUTS: " + JSON.stringify(outputs));
    return (
        <>
            <tr class="text-muted">
                <td class="text-left pl-4">{displayName}</td>
                <td class="text-left pl-4">{instanceName}</td>
                <td class="text-center">{deleting ? "Deleting..." : "Deployed"}</td>
                <td class="text-center">Dan Hernandez</td>
                <td class="text-center"><Button onClick={handleShowOutputs} size="sm" variant="outline-l-purp" className="mr-2 remove-border-focus">{showOutputs ? "Hide" : "Show"} Outputs</Button>{deleting ? <Button disabled size="sm" onClick={deleteInstanceHandler} variant="outline-red">Deleting...</Button> : <Button size="sm" onClick={deleteInstanceHandler} variant="outline-red">Delete</Button>}</td>
            </tr>
            {
                showOutputs ?
                    (
                         Object.keys(outputs).map((key, i) => {
                            return (
                                <tr className="text-muted bg-light">
                                    <td style={{ width: "100%" }} className="pl-5" colSpan="5"><span className="font-weight-bold">{key + ": "}</span>{outputs[key].value}</td>
                                </tr>
                            )
                        })
                        
                    ) : null
            }
        </>
    );
}

export default ServiceInstance;