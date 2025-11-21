import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import "../assets/styles/estilos.css";

/**
 * NotFound.jsx
 * Página 404 para rutas inexistentes
 */
export function NotFound() {
    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }} // Altura mínima para centrar verticalmente
        >
            {/* Caja contenedora con fondo blanco semi-transparente.
        rgba(255, 255, 255, 0.9) significa blanco con 90% de opacidad.
      */}
            <div
                className="text-center p-5 rounded shadow-lg"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.6)", // 👈 Aquí está la magia
                    backdropFilter: "blur(5px)", // (Opcional) Efecto de "vidrio esmerilado" si el navegador lo soporta
                    maxWidth: "600px",
                    width: "100%",
                }}
            >
                <div className="mb-4">
                    <i
                        className="bi bi-exclamation-triangle-fill text-warning"
                        style={{ fontSize: "5rem" }}
                    ></i>
                </div>

                <h1 className="display-2 fw-bold text-primary mb-2">404</h1>
                <h3 className="mb-3 text-dark fw-bold">Página no encontrada</h3>
                <p className="text-muted mb-4 fs-5">
                    Parece que te has perdido. La página que buscas no existe o ha sido
                    movida.
                </p>

                <Button
                    variant="primary"
                    as={Link}
                    to="/"
                    size="lg"
                    className="px-4 py-2 fw-semibold shadow-sm"
                >
                    <i className="bi bi-house-fill me-2"></i> Volver al inicio
                </Button>
            </div>
        </Container>
    );
}