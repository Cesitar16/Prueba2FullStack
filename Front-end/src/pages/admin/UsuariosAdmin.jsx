import { useEffect, useMemo, useState } from "react";
import { api, BASE } from "../../services/api";
import AdminModal from "../../components/admin/AdminModal.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

export default function UsuariosAdmin() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // búsqueda
    const [q, setQ] = useState("");
    const filtrados = useMemo(() => {
        const s = q.trim().toLowerCase();
        return s ? data.filter(u =>
            `${u.nombre} ${u.correo} ${u.rol} ${u.estado}`.toLowerCase().includes(s)
        ) : data;
    }, [q, data]);

    // CRUD states
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [sel, setSel] = useState(null);

    const [form, setForm] = useState({ nombre:"", correo:"", password:"", rol:"Cliente", estado:"Activo" });

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get(`${BASE.USUARIOS}/api/usuarios`);
            setData(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, []);

    const onChange = e => setForm(f => ({...f, [e.target.name]: e.target.value}));

    // CREATE
    const openCreateModal = () => { setForm({ nombre:"", correo:"", password:"", rol:"Cliente", estado:"Activo" }); setOpenCreate(true); };
    const createUser = async () => {
        try {
            // tu API de registro pide nombre, correo, password y rol
            const body = { nombre: form.nombre, correo: form.correo, password: form.password, rol: form.rol };
            const res = await api.post(`${BASE.USUARIOS}/api/auth/register`, body);
            setData(prev => [res.data, ...prev]);
            setOpenCreate(false);
        } catch (e) { console.error(e); }
    };

    // EDIT
    const openEditModal = (u) => {
        setSel(u);
        setForm({ nombre: u.nombre || "", correo: u.correo || "", password:"", rol: u.rol || "Cliente", estado: u.estado || "Activo" });
        setOpenEdit(true);
    };
    const updateUser = async () => {
        try {
            const body = { nombre: form.nombre, rol: form.rol, estado: form.estado };
            await api.patch(`${BASE.USUARIOS}/api/usuarios/${sel.id}`, body);
            setData(prev => prev.map(x => x.id === sel.id ? {...x, ...body} : x));
            setOpenEdit(false);
            setSel(null);
        } catch (e) { console.error(e); }
    };

    // DELETE (o desactivar)
    const openDelete = (u) => { setSel(u); setOpenDel(true); };
    const doDelete = async () => {
        try {
            // si no tienes DELETE, comenta esto y usa un PATCH estado=Inactivo
            await api.delete(`${BASE.USUARIOS}/api/usuarios/${sel.id}`);
            setData(prev => prev.filter(x => x.id !== sel.id));
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            // fallback: desactivar
            try {
                await api.patch(`${BASE.USUARIOS}/api/usuarios/${sel.id}`, { estado: "Inactivo" });
                setData(prev => prev.map(x => x.id === sel.id ? {...x, estado:"Inactivo"} : x));
            } catch (err2) { console.error(err2); }
        } finally {
            setOpenDel(false);
            setSel(null);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="titulo-seccion">👥 Gestión de Usuarios</h3>
                <button className="btn btn-guardar" onClick={openCreateModal}>Nuevo usuario</button>
            </div>

            <div className="filter-panel mb-3">
                <input placeholder="Buscar: nombre, correo, rol, estado..." value={q} onChange={e=>setQ(e.target.value)} />
            </div>

            {loading ? <p>Cargando...</p> : (
                <table className="table table-hover">
                    <thead><tr>
                        <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th></th>
                    </tr></thead>
                    <tbody>
                    {filtrados.map(u=>(
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.nombre}</td>
                            <td>{u.correo}</td>
                            <td>{u.rol}</td>
                            <td><span className={`badge ${u.estado==="Activo"?"badge-activo":"badge-inactivo"}`}>{u.estado}</span></td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>openEditModal(u)}>Editar</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={()=>openDelete(u)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Create */}
            <AdminModal open={openCreate} title="Nuevo usuario" onClose={()=>setOpenCreate(false)} onSubmit={createUser} submitText="Crear">
                <div className="form-container">
                    <div className="mb-2">
                        <label className="form-label">Nombre</label>
                        <input className="form-control" name="nombre" value={form.nombre} onChange={onChange} required/>
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Correo</label>
                        <input type="email" className="form-control" name="correo" value={form.correo} onChange={onChange} required/>
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" name="password" value={form.password} onChange={onChange} required/>
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Rol</label>
                        <select className="form-control" name="rol" value={form.rol} onChange={onChange}>
                            <option>Cliente</option>
                            <option>Administrador</option>
                        </select>
                    </div>
                </div>
            </AdminModal>

            {/* Edit */}
            <AdminModal open={openEdit} title={`Editar usuario #${sel?.id}`} onClose={()=>{setOpenEdit(false); setSel(null);}} onSubmit={updateUser}>
                <div className="form-container">
                    <div className="mb-2">
                        <label className="form-label">Nombre</label>
                        <input className="form-control" name="nombre" value={form.nombre} onChange={onChange}/>
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Rol</label>
                        <select className="form-control" name="rol" value={form.rol} onChange={onChange}>
                            <option>Cliente</option>
                            <option>Administrador</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Estado</label>
                        <select className="form-control" name="estado" value={form.estado} onChange={onChange}>
                            <option>Activo</option>
                            <option>Inactivo</option>
                        </select>
                    </div>
                </div>
            </AdminModal>

            {/* Delete */}
            <ConfirmDialog
                open={openDel}
                title="Eliminar usuario"
                message={`¿Seguro que deseas eliminar al usuario "${sel?.nombre}"?`}
                onCancel={()=>{setOpenDel(false); setSel(null);}}
                onConfirm={doDelete}
            />
        </div>
    );
}