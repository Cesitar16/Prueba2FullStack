import { useState } from "react";
import "/src/assets/styles/admin-modal.css";

/**
 * AdminModal.jsx
 * Modal reutilizable con soporte para subida de imágenes
 */
export default function AdminModal({
  open,
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Guardar",
  onImagesChange, // callback opcional para subir imágenes al padre
}) {
  const [imagenes, setImagenes] = useState([]);

  if (!open) return null;

  // ✅ Ahora cada imagen tendrá su propia marca "principal"
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((f) => ({ file: f, principal: false }));
    setImagenes(files);
    if (onImagesChange) onImagesChange(files);
  };


  const removeImage = (index) => {
    const newImgs = imagenes.filter((_, i) => i !== index);
    setImagenes(newImgs);
    if (onImagesChange) onImagesChange(newImgs);
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 1050,
      }}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          borderRadius: 10,
          maxWidth: 750,
          width: "95%",
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        }}
      >
        {/* 🔹 Header del modal */}
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="m-0">{title}</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>

        {/* 🔹 Cuerpo del modal */}
        <div className="p-3">
          {/* Campos dinámicos (nombre, precio, etc.) */}
          {children}

          {/* 🔸 Sección de imágenes */}
          <div className="mt-4">
            <label className="form-label fw-semibold">Imágenes</label>
            <input
              type="file"
              className="form-control"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            <small className="text-muted d-block mt-1">
              Puedes seleccionar una o varias imágenes (JPG, PNG, WEBP)
            </small>

            {imagenes.length > 0 && (
            <small className="text-muted d-block mt-2 mb-1">
                👉 Haz clic sobre una imagen para marcarla como <strong>principal</strong>.
            </small>
            )}


            {/* Vista previa mejorada con selector de imagen principal */}
            {imagenes.length > 0 && (
            <div className="mt-3 d-flex flex-wrap gap-3">
                {imagenes.map((imgObj, index) => (
                <div
                    key={index}
                    style={{
                    position: "relative",
                    width: "110px",
                    height: "110px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                    cursor: "pointer",
                    border: imgObj.principal ? "3px solid gold" : "1px solid #ccc",
                    }}
                    onClick={() => {
                    // Marca una sola como principal
                    const newImgs = imagenes.map((img, i) => ({
                        ...img,
                        principal: i === index,
                    }));
                    setImagenes(newImgs);
                    if (onImagesChange) onImagesChange(newImgs);
                    }}
                >
                    <img
                    src={URL.createObjectURL(imgObj.file)}
                    alt={`imagen-${index}`}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                    }}
                    />
                    {imgObj.principal && (
                    <span
                        style={{
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                        background: "gold",
                        color: "#000",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        }}
                    >
                        Principal
                    </span>
                    )}
                    <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        const newImgs = imagenes.filter((_, i) => i !== index);
                        setImagenes(newImgs);
                        if (onImagesChange) onImagesChange(newImgs);
                    }}
                    style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "rgba(0,0,0,0.6)",
                        border: "none",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        fontSize: "13px",
                        cursor: "pointer",
                    }}
                    >
                    ×
                    </button>
                </div>
                ))}
            </div>
            )}


          </div>
        </div>

        {/* 🔹 Footer */}
        <div className="p-3 border-top d-flex justify-content-end gap-2">
          <button className="btn btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-guardar" onClick={onSubmit}>
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}