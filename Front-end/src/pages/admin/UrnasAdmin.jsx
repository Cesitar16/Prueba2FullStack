import { useState, useEffect } from "react";
import { catalogoApi } from "../../services/api";
import { Container, Table, Button, Badge } from "react-bootstrap";
import AdminModalImagenes from "../../components/admin/common/AdminModalImagenes.jsx";
import "../../assets/styles/admin.css";
import "../../assets/styles/estilos.css";

export default function UrnasAdmin() {
    const [urnas, setUrnas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUrna, setEditingUrna] = useState(null);

    // ====== PAGINACIÓN ======
    const [paginaActual, setPaginaActual] = useState(1);
    const urnasPorPagina = 10;

    const indiceUltimaUrna = paginaActual * urnasPorPagina;
    const indicePrimeraUrna = indiceUltimaUrna - urnasPorPagina;
    const urnasPaginaActual = urnas.slice(indicePrimeraUrna, indiceUltimaUrna);
    const totalPaginas = Math.ceil(urnas.length / urnasPorPagina);

    // ====== CARGA INICIAL ======
    useEffect(() => {
        fetchUrnas();
    }, []);

    const fetchUrnas = async () => {
        try {
            const res = await catalogoApi.getUrnas();
            setUrnas(res.data || []);
        } catch (err) {
            console.error("Error al cargar urnas:", err);
        }
    };

    const handleEdit = (urna) => {
        setEditingUrna(urna);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta urna?")) return;
        try {
            await catalogoApi.deleteUrna(id);
            await fetchUrnas();
        } catch (err) {
            console.error("Error al eliminar urna:", err);
            alert("❌ No se puede eliminar esta urna.");
        }
    };

    const openCreateModal = () => {
        setEditingUrna(null);
        setModalOpen(true);
    };

    // Cambio de página
    const cambiarPagina = (n) => {
        if (n >= 1 && n <= totalPaginas) setPaginaActual(n);
    };

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                {/* Título con tipografía corporativa */}
                <h3 className="mb-0 fw-bold" style={{ color: 'var(--color-principal)', fontFamily: 'Playfair Display, serif' }}>
                    ⚰️ Gestión de Urnas
                </h3>

                {/* Botón "Nueva Urna" estilo madera */}
                <Button
                    variant=""
                    className="btn-brand shadow-sm"
                    onClick={openCreateModal}
                >
                    <i className="bi bi-plus-lg me-2"></i>Nueva Urna
                </Button>
            </div>

            {/* === Tabla de Urnas === */}
            <div className="table-responsive shadow-sm rounded">
                <Table hover bordered className="align-middle bg-white mb-0">
                    {/* Encabezado color Madera */}
                    <thead className="text-white" style={{ backgroundColor: 'var(--color-principal)' }}>
                    <tr>
                        <th className="py-3">ID</th>
                        <th className="py-3">Nombre</th>
                        <th className="py-3">Precio</th>
                        <th className="py-3 text-center">Disponible</th>
                        <th className="py-3 text-end pe-4">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {urnasPaginaActual.length > 0 ? (
                        urnasPaginaActual.map((u) => (
                            <tr key={u.id}>
                                <td className="fw-semibold text-muted">{u.idInterno || u.id}</td>
                                <td className="fw-medium">{u.nombre || "-"}</td>
                                <td style={{ color: 'var(--color-principal)', fontWeight: 'bold' }}>
                                    ${Number(u.precio || 0).toLocaleString("es-CL")}
                                </td>
                                <td className="text-center">
                                    <Badge
                                        bg={String(u.disponible).toLowerCase() === "s" ? "success" : "secondary"}
                                        className="px-3 py-2 fw-normal"
                                    >
                                        {String(u.disponible).toLowerCase() === "s" ? "Sí" : "No"}
                                    </Badge>
                                </td>
                                <td className="text-end" style={{ minWidth: '180px' }}>
                                    {/* Botón Editar: Estilo Outline Madera */}
                                    <Button
                                        variant=""
                                        size="sm"
                                        className="btn-brand-outline me-2"
                                        onClick={() => handleEdit(u)}
                                    >
                                        <i className="bi bi-pencil me-1"></i> Editar
                                    </Button>

                                    {/* Botón Eliminar: Mantenemos rojo pero con estilo outline más limpio */}
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(u.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-5 text-muted">
                                <i className="bi bi-box-seam display-4 d-block mb-3 opacity-50"></i>
                                No hay urnas registradas.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>

            {/* ===== PAGINACIÓN CORPORATIVA ===== */}
            {urnas.length > 0 && (
                <div className="d-flex justify-content-center gap-2 mt-4 pb-4">
                    <Button
                        variant=""
                        className="btn-brand-outline"
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                        size="sm"
                    >
                        ← Anterior
                    </Button>

                    {[...Array(totalPaginas)].map((_, index) => (
                        <Button
                            key={index + 1}
                            variant=""
                            className={index + 1 === paginaActual ? "btn-brand" : "btn-brand-outline"}
                            onClick={() => cambiarPagina(index + 1)}
                            size="sm"
                        >
                            {index + 1}
                        </Button>
                    ))}

                    <Button
                        variant=""
                        className="btn-brand-outline"
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                        size="sm"
                    >
                        Siguiente →
                    </Button>
                </div>
            )}

            {/* === Modal de Crear/Editar Urna === */}
            <AdminModalImagenes
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={fetchUrnas}
                editingUrna={editingUrna}
            />
        </Container>
    );
}