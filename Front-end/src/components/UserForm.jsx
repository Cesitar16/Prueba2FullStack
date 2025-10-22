import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/vistaAdmin.css";

export function UserForm({ usuarioEdit, onSave }) {
  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "Cliente",
    estado: "Activo",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuarioEdit) setUsuario(usuarioEdit);
  }, [usuarioEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario.nombre || !usuario.correo) {
      return alert("Por favor completa los campos obligatorios.");
    }

    try {
      setLoading(true);
      if (usuario.id) {
        await axios.put(
          `http://localhost:8004/api/usuarios/${usuario.id}`,
          usuario
        );
      } else {
        await axios.post("http://localhost:8004/api/auth/register", usuario);
      }

      alert("✅ Usuario guardado correctamente.");
      setUsuario({
        nombre: "",
        correo: "",
        password: "",
        rol: "Cliente",
        estado: "Activo",
      });
      onSave?.();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("Error al guardar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="p-4 rounded shadow-sm bg-light"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <h5 className="mb-3 fw-bold text-dark">
        {usuario.id ? "Editar Usuario" : "Registrar Nuevo Usuario"}
      </h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre del usuario"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Correo *</label>
          <input
            type="email"
            name="correo"
            value={usuario.correo}
            onChange={handleChange}
            className="form-control"
            placeholder="Correo electrónico"
            required
          />
        </div>

        {!usuario.id && (
          <div className="col-md-6">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              name="password"
              value={usuario.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
        )}

        <div className="col-md-3">
          <label className="form-label">Rol</label>
          <select
            name="rol"
            value={usuario.rol}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Administrador">Administrador</option>
            <option value="Cliente">Cliente</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Estado</label>
          <select
            name="estado"
            value={usuario.estado}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="col-12 text-end mt-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Usuario"}
          </button>
        </div>
      </div>
    </form>
  );
}
