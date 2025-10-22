import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

/**
 * AuthContext.jsx
 * Maneja autenticación, sesión persistente y datos del usuario logueado
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Iniciar sesión
  const login = async (correo, password) => {
    try {
      const res = await axios.post("http://localhost:8004/api/auth/login", {
        correo,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      // Obtener datos del usuario autenticado
      const meRes = await axios.get("http://localhost:8004/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(meRes.data);
      return true;
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      alert("Credenciales inválidas o usuario inactivo.");
      return false;
    }
  };

  // 🔹 Cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🔹 Cargar sesión desde localStorage (mantener login)
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
      .then((res) => setUser(res.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
