import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { callApi } from "../CallApi/CallApi";

export default function MyFriendsPage() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = () => {
        setLoading(true);
        callApi({ endPoint: "/friendship/list", method: "GET" })
            .then(res => {
                // Adjust this based on your backend response wrapper name
                // Based on previous step, it is likely inside 'userDTOList'
                setFriends(res.data?.userDTOList || []);
            })
            .catch(err => console.error("Failed to fetch friends", err))
            .finally(() => setLoading(false));
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-primary mb-0">My Friends</h2>
                    <p className="text-muted mb-0">People you are connected with.</p>
                </div>
                <Button as={Link} to="/add-friends" variant="outline-primary" size="sm">
                    Find New Friends +
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : friends.length === 0 ? (
                <Alert variant="info" className="text-center py-4">
                    <h5>You don't have any friends yet.</h5>
                    <p>Go to the "Find Friends" page to connect with people!</p>
                    <Button as={Link} to="/add-friends" variant="primary">
                        Find Friends
                    </Button>
                </Alert>
            ) : (
                <Row>
                    {friends.map(friend => (
                        <Col key={friend.id} md={6} lg={4} className="mb-4">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="d-flex align-items-center">
                                    {/* Avatar */}
                                    <div className="me-3">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${friend.username}&background=random&color=fff`}
                                            alt={friend.username}
                                            className="rounded-circle"
                                            width="60"
                                            height="60"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow-1">
                                        <h5 className="mb-1 fw-bold text-dark">{friend.username}</h5>
                                        <small className="text-muted d-block">User ID: {friend.id}</small>
                                        <Link to={`/user/profile/${friend.id}`} className="text-decoration-none small">
                                            View Profile
                                        </Link>
                                    </div>

                                    {/* Validated Badge */}
                                    <div className="text-success fs-4">
                                        ✓
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}