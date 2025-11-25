import { useEffect, useMemo, useState } from "react";
import { pedidosApi, usuariosApi } from "../../services/api";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AdminModal from "../../components/admin/common/AdminModal.jsx";

// Ajusta las etiquetas a lo que tengas en tu tabla estado_pedido
const ESTADOS = [
    { id: 1, label: "Pendiente" },
    { id: 2, label: "Preparado" },  // si en BD es "Preparando", cámbialo aquí
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
            `${p.id} ${p.clienteNombre || ""} ${p.estado || ""}`
                .toLowerCase()
                .includes(s)
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

    const badgeClass = (estado) => {
        switch (estado) {
            case "Entregado":
                return "badge-activo";
            case "Pendiente":
                return "badge-warning";
            case "Cancelado":
                return "badge-inactivo";
            case "Preparado":
            case "Despachado":
            default:
                return "badge-secondary";
        }
    };

    const fmtCLP = (n) =>
        Number(n || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" });

    const fmtFecha = (v) => {
        try {
            const d = new Date(v);
            return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("es-CL");
        } catch {
            return "—";
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="titulo-seccion">🧾 Gestión de Pedidos</h3>
            </div>

            <div className="filter-panel mb-3">
                <input
                    placeholder="Buscar por ID, cliente, estado..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.clienteNombre || "-"}</td>
                            <td>{fmtFecha(p.fechaPedido)}</td>
                            <td>{fmtCLP(p.total)}</td>
                            <td>
                  <span className={`badge ${badgeClass(p.estado)}`}>
                    {p.estado}
                  </span>
                            </td>
                            <td className="text-end">
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => openEdit(p)}
                                >
                                    Cambiar estado
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => openDelete(p)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {!list.length && (
                        <tr>
                            <td colSpan={6} className="text-center text-muted">
                                No hay pedidos que coincidan con la búsqueda.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}

            {/* Cambiar estado */}
            <AdminModal
                open={openE}
                title={`Actualizar estado pedido #${sel?.id}`}
                onClose={() => {
                    setOpenE(false);
                    setSel(null);
                }}
                onSubmit={updateEstado}
                submitText="Actualizar"
            >
                <div className="form-container">
                    <div className="mb-2">
                        <label className="form-label">Estado</label>
                        <select
                            className="form-control"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                        >
                            {ESTADOS.map((e) => (
                                <option key={e.id} value={e.label}>
                                    {e.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </AdminModal>

            {/* Eliminar */}
            <ConfirmDialog
                open={openD}
                title="Eliminar pedido"
                message={`¿Eliminar el pedido #${sel?.id}?`}
                onCancel={() => {
                    setOpenD(false);
                    setSel(null);
                }}
                onConfirm={doDelete}
            />
        </div>
    );
}
