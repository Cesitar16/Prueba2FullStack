import { Button } from "react-bootstrap";
import "../../assets/styles/estilos.css";

export function FloatingCartButton({ onClick }) {
    return (
        <Button
            // Aplicamos nuestra clase personalizada que tiene los !important
            className="floating-cart-btn"
            onClick={onClick}
            // variant="link" elimina fondos base para que nuestro CSS actúe mejor
            variant="link"
        >
            <i className="bi bi-cart3"></i>
        </Button>
    );
}