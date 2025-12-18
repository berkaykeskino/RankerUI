import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { callApi } from "../CallApi/CallApi";

// Helper: Fetches username (same as before to make UI readable)
const UserLabel = ({ userId }) => {
    const [username, setUsername] = useState(`User #${userId}`);

    useEffect(() => {
        if (!userId) return;
        callApi({ endPoint: `/user/${userId}`, method: "GET" })
            .then(res => {
                if (res.data?.userDTO?.username) setUsername(res.data.userDTO.username);
            })
            .catch(() => {});
    }, [userId]);

    return <span className="fw-bold text-dark">{username}</span>;
};

// Helper: Fetches Ranking Type Name
const TypeLabel = ({ typeId }) => {
    const [type, setType] = useState(`Type ${typeId}`);

    useEffect(() => {
        if (!typeId) return;
        callApi({ endPoint: `/ranking-type/${typeId}`, method: "GET" })
            .then(res => {
                if (res.data?.rankingTypeDTO?.base) setType(res.data.rankingTypeDTO.base);
            })
            .catch(() => {});
    }, [typeId]);

    return <small className="text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>{type}</small>;
};

export default function CreateRankEventPage() {
    // 1. Hardcoded Actor ID as requested
    const [actorId] = useState(4);

    const [rankEvents, setRankEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // References for Drag and Drop
    const dragItem = useRef();
    const dragOverItem = useRef();

    // Fetch initial list
    const fetchRankings = () => {
        setLoading(true);
        callApi({
            endPoint: "/rank-event",
            method: "GET",
            params: { actorId: actorId }
        }).then(res => {
            let list = res.data?.rankEventDTOList || [];
            // Sort by rank ascending (1, 2, 3...)
            list.sort((a, b) => a.rank - b.rank);
            setRankEvents(list);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchRankings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Drag and Drop Logic ---

    const handleDragStart = (e, position) => {
        dragItem.current = position;
        // Visual effect for the element being dragged
        e.target.style.opacity = "0.5";
    };

    const handleDragEnter = (e, position) => {
        dragOverItem.current = position;
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = "1";

        // Copy state
        const _rankEvents = [...rankEvents];

        // Remove item from old position
        const draggedItemContent = _rankEvents.splice(dragItem.current, 1)[0];

        // Insert item at new position
        _rankEvents.splice(dragOverItem.current, 0, draggedItemContent);

        // RE-CALCULATE RANKS based on new array index
        // Index 0 becomes Rank 1, Index 1 becomes Rank 2...
        const updatedRanks = _rankEvents.map((item, index) => ({
            ...item,
            rank: index + 1
        }));

        setRankEvents(updatedRanks);

        // Reset refs
        dragItem.current = null;
        dragOverItem.current = null;
    };

    // --- Action Buttons ---

    const handleCancel = () => {
        // Simply re-fetch from server to undo local changes
        fetchRankings();
    };

    const handleConfirm = async () => {
        setIsSaving(true);
        try {
            // Create a promise for every item in the list to update its new rank
            const updatePromises = rankEvents.map(event => {
                return callApi({
                    endPoint: "/rank-event",
                    method: "POST",
                    body: {
                        "rankEventDTO": {
                            id: event.id,
                            actorId: event.actorId,
                            subjectId: event.subjectId,
                            rank: event.rank, // This is the updated rank
                            totalCandidates: rankEvents.length, // Update total count context
                            rankingTypeId: event.rankingTypeId
                        }
                    }
                });
            });

            // Wait for all updates to finish
            await Promise.all(updatePromises);
            alert("Rankings updated successfully!");
        } catch (error) {
            console.error("Failed to save rankings", error);
            alert("Error saving rankings.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 bg-light py-5">
            <Container>

                {/* Header */}
                <Row className="justify-content-center mb-4">
                    <Col md={8} lg={6} className="text-center">
                        <h2 className="fw-bold text-primary">Your Rankings</h2>
                        <p className="text-muted">Drag and drop cards to reorder your favorites.</p>
                    </Col>
                </Row>

                {/* List Area */}
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            <ListGroup className="shadow-sm border-0 rounded-3 overflow-hidden">
                                {rankEvents.map((event, index) => (
                                    <ListGroup.Item
                                        key={event.id || index}
                                        as="div"
                                        className="d-flex align-items-center justify-content-between p-3 border-bottom bg-white"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnter={(e) => handleDragEnter(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => e.preventDefault()} // Necessary to allow dropping
                                        style={{ cursor: "grab" }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            {/* Rank Number Badge */}
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded-circle bg-light text-primary fw-bold"
                                                style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}
                                            >
                                                {event.rank}
                                            </div>

                                            {/* Content */}
                                            <div className="d-flex flex-column">
                                                <UserLabel userId={event.subjectId} />
                                                <TypeLabel typeId={event.rankingTypeId} />
                                            </div>
                                        </div>

                                        {/* Drag Handle Icon (Visual only) */}
                                        <div className="text-muted" style={{ fontSize: '1.5rem', opacity: 0.5 }}>
                                            &#8801;
                                        </div>
                                    </ListGroup.Item>
                                ))}

                                {rankEvents.length === 0 && (
                                    <div className="p-4 text-center text-muted">
                                        You haven't ranked anyone yet.
                                    </div>
                                )}
                            </ListGroup>
                        )}
                    </Col>
                </Row>

                {/* Sticky Footer / Action Area */}
                <Row className="justify-content-center mt-4">
                    <Col md={8} lg={6} className="d-flex gap-3">
                        <Button
                            variant="outline-secondary"
                            size="lg"
                            className="w-50 fw-bold border-0 bg-white shadow-sm"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-50 fw-bold shadow-sm"
                            onClick={handleConfirm}
                            disabled={isSaving || rankEvents.length === 0}
                        >
                            {isSaving ? "Saving..." : "Confirm New Order"}
                        </Button>
                    </Col>
                </Row>

            </Container>
        </Container>
    );
}