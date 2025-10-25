import { useEffect, useMemo, useState } from "react";
import { api, BASE } from "../../services/api";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import AdminModal from "../../components/admin/AdminModal.jsx";

export default function PedidosAdmin() {
    const [rows, setRows] = useState([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);

    const [openE, setOpenE] = useState(false);
    const [openD, setOpenD] = useState(false);
    const [sel, setSel] = useState(null);
    const [estado, setEstado] = useState("Pendiente");

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get(`${BASE.PEDIDOS}/api/pedidos`);
            setRows(res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(()=>{ load(); },[]);

    const list = useMemo(()=>{
        const s = q.trim().toLowerCase();
        return s ? rows.filter(p =>
            `${p.id} ${p.cliente?.nombre||""} ${p.estado}`.toLowerCase().includes(s)
        ) : rows;
    },[q, rows]);

    const openEdit = (r)=>{ setSel(r); setEstado(r.estado || "Pendiente"); setOpenE(true); };
    const updateEstado = async ()=>{
        try{
            await api.patch(`${BASE.PEDIDOS}/api/pedidos/${sel.id}`, { estado });
            setRows(prev => prev.map(x => x.id===sel.id ? {...x, estado} : x));
            setOpenE(false); setSel(null);
        }catch(e){ console.error(e); }
    };

    const openDelete = (r)=>{ setSel(r); setOpenD(true); };
    const doDelete = async ()=>{
        try{
            await api.delete(`${BASE.PEDIDOS}/api/pedidos/${sel.id}`);
            setRows(prev => prev.filter(x => x.id !== sel.id));
        }catch(e){ console.error(e); }
        finally { setOpenD(false); setSel(null); }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="titulo-seccion">🧾 Gestión de Pedidos</h3>
            </div>

            <div className="filter-panel mb-3">
                <input placeholder="Buscar por ID, cliente, estado..." value={q} onChange={e=>setQ(e.target.value)} />
            </div>

            {loading ? <p>Cargando...</p> : (
                <table className="table table-hover">
                    <thead><tr>
                        <th>ID</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th></th>
                    </tr></thead>
                    <tbody>
                    {list.map(p=>(
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.cliente?.nombre || "—"}</td>
                            <td>{p.fechaPedido ? new Date(p.fechaPedido).toLocaleDateString("es-CL") : "—"}</td>
                            <td>${(p.total||0).toLocaleString("es-CL")}</td>
                            <td>
                  <span className={`badge ${
                      p.estado==="Entregado" ? "badge-activo" :
                          p.estado==="Pendiente" ? "badge-warning" : "badge-inactivo"
                  }`}>{p.estado}</span>
                            </td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>openEdit(p)}>Cambiar estado</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={()=>openDelete(p)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Cambiar estado */}
            <AdminModal open={openE} title={`Actualizar estado pedido #${sel?.id}`} onClose={()=>{setOpenE(false); setSel(null);}} onSubmit={updateEstado} submitText="Actualizar">
                <div className="form-container">
                    <div className="mb-2">
                        <label className="form-label">Estado</label>
                        <select className="form-control" value={estado} onChange={e=>setEstado(e.target.value)}>
                            <option>Pendiente</option>
                            <option>Preparando</option>
                            <option>Despachado</option>
                            <option>Entregado</option>
                            <option>Cancelado</option>
                        </select>
                    </div>
                </div>
            </AdminModal>

            {/* Eliminar */}
            <ConfirmDialog
                open={openD}
                title="Eliminar pedido"
                message={`¿Eliminar el pedido #${sel?.id}?`}
                onCancel={()=>{setOpenD(false); setSel(null);}}
                onConfirm={doDelete}
            />
        </div>
    );
}