import {useContext, useEffect, useRef, useState} from "react";
import { CarritoContext } from "../../context/CarritoContext";
import { AuthContext } from "../../context/AuthContext";
import placeholder from "../../assets/img/placeholder.png";
import {
    usuariosApi,
    pedidosApi,
    inventarioApi,
} from "../../services/api";
import "../../assets/styles/estilos.css";

const ESTADO_PENDIENTE_ID = 1; // Ajusta si tu backend usa otro id

export function CarritoModal() {
    const { carrito, vaciarCarrito } = useContext(CarritoContext);
    const { usuario, isAuthenticated, login } = useContext(AuthContext);
    const prefilledRef = useRef(false);

    const [etapa, setEtapa] = useState("carrito"); // "carrito" | "login" | "confirmar" | "exito"
    const [loading, setLoading] = useState(false);

    // Login inline
    const [credenciales, setCredenciales] = useState({ correo: "", password: "" });

    // Envío
    const [direccionId, setDireccionId] = useState(null);
    const [envio, setEnvio] = useState({
        region: "",
        comuna: "",
        direccion: "",
        telefono: "",
        pais: "Chile",
    });

    const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const handleImgError = (e) => { e.target.src = placeholder; };

    const setField = (k, v) => {
        setEnvio((s) => {
            const next = { ...s, [k]: v };
            // Fallback persistente si no hay sesión (o por si falla el GET direcciones):
            localStorage.setItem("shippingDraft", JSON.stringify(next));
            return next;
        });
    };

    // Al pasar a "confirmar", prefill de datos de envío
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
                        return;
                    }
                }
            } catch (e) {
                console.warn("Prefill direcciones falló, uso localStorage como respaldo:", e);
            }

            // Fallback localStorage
            try {
                const draft = JSON.parse(localStorage.getItem("shippingDraft") || "{}");
                setEnvio((s) => ({
                    region: draft.region || s.region,
                    comuna: draft.comuna || s.comuna,
                    direccion: draft.direccion || s.direccion,
                    telefono: draft.telefono || s.telefono,
                    pais: draft.pais || s.pais || "Chile",
                }));
            } catch {}
        })();
    }, [etapa, isAuthenticated, usuario?.id]);

// resetear bandera si sales de confirmar
    useEffect(() => { if (etapa !== "confirmar") prefilledRef.current = false; }, [etapa]);

    const validarTelefono = (t) => {
        // +56 9 XXXX XXXX (tolerando espacios)
        const re = /^\+56\s?9\s?\d{4}\s?\d{4}$/;
        return re.test(t.trim());
    };

    const validarEnvio = () => {
        if (!envio.region.trim()) return "Debes ingresar la región";
        if (!envio.comuna.trim()) return "Debes ingresar la comuna";
        if (!envio.direccion.trim()) return "Debes ingresar la dirección";
        if (!envio.telefono.trim()) return "Debes ingresar el teléfono";
        if (!validarTelefono(envio.telefono)) return "Formato de teléfono inválido. Usa: +56 9 XXXX XXXX";
        return null;
    };

    // Paso 1: ir a comprar
    const handleCompra = async () => {
        if (carrito.length === 0) return alert("No hay productos en el carrito.");
        try {
            setLoading(true);
            if (!isAuthenticated) {
                setEtapa("login");
                return;
            }
            setEtapa("confirmar");
        } finally {
            setLoading(false);
        }
    };

    // Paso login
    const handleLogin = async () => {
        if (!credenciales.correo || !credenciales.password)
            return alert("Debes ingresar tus credenciales.");
        try {
            setLoading(true);
            await login(credenciales.correo, credenciales.password);
            setEtapa("confirmar");
        } catch (err) {
            alert("Credenciales incorrectas o error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    // Confirmar compra (crea/actualiza dirección, crea pedido, descuenta stock, emite evento)
    const handleConfirmarCompra = async () => {
        const err = validarEnvio();
        if (err) return alert(err);
        if (!usuario?.id) return alert("No se encontró el usuario. Inicia sesión nuevamente.");

        try {
            setLoading(true);

            // 1) Guardar/actualizar dirección (DTO)
            let dirId = direccionId;
            const dto = {
                id: dirId ?? undefined,
                usuarioId: usuario.id,
                calle: envio.direccion,
                comuna: envio.comuna,
                region: envio.region,
                pais: envio.pais || "Chile",
                telefono: envio.telefono,
            };

            try {
                if (dirId) {
                    await usuariosApi.updateDireccion(dirId, dto);
                } else {
                    const r = await usuariosApi.createDireccion(dto);
                    dirId = r?.data?.id ?? null;
                    setDireccionId(dirId);
                }
            } catch (e) {
                console.warn("No se pudo guardar la dirección, continuo con direccionId null:", e);
                dirId = dirId ?? null; // no bloquear compra
            }

            // 2) Crear pedido (UNA sola request)
            const payload = {
                usuarioId: usuario.id,
                direccionId: dirId,
                estadoPedidoId: 1,
                total: Math.round(total),
                detalles: carrito.map(it => ({
                    urnaId: it.id,
                    cantidad: it.cantidad,
                    precioUnitario: it.precio,
                })),
            };

            const resp = await pedidosApi.createPedido(payload);

            // 3) (Opcional) Descontar stock — no bloquee la UX si falla
            try {
                await Promise.all(
                    carrito.map(it =>
                        inventarioApi.disminuirStock(it.id, it.cantidad, "Venta", usuario?.nombre || "Cliente")
                    )
                );
            } catch (e) {
                console.warn("No se pudo disminuir stock de algún item:", e);
            }

            // 4) Notificar a Admin y UX
            window.dispatchEvent(new CustomEvent("pedido:nuevo", { detail: resp.data }));
            setEtapa("exito");
            vaciarCarrito();
        } catch (e) {
            console.error(e);
            alert("Error al procesar el pedido. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const StepContainer = ({ children }) => (
        <div className="modal-step animate__animated animate__fadeInRight">{children}</div>
    );

    return (
        <div
            className="modal fade"
            id="carritoModal"
            tabIndex="-1"
            aria-labelledby="carritoModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header bg-dark text-white d-flex align-items-center">
                        {etapa !== "carrito" && (
                            <button
                                className="btn btn-outline-light btn-sm me-2"
                                onClick={() =>
                                    setEtapa(
                                        etapa === "login"
                                            ? "carrito"
                                            : etapa === "confirmar"
                                                ? (isAuthenticated ? "carrito" : "login")
                                                : "carrito"
                                    )
                                }
                            >
                                ←
                            </button>
                        )}
                        <h5 className="modal-title" id="carritoModalLabel">
                            {etapa === "carrito" && "🛒 Carrito de Compras"}
                            {etapa === "login" && "🔐 Inicia sesión para continuar"}
                            {etapa === "confirmar" && "✅ Confirmar datos de envío"}
                            {etapa === "exito" && "🎉 Compra Exitosa"}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {/* ETAPA: CARRITO */}
                        {etapa === "carrito" && (
                            <StepContainer>
                                {carrito.length === 0 ? (
                                    <div className="text-center text-muted py-5">
                                        <i className="bi bi-cart3 display-3 mb-3"></i>
                                        <p>No hay productos en tu carrito.</p>
                                    </div>
                                ) : (
                                    <>
                                        <table className="table align-middle">
                                            <thead>
                                            <tr>
                                                <th>Imagen</th>
                                                <th>Producto</th>
                                                <th>Código Interno</th>
                                                <th>Cantidad</th>
                                                <th>Precio</th>
                                                <th>Subtotal</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {carrito.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <img
                                                            src={
                                                                item.img
                                                                    ? item.img.startsWith("http")
                                                                        ? item.img
                                                                        : `http://localhost:8002${item.img}`
                                                                    : placeholder
                                                            }
                                                            alt={item.nombre}
                                                            width="60"
                                                            className="rounded shadow-sm"
                                                            onError={handleImgError}
                                                        />
                                                    </td>
                                                    <td>{item.nombre}</td>
                                                    <td className="text-muted small">{item.idInterno || "—"}</td>
                                                    <td>{item.cantidad}</td>
                                                    <td>${item.precio.toLocaleString("es-CL")}</td>
                                                    <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>

                                        <div className="text-end mt-4">
                                            <h6 className="text-muted">
                                                Subtotal (sin IVA): ${subtotal.toLocaleString("es-CL")}
                                            </h6>
                                            <h5 className="fw-bold">
                                                Total (con IVA 19%): ${total.toLocaleString("es-CL")}
                                            </h5>
                                        </div>
                                    </>
                                )}
                            </StepContainer>
                        )}

                        {/* ETAPA: LOGIN */}
                        {etapa === "login" && (
                            <StepContainer>
                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={credenciales.correo}
                                        onChange={(e) => setCredenciales({ ...credenciales, correo: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={credenciales.password}
                                        onChange={(e) => setCredenciales({ ...credenciales, password: e.target.value })}
                                    />
                                </div>
                                <button className="btn btn-primary w-100" onClick={handleLogin} disabled={loading}>
                                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                                </button>
                            </StepContainer>
                        )}

                        {/* ETAPA: CONFIRMAR */}
                        {etapa === "confirmar" && (
                            <StepContainer>
                                <div className="alert alert-light">
                                    <div><strong>Nombre:</strong> {usuario?.nombre || "—"}</div>
                                    <div><strong>Correo:</strong> {usuario?.correo || "—"}</div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Región</label>
                                        <input className="form-control" value={envio.region} onChange={(e) => setField("region", e.target.value)} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Comuna</label>
                                        <input className="form-control" value={envio.comuna} onChange={(e) => setField("comuna", e.target.value)} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Dirección</label>
                                        <input className="form-control" value={envio.direccion} onChange={(e) => setField("direccion", e.target.value)} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Teléfono</label>
                                        <input className="form-control" placeholder="+56 9 1234 5678"
                                               value={envio.telefono} onChange={(e) => setField("telefono", e.target.value)} />
                                    </div>
                                </div>

                                <button className="btn btn-success w-100 mt-3" onClick={handleConfirmarCompra} disabled={loading}>
                                    {loading ? "Procesando compra..." : "Confirmar y proceder con el pago"}
                                </button>
                            </StepContainer>
                        )}

                        {/* ETAPA: ÉXITO */}
                        {etapa === "exito" && (
                            <StepContainer>
                                <div className="text-center py-4">
                                    <i className="bi bi-check-circle-fill text-success display-4 mb-3"></i>
                                    <h5>Compra realizada con éxito</h5>
                                    <p className="text-muted">
                                        Gracias por confiar en <b>Descansos del Recuerdo SPA</b>.
                                    </p>
                                    <button className="btn btn-primary mt-3" data-bs-dismiss="modal" onClick={() => setEtapa("carrito")}>
                                        Cerrar
                                    </button>
                                </div>
                            </StepContainer>
                        )}
                    </div>

                    {/* Footer (solo en carrito) */}
                    {etapa === "carrito" && (
                        <div className="modal-footer d-flex justify-content-between">
                            <button className="btn btn-outline-danger" onClick={vaciarCarrito} disabled={carrito.length === 0}>
                                <i className="bi bi-trash me-2"></i> Vaciar Carrito
                            </button>
                            <button className="btn btn-primary" onClick={handleCompra} disabled={loading || carrito.length === 0}>
                                {loading ? (<><i className="fas fa-spinner fa-spin me-2"></i> Procesando...</>) : (<><i className="bi bi-bag-check me-2"></i> Confirmar Compra</>)}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
