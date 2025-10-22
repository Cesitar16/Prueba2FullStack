import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CarritoContext } from "../context/CarritoContext";
import "../assets/styles/estilos.css";

export function Checkout() {
  const { carrito, total, confirmarCompra } = useContext(CarritoContext);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [regionSeleccionada, setRegionSeleccionada] = useState("");
  const [cliente, setCliente] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    region: "",
    comuna: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8001/api/regiones")
      .then((res) => setRegiones(res.data))
      .catch((err) => console.error("Error al cargar regiones:", err));
  }, []);

  useEffect(() => {
    if (regionSeleccionada) {
      axios
        .get(`http://localhost:8001/api/comunas/region/${regionSeleccionada}`)
        .then((res) => setComunas(res.data))
        .catch((err) => console.error("Error al cargar comunas:", err));
    }
  }, [regionSeleccionada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (carrito.length === 0)
      return alert("Tu carrito está vacío. Agrega productos antes de continuar.");

    if (!cliente.nombre || !cliente.correo || !cliente.direccion)
      return alert("Por favor completa todos los campos obligatorios.");

    confirmarCompra(cliente);
  };

  return (
    <div className="container py-5">
      <h2 className="titulo-seccion text-center mb-4">
        Confirmación de Compra
      </h2>

      {carrito.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-cart3 display-5"></i>
          <p>No hay productos en tu carrito.</p>
        </div>
      ) : (
        <div className="row">
          {/* 🧾 Resumen del pedido */}
          <div className="col-md-5 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Resumen de Compra</h5>
              </div>
              <div className="card-body">
                {carrito.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between mb-2"
                  >
                    <span>
                      {item.nombre} × {item.cantidad}
                    </span>
                    <strong>
                      ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                    </strong>
                  </div>
                ))}
                <hr />
                <h5 className="text-end text-success">
                  Total: ${total.toLocaleString("es-CL")}
                </h5>
              </div>
            </div>
          </div>

          {/* 📦 Formulario de datos del cliente */}
          <div className="col-md-7">
            <form
              className="p-4 rounded shadow-sm bg-light"
              onSubmit={handleSubmit}
            >
              <h5 className="mb-3 fw-bold">Datos de envío</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={cliente.nombre}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Correo *</label>
                  <input
                    type="email"
                    name="correo"
                    value={cliente.correo}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={cliente.telefono}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Dirección *</label>
                  <input
                    type="text"
                    name="direccion"
                    value={cliente.direccion}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Región</label>
                  <select
                    className="form-select"
                    value={regionSeleccionada}
                    onChange={(e) => {
                      setRegionSeleccionada(e.target.value);
                      setCliente({
                        ...cliente,
                        region: e.target.options[e.target.selectedIndex].text,
                      });
                    }}
                  >
                    <option value="">Selecciona una región</option>
                    {regiones.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Comuna</label>
                  <select
                    className="form-select"
                    value={cliente.comuna}
                    onChange={(e) =>
                      setCliente({ ...cliente, comuna: e.target.value })
                    }
                    disabled={!regionSeleccionada}
                  >
                    <option value="">Selecciona una comuna</option>
                    {comunas.map((c) => (
                      <option key={c.id} value={c.nombre}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-bag-check me-2"></i> Confirmar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
