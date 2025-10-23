import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Protege rutas seguras con verificación de sesión y rol.
 * Muestra loader mientras AuthContext restaura sesión.
 */
export default function ProtectedRoute({ children, roleRequired = null }) {
    const { usuario, isAuthenticated, loading } = useContext(AuthContext);

    // 🔸 Mientras se está verificando la sesión, no navegar todavía
    if (loading) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    color: "#5a4634",
                    fontFamily: "Poppins, sans-serif",
                }}
            >
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-3 fw-medium">Verificando sesión...</p>
            </div>
        );
    }

    // 🔹 Sin sesión → ir al login
    if (!isAuthenticated) {
        console.warn("⛔ Usuario no autenticado");
        return <Navigate to="/login" replace />;
    }

    // 🔹 Rol insuficiente → redirigir a home
    if (roleRequired && usuario?.rol?.toLowerCase?.() !== roleRequired.toLowerCase()) {
        console.warn(`⚠️ Acceso denegado, se requiere rol: ${roleRequired}`);
        return <Navigate to="/" replace />;
    }

    // ✅ Todo correcto
    return children;
}