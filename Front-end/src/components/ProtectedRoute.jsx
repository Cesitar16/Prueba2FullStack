import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * ProtectedRoute.jsx
 * Protege rutas para usuarios autenticados con rol específico
 */
export default function ProtectedRoute({ children, roleRequired = "Administrador" }) {
  const { user } = useContext(AuthContext);

  // Si no hay usuario autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no coincide
  if (roleRequired && user.rol !== roleRequired) {
    alert("⚠️ No tienes permiso para acceder a esta sección.");
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderiza el componente protegido
  return children;
}
