import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col, Container, Row, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { callApi } from "../CallApi/CallApi";

export default function UserPostsPage() {
    const [username, setUsername] = useState("");
    const [posts, setPosts] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!username) return;

        try {
            const res = await callApi({
                endPoint: `/user/post/${username}`,
                method: "GET"
            });
            setPosts(res.data.allPosts);
            setSearched(true);
        } catch (err) {
            setPosts([]);
            setSearched(true);
        }
    };

    return (
        // Main wrapper with background color and full height
        <Container fluid className="min-vh-100 bg-light py-5">
            <Container>
                {/* Header & Search Section */}
                <Row className="justify-content-center mb-5">
                    <Col md={8} lg={6}>
                        <Card className="shadow border-0 p-4">
                            <Card.Body>
                                <h2 className="text-center fw-bold text-primary mb-2">User Posts</h2>
                                <p className="text-center text-muted mb-4">Discover content by username</p>

                                <Row className="g-2">
                                    <Col sm={8}>
                                        <Form.Control
                                            size="lg"
                                            type="text"
                                            placeholder="e.g. jdoe123"
                                            className="bg-light border-0"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </Col>
                                    <Col sm={4}>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="w-100 fw-bold shadow-sm"
                                            onClick={handleSearch}
                                        >
                                            Search
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Posts Grid */}
                <Row className="g-4">
                    {posts.map(post => (
                        <Col md={6} lg={4} key={post.id}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="fw-bold text-dark mb-3">
                                        {post.title}
                                    </Card.Title>

                                    <Card.Text className="text-secondary mb-4 flex-grow-1">
                                        {post.content}
                                    </Card.Text>

                                    <Card.Text className="text-muted small border-top pt-3 mt-auto d-flex justify-content-between">
                                        <span>Posted by {username}</span>
                                        <span className="fw-bold text-primary">♥ {post.likeCount} Likes</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Empty State */}
                {searched && posts.length === 0 && (
                    <Row className="justify-content-center mt-5">
                        <Col md={6} className="text-center">
                            <h4 className="text-muted fw-normal">No posts found</h4>
                            <p className="text-secondary">
                                We couldn't find any content for user "<strong>{username}</strong>".
                            </p>
                        </Col>
                    </Row>
                )}
            </Container>
        </Container>
    );
}