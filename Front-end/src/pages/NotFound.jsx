import { Link } from "react-router-dom";
import "../assets/styles/estilos.css";

/**
 * NotFound.jsx
 * Página 404 para rutas inexistentes
 */
export function NotFound() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "80vh" }}
    >
      <h1 className="display-1 fw-bold text-warning">404</h1>
      <h2 className="mb-3">Página no encontrada</h2>
      <p className="text-muted mb-4">
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>

      <Link to="/" className="btn btn-outline-dark">
        <i className="bi bi-house-door me-2"></i> Volver al inicio
      </Link>
    </div>
  );
}
