import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, ListGroup } from "react-bootstrap";
import { CarritoContext } from "../context/CarritoContext";
import "../assets/styles/estilos.css";


const API_UBICACION = "http://localhost:8001/api";

export function Checkout() {
    const { carrito, total, confirmarCompra } = useContext(CarritoContext);
    const [regiones, setRegiones] = useState([]);
    const [comunas, setComunas] = useState([]);
    const [regionSeleccionada, setRegionSeleccionada] = useState("");

    const [cliente, setCliente] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        direccion: "",
        region: "",
        comuna: "",
    });

    useEffect(() => {
        axios
            .get(`${API_UBICACION}/regiones`)
            .then((res) => setRegiones(res.data))
            .catch((err) => console.error("Error regiones:", err));
    }, []);

    useEffect(() => {
        if (regionSeleccionada) {
            axios
                .get(`${API_UBICACION}/comunas/region/${regionSeleccionada}`)
                .then((res) => setComunas(res.data))
                .catch((err) => console.error("Error comunas:", err));
        } else {
            setComunas([]);
        }
    }, [regionSeleccionada]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (carrito.length === 0) return alert("Carrito vacío.");

        // Validaciones básicas HTML5 funcionan, pero aquí puedes agregar más lógica
        confirmarCompra(cliente);
    };

    if (carrito.length === 0) {
        return (
            <Container className="py-5 text-center">
                <div className="text-muted">
                    <i className="bi bi-cart3 display-1 mb-3"></i>
                    <p className="fs-4">No hay productos en tu carrito.</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="titulo-seccion text-center mb-4">Confirmación de Compra</h2>

            <Row>
                {/* 🧾 Columna Resumen (Ordenada primero en móviles visualmente si quisieras, pero por defecto va a la izq en desktop) */}
                <Col md={{ span: 5, order: 'last' }} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Header className="bg-dark text-white">
                            <h5 className="mb-0">Resumen de Compra</h5>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {carrito.map((item) => (
                                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="fw-bold">{item.nombre}</div>
                                        <small className="text-muted">Cant: {item.cantidad}</small>
                                    </div>
                                    <span className="fw-semibold">
                    ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                  </span>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item className="bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold text-uppercase">Total</span>
                                    <span className="fw-bold text-success fs-5">
                    ${total.toLocaleString("es-CL")}
                  </span>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                {/* 📦 Columna Formulario */}
                <Col md={7}>
                    <Card className="shadow-sm border-0 bg-light">
                        <Card.Body className="p-4">
                            <h5 className="mb-3 fw-bold text-primary">Datos de envío</h5>

                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group controlId="nombre">
                                            <Form.Label>Nombre Completo *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={cliente.nombre}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="correo">
                                            <Form.Label>Correo Electrónico *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="correo"
                                                value={cliente.correo}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="telefono">
                                            <Form.Label>Teléfono</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="telefono"
                                                placeholder="+56 9..."
                                                value={cliente.telefono}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId="direccion">
                                            <Form.Label>Dirección *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="direccion"
                                                value={cliente.direccion}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="region">
                                            <Form.Label>Región</Form.Label>
                                            <Form.Select
                                                value={regionSeleccionada}
                                                onChange={(e) => {
                                                    setRegionSeleccionada(e.target.value);
                                                    // Guardamos el TEXTO de la región, no el ID, según tu lógica original
                                                    const texto = e.target.options[e.target.selectedIndex].text;
                                                    setCliente({ ...cliente, region: texto });
                                                }}
                                            >
                                                <option value="">Selecciona una región</option>
                                                {regiones.map((r) => (
                                                    <option key={r.id} value={r.id}>{r.nombre}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="comuna">
                                            <Form.Label>Comuna</Form.Label>
                                            <Form.Select
                                                value={cliente.comuna}
                                                onChange={(e) => setCliente({ ...cliente, comuna: e.target.value })}
                                                disabled={!regionSeleccionada}
                                            >
                                                <option value="">Selecciona una comuna</option>
                                                {comunas.map((c) => (
                                                    <option key={c.id} value={c.nombre}>{c.nombre}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-grid gap-2 mt-4 d-md-flex justify-content-md-end">
                                    <Button variant="primary" type="submit" size="lg">
                                        <i className="bi bi-bag-check-fill me-2"></i> Confirmar Pedido
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}