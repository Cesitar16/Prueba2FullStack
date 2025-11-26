import { useEffect, useMemo, useState } from "react";
import {Container, Table, Button, Form, Badge, InputGroup, Row, Col} from "react-bootstrap";
import { api, BASE } from "../../services/api";
import AdminModal from "../../components/admin/common/AdminModal.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import "../../assets/styles/estilos.css";

export default function InventarioAdmin() {
    const [rows, setRows] = useState([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);

    // ====== PAGINACIÓN ======
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 10;

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

    // Filtrado
    const list = useMemo(()=>{
        const s = q.trim().toLowerCase();
        return s ? rows.filter(r => `${r.urnaId} ${r.ubicacionFisica} ${r.estado}`.toLowerCase().includes(s)) : rows;
    },[q, rows]);

    // Reiniciar a página 1 si cambia el filtro
    useEffect(() => {
        setPaginaActual(1);
    }, [q]);

    // Lógica de Paginación
    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const itemsActuales = list.slice(indicePrimerItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(list.length / itemsPorPagina);

    const cambiarPagina = (n) => {
        if (n >= 1 && n <= totalPaginas) setPaginaActual(n);
    };

    // --- ACCIONES ---
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

    const getBadgeVariant = (r) => {
        if (r.cantidadActual === 0) return "secondary";
        if (r.cantidadActual <= r.cantidadMinima) return "warning";
        return "success";
    };

    const getBadgeText = (r) => {
        if (r.cantidadActual === 0) return "Agotado";
        if (r.cantidadActual <= r.cantidadMinima) return "Bajo Stock";
        return "Disponible";
    };

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0 fw-bold" style={{ color: 'var(--color-principal)', fontFamily: 'Playfair Display, serif' }}>
                    📦 Gestión de Inventario
                </h3>
                <Button variant="" className="btn-brand shadow-sm" onClick={openCreate}>
                    <i className="bi bi-plus-lg me-2"></i>Nuevo Registro
                </Button>
            </div>

            <InputGroup className="mb-4 shadow-sm">
                <InputGroup.Text className="bg-white border-end-0 text-muted"><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                    className="border-start-0 ps-0"
                    placeholder="Buscar por urnaId, ubicación, estado..."
                    value={q}
                    onChange={e=>setQ(e.target.value)}
                />
            </InputGroup>

            {loading ? (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-arrow-repeat fs-1 spinner-border mb-2 border-0"></i>
                    <p>Cargando inventario...</p>
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <Table hover bordered className="align-middle bg-white mb-0">
                        <thead className="text-white" style={{ backgroundColor: 'var(--color-principal)' }}>
                        <tr>
                            <th className="py-3 ps-3">ID</th>
                            <th className="py-3 text-center">Urna ID</th>
                            <th className="py-3 text-center">Actual</th>
                            <th className="py-3 text-center">Mín / Máx</th>
                            <th className="py-3">Ubicación</th>
                            <th className="py-3 text-center">Estado</th>
                            <th className="py-3 text-end pe-4">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {itemsActuales.map(r=>(
                            <tr key={r.id}>
                                <td className="ps-3 fw-semibold text-muted">{r.id}</td>
                                <td className="text-center fw-bold text-dark">{r.urnaId}</td>
                                <td className="text-center fs-5 fw-bold" style={{ color: r.cantidadActual <= r.cantidadMinima ? '#dc3545' : '#198754' }}>
                                    {r.cantidadActual}
                                </td>
                                <td className="text-center text-muted small">
                                    {r.cantidadMinima} / {r.cantidadMaxima}
                                </td>
                                <td className="text-muted">{r.ubicacionFisica || "—"}</td>
                                <td className="text-center">
                                    <Badge
                                        bg={getBadgeVariant(r)}
                                        className="px-3 py-2 fw-normal text-uppercase"
                                        style={{letterSpacing: '0.5px'}}
                                    >
                                        {getBadgeText(r)}
                                    </Badge>
                                </td>
                                <td className="text-end pe-3" style={{width: '180px'}}>
                                    <Button variant="" size="sm" className="btn-brand-outline me-2" onClick={()=>openEdit(r)}>
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={()=>openDelete(r)}>
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {!itemsActuales.length && (
                            <tr>
                                <td colSpan={7} className="text-center py-5 text-muted">
                                    <i className="bi bi-box2 display-4 d-block mb-3 opacity-50"></i>
                                    No hay registros que coincidan.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* ===== PAGINACIÓN CORPORATIVA ===== */}
            {list.length > 0 && (
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

            {/* === MODALES (Sin cambios) === */}
            <AdminModal open={openC} title="Nuevo inventario" onClose={()=>setOpenC(false)} onSubmit={createItem} submitText="Crear">
                <Form>
                    <Row className="g-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-bold text-secondary">Urna ID</Form.Label>
                                <Form.Control name="urnaId" value={f.urnaId} onChange={onChange} placeholder="Ej: 105" autoFocus />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Cantidad Actual</Form.Label>
                                <Form.Control type="number" name="cantidadActual" value={f.cantidadActual} onChange={onChange} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Mínima</Form.Label>
                                <Form.Control type="number" name="cantidadMinima" value={f.cantidadMinima} onChange={onChange} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Máxima</Form.Label>
                                <Form.Control type="number" name="cantidadMaxima" value={f.cantidadMaxima} onChange={onChange} />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Ubicación Física</Form.Label>
                                <Form.Control name="ubicacionFisica" value={f.ubicacionFisica} onChange={onChange} placeholder="Ej: Bodega 1, Pasillo 3" />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Estado Inicial</Form.Label>
                                <Form.Select name="estado" value={f.estado} onChange={onChange}>
                                    <option>Disponible</option>
                                    <option>Bloqueado</option>
                                    <option>Agotado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </AdminModal>

            <AdminModal open={openE} title={`Editar inventario #${sel?.id}`} onClose={()=>{setOpenE(false); setSel(null);}} onSubmit={updateItem}>
                <Form>
                    <Row className="g-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-bold text-secondary">Urna ID</Form.Label>
                                <Form.Control name="urnaId" value={f.urnaId} onChange={onChange} disabled className="bg-light" />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Cantidad Actual</Form.Label>
                                <Form.Control type="number" name="cantidadActual" value={f.cantidadActual} onChange={onChange} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Mínima</Form.Label>
                                <Form.Control type="number" name="cantidadMinima" value={f.cantidadMinima} onChange={onChange} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Máxima</Form.Label>
                                <Form.Control type="number" name="cantidadMaxima" value={f.cantidadMaxima} onChange={onChange} />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Ubicación Física</Form.Label>
                                <Form.Control name="ubicacionFisica" value={f.ubicacionFisica} onChange={onChange} />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Estado</Form.Label>
                                <Form.Select name="estado" value={f.estado} onChange={onChange}>
                                    <option>Disponible</option>
                                    <option>Bloqueado</option>
                                    <option>Agotado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </AdminModal>

            <ConfirmDialog
                open={openD}
                title="Eliminar registro"
                message={`¿Eliminar inventario #${sel?.id}? Esta acción no se puede deshacer.`}
                onCancel={()=>{setOpenD(false); setSel(null);}}
                onConfirm={doDelete}
            />
        </Container>
    );
}