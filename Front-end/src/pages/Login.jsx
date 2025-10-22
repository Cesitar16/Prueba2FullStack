import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/login.css";

/**
 * Login.jsx
 * Pantalla de inicio de sesión basada en tu login.html original
 */
export function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credenciales, setCredenciales] = useState({
    correo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciales({ ...credenciales, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credenciales.correo || !credenciales.password) {
      return alert("Completa ambos campos para continuar.");
    }
    setLoading(true);
    const exito = await login(credenciales.correo, credenciales.password);
    setLoading(false);
    if (exito) {
      const user = JSON.parse(localStorage.getItem("user"));
      navigate(user?.rol === "Administrador" ? "/admin" : "/");
    }
  };

  return (
    <div className="login-container">
      {/* Izquierda: presentación */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="brand-logo">
            <i className="bi bi-dove"></i>
          </div>
          <h2 className="brand-name">Descansos del Recuerdo</h2>
          <p className="brand-subtitle">
            Urnas funerarias de la más alta calidad.  
            Un tributo eterno a quienes amamos.
          </p>
          <div className="decorative-line"></div>
        </div>
      </div>

      {/* Derecha: formulario */}
      <div className="login-right">
        <div className="login-header">
          <h2 className="login-title">Bienvenido</h2>
          <p className="login-subtitle">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              name="correo"
              className="form-control"
              id="correo"
              placeholder="correo@ejemplo.com"
              value={credenciales.correo}
              onChange={handleChange}
            />
            <label htmlFor="correo">Correo electrónico</label>
          </div>

          <div className="form-floating mb-3 password-field">
            <input
              type="password"
              name="password"
              className="form-control"
              id="password"
              placeholder="Contraseña"
              value={credenciales.password}
              onChange={handleChange}
            />
            <label htmlFor="password">Contraseña</label>
          </div>

          <button
            type="submit"
            className="btn-login w-100"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="forgot-password">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
}
