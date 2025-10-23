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
      <div className="card h-100 product-card shadow-sm">
        {/* Imagen clickeable para abrir modal */}
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

        {/* Información principal */}
        <div className="card-body">
          <small className="text-muted d-block mb-1">
            Código:{" "}
            <span className="fw-semibold">
              {urna.idInterno || `#${urna.id}`}
            </span>
          </small>

          <h5 className="card-title">{urna.nombre}</h5>
          <p className="card-text text-muted mb-1">
            {urna.descripcionCorta || "Urna funeraria elegante"}
          </p>

          <small className="text-muted d-block">
            Modelo: {urna.modelo?.nombre || "N/A"}
          </small>
          <small className="text-muted d-block">
            Material: {urna.material?.nombre || "N/A"}
          </small>
          <small className="text-muted d-block">
            Color: {urna.color?.nombre || "N/A"}
          </small>
        </div>

        {/* Pie de tarjeta */}
        <div className="card-footer">
          {/* 💰 Fila de precio + stock */}
          <div className="price-row">
            <strong>${urna.precio?.toLocaleString("es-CL")}</strong>
            <span
              className={`badge ${
                urna.stock < 5 ? "bg-danger" : "bg-success"
              }`}
            >
              {urna.stock < 5
                ? `Stock crítico (${urna.stock})`
                : `Stock: ${urna.stock}`}
            </span>
          </div>

          {/* 🛒 Botón agregar */}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={handleAgregar}
          >
            <i className="bi bi-cart-plus me-1"></i> Agregar al carrito
          </button>
        </div>

      </div>
    </div>
  );
}
