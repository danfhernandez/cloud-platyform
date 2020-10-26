import React from "react";

function ServiceInstance(props) {
    const { name, outputs } = props;
    return (
        <li>
            {name} 
            <ul>
                <li>outputs:</li>
                <ul>
                    <li>{outputs}</li>
                </ul>
                <li><button>Delete Service Instance</button></li>
            </ul>
        </li>
    );
}

export default ServiceInstance;