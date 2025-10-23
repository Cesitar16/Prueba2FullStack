import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../assets/styles/animate.css";

/**
 * LoginStep.jsx
 * Paso de inicio de sesión dentro del flujo de compra (CarritoModal)
 */
export function LoginStep({ onLoginSuccess, onBack }) {
  const { login } = useContext(AuthContext);
  const [credenciales, setCredenciales] = useState({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!credenciales.correo || !credenciales.password)
      return alert("Por favor ingresa tu correo y contraseña.");

    try {
      setLoading(true);
      const ok = await login(credenciales.correo, credenciales.password);
      if (ok) onLoginSuccess();
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      alert("No se pudo iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate__animated animate__fadeInRight">
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-outline-dark btn-sm me-2" onClick={onBack}>
          ←
        </button>
        <h5 className="m-0">🔐 Inicia sesión para continuar</h5>
      </div>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            placeholder="ejemplo@correo.com"
            value={credenciales.correo}
            onChange={(e) =>
              setCredenciales({ ...credenciales, correo: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            placeholder="********"
            value={credenciales.password}
            onChange={(e) =>
              setCredenciales({ ...credenciales, password: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin me-2"></i> Iniciando sesión...
            </>
          ) : (
            <>
              <i className="bi bi-box-arrow-in-right me-2"></i> Iniciar sesión
            </>
          )}
        </button>
      </form>

      <p className="text-muted small text-center mt-3">
        Si no tienes una cuenta, puedes crearla desde la sección de registro.
      </p>
    </div>
  );
}
