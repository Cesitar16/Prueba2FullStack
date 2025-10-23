import { useContext, useEffect, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { AuthContext } from "../context/AuthContext";
import placeholder from "../assets/img/placeholder.png";
import axios from "axios";
import "../assets/styles/estilos.css";

export function CarritoModal() {
  const { carrito, vaciarCarrito } = useContext(CarritoContext);
  const { usuario, isAuthenticated, login } = useContext(AuthContext);

  const [etapa, setEtapa] = useState("carrito"); // "carrito" | "login" | "confirmar" | "exito"
  const [loading, setLoading] = useState(false);

  // Datos login temporal
  const [credenciales, setCredenciales] = useState({
    correo: "",
    password: "",
  });

  // Cálculo de totales
  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  // Simular compra exitosa
  const handleCompra = async () => {
    if (carrito.length === 0)
      return alert("No hay productos en el carrito.");

    try {
      setLoading(true);
      // Si no hay sesión → pasa a login
      if (!isAuthenticated) {
        setEtapa("login");
        return;
      }

      // Si hay sesión → pasa a confirmar
      setEtapa("confirmar");
    } finally {
      setLoading(false);
    }
  };

  // Confirmar datos (solo usuarios logueados)
  const handleConfirmarCompra = async () => {
    try {
      setLoading(true);
      // Aquí podrías llamar al endpoint de pedidos con el usuario autenticado
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulación
      setEtapa("exito");
      vaciarCarrito();
    } catch (err) {
      alert("Error al procesar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión desde el modal
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

  // Imagen fallback
  const handleImgError = (e) => {
    e.target.src = placeholder;
  };

  // Animaciones suaves de transición entre pasos
  const StepContainer = ({ children }) => (
    <div className="modal-step animate__animated animate__fadeInRight">
      {children}
    </div>
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
          {/* ENCABEZADO */}
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
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="modal-body">
            {/* ====================== ETAPA 1: CARRITO ====================== */}
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
                            <td className="text-muted small">
                              {item.idInterno || "—"}
                            </td>
                            <td>{item.cantidad}</td>
                            <td>
                              ${item.precio.toLocaleString("es-CL")}
                            </td>
                            <td>
                              $
                              {(item.precio * item.cantidad).toLocaleString(
                                "es-CL"
                              )}
                            </td>
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

            {/* ====================== ETAPA 2: LOGIN ====================== */}
            {etapa === "login" && (
              <StepContainer>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    value={credenciales.correo}
                    onChange={(e) =>
                      setCredenciales({
                        ...credenciales,
                        correo: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={credenciales.password}
                    onChange={(e) =>
                      setCredenciales({
                        ...credenciales,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  className="btn btn-primary w-100"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </StepContainer>
            )}

            {/* ====================== ETAPA 3: CONFIRMAR DATOS ====================== */}
            {etapa === "confirmar" && (
              <StepContainer>
                {usuario ? (
                  <div>
                    <p className="text-muted">
                      Revisa tus datos antes de continuar:
                    </p>
                    <ul className="list-group mb-3">
                      <li className="list-group-item">
                        <strong>Nombre:</strong> {usuario.nombre}
                      </li>
                      <li className="list-group-item">
                        <strong>Correo:</strong> {usuario.correo}
                      </li>
                      <li className="list-group-item">
                        <strong>Región:</strong>{" "}
                        {usuario.region || "No especificada"}
                      </li>
                      <li className="list-group-item">
                        <strong>Comuna:</strong>{" "}
                        {usuario.comuna || "No especificada"}
                      </li>
                      <li className="list-group-item">
                        <strong>Dirección:</strong>{" "}
                        {usuario.direccion || "No especificada"}
                      </li>
                      <li className="list-group-item">
                        <strong>Teléfono:</strong>{" "}
                        {usuario.telefono || "No especificado"}
                      </li>
                    </ul>

                    <button
                      className="btn btn-success w-100"
                      onClick={handleConfirmarCompra}
                      disabled={loading}
                    >
                      {loading
                        ? "Procesando compra..."
                        : "Confirmar y proceder con el pago"}
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-muted">
                    Cargando datos del usuario...
                  </p>
                )}
              </StepContainer>
            )}

            {/* ====================== ETAPA 4: ÉXITO ====================== */}
            {etapa === "exito" && (
              <StepContainer>
                <div className="text-center py-4">
                  <i className="bi bi-check-circle-fill text-success display-4 mb-3"></i>
                  <h5>Compra realizada con éxito</h5>
                  <p className="text-muted">
                    Gracias por confiar en <b>Descansos del Recuerdo SPA</b>.
                  </p>
                  <button
                    className="btn btn-primary mt-3"
                    data-bs-dismiss="modal"
                    onClick={() => setEtapa("carrito")}
                  >
                    Cerrar
                  </button>
                </div>
              </StepContainer>
            )}
          </div>

          {/* PIE DE MODAL (solo en carrito) */}
          {etapa === "carrito" && (
            <div className="modal-footer d-flex justify-content-between">
              <button
                className="btn btn-outline-danger"
                onClick={vaciarCarrito}
                disabled={carrito.length === 0}
              >
                <i className="bi bi-trash me-2"></i> Vaciar Carrito
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCompra}
                disabled={loading || carrito.length === 0}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i> Procesando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-bag-check me-2"></i> Confirmar Compra
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
