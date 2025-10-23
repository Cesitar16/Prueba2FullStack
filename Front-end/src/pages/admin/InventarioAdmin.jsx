import { useEffect, useMemo, useState } from "react";
import { api, BASE } from "../../services/api";
import AdminModal from "../../components/admin/AdminModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

export default function InventarioAdmin() {
    const [rows, setRows] = useState([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);

    const [openC, setOpenC] = useState(false);
    const [openE, setOpenE] = useState(false);
    const [openD, setOpenD] = useState(false);
    const [sel, setSel] = useState(null);

    const [f, setF] = useState({
        urnaId:"", cantidadActual:0, cantidadMinima:0, cantidadMaxima:0, ubicacionFisica:"", estado:"Disponible"
    });
    const onChange = e => setF(v=>({...v, [e.target.name]: e.target.value}));

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get(`${BASE.INVENTARIO}/api/inventario`);
            setRows(res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };
    useEffect(()=>{ load(); },[]);

    const list = useMemo(()=>{
        const s = q.trim().toLowerCase();
        return s ? rows.filter(r => `${r.urnaId} ${r.ubicacionFisica} ${r.estado}`.toLowerCase().includes(s)) : rows;
    },[q, rows]);

    const openCreate = ()=>{ setF({ urnaId:"", cantidadActual:0, cantidadMinima:0, cantidadMaxima:0, ubicacionFisica:"", estado:"Disponible" }); setOpenC(true); };
    const createItem = async ()=>{
        try{
            const body = {
                urnaId: Number(f.urnaId),
                cantidadActual: Number(f.cantidadActual),
                cantidadMinima: Number(f.cantidadMinima),
                cantidadMaxima: Number(f.cantidadMaxima),
                ubicacionFisica: f.ubicacionFisica,
                estado: f.estado
            };
            const res = await api.post(`${BASE.INVENTARIO}/api/inventario`, body);
            setRows(prev => [res.data, ...prev]);
            setOpenC(false);
        }catch(e){ console.error(e); }
    };

    const openEdit = (r)=>{ setSel(r); setF({
        urnaId: r.urnaId, cantidadActual: r.cantidadActual, cantidadMinima: r.cantidadMinima, cantidadMaxima: r.cantidadMaxima,
        ubicacionFisica: r.ubicacionFisica || "", estado: r.estado || "Disponible"
    }); setOpenE(true); };

    const updateItem = async ()=>{
        try{
            const body = {
                urnaId: Number(f.urnaId),
                cantidadActual: Number(f.cantidadActual),
                cantidadMinima: Number(f.cantidadMinima),
                cantidadMaxima: Number(f.cantidadMaxima),
                ubicacionFisica: f.ubicacionFisica,
                estado: f.estado
            };
            await api.put(`${BASE.INVENTARIO}/api/inventario/${sel.id}`, body);
            setRows(prev => prev.map(x => x.id===sel.id ? {...x, ...body} : x));
            setOpenE(false); setSel(null);
        }catch(e){ console.error(e); }
    };

    const openDelete = (r)=>{ setSel(r); setOpenD(true); };
    const doDelete = async ()=> {
        try{
            await api.delete(`${BASE.INVENTARIO}/api/inventario/${sel.id}`);
            setRows(prev => prev.filter(x=>x.id !== sel.id));
        }catch(e){ console.error(e); }
        finally { setOpenD(false); setSel(null); }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="titulo-seccion">📦 Gestión de Inventario</h3>
                <button className="btn btn-guardar" onClick={openCreate}>Nuevo registro</button>
            </div>

            <div className="filter-panel mb-3">
                <input placeholder="Buscar por urnaId, ubicación, estado..." value={q} onChange={e=>setQ(e.target.value)} />
            </div>

            {loading ? <p>Cargando...</p> : (
                <table className="table table-hover">
                    <thead><tr>
                        <th>ID</th><th>UrnaID</th><th>Actual</th><th>Mín</th><th>Máx</th><th>Ubicación</th><th>Estado</th><th></th>
                    </tr></thead>
                    <tbody>
                    {list.map(r=>(
                        <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>{r.urnaId}</td>
                            <td>{r.cantidadActual}</td>
                            <td>{r.cantidadMinima}</td>
                            <td>{r.cantidadMaxima}</td>
                            <td>{r.ubicacionFisica || "—"}</td>
                            <td>
                  <span className={`badge ${r.cantidadActual<=r.cantidadMinima ? "badge-stock-bajo":"badge-activo"}`}>
                    {r.cantidadActual<=r.cantidadMinima ? "Bajo Stock" : "Disponible"}
                  </span>
                            </td>
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
            <AdminModal open={openC} title="Nuevo inventario" onClose={()=>setOpenC(false)} onSubmit={createItem} submitText="Crear">
                <div className="form-container">
                    <div className="mb-2"><label className="form-label">UrnaID</label>
                        <input name="urnaId" className="form-control" value={f.urnaId} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Cantidad actual</label>
                        <input type="number" name="cantidadActual" className="form-control" value={f.cantidadActual} onChange={onChange}/></div>
                    <div className="mb-2 d-flex gap-2">
                        <div style={{flex:1}}>
                            <label className="form-label">Mínima</label>
                            <input type="number" name="cantidadMinima" className="form-control" value={f.cantidadMinima} onChange={onChange}/>
                        </div>
                        <div style={{flex:1}}>
                            <label className="form-label">Máxima</label>
                            <input type="number" name="cantidadMaxima" className="form-control" value={f.cantidadMaxima} onChange={onChange}/>
                        </div>
                    </div>
                    <div className="mb-2"><label className="form-label">Ubicación física</label>
                        <input name="ubicacionFisica" className="form-control" value={f.ubicacionFisica} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Estado</label>
                        <select name="estado" className="form-control" value={f.estado} onChange={onChange}>
                            <option>Disponible</option><option>Bloqueado</option>
                        </select></div>
                </div>
            </AdminModal>

            {/* Edit */}
            <AdminModal open={openE} title={`Editar inventario #${sel?.id}`} onClose={()=>{setOpenE(false); setSel(null);}} onSubmit={updateItem}>
                <div className="form-container">
                    {/* mismos campos que create */}
                    <div className="mb-2"><label className="form-label">UrnaID</label>
                        <input name="urnaId" className="form-control" value={f.urnaId} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Cantidad actual</label>
                        <input type="number" name="cantidadActual" className="form-control" value={f.cantidadActual} onChange={onChange}/></div>
                    <div className="mb-2 d-flex gap-2">
                        <div style={{flex:1}}>
                            <label className="form-label">Mínima</label>
                            <input type="number" name="cantidadMinima" className="form-control" value={f.cantidadMinima} onChange={onChange}/>
                        </div>
                        <div style={{flex:1}}>
                            <label className="form-label">Máxima</label>
                            <input type="number" name="cantidadMaxima" className="form-control" value={f.cantidadMaxima} onChange={onChange}/>
                        </div>
                    </div>
                    <div className="mb-2"><label className="form-label">Ubicación física</label>
                        <input name="ubicacionFisica" className="form-control" value={f.ubicacionFisica} onChange={onChange}/></div>
                    <div className="mb-2"><label className="form-label">Estado</label>
                        <select name="estado" className="form-control" value={f.estado} onChange={onChange}>
                            <option>Disponible</option><option>Bloqueado</option>
                        </select></div>
                </div>
            </AdminModal>

            {/* Delete */}
            <ConfirmDialog
                open={openD}
                title="Eliminar registro"
                message={`¿Eliminar inventario #${sel?.id}?`}
                onCancel={()=>{setOpenD(false); setSel(null);}}
                onConfirm={doDelete}
            />
        </div>
    );
}