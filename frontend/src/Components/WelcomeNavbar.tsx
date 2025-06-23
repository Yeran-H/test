import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import styles from './WelcomeNavbar.module.css';  // <-- import CSS module

export function NavBar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="./#/">MathEase</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/About_Us">About Us</Nav.Link>
                        <NavDropdown title="Subjects" id="basic-nav-dropdown" className={styles.dropdownMenu}>
                            <NavDropdown.Item as={Link} to="/Subject/1" className={styles.dropdownItem}>
                                Math Standard 2
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/Subject/2" className={styles.dropdownItem}>
                                Math Advanced
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/Subject/3" className={styles.dropdownItem}>
                                Math Extension 1
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/Subject/4" className={styles.dropdownItem}>
                                Math Extension 2
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/Log_In">Log In</Nav.Link>
                        <Nav.Link as={Link} to="/Sign_Up">
                          <button className={styles.btnSignup}>Sign Up Now</button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
