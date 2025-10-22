import { useState, useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import placeholder from "../assets/img/placeholder.png";
import "../assets/styles/estilos.css";

export function UrnaModal({ urnaSeleccionada }) {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [cantidad, setCantidad] = useState(1);
  const [indexActivo, setIndexActivo] = useState(0);

  if (!urnaSeleccionada) return null;

  // Construir array de imágenes (principal + adicionales)
  const imagenes = [
    urnaSeleccionada.imagenPrincipal
      ? `http://localhost:8002${urnaSeleccionada.imagenPrincipal}`
      : placeholder,
    ...(urnaSeleccionada.imagenes?.map((img) => `http://localhost:8002${img.url}`) || []),
  ];

  const handleAgregar = () => {
    if (cantidad < 1) return alert("Debe agregar al menos 1 unidad.");
    if (cantidad > urnaSeleccionada.stock)
      return alert("No hay suficiente stock disponible.");

    agregarAlCarrito({
      id: urnaSeleccionada.id,
      nombre: urnaSeleccionada.nombre,
      precio: urnaSeleccionada.precio,
      cantidad,
      img: urnaSeleccionada.imagenPrincipal,
    });
    alert(`Se agregó ${cantidad} unidad(es) de "${urnaSeleccionada.nombre}"`);
  };

  const siguienteImagen = () => {
    setIndexActivo((prev) => (prev + 1) % imagenes.length);
  };

  const anteriorImagen = () => {
    setIndexActivo((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  return (
    <div
      className="modal fade"
      id="urnaModal"
      tabIndex="-1"
      aria-labelledby="urnaModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-dark text-white">
            <div>
              <h5 className="modal-title" id="urnaModalLabel">
                {urnaSeleccionada.nombre}
              </h5>
              {/* 👇 Nuevo: Código interno debajo del título */}
              <small className="text-warning">
                Código: {urnaSeleccionada.idInterno || `#${urnaSeleccionada.id}`}
              </small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body">
            <div className="row">
              {/* Thumbnails con scroll */}
              <div className="col-2 d-flex flex-column align-items-center">
                <button
                  className="btn btn-sm btn-light mb-2"
                  onClick={() =>
                    document.getElementById("thumbsContainer").scrollBy({
                      top: -80,
                      behavior: "smooth",
                    })
                  }
                >
                  ▲
                </button>

                <div
                  id="thumbsContainer"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                  className="d-flex flex-column gap-2"
                >
                  {imagenes.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`thumb-${i}`}
                      className={`img-thumbnail ${i === indexActivo ? "border-primary" : ""}`}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => setIndexActivo(i)}
                      onError={(e) => (e.target.src = placeholder)}
                    />
                  ))}
                </div>

                <button
                  className="btn btn-sm btn-light mt-2"
                  onClick={() =>
                    document.getElementById("thumbsContainer").scrollBy({
                      top: 80,
                      behavior: "smooth",
                    })
                  }
                >
                  ▼
                </button>
              </div>

              {/* Imagen grande con flechas carrusel */}
              <div className="col-6 position-relative text-center">
                <img
                  src={imagenes[indexActivo]}
                  alt={urnaSeleccionada.nombre}
                  className="img-fluid rounded"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                  onError={(e) => (e.target.src = placeholder)}
                />

                {imagenes.length > 1 && (
                  <>
                    <button
                      className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
                      style={{ opacity: 0.6 }}
                      onClick={anteriorImagen}
                    >
                      ‹
                    </button>
                    <button
                      className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
                      style={{ opacity: 0.6 }}
                      onClick={siguienteImagen}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Detalles */}
              <div className="col-4">
                <p>
                  <strong>Descripción:</strong>{" "}
                  {urnaSeleccionada.descripcionDetallada ||
                    "Urna de alta calidad con acabado artesanal."}
                </p>
                <p>
                  <strong>Modelo:</strong> {urnaSeleccionada.modelo?.nombre}
                </p>
                <p>
                  <strong>Material:</strong> {urnaSeleccionada.material?.nombre}
                </p>
                <p>
                  <strong>Color:</strong> {urnaSeleccionada.color?.nombre}
                </p>
                <p>
                  <strong>Dimensiones:</strong>{" "}
                  {`${urnaSeleccionada.ancho}×${urnaSeleccionada.profundidad}×${urnaSeleccionada.alto} cm`}
                </p>
                <p>
                  <strong>Peso:</strong> {urnaSeleccionada.peso} kg
                </p>
                <p>
                  <strong>Precio:</strong>{" "}
                  ${urnaSeleccionada.precio?.toLocaleString("es-CL")}
                </p>
                <p>
                  <strong>Stock:</strong> {urnaSeleccionada.stock} unidades
                </p>

                {/* Cantidad */}
                <div className="input-group mb-3">
                  <span className="input-group-text">Cantidad</span>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max={urnaSeleccionada.stock}
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                  />
                </div>

                <button className="btn btn-primary w-100" onClick={handleAgregar}>
                  <i className="bi bi-cart-plus me-2"></i> Agregar al carrito
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
