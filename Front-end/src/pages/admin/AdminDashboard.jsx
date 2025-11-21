import { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { api, BASE } from "../../services/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        usuarios: 0,
        urnas: 0,
        inventario: 0,
        pedidos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [usuarios, urnas, inventario, pedidos] = await Promise.all([
                    api.get(`${BASE.USUARIOS}/api/usuarios`),
                    api.get(`${BASE.CATALOGO}/api/urnas`),
                    api.get(`${BASE.INVENTARIO}/api/inventario`),
                    api.get(`${BASE.PEDIDOS}/api/pedidos`),
                ]);
                setStats({
                    usuarios: usuarios.data.length,
                    urnas: urnas.data.length,
                    inventario: inventario.data.length,
                    pedidos: pedidos.data.length,
                });
            } catch (err) {
                console.error("Error al cargar estadísticas", err);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" style={{ color: 'var(--color-secundario)' }} />
                <p className="mt-2 text-muted">Cargando métricas...</p>
            </div>
        );
    }

    // Configuración de tarjetas (Eliminamos los colores específicos de Bootstrap)
    const cards = [
        { label: "Usuarios Registrados", value: stats.usuarios, icon: "bi-people-fill" },
        { label: "Total de Urnas", value: stats.urnas, icon: "bi-box-seam-fill" },
        { label: "Items en Inventario", value: stats.inventario, icon: "bi-house-door-fill" },
        { label: "Pedidos Realizados", value: stats.pedidos, icon: "bi-receipt" },
    ];

    return (
        <div>
            <h3 className="mb-4 fw-bold" style={{ color: 'var(--color-principal)', fontFamily: 'Playfair Display, serif' }}>
                Dashboard General
            </h3>

            <Row className="g-4">
                {cards.map((card, i) => (
                    <Col key={i} xs={12} md={6} xl={3}>
                        <Card className="h-100 shadow-sm border-0 hover-scale transition">
                            <Card.Body className="d-flex align-items-center p-4">
                                {/* Icono con estilo corporativo: Fondo dorado tenue, icono madera */}
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        backgroundColor: 'rgba(212, 175, 55, 0.15)', // Dorado transparente
                                        color: 'var(--color-principal)' // Madera
                                    }}
                                >
                                    <i className={`bi ${card.icon} fs-3`}></i>
                                </div>

                                <div>
                                    <h6 className="text-muted mb-1 small text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>
                                        {card.label}
                                    </h6>
                                    <h2 className="fw-bold mb-0" style={{ color: 'var(--color-principal)' }}>
                                        {card.value}
                                    </h2>
                                </div>
                            </Card.Body>
                            {/* Pequeña línea decorativa inferior */}
                            <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--color-principal), var(--color-secundario))' }}></div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Sección opcional: Accesos directos o info extra para llenar el dashboard */}
            <Row className="mt-5">
                <Col>
                    <Card className="border-0 shadow-sm p-4 text-center bg-light" style={{ border: '1px dashed #ccc' }}>
                        <p className="text-muted mb-0">
                            Bienvenido al panel de administración. Selecciona una opción del menú lateral para comenzar a gestionar.
                        </p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}