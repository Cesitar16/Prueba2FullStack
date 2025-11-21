import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Form, InputGroup, Row, Col, Badge } from "react-bootstrap";
import { ProductForm } from "./ProductForm";
import { AlertBadge } from "../../common/AlertBadge";
import "../../../assets/styles/vistaAdmin.css";

export function ProductTable() {
    const [urnas, setUrnas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [productoEdit, setProductoEdit] = useState(null);
    const [modoFormulario, setModoFormulario] = useState(false);

    const cargarUrnas = async () => {
        try {
            const res = await axios.get("http://localhost:8002/api/urnas");
            setUrnas(res.data);
        } catch (err) {
            console.error("Error al cargar urnas:", err);
        }
    };

    useEffect(() => {
        cargarUrnas();
    }, []);

    const filtrarUrnas = urnas.filter(
        (u) =>
            u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            u.nombreMaterial?.toLowerCase().includes(filtro.toLowerCase())
    );

    const eliminarUrna = async (id) => {
        if (!window.confirm("¿Deseas eliminar esta urna?")) return;
        try {
            await axios.delete(`http://localhost:8002/api/urnas/${id}`);
            alert("✅ Urna eliminada correctamente.");
            cargarUrnas();
        } catch (err) {
            console.error("Error al eliminar urna:", err);
        }
    };

    return (
        <Container fluid className="mt-5 product-table">
            <h4 className="titulo-seccion text-center mb-3">Gestión de Urnas</h4>

            {modoFormulario ? (
                <ProductForm
                    productoEdit={productoEdit}
                    onSave={() => {
                        setModoFormulario(false);
                        setProductoEdit(null);
                        cargarUrnas();
                    }}
                />
            ) : (
                <>
                    {/* Barra de Herramientas */}
                    <Row className="mb-3 g-2 align-items-center">
                        <Col md={6}>
                            <InputGroup>
                                <InputGroup.Text className="bg-white text-muted">
                                    <i className="bi bi-search"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por nombre o material..."
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6} className="text-md-end">
                            <Button
                                variant="success"
                                onClick={() => setModoFormulario(true)}
                            >
                                <i className="bi bi-plus-circle me-2"></i>Nueva Urna
                            </Button>
                        </Col>
                    </Row>

                    {/* Tabla de Datos */}
                    <Table responsive hover bordered striped className="align-middle bg-white shadow-sm rounded">
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Material</th>
                            <th>Color</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtrarUrnas.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.nombre}</td>
                                <td>{u.nombreMaterial || "-"}</td>
                                <td>{u.nombreColor || "-"}</td>
                                <td>${Number(u.precio).toLocaleString("es-CL")}</td>
                                <td>
                                    <AlertBadge stock={u.stock} />
                                </td>
                                <td>
                                    <Badge bg={u.disponible === "s" ? "success" : "secondary"}>
                                        {u.disponible === "s" ? "Activo" : "Inactivo"}
                                    </Badge>
                                </td>
                                <td style={{ minWidth: '120px' }}>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => {
                                            setProductoEdit(u);
                                            setModoFormulario(true);
                                        }}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => eliminarUrna(u.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filtrarUrnas.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center text-muted py-4">
                                    No se encontraron urnas.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </>
            )}
        </Container>
    );
}