import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { callApi } from "../CallApi/CallApi";

// Helper to fetch sender username by ID
const SenderLabel = ({ userId }) => {
    const [username, setUsername] = useState(`User #${userId}`);
    useEffect(() => {
        if (!userId) return;
        callApi({ endPoint: `/user/${userId}`, method: "GET" })
            .then(res => { if(res.data?.userDTO?.username) setUsername(res.data.userDTO.username); })
            .catch(() => {});
    }, [userId]);
    return <span className="fw-bold">{username}</span>;
};

export default function PendingRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = () => {
        setLoading(true);
        callApi({ endPoint: "/friendship/pending", method: "GET" })
            .then(res => {
                setRequests(res.data?.friendshipDTOList || []);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleResponse = (friendshipId, answer) => {
        callApi({
            endPoint: "/friendship/respond",
            method: "POST",
            body: {
                friendshipId: friendshipId,
                answer: answer // true = Accept, false = Reject
            }
        }).then(() => {
            // Remove the item from the list locally to update UI instantly
            setRequests(prev => prev.filter(req => req.id !== friendshipId));
        }).catch(() => {
            alert("Failed to process request.");
        });
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-primary fw-bold">Friend Requests</h2>

            {loading ? (
                <div className="text-center"><Spinner animation="border" variant="primary" /></div>
            ) : requests.length === 0 ? (
                <Alert variant="secondary" className="text-center">No pending friend requests.</Alert>
            ) : (
                <Row>
                    {requests.map(req => (
                        <Col key={req.id} md={6} lg={4} className="mb-3">
                            <Card className="shadow-sm border-0">
                                <Card.Body className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <div className="text-muted small">Request from:</div>
                                        <SenderLabel userId={req.senderId} />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleResponse(req.id, false)}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleResponse(req.id, true)}
                                        >
                                            Accept
                                        </Button>
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