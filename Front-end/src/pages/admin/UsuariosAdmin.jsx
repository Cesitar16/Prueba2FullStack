import { useEffect, useMemo, useState } from "react";
import { Container, Table, Button, Form, Badge, InputGroup } from "react-bootstrap";
import { api, BASE } from "../../services/api";
import AdminModal from "../../components/admin/common/AdminModal.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import "../../assets/styles/estilos.css";

export default function UsuariosAdmin() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");

    // ====== PAGINACIÓN ======
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 10;

    // Estados CRUD
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [sel, setSel] = useState(null);
    const [form, setForm] = useState({ nombre:"", correo:"", password:"", rol:"Cliente", estado:"Activo" });

    // Filtrado
    const filtrados = useMemo(() => {
        const s = q.trim().toLowerCase();
        return s ? data.filter(u => `${u.nombre} ${u.correo} ${u.rol} ${u.estado}`.toLowerCase().includes(s)) : data;
    }, [q, data]);

    // Reiniciar página al filtrar
    useEffect(() => {
        setPaginaActual(1);
    }, [q]);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get(`${BASE.USUARIOS}/api/usuarios`);
            setData(res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    // Lógica de Paginación
    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const itemsActuales = filtrados.slice(indicePrimerItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(filtrados.length / itemsPorPagina);

    const cambiarPagina = (n) => {
        if (n >= 1 && n <= totalPaginas) setPaginaActual(n);
    };

    const onChange = e => setForm(f => ({...f, [e.target.name]: e.target.value}));

    // Acciones
    const openCreateModal = () => { setForm({ nombre:"", correo:"", password:"", rol:"Cliente", estado:"Activo" }); setOpenCreate(true); };

    const createUser = async () => {
        try {
            const body = { nombre: form.nombre, correo: form.correo, password: form.password, rol: form.rol };
            const res = await api.post(`${BASE.USUARIOS}/api/auth/register`, body);
            setData(prev => [res.data, ...prev]);
            setOpenCreate(false);
        } catch (e) { console.error(e); }
    };

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
            setOpenEdit(false); setSel(null);
        } catch (e) { console.error(e); }
    };

    const openDelete = (u) => { setSel(u); setOpenDel(true); };

    const doDelete = async () => {
        try {
            await api.delete(`${BASE.USUARIOS}/api/usuarios/${sel.id}`);
            setData(prev => prev.filter(x => x.id !== sel.id));
        } catch (e) { console.error(e); }
        finally { setOpenDel(false); setSel(null); }
    };

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0 fw-bold" style={{ color: 'var(--color-principal)', fontFamily: 'Playfair Display, serif' }}>
                    👤 Gestión de Usuarios
                </h3>
                <Button variant="" className="btn-brand shadow-sm" onClick={openCreateModal}>
                    <i className="bi bi-person-plus-fill me-2"></i>Nuevo Usuario
                </Button>
            </div>

            <InputGroup className="mb-4 shadow-sm">
                <InputGroup.Text className="bg-white border-end-0 text-muted"><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                    className="border-start-0 ps-0"
                    placeholder="Buscar por nombre, correo, rol..."
                    value={q}
                    onChange={e=>setQ(e.target.value)}
                />
            </InputGroup>

            {loading ? <div className="text-center py-5">Cargando...</div> : (
                <div className="table-responsive shadow-sm rounded">
                    <Table hover bordered className="align-middle bg-white mb-0">
                        <thead className="text-white" style={{ backgroundColor: 'var(--color-principal)' }}>
                        <tr>
                            <th className="py-3 ps-3">ID</th>
                            <th className="py-3">Nombre</th>
                            <th className="py-3">Correo</th>
                            <th className="py-3">Rol</th>
                            <th className="py-3 text-center">Estado</th>
                            <th className="py-3 text-end pe-4">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {itemsActuales.map(u=>(
                            <tr key={u.id}>
                                <td className="ps-3 fw-semibold text-muted">{u.id}</td>
                                <td className="fw-medium">{u.nombre}</td>
                                <td className="text-muted small">{u.correo}</td>
                                <td>
                                    <Badge bg="light" text="dark" className="border fw-normal">
                                        {u.rol}
                                    </Badge>
                                </td>
                                <td className="text-center">
                                    <Badge
                                        bg={u.estado==="Activo" ? "success" : "secondary"}
                                        className="px-3 py-2 fw-normal"
                                    >
                                        {u.estado}
                                    </Badge>
                                </td>
                                <td className="text-end pe-3" style={{width: '180px'}}>
                                    <Button variant="" size="sm" className="btn-brand-outline me-2" onClick={()=>openEditModal(u)}>
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={()=>openDelete(u)}>
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* ===== PAGINACIÓN CORPORATIVA ===== */}
            {filtrados.length > 0 && (
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

            {/* Modals (Sin cambios) */}
            <AdminModal open={openCreate} title="Nuevo usuario" onClose={()=>setOpenCreate(false)} onSubmit={createUser} submitText="Crear">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control name="nombre" value={form.nombre} onChange={onChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control type="email" name="correo" value={form.correo} onChange={onChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" name="password" value={form.password} onChange={onChange} required minLength={8} placeholder="Mínimo 8 caracteres" />
                        <Form.Text className="text-muted">Debe tener al menos 8 caracteres.</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select name="rol" value={form.rol} onChange={onChange}>
                            <option>Cliente</option>
                            <option>Administrador</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </AdminModal>

            <AdminModal open={openEdit} title={`Editar usuario #${sel?.id}`} onClose={()=>{setOpenEdit(false); setSel(null);}} onSubmit={updateUser}>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control name="nombre" value={form.nombre} onChange={onChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select name="rol" value={form.rol} onChange={onChange}>
                            <option>Cliente</option>
                            <option>Administrador</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select name="estado" value={form.estado} onChange={onChange}>
                            <option>Activo</option>
                            <option>Inactivo</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </AdminModal>

            <ConfirmDialog
                open={openDel}
                title="Eliminar usuario"
                message={`¿Seguro que deseas eliminar al usuario "${sel?.nombre}"?`}
                onCancel={()=>{setOpenDel(false); setSel(null);}}
                onConfirm={doDelete}
            />
        </Container>
    );
}