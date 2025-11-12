import { useState } from "react";
import { UserTable } from "../components/admin/usuarios/UserTable";
import { UserForm } from "../components/admin/usuarios/UserForm";
import "../assets/styles/vistaAdmin.css";

/**
 * Usuarios.jsx
 * Vista principal del módulo de gestión de usuarios (solo administradores)
 */
export function Usuarios() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);

  return (
    <div className="container py-5">
      <h2 className="titulo-seccion text-center mb-4">
        Gestión de Usuarios
      </h2>

      {!mostrarFormulario ? (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-success"
              onClick={() => setMostrarFormulario(true)}
            >
              <i className="bi bi-person-plus me-2"></i>Nuevo Usuario
            </button>
          </div>

          <UserTable
            onEdit={(user) => {
              setUsuarioEdit(user);
              setMostrarFormulario(true);
            }}
          />
        </>
      ) : (
        <UserForm
          usuarioEdit={usuarioEdit}
          onSave={() => {
            setUsuarioEdit(null);
            setMostrarFormulario(false);
          }}
        />
      )}
    </div>
  );
}
