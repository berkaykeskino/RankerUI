import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { callApi } from "../CallApi/CallApi"; // Adjust path if needed

export default function AddFriendsPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sentRequests, setSentRequests] = useState([]); // Track IDs of sent requests

    // 1. Fetch Non-Friends on Load
    useEffect(() => {
        fetchNonFriends();
    }, []);

    const fetchNonFriends = () => {
        setLoading(true);
        callApi({
            endPoint: "/friendship/non-friend-list",
            method: "GET"
        }).then(res => {
            // Assuming response structure is { userDTOList: [...] } or just an array
            // Adjust based on your NonFriendListResponse DTO
            const list = res.data?.userDTOList || res.data || [];
            setUsers(list);
        }).catch(err => {
            console.error("Failed to fetch users", err);
        }).finally(() => {
            setLoading(false);
        });
    };

    // 2. Handle Add Friend Logic
    const handleAddFriend = (userId) => {
        callApi({
            endPoint: "/friendship/send", // Assumes you have a POST /friendship endpoint
            method: "POST",
            body: { receiverId: userId } // Sending the target user ID
        }).then(() => {
            // Add visual feedback (disable button)
            setSentRequests(prev => [...prev, userId]);
        }).catch(err => {
            alert("Failed to send friend request.");
        });
    };

    // Filter users based on search
    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="py-5">
            <Row className="mb-4 align-items-center">
                <Col md={6}>
                    <h2 className="fw-bold text-primary">Discover People</h2>
                    <p className="text-muted">Find new friends to rank and compete with.</p>
                </Col>
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search by username..."
                        className="shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <Alert variant="info" className="text-center">
                    No users found to add. You might be friends with everyone!
                </Alert>
            ) : (
                <Row>
                    {filteredUsers.map(user => (
                        <Col key={user.id} md={6} lg={4} className="mb-4">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="d-flex align-items-center">
                                    {/* Avatar Placeholder */}
                                    <div className="me-3">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`}
                                            alt={user.username}
                                            className="rounded-circle"
                                            width="50"
                                            height="50"
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="mb-0 fw-bold">{user.username}</h5>
                                        <small className="text-muted">User ID: {user.id}</small>
                                    </div>
                                    <div>
                                        {sentRequests.includes(user.id) ? (
                                            <Button variant="success" size="sm" disabled>
                                                Sent ✓
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="fw-bold"
                                                onClick={() => handleAddFriend(user.id)}
                                            >
                                                Add +
                                            </Button>
                                        )}
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