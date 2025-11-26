import { useContext, useEffect, useState } from "react";
import { Container, Card, Button, Table, Badge, Modal, Spinner, Pagination } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { pedidosApi, catalogoApi, buildImageUrl } from "../services/api";
import placeholder from "../assets/img/placeholder.png";
import "../assets/styles/estilos.css";

export function UserProfile() {
    const { usuario, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [productosMap, setProductosMap] = useState({});

    // === ESTADOS PARA PAGINACIÓN ===
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        if (usuario?.id) {
            setLoading(true);
            pedidosApi.getByUsuario(usuario.id)
                .then(async (res) => {
                    const listaOrdenada = (res.data || []).sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));
                    setPedidos(listaOrdenada);

                    try {
                        const resCat = await catalogoApi.getUrnas();
                        const mapa = {};
                        resCat.data.forEach(u => {
                            mapa[u.id] = { nombre: u.nombre, imagenPrincipal: u.imagenPrincipal };
                        });
                        setProductosMap(mapa);
                    } catch (err) {
                        console.error("Error hidratando productos:", err);
                    }
                })
                .catch((err) => console.error("Error cargando pedidos:", err))
                .finally(() => setLoading(false));
        }
    }, [usuario]);

    // === LÓGICA DE PAGINACIÓN ===
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pedidos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(pedidos.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleVerDetalle = (pedido) => {
        setPedidoSeleccionado(pedido);
        setShowModal(true);
    };

    const fmtFecha = (f) => new Date(f).toLocaleDateString("es-CL", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const fmtPrecio = (p) => `$${Number(p).toLocaleString("es-CL")}`;

    const calcularTotales = (montoTotalBD) => {
        const totalFinal = Number(montoTotalBD) || 0;
        const neto = Math.round(totalFinal / 1.19);
        const iva = totalFinal - neto;
        return { neto, iva, total: totalFinal };
    };

    const getBadgeVariant = (estado) => {
        switch (estado) {
            case "Entregado": return "success";
            case "Pendiente": return "warning";
            case "Cancelado": return "danger";
            default: return "primary";
        }
    };

    // Estilos personalizados para la tabla "Premium"
    const tableContainerStyle = {
        background: "linear-gradient(180deg, rgba(255, 252, 247, 0.95), rgba(247, 236, 215, 0.6))",
        border: "1px solid rgba(120, 90, 55, 0.2)",
        borderRadius: "16px",
        boxShadow: "0 4px 15px rgba(90, 70, 52, 0.08)"
    };

    const tableHeaderStyle = {
        borderBottom: "2px solid var(--color-secundario)", // Dorado
        color: "var(--color-principal)", // Madera
        fontFamily: "'Playfair Display', serif",
        letterSpacing: "0.5px"
    };

    return (
        <Container className="my-5">
            {/* === CABECERA DE PERFIL === */}
            <Card className="border-0 shadow-lg mb-5" style={{ background: 'linear-gradient(135deg, var(--color-principal) 0%, #3e2f21 100%)', color: '#fff', borderRadius: '18px' }}>
                <Card.Body className="p-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
                    <div className="d-flex align-items-center gap-4">
                        <div className="rounded-circle bg-white d-flex align-items-center justify-content-center text-principal fw-bold fs-1 shadow"
                             style={{ width: '80px', height: '80px', border: '3px solid var(--color-secundario)' }}>
                            {usuario?.nombre?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="fw-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Hola, {usuario?.nombre}</h2>
                            <p className="mb-0 text-white-50" style={{letterSpacing: '0.5px'}}>{usuario?.correo}</p>
                            <Badge bg="warning" text="dark" className="mt-2 fw-normal px-3">{usuario?.rol}</Badge>
                        </div>
                    </div>

                    <div className="d-flex gap-3">
                        {usuario?.rol === "Administrador" && (
                            <Link to="/admin/dashboard" className="btn btn-light fw-bold shadow-sm">
                                <i className="bi bi-speedometer2 me-2"></i> Panel Admin
                            </Link>
                        )}
                        <Button variant="outline-light" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* === SECCIÓN HISTORIAL === */}
            <h3 className="mb-4 fw-bold" style={{ color: 'var(--color-principal)', fontFamily: 'Playfair Display, serif' }}>
                <i className="bi bi-receipt me-2"></i> Mis Pedidos
            </h3>

            {loading ? (
                <div className="text-center py-5 text-muted">
                    <Spinner animation="border" style={{ color: 'var(--color-secundario)' }} />
                    <p className="mt-2">Cargando historial...</p>
                </div>
            ) : pedidos.length === 0 ? (
                <div className="text-center py-5 rounded border border-dashed" style={{ backgroundColor: '#faf9f6' }}>
                    <i className="bi bi-bag-x fs-1 text-muted opacity-50"></i>
                    <p className="mt-3 text-muted">Aún no has realizado compras.</p>
                    <Link to="/catalogo" className="btn btn-brand">Ir al Catálogo</Link>
                </div>
            ) : (
                <>
                    {/* CONTENEDOR DE TABLA CON ESTILO PREMIUM */}
                    <div className="table-responsive p-2" style={tableContainerStyle}>
                        <Table hover className="align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                            <thead style={{ backgroundColor: 'transparent' }}>
                            <tr style={tableHeaderStyle}>
                                <th className="py-3 ps-4">N° Pedido</th>
                                <th className="py-3">Fecha</th>
                                <th className="py-3">Estado</th>
                                <th className="py-3">Total (c/IVA)</th>
                                <th className="py-3 text-end pe-4">Detalle</th>
                            </tr>
                            </thead>
                            <tbody style={{ borderTop: 'none' }}>
                            {currentItems.map((p) => {
                                const { total } = calcularTotales(p.total);
                                return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(90, 70, 52, 0.1)' }}>
                                        <td className="ps-4 fw-bold" style={{ color: 'var(--color-principal-oscuro)' }}>#{p.id}</td>
                                        <td className="text-muted small">{fmtFecha(p.fechaPedido)}</td>
                                        <td>
                                            <Badge bg={getBadgeVariant(p.estado)} className="fw-normal px-3 py-2">
                                                {p.estado}
                                            </Badge>
                                        </td>
                                        <td className="fw-bold" style={{ color: 'var(--color-principal)' }}>{fmtPrecio(total)}</td>
                                        <td className="text-end pe-4">
                                            <Button
                                                variant=""
                                                className="btn-brand-outline btn-sm px-3"
                                                onClick={() => handleVerDetalle(p)}
                                            >
                                                Ver Boleta
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    </div>

                    {/* PAGINACIÓN */}
                    {totalPages > 1 && (
                        <div className="paginacion-catalogo d-flex justify-content-center gap-2 mt-4">
                            <Button
                                variant=""
                                className="btn-brand-outline"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ← Anterior
                            </Button>

                            {[...Array(totalPages)].map((_, index) => (
                                <Button
                                    key={index + 1}
                                    variant=""
                                    className={currentPage === index + 1 ? "btn-brand" : "btn-brand-outline"}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Button>
                            ))}

                            <Button
                                variant=""
                                className="btn-brand-outline"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente →
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* === MODAL DETALLE (Igual que antes) === */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header
                    closeButton
                    className="border-0 py-3"
                    style={{ background: '#f8f9fa' }}
                >
                    {/* 2. Quitamos 'pt-2' para que quede centrado verticalmente en el header */}
                    <div className="w-100 text-center">
                        <h5
                            className="fw-bold text-principal mb-1"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            BOLETA ELECTRÓNICA
                        </h5>
                        {/* Usamos un <p> o <div> para el subtítulo en lugar de otro Title para mejor semántica */}
                        <div
                            className="text-muted"
                            style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem' }}
                        >
                            R.U.T: 77.123.456-8
                        </div>
                    </div>
                </Modal.Header>

                <Modal.Body className="p-4" style={{ background: '#fff' }}>
                    {pedidoSeleccionado && (() => {
                        const { neto, iva, total } = calcularTotales(pedidoSeleccionado.total);

                        return (
                            <div>
                                <div className="text-center mb-4 pb-3 border-bottom border-dashed">
                                    <p className="mb-1 fw-bold text-dark">Descansos del Recuerdo SPA</p>
                                    <p className="mb-2 small text-muted">Av. Siempreviva 742, Santiago</p>
                                    <div className="d-flex justify-content-between mt-3 small text-secondary px-3">
                                        <span><strong>Folio:</strong> #{pedidoSeleccionado.id}</span>
                                        <span>{fmtFecha(pedidoSeleccionado.fechaPedido)}</span>
                                    </div>
                                </div>

                                <div className="d-flex flex-column gap-2 mb-4">
                                    {pedidoSeleccionado.detalles?.map((item, i) => {
                                        const info = productosMap[item.urnaId] || {};
                                        const imgUrl = info.imagenPrincipal
                                            ? buildImageUrl(info.imagenPrincipal)
                                            : placeholder;

                                        return (
                                            <div key={i} className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center gap-3">
                                                    <img
                                                        src={imgUrl}
                                                        alt="urna"
                                                        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4, border: '1px solid #eee' }}
                                                        onError={(e) => e.target.src = placeholder}
                                                    />
                                                    <div style={{ lineHeight: '1.2' }}>
                                                        <div className="fw-bold text-dark small">
                                                            {info.nombre || `Producto ID ${item.urnaId}`}
                                                        </div>
                                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                            {item.cantidad} x {fmtPrecio(item.precioUnitario)}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="fw-bold text-dark small">
                                                    {fmtPrecio(item.subtotal)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="border-top border-dark border-2 pt-3 mt-2">
                                    <div className="d-flex justify-content-between mb-1 small">
                                        <span className="text-muted">MONTO NETO</span>
                                        <span>{fmtPrecio(neto)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span className="text-muted">I.V.A. (19%)</span>
                                        <span>{fmtPrecio(iva)}</span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-dashed">
                                        <span className="fw-bold fs-5 text-principal">TOTAL</span>
                                        <span className="fw-bold fs-4 text-dark">{fmtPrecio(total)}</span>
                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    <Badge bg={getBadgeVariant(pedidoSeleccionado.estado)} className="fw-normal text-uppercase px-3 py-2">
                                        Estado: {pedidoSeleccionado.estado}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })()}
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center bg-light">
                    <small className="text-muted fst-italic text-center d-block w-100 mb-2">
                        Gracias por su preferencia
                    </small>
                    <Button variant="outline-dark" size="sm" onClick={() => setShowModal(false)} className="px-4 rounded-pill">
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}