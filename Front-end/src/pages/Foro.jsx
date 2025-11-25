import { useState, useEffect, useContext } from "react";
import { socialApi, usuariosApi } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
    Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge
} from "react-bootstrap";
import "../assets/styles/estilos.css"; // Hereda tus estilos globales

export function Foro() {
    const { usuario, isAuthenticated } = useContext(AuthContext);
    const [comentarios, setComentarios] = useState([]);
    const [usuariosMap, setUsuariosMap] = useState({});
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            // 1. Cargar foro
            const resComentarios = await socialApi.getForo();
            const listaComentarios = resComentarios.data || [];
            setComentarios(listaComentarios);

            // 2. Obtener nombres de usuarios únicos
            const userIds = [...new Set(listaComentarios.map((c) => c.usuarioId))];
            const mapaNombres = { ...usuariosMap };

            await Promise.all(
                userIds.map(async (id) => {
                    if (mapaNombres[id]) return;
                    try {
                        const res = await usuariosApi.getById(id);
                        mapaNombres[id] = res.data.nombre;
                    } catch {
                        mapaNombres[id] = "Usuario Desconocido";
                    }
                })
            );
            setUsuariosMap(mapaNombres);
        } catch (error) {
            console.error("Error cargando el foro:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;

        try {
            setEnviando(true);
            await socialApi.create({
                usuarioId: usuario.id,
                contenido: nuevoComentario,
                urnaId: null,
            });
            setNuevoComentario("");
            await cargarDatos();
        } catch (error) {
            console.error("Error enviando comentario:", error);
            alert("Hubo un error al publicar tu comentario.");
        } finally {
            setEnviando(false);
        }
    };

    // Estilos en línea para igualar la estética "papel/madera" de tu catálogo
    const paperCardStyle = {
        background: "linear-gradient(180deg, rgba(255, 252, 247, 0.95), rgba(247, 236, 215, 0.9))",
        border: "1px solid rgba(120, 90, 55, 0.25)",
        borderRadius: "16px"
    };

    return (
        <Container className="my-5">
            {/* === HERO SECTION (Reutilizando estilo de Catálogo) === */}
            <div className="hero-section rounded shadow-sm mb-5 text-center p-5">
                <h1 className="display-4 fw-bold mb-3">Foro de la Comunidad</h1>
                <p className="lead mx-auto" style={{ maxWidth: "700px" }}>
                    Un espacio respetuoso para compartir memorias, experiencias y consultas.
                    Tu voz es parte de nuestra historia.
                </p>
            </div>

            <Row className="justify-content-center">
                <Col lg={8}>

                    {/* === FORMULARIO DE NUEVO COMENTARIO === */}
                    <Card className="shadow mb-5 border-0" style={paperCardStyle}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-chat-square-quote-fill text-principal fs-3 me-2"></i>
                                <h4 className="mb-0 text-principal fw-bold">Deja tu mensaje</h4>
                            </div>

                            {isAuthenticated ? (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted small fw-bold">
                                            Comentando como: <span className="text-principal">{usuario.nombre}</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Escribe aquí tu comentario, duda o experiencia..."
                                            value={nuevoComentario}
                                            onChange={(e) => setNuevoComentario(e.target.value)}
                                            className="border-0 bg-white shadow-sm"
                                            style={{ resize: "none" }}
                                            required
                                        />
                                    </Form.Group>
                                    <div className="text-end">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={enviando || !nuevoComentario.trim()}
                                            className="px-4 rounded-pill"
                                        >
                                            {enviando ? (
                                                <>
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-send-fill me-2"></i> Publicar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <Alert variant="warning" className="text-center m-0 border-0 shadow-sm">
                                    <i className="bi bi-lock-fill me-2"></i>
                                    Necesitas iniciar sesión para participar en la conversación.
                                    <div className="mt-3">
                                        <Link to="/login" className="btn btn-outline-dark rounded-pill px-4">
                                            Ir al Login
                                        </Link>
                                    </div>
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>

                    {/* === LISTA DE COMENTARIOS === */}
                    <h3 className="titulo-seccion mb-4">Comentarios Recientes</h3>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="secondary" />
                            <p className="mt-3 text-muted">Cargando conversaciones...</p>
                        </div>
                    ) : comentarios.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-chat-dots display-1 opacity-25"></i>
                            <p className="mt-3 fs-5">Aún no hay comentarios.</p>
                            <p>¡Sé el primero en compartir algo!</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {comentarios.map((c) => (
                                <Card
                                    key={c.id}
                                    className="border-0 shadow-sm animate__animated animate__fadeIn"
                                    style={{ borderRadius: "12px", overflow: "hidden" }}
                                >
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="d-flex align-items-center">
                                                {/* Avatar genérico con color de marca */}
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                                                    style={{ width: "45px", height: "45px", background: "var(--color-principal)" }}
                                                >
                          <span className="fw-bold fs-5">
                            {(usuariosMap[c.usuarioId] || "?").charAt(0).toUpperCase()}
                          </span>
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold text-principal mb-0">
                                                        {usuariosMap[c.usuarioId] || "Usuario..."}
                                                    </h6>
                                                    <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                                                        {new Date(c.fecha).toLocaleDateString("es-CL", {
                                                            weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit'
                                                        })}
                                                    </small>
                                                </div>
                                            </div>
                                            <Badge bg="light" text="dark" className="border">
                                                Foro
                                            </Badge>
                                        </div>

                                        <hr className="my-2 opacity-10" />

                                        <Card.Text className="text-dark mt-3" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                                            {c.contenido}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}