import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, ListGroup, Row, Spinner, Form, Alert } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { callApi } from "../CallApi/CallApi";

// Helper to fetch username
const UserLabel = ({ userId }) => {
    const [username, setUsername] = useState(`User #${userId}`);
    useEffect(() => {
        if (!userId) return;
        callApi({ endPoint: `/user/${userId}`, method: "GET" })
            .then(res => { if (res.data?.userDTO?.username) setUsername(res.data.userDTO.username); })
            .catch(() => {});
    }, [userId]);
    return <span className="fw-bold text-dark">{username}</span>;
};

export default function CreateRankEventPage() {
    // 1. State for Ranking Logic
    const [rankingTypes, setRankingTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState("");
    const [rankEvents, setRankEvents] = useState([]);

    // 2. Loading States
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // 3. Drag References
    const dragItem = useRef();
    const dragOverItem = useRef();

    // --- INITIAL LOAD: Get Ranking Types ---
    useEffect(() => {
        callApi({ endPoint: "/ranking-type/all", method: "GET" })
            .then(res => {
                const types = res.data || []; // Adjust based on your backend response structure
                setRankingTypes(types);
                if (types.length > 0) {
                    setSelectedTypeId(types[0].id); // Select first by default
                }
            })
            .catch(err => console.error("Failed to fetch types", err));
    }, []);

    // --- FETCH RANKINGS Whenever Type Changes ---
    useEffect(() => {
        if (!selectedTypeId) return;
        fetchRankings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTypeId]);

    const fetchRankings = async () => {
        setLoading(true);
        try {
            // A. Get existing rankings for this Type
            const rankRes = await callApi({
                endPoint: "/rank-event",
                method: "GET",
                // actorId is handled by backend token now, or pass it if your backend requires it
                params: { rankingTypeId: selectedTypeId }
            });

            let existingRanks = rankRes.data?.rankEventDTOList || [];

            // B. If no rankings exist yet, fetch Friends list to start a fresh list
            if (existingRanks.length === 0) {
                const friendRes = await callApi({ endPoint: "/friendship/list", method: "GET" });
                // Assuming friendRes returns list of UserDTOs
                // We create "Temporary" rank events locally
                const friends = friendRes.data?.userDTOList || []; // Adjust path based on your API

                existingRanks = friends.map((friend, index) => ({
                    id: null, // No ID yet because it's not saved
                    subjectId: friend.id,
                    rankingTypeId: selectedTypeId,
                    rank: index + 1
                }));
            }

            // Sort by rank
            existingRanks.sort((a, b) => a.rank - b.rank);
            setRankEvents(existingRanks);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- DRAG AND DROP LOGIC (Unchanged) ---
    const handleDragStart = (e, position) => {
        dragItem.current = position;
        e.target.style.opacity = "0.5";
    };
    const handleDragEnter = (e, position) => {
        dragOverItem.current = position;
    };
    const handleDragEnd = (e) => {
        e.target.style.opacity = "1";
        const _rankEvents = [...rankEvents];
        const draggedItemContent = _rankEvents.splice(dragItem.current, 1)[0];
        _rankEvents.splice(dragOverItem.current, 0, draggedItemContent);

        const updatedRanks = _rankEvents.map((item, index) => ({
            ...item,
            rank: index + 1
        }));
        setRankEvents(updatedRanks);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    // --- SAVE LOGIC ---
    const handleConfirm = async () => {
        setIsSaving(true);
        try {
            // We use Promise.all to save all positions
            const updatePromises = rankEvents.map(event => {
                return callApi({
                    endPoint: "/rank-event",
                    method: "POST",
                    body: {
                        "rankEventDTO": {
                            id: event.id, // Null for new rows, ID for existing
                            // Actor ID is handled by backend via Token
                            subjectId: event.subjectId,
                            rank: event.rank,
                            totalCandidates: rankEvents.length,
                            rankingTypeId: selectedTypeId
                        }
                    }
                });
            });

            await Promise.all(updatePromises);
            alert("Rankings updated successfully!");
            fetchRankings(); // Refresh IDs
        } catch (error) {
            console.error("Failed to save", error);
            alert("Error saving rankings.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 bg-light py-5">
            <Container>
                {/* Header & Selector */}
                <Row className="justify-content-center mb-4">
                    <Col md={8} lg={6} className="text-center">
                        <h2 className="fw-bold text-primary">Rank Your Friends</h2>
                        <p className="text-muted">Choose a category and drag to order.</p>

                        <Form.Group className="mb-3 text-start bg-white p-3 rounded shadow-sm border">
                            <Form.Label className="fw-bold text-secondary text-uppercase small">Ranking Category</Form.Label>
                            <Form.Select
                                size="lg"
                                value={selectedTypeId}
                                onChange={(e) => setSelectedTypeId(e.target.value)}
                                disabled={loading || isSaving}
                            >
                                <option value="" disabled>Select a type...</option>
                                {rankingTypes.map(t => (
                                    <option key={t.id} value={t.id}>{t.base} (Type {t.id})</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Ranking List */}
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        {loading ? (
                            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                        ) : (
                            <ListGroup className="shadow-sm border-0 rounded-3 overflow-hidden">
                                {rankEvents.map((event, index) => (
                                    <ListGroup.Item
                                        key={event.subjectId} // Key by Subject ID ensures stability
                                        as="div"
                                        className="d-flex align-items-center justify-content-between p-3 border-bottom bg-white"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnter={(e) => handleDragEnter(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => e.preventDefault()}
                                        style={{ cursor: "grab" }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            {/* Rank Badge */}
                                            <div className={`d-flex align-items-center justify-content-center rounded-circle fw-bold text-white
                                                ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : index === 2 ? 'bg-danger' : 'bg-primary'}`}
                                                 style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                                                {event.rank}
                                            </div>
                                            <div className="d-flex flex-column">
                                                <UserLabel userId={event.subjectId} />
                                            </div>
                                        </div>
                                        <div className="text-muted fs-4" style={{ opacity: 0.5 }}>&#8801;</div>
                                    </ListGroup.Item>
                                ))}
                                {rankEvents.length === 0 && !loading && (
                                    <Alert variant="warning" className="m-3 text-center">
                                        You have no friends to rank yet! Go to "Find Friends".
                                    </Alert>
                                )}
                            </ListGroup>
                        )}
                    </Col>
                </Row>

                {/* Footer Buttons */}
                <Row className="justify-content-center mt-4">
                    <Col md={8} lg={6} className="d-flex gap-3">
                        <Button variant="outline-secondary" size="lg" className="w-50" onClick={fetchRankings} disabled={isSaving}>
                            Reset
                        </Button>
                        <Button variant="primary" size="lg" className="w-50 fw-bold" onClick={handleConfirm} disabled={isSaving || rankEvents.length === 0}>
                            {isSaving ? "Saving..." : "Save Ranking"}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}