import { useEffect, useState } from "react";
import AdminModal from "../../components/admin/AdminModal";
import { catalogoApi } from "../../services/api";

export default function UrnasAdmin() {
    const [urnas, setUrnas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUrna, setEditingUrna] = useState(null);

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
        disponible: "s",
        estado: "Activo",
        imagenPrincipal: "",
        idInterno: "",
        material: null,
        color: null,
        modelo: null,
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

    // 🔹 Crear urna
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                disponible: formData.disponible === "s" ? "s" : "n",
                material: formData.material ? { id: formData.material } : null,
                color: formData.color ? { id: formData.color } : null,
                modelo: formData.modelo ? { id: formData.modelo } : null,
            };
            console.log("Payload enviado al crear urna:", payload);
            await catalogoApi.createUrna(payload);
            await cargarUrnas();
            closeModal();
        } catch (err) {
            console.error("Error al crear urna:", err);
            alert("Ocurrió un error al crear la urna.");
        }
    };

    // 🔹 Editar urna
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                disponible: formData.disponible === "s" ? "s" : "n",
                material: formData.material ? { id: formData.material } : null,
                color: formData.color ? { id: formData.color } : null,
                modelo: formData.modelo ? { id: formData.modelo } : null,
            };
            console.log("Payload enviado al backend:", payload);
            await catalogoApi.updateUrna(editingUrna.id, payload);
            await cargarUrnas();
            closeModal();
        } catch (err) {
            console.error("Error al actualizar urna:", err);
            alert("Ocurrió un error al actualizar la urna.");
        }
    };

    // 🔹 Eliminar urna
    const handleDelete = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar esta urna?")) return;
        try {
            await catalogoApi.deleteUrna(id);
            await cargarUrnas();
        } catch (err) {
            console.error("Error al eliminar urna:", err);
            alert("No se puede eliminar esta urna.");
        }
    };

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
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingUrna(null);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Gestión de Urnas</h2>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    Nueva Urna
                </button>
            </div>

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
                {urnas.map((u) => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.nombre}</td>
                        <td>${u.precio}</td>
                        <td>{u.disponible === "s" ? "Sí" : "No"}</td>
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
                ))}
                </tbody>
            </table>

            <AdminModal
                open={modalOpen}
                title={editingUrna ? "Editar Urna" : "Crear Urna"}
                onClose={closeModal}
                onSubmit={editingUrna ? handleUpdate : handleCreate}
                submitText={editingUrna ? "Actualizar" : "Crear"}
            >
                {/* Campos del formulario */}
                <div className="row g-2">
                    <div className="col-md-6">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">ID Interno</label>
                        <input
                            type="text"
                            name="idInterno"
                            value={formData.idInterno}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label">Descripción Corta</label>
                        <input
                            type="text"
                            name="descripcionCorta"
                            value={formData.descripcionCorta}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label">Descripción Detallada</label>
                        <textarea
                            name="descripcionDetallada"
                            value={formData.descripcionDetallada}
                            onChange={handleChange}
                            className="form-control"
                        ></textarea>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Alto (cm)</label>
                        <input
                            type="number"
                            name="alto"
                            value={formData.alto}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Ancho (cm)</label>
                        <input
                            type="number"
                            name="ancho"
                            value={formData.ancho}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Profundidad (cm)</label>
                        <input
                            type="number"
                            name="profundidad"
                            value={formData.profundidad}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Peso (kg)</label>
                        <input
                            type="number"
                            name="peso"
                            value={formData.peso}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Precio ($)</label>
                        <input
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Disponible</label>
                        <select
                            name="disponible"
                            value={formData.disponible}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="s">Sí</option>
                            <option value="n">No</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Estado</label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>

                    {/* Selects dinámicos */}
                    <div className="col-md-4">
                        <label className="form-label">Material</label>
                        <select
                            name="material"
                            value={formData.material || ""}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">Seleccionar</option>
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
                            value={formData.color || ""}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">Seleccionar</option>
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
                            value={formData.modelo || ""}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">Seleccionar</option>
                            {modelos.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </AdminModal>
        </div>
    );
}