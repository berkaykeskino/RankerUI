import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Table, Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { callApi } from "../CallApi/CallApi";

// Helper 1: Fetches and displays username for a given ID
const UserLabel = ({ userId }) => {
    const [username, setUsername] = useState(`ID: ${userId}`);

    useEffect(() => {
        if (!userId) return;

        callApi({
            endPoint: `/user/${userId}`,
            method: "GET"
        }).then(res => {
            if (res.data?.userDTO?.username) {
                setUsername(res.data.userDTO.username);
            }
        }).catch(() => {
            setUsername(`User #${userId}`);
        });
    }, [userId]);

    return <span>{username}</span>;
};

// Helper 2: Fetches and displays the "base" category for a ranking type ID
const RankingTypeLabel = ({ rankingTypeId }) => {
    const [categoryName, setCategoryName] = useState(`Type ${rankingTypeId}`);

    useEffect(() => {
        if (!rankingTypeId) return;

        callApi({
            endPoint: `/ranking-type/${rankingTypeId}`,
            method: "GET"
        }).then(res => {
            // Extract "base" from the response structure
            if (res.data?.rankingTypeDTO?.base) {
                setCategoryName(res.data.rankingTypeDTO.base);
            }
        }).catch(() => {
            setCategoryName(`Type ${rankingTypeId}`);
        });
    }, [rankingTypeId]);

    return (
        <small className="fw-bold text-uppercase text-secondary border border-secondary rounded px-2 py-1">
            {categoryName}
        </small>
    );
};

export default function RankingsPage() {
    const [rankings, setRankings] = useState([]);

    // Inputs state
    const [actorId, setActorId] = useState("");
    const [subjectId, setSubjectId] = useState("");

    // Fetch logic
    const fetchRankings = () => {
        const params = {
            actorId: actorId === "" ? null : actorId,
            subjectId: subjectId === "" ? null : subjectId
        };

        callApi({
            endPoint: "/rank-event",
            method: "GET",
            params: params
        }).then(res => {
            setRankings(res.data?.rankEventDTOList || []);
        }).catch(err => {
            console.error(err);
            setRankings([]);
        });
    };

    // Initial load
    useEffect(() => {
        fetchRankings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container fluid className="min-vh-100 bg-light py-5">
            <Container>

                {/* Header */}
                <Row className="mb-4 text-center">
                    <Col>
                        <h2 className="fw-bold text-primary display-6">Global Rankings</h2>
                        <p className="text-muted">Live performance data and statistics</p>
                    </Col>
                </Row>

                {/* Filter Section */}
                <Row className="justify-content-center mb-4">
                    <Col lg={10} className="bg-white shadow-sm rounded p-4 border">
                        <Form>
                            <Row className="g-3 align-items-end">
                                <Col md={5}>
                                    <Form.Label className="fw-bold text-secondary small text-uppercase">
                                        Filter by Actor ID
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="e.g. 101"
                                        value={actorId}
                                        onChange={e => setActorId(e.target.value)}
                                        className="bg-light border-0"
                                    />
                                </Col>
                                <Col md={5}>
                                    <Form.Label className="fw-bold text-secondary small text-uppercase">
                                        Filter by Subject ID
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="e.g. 202"
                                        value={subjectId}
                                        onChange={e => setSubjectId(e.target.value)}
                                        className="bg-light border-0"
                                    />
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="primary"
                                        className="w-100 fw-bold shadow-sm"
                                        onClick={fetchRankings}
                                    >
                                        Filter
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>

                {/* Table Section */}
                <Row className="justify-content-center">
                    <Col lg={10} className="bg-white shadow rounded overflow-hidden p-0">
                        <Table responsive hover className="mb-0 align-middle text-center">
                            <thead className="bg-primary text-white">
                            <tr>
                                <th className="py-3 text-uppercase small fw-bold">Actor</th>
                                <th className="py-3 text-uppercase small fw-bold">Subject</th>
                                <th className="py-3 text-uppercase small fw-bold">Rank</th>
                                <th className="py-3 text-uppercase small fw-bold">Total Votes</th>
                                <th className="py-3 text-uppercase small fw-bold">Category</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rankings.map((r, index) => (
                                <tr key={r.id} className={index % 2 === 0 ? "bg-white" : "bg-light"}>
                                    <td className="fw-semibold text-dark py-3">
                                        <UserLabel userId={r.actorId} />
                                    </td>
                                    <td className="text-secondary">
                                        <UserLabel userId={r.subjectId} />
                                    </td>
                                    <td className="fw-bold fs-5 text-primary">
                                        #{r.rank}
                                    </td>
                                    <td className="text-muted">
                                        {r.totalCandidates}
                                    </td>
                                    <td>
                                        {/* Use new RankingTypeLabel component here */}
                                        <RankingTypeLabel rankingTypeId={r.rankingTypeId} />
                                    </td>
                                </tr>
                            ))}

                            {rankings.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        No rankings found matching your criteria.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}