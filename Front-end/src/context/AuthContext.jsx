import { createContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_USUARIOS || "http://localhost:8004";

/**
 * 🌿 AuthContext unificado
 * Combina lo mejor del flujo de César y del tuyo:
 * - Interceptores Axios globales
 * - Manejo persistente de token
 * - Refresh automático de sesión
 * - Manejo elegante de errores y 401
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, nombre, correo, rol, ... }
  const [loading, setLoading] = useState(true);

  // ============================================================
  // 🔹 Axios singleton con interceptores
  // ============================================================
  const http = useMemo(() => {
    const instance = axios.create({ baseURL: API_BASE });

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          console.warn("🔒 Sesión expirada, cerrando sesión...");
          localStorage.removeItem("token");
          setUser(null);
        }
        return Promise.reject(err);
      }
    );

    return instance;
  }, []);

  // ============================================================
  // 🔹 Obtener token actual
  // ============================================================
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ============================================================
  // 🔹 Login
  // ============================================================
  const login = async (correo, password) => {
    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/login`, {
        correo,
        password,
      });

      const token = data?.token;
      if (!token) throw new Error("No se recibió token del backend");

      localStorage.setItem("token", token);

      const me = await http.get("/api/auth/me");
      setUser(me.data);

      return true;
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      alert("❌ Credenciales inválidas o usuario inactivo.");
      return false;
    }
  };

  // ============================================================
  // 🔹 Logout
  // ============================================================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // ============================================================
  // 🔹 Refrescar perfil manualmente
  // ============================================================
  const refreshProfile = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const { data } = await http.get("/api/auth/me");
      setUser(data);
    } catch {
      logout();
    }
  };

  // ============================================================
  // 🔹 Restaurar sesión al montar
  // ============================================================
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await http.get("/api/auth/me");
        setUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, [http]);

  // ============================================================
  // 🔹 Exportar contexto
  // ============================================================
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
