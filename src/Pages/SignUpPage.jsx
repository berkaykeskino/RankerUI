import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import { callApi } from "../CallApi/CallApi";

export default function SignUpPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const handleSignup = async () => {
        try {
            await callApi({
                endPoint: "/user",
                method: "POST",
                body: { "userDTO": { username, password } }
            });

            // 1. Success Feedback
            alert("Account created successfully! Please log in.");

            // 2. Redirect to Login Page
            navigate("/login");
        } catch (error) {
            alert("Failed to create account. Username might be taken.");
        }
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center bg-light">
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={5} xl={4} className="bg-white shadow rounded p-5 border">

                    <h2 className="text-center fw-bold text-primary mb-2">Get Started</h2>
                    <p className="text-center text-muted mb-4">Create your account below</p>

                    <Form>
                        <Form.Group className="mb-4" controlId="formUsername">
                            <Form.Label className="fw-semibold text-secondary">Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. jdoe123"
                                size="lg"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formPassword">
                            <Form.Label className="fw-semibold text-secondary">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="••••••••"
                                size="lg"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            size="lg"
                            className="w-100 shadow-sm fw-bold mb-3"
                            onClick={handleSignup}
                        >
                            Create Account
                        </Button>

                        {/* 3. Navigation Link */}
                        <div className="text-center">
                            <p className="mb-0 text-muted">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary fw-bold text-decoration-none">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}