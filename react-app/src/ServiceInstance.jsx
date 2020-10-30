import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";

function ServiceInstance(props) {
    const [deleting, setDeleting] = useState(false);
    const { instanceName, outputs, updateServiceData, serviceName } = props;

    function deleteInstanceHandler() {
        setDeleting(true);
        axios.delete("http://localhost:3000/services/" + serviceName + "/instances/" + instanceName)
            .then(function (response) {
                console.log('Success:', response);
                updateServiceData();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <tr class='text-muted '>
            <td class="text-left pl-4">{instanceName}</td>
            <td class="text-center">{deleting ? "Deleting..." : "Deployed"}</td>
            <td class="text-center">Dan Hernandez</td>
            <td class="text-center"><Button size="sm" variant="outline-l-purp" className="mr-2">Show Outputs</Button>{deleting ? <Button disabled size="sm" onClick={deleteInstanceHandler} variant="outline-red">Deleting...</Button> : <Button size="sm" onClick={deleteInstanceHandler} variant="outline-red">Delete</Button>}</td>
        </tr>
    );
}

export default ServiceInstance;