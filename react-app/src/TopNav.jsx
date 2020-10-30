import React from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import logo from "./logo.png"

function TopNav() {
    return (
        <div>
            <Navbar className="mr-auto mb-0 pb-0" bg="dark-purple" variant="dark" expand="lg">
                <Navbar.Brand href="#home" className="mb-0 p-0 mr-4">
                    <img
                        src={logo}
                        height="50"
                        alt="cloud platyform"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="mr-auto mb-0 pb-0" id="basic-navbar-nav">
                    <Nav className="mr-auto mb-0 pb-0" style={{height: "60px"}}>
                        <Nav.Link className="py-auto mt-2 px-3 font-weight-bold"  href="#applications"><i class="far fa-list-alt mr-1"></i> Applications</Nav.Link>
                        <Nav.Link className="py-auto mt-2 px-3 font-weight-bold active" href="#services"><i class="fas fa-bolt mr-1" /> Services</Nav.Link>
                        <Nav.Link className="py-auto mt-2 px-3 font-weight-bold" href="#accounts"><i class="fas fa-cloud mr-1"></i> Accounts</Nav.Link>
                        <Nav.Link className="py-auto mt-2 px-3 font-weight-bold" href="#controls"><i class="fas fa-lock mr-1"></i> Controls</Nav.Link>
                        <Nav.Link className="py-auto mt-2 px-3 font-weight-bold" href="#settings"><i class="fas fa-cogs mr-1"></i> Settings</Nav.Link>
                        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                    <Nav className="mb-0 pb-0" style={{height: "60px"}}>
                        <Nav.Link className="py-auto mt-2 font-weight-bold" href="#account"><i class="fas fa-user-circle mr-1"></i> Account</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            
        </div>
    );
}

export default TopNav;