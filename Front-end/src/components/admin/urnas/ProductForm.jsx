import { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/styles/vistaAdmin.css";

export function ProductForm({ productoEdit, onSave }) {
  const [producto, setProducto] = useState({
    idInterno: "",
    nombre: "",
    descripcionCorta: "",
    descripcionDetallada: "",
    precio: "",
    stock: "",
    idMaterial: "",
    idColor: "",
    idModelo: "",
    estado: "Activo",
  });

  const [imagen, setImagen] = useState(null);
  const [materiales, setMateriales] = useState([]);
  const [colores, setColores] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // cargar listas desde el backend (catálogo)
    const fetchData = async () => {
      const [mat, col, mod] = await Promise.all([
        axios.get("http://localhost:8002/api/materiales"),
        axios.get("http://localhost:8002/api/colores"),
        axios.get("http://localhost:8002/api/modelos"),
      ]);
      setMateriales(mat.data);
      setColores(col.data);
      setModelos(mod.data);
    };
    fetchData();

    if (productoEdit) setProducto(productoEdit);
  }, [productoEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!producto.nombre || !producto.precio || !producto.stock) {
      return alert("Por favor completa los campos requeridos.");
    }

    try {
      setLoading(true);
      let response;

      // 1️⃣ Crear o actualizar urna
      if (producto.id) {
        response = await axios.put(
          `http://localhost:8002/api/urnas/${producto.id}`,
          producto
        );
      } else {
        response = await axios.post("http://localhost:8002/api/urnas", producto);
      }

      const urnaId = response.data.id || producto.id;

      // 2️⃣ Si hay imagen, subirla
      if (imagen) {
        const formData = new FormData();
        formData.append("archivo", imagen);
        formData.append("principal", true);

        await axios.post(
          `http://localhost:8002/api/imagenes/${urnaId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      alert("✅ Producto guardado correctamente.");
      setProducto({
        idInterno: "",
        nombre: "",
        descripcionCorta: "",
        descripcionDetallada: "",
        precio: "",
        stock: "",
        idMaterial: "",
        idColor: "",
        idModelo: "",
        estado: "Activo",
      });
      setImagen(null);
      onSave?.();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Ocurrió un error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="p-4 rounded shadow-sm bg-light"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h5 className="mb-3 text-dark fw-bold">
        {producto.id ? "Editar Urna" : "Registrar Nueva Urna"}
      </h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre de la urna"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">ID Interno</label>
          <input
            type="text"
            name="idInterno"
            value={producto.idInterno}
            onChange={handleChange}
            className="form-control"
            placeholder="Código interno (opcional)"
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Descripción Corta</label>
          <input
            type="text"
            name="descripcionCorta"
            value={producto.descripcionCorta}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Descripción Detallada</label>
          <textarea
            name="descripcionDetallada"
            value={producto.descripcionDetallada}
            onChange={handleChange}
            className="form-control"
            rows="3"
          ></textarea>
        </div>

        <div className="col-md-4">
          <label className="form-label">Precio *</label>
          <input
            type="number"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Stock *</label>
          <input
            type="number"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Estado</label>
          <select
            name="estado"
            value={producto.estado}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Material</label>
          <select
            name="idMaterial"
            value={producto.idMaterial}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Seleccionar...</option>
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
            name="idColor"
            value={producto.idColor}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Seleccionar...</option>
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
            name="idModelo"
            value={producto.idModelo}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Seleccionar...</option>
            {modelos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-12">
          <label className="form-label">Imagen Principal</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            className="form-control"
          />
        </div>

        <div className="col-12 text-end mt-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </div>
    </form>
  );
}
