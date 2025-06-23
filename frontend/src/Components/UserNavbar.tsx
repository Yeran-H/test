import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import styles from './UserNavbar.module.css'; // import CSS module

export function NavBar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/User_Page">MathEase</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Calculators" id="basic-nav-dropdown" className={styles.dropdownMenu}>
                            <NavDropdown.Item as={Link} to="/ArithmeticCalculator" className={styles.dropdownItem}>
                                Arithmetic Calculator
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/GraphingCalculator" className={styles.dropdownItem}>
                                Graphing Calculator
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/IntegralCalculator" className={styles.dropdownItem}>
                                Integral Calculator
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/Settings">Settings</Nav.Link>
                        <Nav.Link as={Link} to="/Sign_Up">
                            <button className={styles.btnSignup}>Sign Out</button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
