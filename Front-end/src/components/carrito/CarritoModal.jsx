import {useContext, useEffect, useRef, useState} from "react";
import { Modal, Button, Form, Row, Col, Table, Alert, Image, Spinner } from "react-bootstrap";
import { CarritoContext } from "../../context/CarritoContext";
import { AuthContext } from "../../context/AuthContext";
import placeholder from "../../assets/img/placeholder.png";
import {
    usuariosApi,
    pedidosApi,
    inventarioApi,
    ubicacionApi
} from "../../services/api";
import "../../assets/styles/estilos.css";

export function CarritoModal({ show, onHide }) {
    const { carrito, vaciarCarrito } = useContext(CarritoContext);
    const { usuario, isAuthenticated, login } = useContext(AuthContext);
    const prefilledRef = useRef(false);

    const [etapa, setEtapa] = useState("carrito");
    const [loading, setLoading] = useState(false);

    // Login inline
    const [credenciales, setCredenciales] = useState({ correo: "", password: "" });

    // Envío y Ubicación
    const [direccionId, setDireccionId] = useState(null);
    const [envio, setEnvio] = useState({
        region: "", comuna: "", direccion: "", telefono: "", pais: "Chile",
    });

    // Estados para combos
    const [regiones, setRegiones] = useState([]);
    const [comunas, setComunas] = useState([]);
    const [regionIdSeleccionada, setRegionIdSeleccionada] = useState(""); // Para controlar la carga de comunas

    // 🔄 Reiniciar
    useEffect(() => {
        if (!show) setTimeout(() => setEtapa("carrito"), 300);
    }, [show]);

    const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const total = Math.round(subtotal * 1.19);

    const setField = (k, v) => {
        setEnvio((s) => {
            const next = { ...s, [k]: v };
            localStorage.setItem("shippingDraft", JSON.stringify(next));
            return next;
        });
    };

    // 📦 1. Cargar Regiones cuando se muestra el modal o se llega a confirmar
    useEffect(() => {
        if (etapa === "confirmar" && regiones.length === 0) {
            ubicacionApi.getRegiones()
                .then(res => setRegiones(res.data || []))
                .catch(err => console.error("Error cargando regiones", err));
        }
    }, [etapa, regiones.length]);

    // 📦 2. Cargar Comunas cuando cambia la región
    useEffect(() => {
        if (!regionIdSeleccionada) {
            setComunas([]);
            return;
        }
        ubicacionApi.getComunasByRegion(regionIdSeleccionada)
            .then(res => setComunas(res.data || []))
            .catch(err => console.error("Error cargando comunas", err));
    }, [regionIdSeleccionada]);


    // 📦 Prefill de datos de usuario (Dirección guardada)
    useEffect(() => {
        if (etapa !== "confirmar" || prefilledRef.current) return;
        prefilledRef.current = true;

        (async () => {
            try {
                if (isAuthenticated && usuario?.id) {
                    const res = await usuariosApi.getDireccionesByUsuario(usuario.id);
                    const lista = res?.data || [];
                    if (lista.length > 0) {
                        const d = lista[0];
                        setDireccionId(d.id);
                        setEnvio({
                            region: d.region || "",
                            comuna: d.comuna || "",
                            direccion: d.calle || "",
                            telefono: d.telefono || "",
                            pais: d.pais || "Chile",
                        });

                        // Intentar pre-seleccionar en los combos si ya existe el dato
                        // Nota: Esto requiere que 'd.region' coincida con el nombre de la región en tu BD
                        // Si guardaste el ID, mejor. Si guardaste el nombre, buscamos el ID.
                        if(d.region && regiones.length > 0) {
                            const regEncontrada = regiones.find(r => r.nombre === d.region);
                            if(regEncontrada) setRegionIdSeleccionada(regEncontrada.id);
                        }
                        return;
                    }
                }
            } catch (e) { console.warn("Error prefill dirección:", e); }

            // Fallback LocalStorage
            try {
                const draft = JSON.parse(localStorage.getItem("shippingDraft") || "{}");
                setEnvio((s) => ({ ...s, ...draft }));
            } catch { /* empty */ }
        })();
    }, [etapa, isAuthenticated, usuario?.id, regiones]); // Agregamos regiones a dep.

    useEffect(() => { if (etapa !== "confirmar") prefilledRef.current = false; }, [etapa]);

    // --- MANEJADORES DE CAMBIO DE COMBO ---
    const handleRegionChange = (e) => {
        const id = e.target.value;
        setRegionIdSeleccionada(id);

        // Guardamos el NOMBRE de la región en el estado de envío (para guardar en BD como string)
        // O guarda el ID si tu backend espera ID. Asumo string por tu código anterior.
        const nombreRegion = e.target.options[e.target.selectedIndex].text;
        setField("region", nombreRegion);

        // Resetear comuna al cambiar región
        setField("comuna", "");
    };

    const handleComunaChange = (e) => {
        const nombreComuna = e.target.options[e.target.selectedIndex].text; // O value si usas ID
        setField("comuna", nombreComuna);
    };


    // Validaciones
    const validarTelefono = (t) => /^\+56\s?9\s?\d{4}\s?\d{4}$/.test(t.trim());
    const validarEnvio = () => {
        if (!envio.region || !envio.comuna || !envio.direccion.trim() || !envio.telefono.trim()) return "Faltan campos de envío.";
        if (!validarTelefono(envio.telefono)) return "Formato teléfono inválido (+56 9 ...)";
        return null;
    };

    // ... (Manejadores handleCompra, handleLogin, handleConfirmarCompra se mantienen IGUALES) ...
    const handleCompra = () => {
        if (carrito.length === 0) return alert("Carrito vacío.");
        setEtapa(isAuthenticated ? "confirmar" : "login");
    };

    const handleLogin = async () => {
        if (!credenciales.correo || !credenciales.password) return alert("Ingresa credenciales.");
        try {
            setLoading(true);
            await login(credenciales.correo, credenciales.password);
            setEtapa("confirmar");
        } catch (err) { alert("Error de inicio de sesión."); }
        finally { setLoading(false); }
    };

    const handleConfirmarCompra = async () => {
        const err = validarEnvio();
        if (err) return alert(err);
        if (!usuario?.id) return alert("Error de usuario. Re-login requerido.");

        try {
            setLoading(true);
            let dirId = direccionId;
            const dirDto = {
                id: dirId ?? undefined, usuarioId: usuario.id,
                calle: envio.direccion, comuna: envio.comuna, region: envio.region,
                pais: envio.pais, telefono: envio.telefono
            };
            try {
                if (dirId) await usuariosApi.updateDireccion(dirId, dirDto);
                else {
                    const r = await usuariosApi.createDireccion(dirDto);
                    dirId = r?.data?.id;
                }
            } catch (e) { console.warn("Error guardando dirección", e); }

            const pedidoPayload = {
                usuarioId: usuario.id, direccionId: dirId, estadoPedidoId: 1, total,
                detalles: carrito.map(it => ({ urnaId: it.id, cantidad: it.cantidad, precioUnitario: it.precio }))
            };
            const resp = await pedidosApi.createPedido(pedidoPayload);

            try {
                await Promise.all(carrito.map(it => inventarioApi.disminuirStock(it.id, it.cantidad, "Venta Web", usuario.nombre)));
            } catch (e) { console.warn("Error descontando stock", e); }

            window.dispatchEvent(new CustomEvent("pedido:nuevo", { detail: resp.data }));
            setEtapa("exito");
            vaciarCarrito();
        } catch (e) {
            console.error(e);
            alert("Error procesando el pedido.");
        } finally { setLoading(false); }
    };

    const getTitle = () => {
        switch(etapa) {
            case "login": return "🔐 Inicia sesión";
            case "confirmar": return "✅ Datos de Envío";
            case "exito": return "🎉 ¡Compra Exitosa!";
            default: return "🛒 Carrito de Compras";
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered scrollable backdrop="static">
            {/* HEADER */}
            <Modal.Header closeButton className="modal-header-brand">
                <div className="d-flex align-items-center gap-2">
                    {etapa !== "carrito" && etapa !== "exito" && (
                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={() => setEtapa(etapa === "login" ? "carrito" : (isAuthenticated ? "carrito" : "login"))}
                            className="border-0"
                        >
                            <i className="bi bi-arrow-left fs-5"></i>
                        </Button>
                    )}
                    <Modal.Title as="h5" className="fw-bold" style={{ letterSpacing: '0.5px' }}>
                        {getTitle()}
                    </Modal.Title>
                </div>
            </Modal.Header>

            {/* BODY */}
            <Modal.Body>
                {/* 🛒 VISTA 1: CARRITO ... (IGUAL) ... */}
                {etapa === "carrito" && (
                    // ... (Tu código de tabla de carrito existente) ...
                    <>
                        {carrito.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                <i className="bi bi-cart-x display-1 mb-3" style={{ color: '#d7c2a6' }}></i>
                                <p className="fs-5">Tu carrito está vacío.</p>
                            </div>
                        ) : (
                            <Table responsive hover className="align-middle mb-0">
                                {/* ... (mismo contenido de tabla) ... */}
                                <thead className="table-light small text-uppercase text-muted">
                                <tr>
                                    <th>Producto</th>
                                    <th className="text-center">Cant.</th>
                                    <th className="text-end">Precio</th>
                                    <th className="text-end">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {carrito.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <Image
                                                    src={item.img?.startsWith("http") ? item.img : `http://localhost:8002${item.img}`}
                                                    rounded
                                                    style={{width: 50, height: 50, objectFit: "cover", border: '1px solid #eee'}}
                                                    onError={(e)=>e.target.src=placeholder}
                                                />
                                                <div>
                                                    <div className="fw-bold text-dark">{item.nombre}</div>
                                                    <small className="text-muted" style={{fontSize: '0.8rem'}}>Ref: {item.idInterno}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center"><span className="badge bg-light text-dark border">{item.cantidad}</span></td>
                                        <td className="text-end text-muted small">${item.precio.toLocaleString("es-CL")}</td>
                                        <td className="text-end fw-bold" style={{color: 'var(--color-principal)'}}>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        )}
                    </>
                )}

                {/* 🔐 VISTA 2: LOGIN ... (IGUAL) ... */}
                {etapa === "login" && (
                    <div className="mx-auto p-3" style={{maxWidth: 400}}>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control type="email" value={credenciales.correo} onChange={e=>setCredenciales({...credenciales, correo:e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" value={credenciales.password} onChange={e=>setCredenciales({...credenciales, password:e.target.value})} />
                            </Form.Group>
                            <Button className="w-100 btn-brand" onClick={handleLogin} disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : "Iniciar Sesión"}
                            </Button>
                        </Form>
                    </div>
                )}

                {/* 📦 VISTA 3: CONFIRMACIÓN (MODIFICADA) */}
                {etapa === "confirmar" && (
                    <Form>
                        <Alert variant="warning" className="d-flex align-items-center gap-3 py-3 border-0 shadow-sm" style={{backgroundColor: '#fff3cd', color: '#856404'}}>
                            <div className="bg-warning bg-opacity-25 p-2 rounded-circle">
                                <i className="bi bi-person-fill fs-4 text-warning"></i>
                            </div>
                            <div>
                                <small className="d-block text-uppercase fw-bold" style={{fontSize: '0.7rem', opacity: 0.8}}>Cliente</small>
                                <div className="fw-bold">{usuario?.nombre}</div>
                                <small>{usuario?.correo}</small>
                            </div>
                        </Alert>

                        <h6 className="mb-3 pb-2 border-bottom text-primary fw-bold">📍 Dirección de Envío</h6>
                        <Row className="g-3">

                            {/* COMBO REGIÓN */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small text-muted">Región</Form.Label>
                                    <Form.Select
                                        value={regionIdSeleccionada}
                                        onChange={handleRegionChange}
                                    >
                                        <option value="">Selecciona una región...</option>
                                        {regiones.map(r => (
                                            <option key={r.id} value={r.id}>{r.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            {/* COMBO COMUNA */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small text-muted">Comuna</Form.Label>
                                    <Form.Select
                                        value={envio.comuna} // Aquí guardamos el nombre directamente si tu BD usa strings
                                        onChange={handleComunaChange}
                                        disabled={!regionIdSeleccionada || comunas.length === 0}
                                    >
                                        <option value="">Selecciona una comuna...</option>
                                        {comunas.map(c => (
                                            <option key={c.id} value={c.nombre}>{c.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small text-muted">Dirección (Calle y Número)</Form.Label>
                                    <Form.Control value={envio.direccion} onChange={e=>setField("direccion", e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small text-muted">Teléfono</Form.Label>
                                    <Form.Control placeholder="+56 9..." value={envio.telefono} onChange={e=>setField("telefono", e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                )}

                {/* 🎉 VISTA 4: ÉXITO ... (IGUAL) ... */}
                {etapa === "exito" && (
                    <div className="text-center py-5">
                        <div className="mb-3">
                            <i className="bi bi-check-circle-fill" style={{fontSize: '5rem', color: 'var(--color-secundario)'}}></i>
                        </div>
                        <h3 className="fw-bold text-dark">¡Compra Exitosa!</h3>
                        <p className="text-muted w-75 mx-auto">
                            Gracias por confiar en nosotros. Hemos registrado tu pedido y te contactaremos a la brevedad.
                        </p>
                    </div>
                )}
            </Modal.Body>

            {/* FOOTER ... (IGUAL) ... */}
            <Modal.Footer className={etapa === "carrito" ? "justify-content-between bg-light" : "justify-content-end bg-light"}>
                {/* ... Botones ... */}
                {etapa === "carrito" && (
                    <>
                        <div>
                            <small className="text-muted d-block">Total con IVA:</small>
                            <span className="fs-4 fw-bold" style={{color: 'var(--color-principal)'}}>${total.toLocaleString("es-CL")}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-secondary" onClick={vaciarCarrito} disabled={carrito.length === 0}>
                                <i className="bi bi-trash"></i>
                            </Button>
                            <Button className="btn-brand border-0" onClick={handleCompra} disabled={carrito.length === 0}>
                                {loading ? "Procesando..." : "Continuar"}
                            </Button>
                        </div>
                    </>
                )}
                {etapa === "confirmar" && (
                    <Button className="btn-brand border-0 w-100 py-2" onClick={handleConfirmarCompra} disabled={loading}>
                        {loading ? <><Spinner animation="border" size="sm" className="me-2"/> Procesando...</> : `Confirmar y Pagar $${total.toLocaleString("es-CL")}`}
                    </Button>
                )}
                {etapa === "exito" && <Button variant="secondary" onClick={onHide}>Cerrar</Button>}
            </Modal.Footer>
        </Modal>
    );
}