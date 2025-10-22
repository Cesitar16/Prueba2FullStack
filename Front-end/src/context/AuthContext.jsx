import { createContext, useEffect, useState, useMemo } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_USUARIOS || "http://localhost:8004";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);       // { id, nombre, correo, rol, ... }
    const [loading, setLoading] = useState(true); // true mientras intenta restaurar sesión

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Axios “singleton” para AuthContext (evita duplicar lógica)
    const http = useMemo(() => {
        const instance = axios.create({ baseURL: API_BASE });
        // request: adjunta token si existe
        instance.interceptors.request.use((config) => {
            const tk = localStorage.getItem("token");
            if (tk) config.headers.Authorization = `Bearer ${tk}`;
            return config;
        });
        // response: si 401 → cierra sesión limpia
        instance.interceptors.response.use(
            (r) => r,
            (err) => {
                if (err?.response?.status === 401) {
                    localStorage.removeItem("token");
                    setUser(null);
                }
                return Promise.reject(err);
            }
        );
        return instance;
    }, []);

    // Restaurar sesión al montar
    useEffect(() => {
        const restore = async () => {
            try {
                if (!token) return; // nada que restaurar
                const { data } = await http.get("/api/auth/me");
                setUser(data);
                // eslint-disable-next-line no-unused-vars
            } catch (_) {
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        restore();
    }, [http]); // eslint-disable-line

    // Login
    const login = async (correo, password) => {
        const { data } = await axios.post(`${API_BASE}/api/auth/login`, { correo, password });
        const tk = data?.token;
        if (!tk) throw new Error("No se recibió token del backend.");
        localStorage.setItem("token", tk);
        // Trae perfil
        const me = await http.get("/api/auth/me");
        setUser(me.data);
        return me.data;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}