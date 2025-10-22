import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roleRequired = null }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ padding: 24 }}>Cargando sesión…</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roleRequired && user.rol !== roleRequired) {
        alert("⚠️ No tienes permiso para acceder a esta sección.");
        return <Navigate to="/" replace />;
    }

    return children;
}