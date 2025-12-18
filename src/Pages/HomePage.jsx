import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row } from "react-bootstrap";

export default function HomePage() {
    return (
        <Container className="mt-4">
            <Row>
                <Col>Home</Col>
                <Col>Posts</Col>
                <Col>Rankings</Col>
            </Row>
        </Container>
    );
}
