import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import { callApi } from "../CallApi/CallApi";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await callApi({
                endPoint: "/login",
                method: "POST",
                body: { username, password }
            });

            if (res.headers["x-header-token"]) {
                localStorage.setItem("userToken", res.headers["x-header-token"]);
                window.location.href = "/home-page";
            }
        } catch (err) {
            alert("Login failed. Check your credentials.");
        }
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center bg-light">
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={5} xl={4} className="bg-white shadow rounded p-5 border">

                    <h2 className="text-center fw-bold text-primary mb-2">Welcome Back</h2>
                    <p className="text-center text-muted mb-4">Please login to your account</p>

                    <Form>
                        <Form.Group className="mb-4" controlId="loginUsername">
                            <Form.Label className="fw-semibold text-secondary">Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your username"
                                size="lg"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="loginPassword">
                            <Form.Label className="fw-semibold text-secondary">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                size="lg"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            size="lg"
                            className="w-100 shadow-sm fw-bold mb-3"
                            onClick={handleLogin}
                        >
                            Sign In
                        </Button>

                        {/* Navigation Link */}
                        <div className="text-center">
                            <p className="mb-0 text-muted">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-primary fw-bold text-decoration-none">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}