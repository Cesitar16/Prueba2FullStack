import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

/**
 * AuthContext.jsx
 * Maneja autenticación, sesión persistente y datos del usuario logueado.
 * Compatible con el flujo de CarritoModal.
 */
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    // ============================================================
    // 🔹 Iniciar sesión
    // ============================================================
    const login = async (correo, password) => {
        try {
            const res = await axios.post("http://localhost:8004/api/auth/login", {
                correo,
                password,
            });

            const token = res.data.token;
            localStorage.setItem("token", token);

            // Obtener perfil del usuario autenticado
            const meRes = await axios.get("http://localhost:8004/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsuario(meRes.data);
            return true;
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            alert("❌ Credenciales inválidas o usuario inactivo.");
            return false;
        }
    };

    // ============================================================
    // 🔹 Cerrar sesión
    // ============================================================
    const logout = () => {
        localStorage.removeItem("token");
        setUsuario(null);
    };

    // ============================================================
    // 🔹 Obtener token actual
    // ============================================================
    const getToken = () => localStorage.getItem("token");

    // ============================================================
    // 🔹 Refrescar perfil (por si cambia información del usuario)
    // ============================================================
    const refreshProfile = async () => {
        const token = getToken();
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:8004/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsuario(res.data);
        } catch (err) {
            console.warn("No se pudo refrescar el perfil:", err);
            logout();
        }
    };

    // ============================================================
    // 🔹 Cargar sesión persistente al iniciar la app
    // ============================================================
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        axios
            .get("http://localhost:8004/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setUsuario(res.data))
            .catch(() => logout())
            .finally(() => setLoading(false)); // ✅ importante
        console.log("AuthContext:", { usuario, isAuthenticated: !!usuario, loading });
    }, []);

    // ============================================================
    // 🔹 Exportar contexto
    // ============================================================
    return (
        <AuthContext.Provider
            value={{
                usuario,
                login,
                logout,
                loading,
                isAuthenticated: !!usuario,
                refreshProfile,
                token: getToken(),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}