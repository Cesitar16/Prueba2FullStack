import { useEffect, useMemo, useState } from "react";
import { pedidosApi, usuariosApi } from "../../services/api";
import { Container, Table, Button, Form, Badge, InputGroup } from "react-bootstrap";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AdminModal from "../../components/admin/common/AdminModal.jsx";
import "../../assets/styles/estilos.css";

const ESTADOS = [
    { id: 1, label: "Pendiente" },
    { id: 2, label: "Preparado" },
    { id: 3, label: "Despachado" },
    { id: 4, label: "Entregado" },
    { id: 5, label: "Cancelado" },
];

const estadoIdFromLabel = (label) =>
    ESTADOS.find((e) => e.label === label)?.id ?? 1;

export default function PedidosAdmin() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");

    const [openE, setOpenE] = useState(false);
    const [openD, setOpenD] = useState(false);
    const [sel, setSel] = useState(null);
    const [estado, setEstado] = useState("Pendiente");

    // Carga + hidratación de nombre de cliente
    const loadAndHydrate = async () => {
        setLoading(true);
        try {
            const { data = [] } = await pedidosApi.getAll();

            const ids = [...new Set(data.map((p) => p.usuarioId).filter(Boolean))];
            let nombres = {};
            if (ids.length) {
                const pairs = await Promise.all(
                    ids.map((id) =>
                        usuariosApi
                            .getById(id)
                            .then((r) => [id, r?.data?.nombre || "-"])
                            .catch(() => [id, "-"])
                    )
                );
                nombres = Object.fromEntries(pairs);
            }

            setRows(
                data.map((p) => ({
                    ...p,
                    clienteNombre: nombres[p.usuarioId] || "-",
                }))
            );
        } catch (e) {
            console.error("Error cargando pedidos:", e);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAndHydrate();
        const onNuevo = () => loadAndHydrate();
        window.addEventListener("pedido:nuevo", onNuevo);
        return () => window.removeEventListener("pedido:nuevo", onNuevo);
    }, []);

    const list = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return rows;
        return rows.filter((p) =>
            `${p.id} ${p.clienteNombre || ""} ${p.estado || ""}`.toLowerCase().includes(s)
        );
    }, [q, rows]);

    const openEdit = (r) => {
        setSel(r);
        setEstado(r.estado || "Pendiente");
        setOpenE(true);
    };

    const updateEstado = async () => {
        if (!sel) return;
        try {
            const estadoId = estadoIdFromLabel(estado);
            await pedidosApi.updateEstado(sel.id, estadoId);
            setRows((prev) =>
                prev.map((x) => (x.id === sel.id ? { ...x, estado } : x))
            );
            setOpenE(false);
            setSel(null);
        } catch (e) {
            console.error("No se pudo actualizar el estado:", e);
        }
    };

    const openDelete = (r) => {
        setSel(r);
        setOpenD(true);
    };

    const doDelete = async () => {
        if (!sel) return;
        try {
            await pedidosApi.deletePedido(sel.id);
            setRows((prev) => prev.filter((x) => x.id !== sel.id));
        } catch (e) {
            console.error("No se pudo eliminar el pedido:", e);
        } finally {
            setOpenD(false);
            setSel(null);
        }
    };

    // Helper para colores de badge (Adaptados a la paleta si se desea, o mantener funcionales)
    const getBadgeVariant = (estado) => {
        switch (estado) {
            case "Entregado": return "success";
            case "Pendiente": return "warning";
            case "Cancelado": return "danger";
            case "Preparado": return "info";
            case "Despachado": return "primary";
            default: return "secondary";
        }
    };

    const fmtCLP = (n) => Number(n || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" });
    const fmtFecha = (v) => {
        try {
            const d = new Date(v);
            return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("es-CL");
        } catch { return "—"; }
    };

    return (
        <Container fluid>
            {/* Header con estilo corporativo */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0 fw-bold" style={{ color: 'var(--color-principal)', fontFamily: 'Playfair Display, serif' }}>
                    🧾 Gestión de Pedidos
                </h3>
            </div>

            {/* Buscador con estilo limpio */}
            <InputGroup className="mb-4 shadow-sm">
                <InputGroup.Text className="bg-white border-end-0 text-muted"><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                    className="border-start-0 ps-0"
                    placeholder="Buscar por ID, cliente, estado..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </InputGroup>

            {loading ? (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-arrow-repeat fs-1 spinner-border mb-2 border-0"></i>
                    <p>Cargando pedidos...</p>
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <Table hover bordered className="align-middle bg-white mb-0">
                        {/* Encabezado color Madera */}
                        <thead className="text-white" style={{ backgroundColor: 'var(--color-principal)' }}>
                        <tr>
                            <th className="py-3 ps-3">ID</th>
                            <th className="py-3">Cliente</th>
                            <th className="py-3">Fecha</th>
                            <th className="py-3 text-end pe-4">Total</th>
                            <th className="py-3 text-center">Estado</th>
                            <th className="py-3 text-end pe-4">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map((p) => (
                            <tr key={p.id}>
                                <td className="ps-3 fw-bold text-muted">#{p.id}</td>
                                <td className="fw-medium">{p.clienteNombre || "-"}</td>
                                <td className="text-muted small">{fmtFecha(p.fechaPedido)}</td>
                                <td className="text-end pe-4 fw-bold text-dark">{fmtCLP(p.total)}</td>
                                <td className="text-center">
                                    <Badge bg={getBadgeVariant(p.estado)} className="fw-normal px-3 py-2">
                                        {p.estado}
                                    </Badge>
                                </td>
                                <td className="text-end pe-3" style={{width: '200px'}}>
                                    <Button
                                        variant=""
                                        size="sm"
                                        className="btn-brand-outline me-2"
                                        onClick={() => openEdit(p)}
                                    >
                                        <i className="bi bi-pencil me-1"></i> Estado
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => openDelete(p)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {!list.length && (
                            <tr>
                                <td colSpan={6} className="text-center py-5 text-muted">
                                    <i className="bi bi-receipt-cutoff display-4 d-block mb-3 opacity-50"></i>
                                    No hay pedidos que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Cambiar estado */}
            <AdminModal
                open={openE}
                title={`Actualizar estado pedido #${sel?.id}`}
                onClose={() => { setOpenE(false); setSel(null); }}
                onSubmit={updateEstado}
                submitText="Actualizar Estado"
            >
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold text-secondary">Estado del Pedido</Form.Label>
                        <Form.Select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="form-select-lg"
                        >
                            {ESTADOS.map((e) => (
                                <option key={e.id} value={e.label}>{e.label}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </AdminModal>

            {/* Eliminar */}
            <ConfirmDialog
                open={openD}
                title="Eliminar pedido"
                message={`¿Estás seguro de eliminar el pedido #${sel?.id}? Esta acción es irreversible.`}
                onCancel={() => { setOpenD(false); setSel(null); }}
                onConfirm={doDelete}
                confirmText="Sí, eliminar"
            />
        </Container>
    );
}