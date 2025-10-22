import { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import placeholder from "../assets/img/placeholder.png";
import "../assets/styles/estilos.css";

export function UrnaCard({ urna, onVerDetalle }) {
  const { agregarAlCarrito } = useContext(CarritoContext);

  const handleAgregar = () => {
    agregarAlCarrito({
      id: urna.id,
      nombre: urna.nombre,
      precio: urna.precio,
      cantidad: 1,
      img: urna.imagenPrincipal, // ahora sí viene de la API
    });
  };

  const imagenValida = urna.imagenPrincipal
    ? urna.imagenPrincipal.startsWith("http")
      ? urna.imagenPrincipal
      : `http://localhost:8002${urna.imagenPrincipal}`
    : placeholder;

  return (
    <div className="col">
      <div className="card h-100 product-card shadow-sm">
        {/* Botón para abrir modal con detalle */}
        <button
          className="btn p-0 border-0 text-start w-100"
          data-bs-toggle="modal"
          data-bs-target="#urnaModal"
          onClick={() => onVerDetalle(urna)}
        >
          <img
            src={imagenValida}
            className="card-img-top"
            alt={urna.nombre}
            onError={(e) => (e.target.src = placeholder)}
          />
        </button>

        <div className="card-body">
          {/* 👇 Nuevo: Código interno */}
          <small className="text-muted d-block mb-1">
            Código: <span className="fw-semibold">{urna.idInterno || `#${urna.id}`}</span>
          </small>

          <h5 className="card-title">{urna.nombre}</h5>
          <p className="card-text text-muted mb-1">
            {urna.descripcionCorta || "Urna funeraria elegante"}
          </p>

          <small className="text-muted">
            Modelo: {urna.modelo?.nombre || "N/A"}
          </small>
          <br />
          <small className="text-muted">
            Material: {urna.material?.nombre || "N/A"}
          </small>
          <br />
          <small className="text-muted">
            Color: {urna.color?.nombre || "N/A"}
          </small>
        </div>

        <div className="card-footer bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <strong className="text-dark">
              ${urna.precio?.toLocaleString("es-CL")}
            </strong>

            {/* Alerta de stock */}
            {urna.stock < 5 ? (
              <span className="badge bg-danger">Stock crítico ({urna.stock})</span>
            ) : (
              <span className="badge bg-success">Stock: {urna.stock}</span>
            )}
          </div>

          <button
            className="btn btn-sm btn-outline-primary mt-2 w-100"
            onClick={handleAgregar}
          >
            <i className="bi bi-cart-plus me-1"></i> Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
