import "../../assets/styles/estilos.css";
import { Badge } from "react-bootstrap";

/**
 * AlertBadge.jsx
 * Componente para mostrar alertas visuales (stock bajo, agotado, etc.)
 */
export function AlertBadge({ stock, limite = 5 }) {
    if (stock === 0) {
        return <Badge bg="secondary"><i className="bi bi-x-circle me-1"></i> Agotado</Badge>;
    }
    if (stock < limite) {
        return <Badge bg="danger"><i className="bi bi-exclamation-triangle me-1"></i> Bajo ({stock})</Badge>;
    }
    return <Badge bg="success"><i className="bi bi-check-circle me-1"></i> Stock: {stock}</Badge>;
}