import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NavigationBar() {
    // Mock User State: Replace this with your actual AuthContext later
    // Set to null to see the "Login/Signup" view
    const [user, setUser] = useState({
        id: 4,
        username: "berkay_tester",
        avatar: "https://ui-avatars.com/api/?name=Berkay+Tester&background=0D6EFD&color=fff"
    });

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate("/login");
    };

    return (
        <Navbar expand="lg" className="bg-white shadow-sm sticky-top py-3 mb-4">
            <Container>
                {/* Brand Logo */}
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
                    RANKER
                </Navbar.Brand>

                {/* Mobile Toggle Button */}
                <Navbar.Toggle aria-controls="main-navbar" />

                {/* Collapsible Content */}
                <Navbar.Collapse id="main-navbar">

                    {/* Left Side: Navigation Links */}
                    <Nav className="me-auto ms-lg-3 gap-2">
                        <Nav.Link as={Link} to="/rankings" active={location.pathname === "/rankings"}>
                            Global Rankings
                        </Nav.Link>
                        <Nav.Link as={Link} to="/rank-event" active={location.pathname === "/rank-event"}>
                            Create Ranking
                        </Nav.Link>
                        <Nav.Link as={Link} to="/user/posts" active={location.pathname === "/user/posts"}>
                            User Posts
                        </Nav.Link>
                    </Nav>

                    {/* Right Side: User Profile */}
                    <Nav className="align-items-center mt-3 mt-lg-0">
                        {user ? (
                            <>
                                {/* User Dropdown */}
                                <NavDropdown
                                    align="end"
                                    title={
                                        <div className="d-inline-flex align-items-center gap-2">
                                            <img
                                                src={user.avatar}
                                                alt="profile"
                                                className="rounded-circle border"
                                                width="40"
                                                height="40"
                                            />
                                            <span className="fw-semibold text-dark d-none d-lg-block">
                                                {user.username}
                                            </span>
                                        </div>
                                    }
                                    id="user-dropdown"
                                >
                                    <div className="px-3 py-2 text-center d-lg-none border-bottom mb-2">
                                        <strong>{user.username}</strong>
                                    </div>
                                    <NavDropdown.Item as={Link} to="/user/posts">My Profile</NavDropdown.Item>
                                    <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                        Sign Out
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            // Guest View
                            <div className="d-flex gap-2">
                                <Button as={Link} to="/login" variant="outline-primary" className="fw-bold px-4">
                                    Login
                                </Button>
                                <Button as={Link} to="/signup" variant="primary" className="fw-bold px-4">
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}