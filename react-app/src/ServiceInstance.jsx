import React, { useState } from "react";
import axios from "axios";

function ServiceInstance(props) {
    const [deleting, setDeleting] = useState(false);
    const { instanceName, outputs, updateServiceData, serviceName} = props;

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
        <li>
            {instanceName} {deleting ? "(deleting...)" : null}
            <ul>
                <li>outputs:</li>
                <ul>
                    <li>{outputs}</li>
                </ul>
                {deleting ? null : <li><button onClick={deleteInstanceHandler}>Delete Service Instance</button></li>}
                
            </ul>
        </li>
    );
}

export default ServiceInstance;