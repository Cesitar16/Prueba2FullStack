import { useContext } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { CarritoContext } from "../../context/CarritoContext";
import placeholder from "../../assets/img/placeholder.png";
import "../../assets/styles/estilos.css";

export function UrnaCard({ urna, onVerDetalle }) {
    const { agregarAlCarrito } = useContext(CarritoContext);

    const handleAgregar = (e) => {
        e.stopPropagation();
        agregarAlCarrito({
            id: urna.id,
            nombre: urna.nombre,
            precio: urna.precio,
            cantidad: 1,
            img: urna.imagenPrincipal,
        });
    };

    const imagenValida = urna.imagenPrincipal
        ? urna.imagenPrincipal.startsWith("http")
            ? urna.imagenPrincipal
            : `http://localhost:8002${urna.imagenPrincipal}`
        : placeholder;

    return (
        <div className="col">
            <Card className="h-100 product-card border-0 shadow-sm">
                <div
                    className="p-0 border-0 text-start w-100 position-relative overflow-hidden"
                    style={{ cursor: "pointer" }}
                    onClick={() => onVerDetalle(urna)}
                >
                    <Card.Img
                        variant="top"
                        src={imagenValida}
                        alt={urna.nombre}
                        onError={(e) => (e.target.src = placeholder)}
                        className="product-img"
                        style={{ height: "250px", objectFit: "cover" }}
                    />
                </div>

                <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <small className="text-muted text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>
                            {urna.idInterno || `#${urna.id}`}
                        </small>
                        {urna.stock < 5 && (
                            <Badge bg="danger" className="fw-normal">¡Poco Stock!</Badge>
                        )}
                    </div>

                    <Card.Title className="fw-bold text-dark mb-1" style={{fontFamily: 'Playfair Display, serif'}}>
                        {urna.nombre}
                    </Card.Title>

                    <Card.Text className="text-muted small flex-grow-1 mb-3">
                        {urna.descripcionCorta || "Urna funeraria de alta calidad."}
                    </Card.Text>

                    {/* CORRECCIÓN BADGES:
                       Cambiamos bg="light" por bg="white" o "transparent" y usamos text-secondary
                       para un look más sobrio y elegante.
                    */}
                    <div className="d-flex gap-2 flex-wrap mb-3">
                        <Badge bg="white" className="text-secondary border fw-normal p-2">
                            {urna.material?.nombre}
                        </Badge>
                        <Badge bg="white" className="text-secondary border fw-normal p-2">
                            {urna.color?.nombre}
                        </Badge>
                    </div>
                </Card.Body>

                <Card.Footer className="bg-white border-top-0 pt-0 pb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fs-5 fw-bold" style={{color: 'var(--color-principal)'}}>
                            ${Number(urna.precio).toLocaleString("es-CL")}
                        </span>
                    </div>

                    {/* CORRECCIÓN BOTÓN:
                       Agregamos variant="" para quitar el azul por defecto de Bootstrap
                       y dejar que .btn-brand-outline aplique el color madera.
                    */}
                    <Button
                        variant=""
                        className="w-100 btn-brand-outline"
                        onClick={handleAgregar}
                        disabled={urna.stock === 0}
                    >
                        {urna.stock === 0 ? "Agotado" : <><i className="bi bi-cart-plus me-2"></i> Agregar</>}
                    </Button>
                </Card.Footer>
            </Card>
        </div>
    );
}