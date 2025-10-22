import { useEffect, useState } from "react";
import axios from "axios";
import { UserForm } from "./UserForm";
import "../assets/styles/vistaAdmin.css";

export function UserTable() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [modoFormulario, setModoFormulario] = useState(false);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:8004/api/usuarios", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const filtrarUsuarios = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`http://localhost:8004/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("✅ Usuario eliminado correctamente.");
      cargarUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  const alternarEstado = async (u) => {
    const nuevoEstado = u.estado === "Activo" ? "Inactivo" : "Activo";
    if (!window.confirm(`¿Deseas cambiar estado a ${nuevoEstado}?`)) return;

    try {
      await axios.put(`http://localhost:8004/api/usuarios/${u.id}`, {
        ...u,
        estado: nuevoEstado,
      });
      alert(`Estado cambiado a ${nuevoEstado}.`);
      cargarUsuarios();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  return (
    <div className="user-table mt-5">
      <h4 className="titulo-seccion text-center mb-3">Gestión de Usuarios</h4>

      {modoFormulario ? (
        <UserForm
          usuarioEdit={usuarioEdit}
          onSave={() => {
            setModoFormulario(false);
            setUsuarioEdit(null);
            cargarUsuarios();
          }}
        />
      ) : (
        <>
          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              placeholder="Buscar usuario..."
              className="form-control w-50"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <button
              className="btn btn-success"
              onClick={() => setModoFormulario(true)}
            >
              <i className="bi bi-person-plus me-2"></i>Nuevo Usuario
            </button>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrarUsuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>{u.rol}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.estado === "Activo" ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {u.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          setUsuarioEdit(u);
                          setModoFormulario(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => eliminarUsuario(u.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => alternarEstado(u)}
                      >
                        <i className="bi bi-arrow-repeat"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtrarUsuarios.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No se encontraron usuarios.
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
