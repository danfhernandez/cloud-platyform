import React from "react";
import Services from "./Services";
function Content() {
    // const [currentService, setCurrentService] = useState("");
    // const [services, setServices] = useState([{}]);

    // useEffect to get all services when this is loaded
    // use modals for new and put an "loading" overlay after it's being created... 
    // what would be cooler is if a new row in the table was available with the name and the status was set

    return (
        <div>
            <Services />
        </div>
    );
}

export default Content;