import Axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import Service from "./Service";
import axios from "axios";

function Services() {
    const [services, setServices] = useState([]);
    //const [name, setName] = useState("");
    const [githubUrl, setGithubUrl] = useState("");

    function updateServices() {
        fetch("http://localhost:3000/services")
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
                setServices(result);
            }
        );
    }
    useEffect(() => {
        updateServices();
    }, []);
    function handleCreateService() {
        // TODO: verify that the url is in the right format.. 
        const name = githubUrl.split("/").pop();
        axios.post("http://localhost:3000/services", {name: name, githubUrl: githubUrl})
            .then(function (response) {
                console.log('Success:', response);
                updateServices();
                setGithubUrl("");
              })
              .catch(function (error) {
                console.log(error);
              });
    }

    // function serviceNameChanged(event) {
    //     setName(event.target.value);
    // }

    function githubRepoChanged(event) {
        setGithubUrl(event.target.value);
    }
    return (
        
        <div>
            <ul>
                {services.map((service, i) => <Service updateServices={updateServices} serviceName={service.name} key={i} />)}

            </ul>
            <input value={githubUrl} type="text" onChange={githubRepoChanged} placeholder="GitHub Repo URL" />
            <button onClick={handleCreateService}>Create Service</button>
        </div>

    );
}

export default Services;