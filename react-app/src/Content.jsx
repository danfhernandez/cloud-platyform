import React from "react";
import Services from "./Services";
import Row from "react-bootstrap/Row";
import Sidebar from "./Sidebar";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Table from "react-bootstrap/Table";
function Content() {
    return (
        <div>
            <div class="d-flex" id="wrapper">
                <div class="border-right font-weight-bold" id="sidebar-wrapper">
                    <div class="sidebar-heading  text-center"><i class="fas fa-bolt mr-1" /></div>
                    <div class="list-group list-group-flush ml-2">
                        <a href="#" class="list-group-item list-group-item-action color-dark-purp">S3 App</a>
                        <a href="#" class="list-group-item list-group-item-action color-dark-purp">ECS Cluster</a>
                        <a href="#" class="list-group-item list-group-item-action color-dark-purp">Cloud Run App</a>
                        <a href="#" class="list-group-item list-group-item-action color-dark-purp">GKE Cluster</a>
                        <a href="#" class="py-4 list-group-item list-group-item-action color-dark-purp text-center"><Button variant="outline-green">Create New Service</Button></a>
                    </div>
                </div>
                <div id="page-content-wrapper">
                    <div class="container-fluid">
                        <h2 class="my-4 mx-4 text-muted">S3 App Service <Button className="ml-3" variant="outline-l-purp mr-auto" size="sm">View Docs</Button> <Button className="float-right mt-2" variant="outline-green" size="sm">New Instance</Button></h2>
                        
                        <Card className="mt-4 mx-4">
                        <Card.Body className="px-0 py-0">
                            <Table responsive className="mb-0">
                                <thead>
                                    <tr class='text-muted'>
                                        <th class="text-left pl-4">Name</th>
                                        <th class="text-center">Status</th>
                                        <th class="text-center">Owner</th>
                                        <th class="text-center">Outputs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class='text-muted '>
                                        <td class="text-left pl-4">Dan's S3 App</td>
                                        <td class="text-center">Deployed</td>
                                        <td class="text-center">Dan Hernandez</td>
                                        <td class="text-center"><Button size="sm" variant="outline-l-purp">Show Outputs</Button></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;