import React, { useEffect, useState } from "react";
import Service from "./Service";

function Services() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/services")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("Result from services call:")
                    console.log(result);
                    setServices(result);
                }
            );
    }, []);
    return (
        <ul>
            {services.map((service, i) => <Service serviceName={service.name} key={i}/>)}
            <li>
                <input type="text" placeholder="Name"/>
                <input type="text" placeholder="GitHub Repo URL"/>
                <button>Create Service</button>
            </li>
        </ul>
    );
}

export default Services;