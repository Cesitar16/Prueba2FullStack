import { useState, useEffect } from "react";
import { catalogoApi } from "../../services/api";
import AdminModalImagenes from "../../components/admin/AdminModalImagenes.jsx";
import "../../assets/styles/admin.css";

export default function UrnasAdmin() {
  const [urnas, setUrnas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUrna, setEditingUrna] = useState(null);

  // ====== PAGINACIÓN ======
  const [paginaActual, setPaginaActual] = useState(1);
  const urnasPorPagina = 13;

  const indiceUltimaUrna = paginaActual * urnasPorPagina;
  const indicePrimeraUrna = indiceUltimaUrna - urnasPorPagina;
  const urnasPaginaActual = urnas.slice(indicePrimeraUrna, indiceUltimaUrna);
  const totalPaginas = Math.ceil(urnas.length / urnasPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  // ====== CARGA INICIAL ======
  const [materiales, setMateriales] = useState([]);
  const [colores, setColores] = useState([]);
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    fetchUrnas();
    cargarOpciones();
  }, []);

  // 🔹 Cargar urnas desde la API
  const fetchUrnas = async () => {
    try {
      const res = await catalogoApi.getUrnas();
      setUrnas(res.data || []);
    } catch (err) {
      console.error("Error al cargar urnas:", err);
    }
  };

  // 🔹 Cargar materiales, colores y modelos
  const cargarOpciones = async () => {
    try {
      const [mat, col, mod] = await Promise.all([
        catalogoApi.getMateriales(),
        catalogoApi.getColores(),
        catalogoApi.getModelos(),
      ]);
      setMateriales(mat.data);
      setColores(col.data);
      setModelos(mod.data);
    } catch (err) {
      console.error("Error al cargar opciones:", err);
    }
  };

  // 🔹 Editar urna existente
  const handleEdit = (urna) => {
    setEditingUrna(urna);
    setModalOpen(true);
  };

  // 🔹 Actualizar urna (sin imágenes aún)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await catalogoApi.updateUrna(editingUrna.id, editingUrna);
      await fetchUrnas();
      closeModal();
      alert("✅ Urna actualizada correctamente.");
    } catch (err) {
      console.error("Error al actualizar urna:", err);
      alert("❌ Ocurrió un error al actualizar la urna.");
    }
  };

  // 🔹 Eliminar urna
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta urna?")) return;
    try {
      await catalogoApi.deleteUrna(id);
      await fetchUrnas();
      alert("🗑️ Urna eliminada correctamente.");
    } catch (err) {
      console.error("Error al eliminar urna:", err);
      alert("❌ No se puede eliminar esta urna.");
    }
  };

  // 🔹 Abrir modal de creación
  const openCreateModal = () => {
    setEditingUrna(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUrna(null);
  };

  // 🔹 Cuando el modal termina con éxito (crear urna + inventario)
  const handleModalSuccess = () => {
    fetchUrnas();
    setModalOpen(false);
  };

    return (
    <div className="dashboard-container urnas-admin-container">
        <div className="container mt-4">
        {/* === Encabezado === */}
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Gestión de Urnas</h2>
            <button className="btn btn-primary" onClick={openCreateModal}>
            Nueva Urna
            </button>
        </div>

        {/* === Tabla de Urnas === */}
        <div className="tabla-container">
            <table className="table table-bordered table-striped align-middle">
            <thead>
                <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Disponible</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {urnasPaginaActual.length > 0 ? (
                urnasPaginaActual.map((u) => (
                    <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre || "-"}</td>
                    <td>${Number(u.precio || 0).toLocaleString("es-CL")}</td>
                    <td>{String(u.disponible).toLowerCase() === "s" ? "Sí" : "No"}</td>
                    <td>
                        <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(u)}
                        >
                        Editar
                        </button>
                        <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u.id)}
                        >
                        Eliminar
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                    No hay urnas registradas.
                    </td>
                </tr>
                )}
            </tbody>
            </table>

            {/* ===== PAGINACIÓN ===== */}
            {urnas.length > 0 && (
            <div className="paginacion text-center mt-4">
                <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                >
                ← Anterior
                </button>

                {[...Array(totalPaginas)].map((_, index) => (
                <button
                    key={index}
                    className={`btn mx-1 ${
                    paginaActual === index + 1
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => cambiarPagina(index + 1)}
                >
                    {index + 1}
                </button>
                ))}

                <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                >
                Siguiente →
                </button>
            </div>
            )}
        </div>

        {/* === Modal de Crear/Editar Urna === */}
        <AdminModalImagenes
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSuccess={fetchUrnas} // 🔁 Refresca la tabla tras crear o editar
            editingUrna={editingUrna}
        />
        </div>
    </div>
    );
}