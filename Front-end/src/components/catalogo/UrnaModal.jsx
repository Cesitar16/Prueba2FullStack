import {useState, useContext, useMemo, useEffect} from "react";
import { Modal, Button, Row, Col, Form, Image, InputGroup } from "react-bootstrap";
import { CarritoContext } from "../../context/CarritoContext";
import placeholder from "../../assets/img/placeholder.png";
import "../../assets/styles/estilos.css";

const buildImgUrl = (u) => {
    if (!u) return null;
    return /^https?:\/\//i.test(u) ? u : `http://localhost:8002${u}`;
};

export function UrnaModal({ urnaSeleccionada, show, onHide }) {
    const { agregarAlCarrito } = useContext(CarritoContext);
    const [cantidad, setCantidad] = useState(1);
    const [indexActivo, setIndexActivo] = useState(0);

    useEffect(() => {
        if (show) {
            setCantidad(1);
            setIndexActivo(0);
        }
    }, [show, urnaSeleccionada]);

    const imagenes = useMemo(() => {
        if (!urnaSeleccionada) return [placeholder];
        const principal = buildImgUrl(urnaSeleccionada.imagenPrincipal);
        const extras = urnaSeleccionada.imagenes?.map((img) => buildImgUrl(img?.url)) || [];
        const lista = [principal, ...extras].filter(Boolean);
        return Array.from(new Set(lista)).length > 0 ? Array.from(new Set(lista)) : [placeholder];
    }, [urnaSeleccionada]);

    const handleAgregar = () => {
        if (!urnaSeleccionada) return;
        if (cantidad < 1 || cantidad > urnaSeleccionada.stock) return alert("Cantidad no válida.");

        agregarAlCarrito({
            id: urnaSeleccionada.id,
            nombre: urnaSeleccionada.nombre,
            precio: urnaSeleccionada.precio,
            cantidad,
            img: buildImgUrl(urnaSeleccionada.imagenPrincipal) || placeholder,
        });
        onHide();
    };

    if (!urnaSeleccionada) return null;

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            // Usamos nuestra clase CSS personalizada para controlar el ancho exacto
            dialogClassName="modal-custom-width"
            contentClassName="border-0 shadow-lg"
        >
            <Modal.Header closeButton className="modal-header-brand py-3">
                <div>
                    <Modal.Title as="h5" className="fw-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {urnaSeleccionada.nombre}
                    </Modal.Title>
                    <small className="text-white-50 d-block" style={{ fontSize: '0.85rem' }}>
                        REF: {urnaSeleccionada.idInterno || `#${urnaSeleccionada.id}`}
                    </small>
                </div>
            </Modal.Header>

            <Modal.Body className="p-4">
                <Row className="g-4">
                    {/* COLUMNA IZQUIERDA: Galería + Imagen Principal */}
                    <Col lg={7}>
                        <Row>
                            {/* Miniaturas (Vertical a la izquierda) */}
                            <Col xs={3} sm={2} className="d-flex flex-column gap-2 pe-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {imagenes.map((img, i) => (
                                    <Image
                                        key={i}
                                        src={img || placeholder}
                                        thumbnail
                                        className={`thumb-img p-1 ${i === indexActivo ? "active border-warning" : ""}`}
                                        style={{ cursor: 'pointer', aspectRatio: '1/1', objectFit: 'cover' }}
                                        onClick={() => setIndexActivo(i)}
                                        onError={(e) => (e.target.src = placeholder)}
                                    />
                                ))}
                            </Col>

                            {/* Imagen Grande */}
                            <Col xs={9} sm={10}>
                                <div className="rounded overflow-hidden border bg-light d-flex align-items-center justify-content-center" style={{ height: '100%', minHeight: '350px' }}>
                                    <Image
                                        src={imagenes[indexActivo] || placeholder}
                                        alt={urnaSeleccionada.nombre}
                                        fluid
                                        className="modal-product-img" // Clase CSS nueva para controlar altura
                                        onError={(e) => (e.target.src = placeholder)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>

                    {/* COLUMNA DERECHA: Detalles */}
                    <Col lg={5} className="d-flex flex-column">
                        <div className="mb-3">
                            <h2 className="fw-bold mb-2" style={{ color: 'var(--color-principal)' }}>
                                ${Number(urnaSeleccionada.precio).toLocaleString("es-CL")}
                            </h2>
                            <p className="text-muted mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                                {urnaSeleccionada.descripcionDetallada || urnaSeleccionada.descripcionCorta || "Producto de alta calidad."}
                            </p>
                        </div>

                        {/* Tabla de especificaciones compacta */}
                        <div className="bg-light p-3 rounded mb-4 border">
                            <Row className="g-2 text-dark" style={{ fontSize: '0.9rem' }}>
                                <Col xs={6}><span className="text-muted">Material:</span> <span className="fw-semibold">{urnaSeleccionada.material?.nombre}</span></Col>
                                <Col xs={6}><span className="text-muted">Color:</span> <span className="fw-semibold">{urnaSeleccionada.color?.nombre}</span></Col>
                                <Col xs={6}><span className="text-muted">Modelo:</span> <span className="fw-semibold">{urnaSeleccionada.modelo?.nombre}</span></Col>
                                <Col xs={6}><span className="text-muted">Peso:</span> <span className="fw-semibold">{urnaSeleccionada.peso} kg</span></Col>
                                <Col xs={12} className="border-top mt-2 pt-2">
                                    <span className="text-muted">Dimensiones:</span> <span className="fw-semibold">{`${urnaSeleccionada.ancho} x ${urnaSeleccionada.profundidad} x ${urnaSeleccionada.alto} cm`}</span>
                                </Col>
                            </Row>
                        </div>

                        {/* Controles de compra al fondo */}
                        <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="fw-bold text-secondary" style={{ fontSize: '0.9rem' }}>Cantidad</label>
                                <small className={urnaSeleccionada.stock < 5 ? "text-danger fw-bold" : "text-success fw-bold"}>
                                    {urnaSeleccionada.stock > 0 ? `Disponible: ${urnaSeleccionada.stock}` : "Sin Stock"}
                                </small>
                            </div>

                            <InputGroup className="mb-3">
                                <Button variant="outline-secondary" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</Button>
                                <Form.Control
                                    className="text-center border-secondary"
                                    type="number"
                                    min="1"
                                    max={urnaSeleccionada.stock}
                                    value={cantidad}
                                    onChange={(e) => setCantidad(Number(e.target.value))}
                                />
                                <Button variant="outline-secondary" onClick={() => setCantidad(Math.min(urnaSeleccionada.stock, cantidad + 1))}>+</Button>
                            </InputGroup>

                            <Button
                                variant=""
                                className="w-100 btn-brand py-2 fw-bold shadow-sm"
                                onClick={handleAgregar}
                                disabled={urnaSeleccionada.stock === 0}
                            >
                                {urnaSeleccionada.stock === 0 ? "Agotado" : (
                                    <>
                                        <i className="bi bi-cart-plus-fill me-2"></i> Agregar al Carrito
                                    </>
                                )}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}