import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { callApi } from "../CallApi/CallApi";

export default function SignUpPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        await callApi({
            endPoint: "/user",
            method: "POST",
            body: { "userDTO": {
                    username,
                    password,
                } }
        });
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

                        <Form.Group className="mb-5" controlId="formPassword">
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
                            className="w-100 shadow-sm fw-bold"
                            onClick={handleSignup}
                        >
                            Create Account
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}