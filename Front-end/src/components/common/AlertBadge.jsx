import "../../assets/styles/estilos.css";

/**
 * AlertBadge.jsx
 * Componente para mostrar alertas visuales (stock bajo, agotado, etc.)
 */
export function AlertBadge({ stock, limite = 5 }) {
  if (stock === 0) {
    return (
      <span className="badge bg-secondary">
        <i className="bi bi-x-circle me-1"></i> Agotado
      </span>
    );
  }

  if (stock < limite) {
    return (
      <span className="badge bg-danger">
        <i className="bi bi-exclamation-triangle me-1"></i> Bajo ({stock})
      </span>
    );
  }

  return (
    <span className="badge bg-success">
      <i className="bi bi-check-circle me-1"></i> Stock: {stock}
    </span>
  );
}
