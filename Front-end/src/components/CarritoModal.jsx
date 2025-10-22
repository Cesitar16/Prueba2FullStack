import { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import axios from "axios";
import "../assets/styles/estilos.css";

export function CarritoModal() {
  const { carrito, vaciarCarrito } = useContext(CarritoContext);
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState({
    nombre: "",
    direccion: "",
    region: "",
    comuna: "",
    telefono: "",
    email: "",
  });

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const handleCompra = async () => {
    if (carrito.length === 0) return alert("No hay productos en el carrito.");
    if (!cliente.nombre || !cliente.direccion || !cliente.email)
      return alert("Por favor completa tus datos para continuar.");

    try {
      setLoading(true);
      const pedido = {
        cliente,
        items: carrito,
        fecha: new Date().toISOString(),
      };

      const res = await axios.post("http://localhost:8005/api/pedidos", pedido);
      if (res.status === 200 || res.status === 201) {
        alert("✅ Compra registrada con éxito.");
        vaciarCarrito();
        setCliente({
          nombre: "",
          direccion: "",
          region: "",
          comuna: "",
          telefono: "",
          email: "",
        });
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("carritoModal")
        );
        modal?.hide();
      }
    } catch (err) {
      console.error("Error al confirmar compra:", err);
      alert("Ocurrió un error al registrar la compra.");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title" id="carritoModalLabel">
              🛒 Carrito de Compras
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body">
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
                            src={item.img}
                            alt={item.nombre}
                            width="60"
                            className="rounded"
                          />
                        </td>
                        <td>{item.nombre}</td>
                        <td>{item.cantidad}</td>
                        <td>${item.precio.toLocaleString("es-CL")}</td>
                        <td>
                          ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h5 className="text-end mt-3">
                  Total:{" "}
                  <span className="text-success fw-bold">
                    ${total.toLocaleString("es-CL")}
                  </span>
                </h5>

                <hr />
                <h5 className="mb-3">Datos del Cliente</h5>
                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre completo"
                      value={cliente.nombre}
                      onChange={(e) =>
                        setCliente({ ...cliente, nombre: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Correo electrónico"
                      value={cliente.email}
                      onChange={(e) =>
                        setCliente({ ...cliente, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Teléfono"
                      value={cliente.telefono}
                      onChange={(e) =>
                        setCliente({ ...cliente, telefono: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Dirección"
                      value={cliente.direccion}
                      onChange={(e) =>
                        setCliente({ ...cliente, direccion: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Región"
                      value={cliente.region}
                      onChange={(e) =>
                        setCliente({ ...cliente, region: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Comuna"
                      value={cliente.comuna}
                      onChange={(e) =>
                        setCliente({ ...cliente, comuna: e.target.value })
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>

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
        </div>
      </div>
    </div>
  );
}
