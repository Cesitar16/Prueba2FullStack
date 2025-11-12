import { useState, useContext, useMemo } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import placeholder from "../../assets/img/placeholder.png";
import "../../assets/styles/estilos.css";

const buildImgUrl = (u) => {
  if (!u) return null;
  return /^https?:\/\//i.test(u) ? u : `http://localhost:8002${u}`;
};

export function UrnaModal({ urnaSeleccionada }) {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [cantidad, setCantidad] = useState(1);
  const [indexActivo, setIndexActivo] = useState(0);

  // 🔹 Construir array de imágenes (principal + adicionales)
  const imagenes = useMemo(() => {
    if (!urnaSeleccionada) return [placeholder];

    const principal = buildImgUrl(urnaSeleccionada.imagenPrincipal);
    const extras =
      urnaSeleccionada.imagenes?.map((img) => buildImgUrl(img?.url)) || [];

    const lista = [principal, ...extras].filter(Boolean);
    const unicos = Array.from(new Set(lista));
    return unicos.length > 0 ? unicos : [placeholder];
  }, [urnaSeleccionada]);

  // 🔹 Manejador para fallback de imagen
  const toPlaceholder = (e) => {
    if (e?.target?.src && !e.target.src.includes("placeholder")) {
      e.target.src = placeholder;
    }
  };

  // 🔹 Navegación de galería
  const siguienteImagen = () =>
    setIndexActivo((prev) => (prev + 1) % imagenes.length);

  const anteriorImagen = () =>
    setIndexActivo((prev) =>
      prev === 0 ? imagenes.length - 1 : prev - 1
    );

  // 🔹 Agregar al carrito
  const handleAgregar = () => {
    if (!urnaSeleccionada) return;
    if (cantidad < 1) return alert("Debe agregar al menos 1 unidad.");
    if (cantidad > urnaSeleccionada.stock)
      return alert("No hay suficiente stock disponible.");

    agregarAlCarrito({
      id: urnaSeleccionada.id,
      nombre: urnaSeleccionada.nombre,
      precio: urnaSeleccionada.precio,
      cantidad,
      img: buildImgUrl(urnaSeleccionada.imagenPrincipal) || placeholder,
    });

    alert(`Se agregó ${cantidad} unidad(es) de "${urnaSeleccionada.nombre}"`);
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
          {/* 🔸 Si no hay urna seleccionada, mostrar carga */}
          {!urnaSeleccionada ? (
            <div className="modal-body text-center py-5 text-muted">
              <div className="spinner-border text-secondary mb-3" role="status"></div>
              <p>Cargando detalles...</p>
            </div>
          ) : (
            <>
              {/* CABECERA */}
              <div className="modal-header bg-dark text-white">
                <div>
                  <h5 className="modal-title" id="urnaModalLabel">
                    {urnaSeleccionada.nombre}
                  </h5>
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

              {/* CONTENIDO PRINCIPAL */}
              <div className="modal-body">
                <div className="row">
                  {/* MINIATURAS */}
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
                          src={img || placeholder}
                          alt={`thumb-${i}`}
                          className={`img-thumbnail ${
                            i === indexActivo ? "border-primary" : ""
                          }`}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={() => setIndexActivo(i)}
                          onError={toPlaceholder}
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

                  {/* IMAGEN PRINCIPAL */}
                  <div className="col-6 position-relative text-center">
                    <img
                      src={imagenes[indexActivo] || placeholder}
                      alt={urnaSeleccionada.nombre}
                      className="img-fluid rounded"
                      style={{ maxHeight: "400px", objectFit: "contain" }}
                      onError={toPlaceholder}
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

                  {/* DETALLES */}
                  <div className="col-4">
                    <p className="mb-2">
                      <strong>Código:</strong>{" "}
                      {urnaSeleccionada.idInterno || `#${urnaSeleccionada.id}`}
                    </p>
                    <p>
                      <strong>Descripción:</strong>{" "}
                      {urnaSeleccionada.descripcionDetallada ||
                        "Urna de alta calidad con acabado artesanal."}
                    </p>
                    <p>
                      <strong>Modelo:</strong> {urnaSeleccionada.modelo?.nombre}
                    </p>
                    <p>
                      <strong>Material:</strong>{" "}
                      {urnaSeleccionada.material?.nombre}
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

                    {/* CANTIDAD */}
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

                    <button
                      className="btn btn-primary w-100"
                      onClick={handleAgregar}
                    >
                      <i className="bi bi-cart-plus me-2"></i> Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>

              {/* PIE */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cerrar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
