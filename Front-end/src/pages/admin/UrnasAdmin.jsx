import { useEffect, useState } from "react";
import AdminModal from "../../components/admin/AdminModal";
import axios from "axios";
import { catalogoApi } from "../../services/api";

export default function UrnasAdmin() {
  const [urnas, setUrnas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUrna, setEditingUrna] = useState(null);
  const [imagenes, setImagenes] = useState([]); // 👈 nuevas imágenes seleccionadas

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


  // Campos del formulario
 const [formData, setFormData] = useState({
  nombre: "",
  descripcionCorta: "",
  descripcionDetallada: "",
  alto: "",
  ancho: "",
  profundidad: "",
  peso: "",
  precio: "",
  stock: "",  // ✅ nuevo
  disponible: "s",
  estado: "Activo",
  imagenPrincipal: "",
  idInterno: "",
  material: "",
  color: "",
  modelo: "",
});

  const [materiales, setMateriales] = useState([]);
  const [colores, setColores] = useState([]);
  const [modelos, setModelos] = useState([]);

  // 🧭 Cargar datos iniciales
  useEffect(() => {
    cargarUrnas();
    cargarOpciones();
  }, []);

  const cargarUrnas = async () => {
    const res = await catalogoApi.getUrnas();
    setUrnas(res.data);
  };

  const cargarOpciones = async () => {
    const [mat, col, mod] = await Promise.all([
      catalogoApi.getMateriales(),
      catalogoApi.getColores(),
      catalogoApi.getModelos(),
    ]);
    setMateriales(mat.data);
    setColores(col.data);
    setModelos(mod.data);
  };

  // 🔹 Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // 🔹 Construye el payload para el backend
  const buildPayload = () => {
    const selectedMaterial = materiales.find((m) => String(m.id) === String(formData.material));
    const selectedColor = colores.find((c) => String(c.id) === String(formData.color));
    const selectedModelo = modelos.find((mo) => String(mo.id) === String(formData.modelo));

    const toNum = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

    return {
      nombre: formData.nombre?.trim(),
      descripcionCorta: formData.descripcionCorta ?? "",
      descripcionDetallada: formData.descripcionDetallada ?? "",
      alto: toNum(formData.alto),
      ancho: toNum(formData.ancho),
      profundidad: toNum(formData.profundidad),
      peso: toNum(formData.peso),
      precio: toNum(formData.precio),
      stock: toNum(formData.stock),
      disponible: formData.disponible === "s" ? "s" : "n",
      estado: formData.estado || "Activo",
      imagenPrincipal: formData.imagenPrincipal ?? "",
      idInterno: formData.idInterno ?? "",
      materialId: selectedMaterial ? selectedMaterial.id : null,
      colorId: selectedColor ? selectedColor.id : null,
      modeloId: selectedModelo ? selectedModelo.id : null,
    };
  };

    // 🔹 Crear urna con imágenes
    const handleCreate = async (e) => {
  e.preventDefault();

  // 🔹 Validaciones mínimas de campos
  const requiredFields = [
    "nombre", "descripcionCorta", "descripcionDetallada",
    "alto", "ancho", "profundidad", "peso", "precio",
    "material", "color", "modelo", "stock"
  ];

  const empty = requiredFields.filter((f) => !formData[f]);
  if (empty.length > 0) {
    alert("⚠️ Debes completar todos los campos obligatorios.");
    return;
  }

  // 🔹 Validar que haya imágenes
  if (imagenes.length === 0) {
    alert("⚠️ Debes subir al menos una imagen.");
    return;
  }

    // 🔹 Validar que haya una imagen marcada como principal
    const tienePrincipal = imagenes.some((img) => img.principal === true);
        if (!tienePrincipal) {
            alert("⚠️ Debes seleccionar una imagen principal haciendo clic sobre una de las imágenes.");
            return;
        }

        try {
            const payload = buildPayload();
            const res = await catalogoApi.createUrna(payload);
            const urnaCreada = res.data;

            // 🔹 Subir imágenes (respetando cuál es principal)
            const uploadPromises = imagenes.map((imgObj) => {
            const formDataImg = new FormData();
            formDataImg.append("archivo", imgObj.file);
            formDataImg.append("principal", imgObj.principal === true);
            return axios.post(`http://localhost:8002/api/imagenes/${urnaCreada.id}`, formDataImg, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            });

            await Promise.all(uploadPromises);

            alert("✅ Urna creada correctamente con imágenes.");
            await cargarUrnas();
            closeModal();
        } catch (err) {
            console.error("Error al crear urna:", err);
            alert("❌ Ocurrió un error al crear la urna.");
        }
    };



  // 🔹 Editar urna existente
  const handleEdit = (urna) => {
    setEditingUrna(urna);
    setFormData({
      ...urna,
      disponible:
        urna.disponible === "s" || urna.disponible === "S" || urna.disponible === true || urna.disponible === "Sí"
          ? "s"
          : "n",
      material: urna.material?.id || "",
      color: urna.color?.id || "",
      modelo: urna.modelo?.id || "",
    });
    setModalOpen(true);
  };

  // 🔹 Actualizar urna (sin imágenes aún)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = buildPayload();
      await catalogoApi.updateUrna(editingUrna.id, payload);
      await cargarUrnas();
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
      await cargarUrnas();
      alert("🗑️ Urna eliminada correctamente.");
    } catch (err) {
      console.error("Error al eliminar urna:", err);
      alert("❌ No se puede eliminar esta urna.");
    }
  };

  // 🔹 Abrir modal de creación
  const openCreateModal = () => {
    setEditingUrna(null);
    setFormData({
      nombre: "",
      descripcionCorta: "",
      descripcionDetallada: "",
      alto: "",
      ancho: "",
      profundidad: "",
      peso: "",
      precio: "",
      disponible: "s",
      estado: "Activo",
      imagenPrincipal: "",
      idInterno: "",
      material: "",
      color: "",
      modelo: "",
    });
    setImagenes([]); // limpia imágenes seleccionadas
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUrna(null);
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

      <div className="tabla-container">
      <table className="table table-bordered table-striped">
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
              <td colSpan="5" className="text-center">
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
      <AdminModal
        open={modalOpen}
        title={editingUrna ? "Editar Urna" : "Crear Urna"}
        onClose={closeModal}
        onSubmit={editingUrna ? handleUpdate : handleCreate}
        submitText={editingUrna ? "Actualizar" : "Crear"}
        onImagesChange={setImagenes}
      >
        {/* Aquí van los campos del formulario */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={formData.nombre || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Precio ($)</label>
            <input
              type="number"
              name="precio"
              className="form-control"
              value={formData.precio || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Descripción Corta</label>
            <input
              type="text"
              name="descripcionCorta"
              className="form-control"
              value={formData.descripcionCorta || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Descripción Detallada</label>
            <textarea
              name="descripcionDetallada"
              className="form-control"
              rows="3"
              value={formData.descripcionDetallada || ""}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="col-md-3">
            <label className="form-label">Alto (cm)</label>
            <input
              type="number"
              name="alto"
              className="form-control"
              value={formData.alto || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Ancho (cm)</label>
            <input
              type="number"
              name="ancho"
              className="form-control"
              value={formData.ancho || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Profundidad (cm)</label>
            <input
              type="number"
              name="profundidad"
              className="form-control"
              value={formData.profundidad || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Peso (kg)</label>
            <input
              type="number"
              name="peso"
              className="form-control"
              value={formData.peso || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Material</label>
            <select
              name="material"
              className="form-select"
              value={formData.material || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {materiales.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Color</label>
            <select
              name="color"
              className="form-select"
              value={formData.color || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {colores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Modelo</label>
            <select
              name="modelo"
              className="form-select"
              value={formData.modelo || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {modelos.map((mo) => (
                <option key={mo.id} value={mo.id}>
                  {mo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Stock</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={formData.stock || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </AdminModal>
    </div>
  </div>
);

}
