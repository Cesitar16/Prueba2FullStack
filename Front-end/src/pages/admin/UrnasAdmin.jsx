import { useEffect, useMemo, useState } from "react";
import { api, BASE } from "../../services/api";
import AdminModal from "../../components/admin/AdminModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

export default function UrnasAdmin() {
    const [rows, setRows] = useState([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);

    const [openC, setOpenC] = useState(false);
    const [openE, setOpenE] = useState(false);
    const [openD, setOpenD] = useState(false);
    const [sel, setSel] = useState(null);

    const [f, setF] = useState({ nombre:"", material:"", color:"", precio:0, estado:"Activo" });
    const onChange = e => setF(v=>({...v, [e.target.name]: e.target.value}));

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get(`${BASE.CATALOGO}/api/urnas`);
            setRows(res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(()=>{ load(); },[]);

    const list = useMemo(()=>{
        const s = q.trim().toLowerCase();
        return s ? rows.filter(r => `${r.nombre} ${r.material?.nombre} ${r.color?.nombre}`.toLowerCase().includes(s)) : rows;
    },[q, rows]);

    const openCreate = () => { setF({ nombre:"", material:"", color:"", precio:0, estado:"Activo" }); setOpenC(true); };
    const createItem = async () => {
        try{
            const body = { nombre:f.nombre, precio: Number(f.precio), estado:f.estado, material:f.material, color:f.color };
            const res = await api.post(`${BASE.CATALOGO}/api/urnas`, body);
            setRows(prev => [res.data, ...prev]);
            setOpenC(false);
        }catch(e){ console.error(e); }
    };

    const openEdit = (r) => { setSel(r); setF({
        nombre: r.nombre || "", material: r.material?.nombre || "", color: r.color?.nombre || "",
        precio: r.precio || 0, estado: r.estado || "Activo"
    }); setOpenE(true); };

    const updateItem = async () => {
        try{
            const body = { nombre:f.nombre, precio:Number(f.precio), estado:f.estado, material:f.material, color:f.color };
            await api.put(`${BASE.CATALOGO}/api/urnas/${sel.id}`, body);
            setRows(prev => prev.map(x => x.id===sel.id ? {...x, ...body, material:{nombre:body.material}, color:{nombre:body.color}} : x));
            setOpenE(false); setSel(null);
        }catch(e){ console.error(e); }
    };

    const openDelete = (r) => { setSel(r); setOpenD(true); };
    const doDelete = async () => {
        try{
            await api.delete(`${BASE.CATALOGO}/api/urnas/${sel.id}`);
            setRows(prev => prev.filter(x => x.id !== sel.id));
        }catch(e){ console.error(e); }
        finally { setOpenD(false); setSel(null); }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="titulo-seccion">⚰️ Gestión de Urnas / Productos</h3>
                <button className="btn btn-guardar" onClick={openCreate}>Nueva urna</button>
            </div>

            <div className="filter-panel">
                <input placeholder="Buscar por nombre, material o color..." value={q} onChange={e=>setQ(e.target.value)} />
            </div>

            {loading ? <p>Cargando...</p> : (
                <table className="table table-hover">
                    <thead><tr>
                        <th>ID</th><th>Nombre</th><th>Material</th><th>Color</th><th>Precio</th><th>Estado</th><th></th>
                    </tr></thead>
                    <tbody>
                    {list.map(r=>(
                        <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>{r.nombre}</td>
                            <td>{r.material?.nombre || r.material || "-"}</td>
                            <td>{r.color?.nombre || r.color || "-"}</td>
                            <td>${(r.precio||0).toLocaleString("es-CL")}</td>
                            <td><span className={`badge ${r.estado==="Activo"?"badge-activo":"badge-inactivo"}`}>{r.estado}</span></td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>openEdit(r)}>Editar</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={()=>openDelete(r)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Create */}
            <AdminModal open={openC} title="Nueva urna" onClose={()=>setOpenC(false)} onSubmit={createItem} submitText="Crear">
                <div className="form-container">
                    <div className="mb-2"><label className="form-label">Nombre</label>
                        <input name="nombre" className="form-control" value={f.nombre} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Material</label>
                        <input name="material" className="form-control" value={f.material} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Color</label>
                        <input name="color" className="form-control" value={f.color} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Precio</label>
                        <input type="number" name="precio" className="form-control" value={f.precio} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Estado</label>
                        <select name="estado" className="form-control" value={f.estado} onChange={onChange}>
                            <option>Activo</option><option>Inactivo</option>
                        </select></div>
                </div>
            </AdminModal>

            {/* Edit */}
            <AdminModal open={openE} title={`Editar urna #${sel?.id}`} onClose={()=>{setOpenE(false); setSel(null);}} onSubmit={updateItem}>
                <div className="form-container">
                    <div className="mb-2"><label className="form-label">Nombre</label>
                        <input name="nombre" className="form-control" value={f.nombre} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Material</label>
                        <input name="material" className="form-control" value={f.material} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Color</label>
                        <input name="color" className="form-control" value={f.color} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Precio</label>
                        <input type="number" name="precio" className="form-control" value={f.precio} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Estado</label>
                        <select name="estado" className="form-control" value={f.estado} onChange={onChange}>
                            <option>Activo</option><option>Inactivo</option>
                        </select></div>
                </div>
            </AdminModal>

            {/* Delete */}
            <ConfirmDialog
                open={openD}
                title="Eliminar urna"
                message={`¿Eliminar la urna "${sel?.nombre}"?`}
                onCancel={()=>{setOpenD(false); setSel(null);}}
                onConfirm={doDelete}
            />
        </div>
    );
}