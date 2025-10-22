import { useEffect, useState } from "react";
import axios from "axios";
import { ProductForm } from "./ProductForm";
import { AlertBadge } from "./AlertBadge";
import "../assets/styles/vistaAdmin.css";

export function ProductTable() {
  const [urnas, setUrnas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [productoEdit, setProductoEdit] = useState(null);
  const [modoFormulario, setModoFormulario] = useState(false);

  const cargarUrnas = async () => {
    try {
      const res = await axios.get("http://localhost:8002/api/urnas");
      setUrnas(res.data);
    } catch (err) {
      console.error("Error al cargar urnas:", err);
    }
  };

  useEffect(() => {
    cargarUrnas();
  }, []);

  const filtrarUrnas = urnas.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.nombreMaterial?.toLowerCase().includes(filtro.toLowerCase())
  );

  const eliminarUrna = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta urna?")) return;
    try {
      await axios.delete(`http://localhost:8002/api/urnas/${id}`);
      alert("✅ Urna eliminada correctamente.");
      cargarUrnas();
    } catch (err) {
      console.error("Error al eliminar urna:", err);
    }
  };

  return (
    <div className="product-table mt-5">
      <h4 className="titulo-seccion text-center mb-3">Gestión de Urnas</h4>

      {modoFormulario ? (
        <ProductForm
          productoEdit={productoEdit}
          onSave={() => {
            setModoFormulario(false);
            setProductoEdit(null);
            cargarUrnas();
          }}
        />
      ) : (
        <>
          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              placeholder="Buscar por nombre o material..."
              className="form-control w-50"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <button
              className="btn btn-success"
              onClick={() => setModoFormulario(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>Nueva Urna
            </button>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Material</th>
                  <th>Color</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrarUrnas.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.nombreMaterial}</td>
                    <td>{u.nombreColor}</td>
                    <td>${u.precio?.toLocaleString("es-CL")}</td>
                    <td>
                      <AlertBadge stock={u.stock} />
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.disponible === "s"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {u.disponible === "s" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          setProductoEdit(u);
                          setModoFormulario(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarUrna(u.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtrarUrnas.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No se encontraron urnas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
