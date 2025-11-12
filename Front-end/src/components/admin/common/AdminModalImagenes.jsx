import { useEffect, useState } from "react";
import "/src/assets/styles/admin-modal.css";
import { catalogoApi, inventarioApi, crearUrnaConInventario } from "../../../services/api";

/**
 * AdminModalImagenes.jsx
 * Modal de dos pasos: 1️⃣ Crear Urna / 2️⃣ Configurar Inventario
 */
export default function AdminModalImagenes({ open, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [urnaId, setUrnaId] = useState(null);
  const [imagenes, setImagenes] = useState([]);

  // === Datos de la Urna ===
  const [urnaData, setUrnaData] = useState({
    nombre: "",
    idInterno: "",
    descripcionCorta: "",
    descripcionDetallada: "",
    precio: "",
    ancho: "",
    alto: "",
    profundidad: "",
    peso: "",
    disponible: "s",
    estado: "Activo",
    materialId: "",
    colorId: "",
    modeloId: "",
  });

  // === Datos de Inventario ===
  const [inventarioData, setInventarioData] = useState({
    cantidadActual: 0,
    cantidadMaxima: 50,
    cantidadMinima: 5,
    ubicacionFisica: "",
  });

  // === Catálogos ===
  const [materiales, setMateriales] = useState([]);
  const [colores, setColores] = useState([]);
  const [modelos, setModelos] = useState([]);

  // === Cargar opciones ===
  useEffect(() => {
    if (open) cargarOpciones();
  }, [open]);

  const cargarOpciones = async () => {
    try {
      const [mat, col, mod] = await Promise.all([
        catalogoApi.getMateriales(),
        catalogoApi.getColores(),
        catalogoApi.getModelos(),
      ]);
      setMateriales(mat.data);
      setColores(col.data);
      setModelos(mod.data);
    } catch (err) {
      console.error("Error al cargar opciones:", err);
    }
  };

  if (!open) return null;

  // === Manejo de campos ===
  const handleUrnaChange = (e) => {
    const { name, value } = e.target;
    setUrnaData({ ...urnaData, [name]: value });
  };

  const handleInventarioChange = (e) => {
    const { name, value } = e.target;
    setInventarioData({ ...inventarioData, [name]: value });
  };

  const handleImagesChange = (files) => setImagenes(files);

  // ======================================================
  //  PASO 1️⃣ → CREAR URNA
  // ======================================================
  const handleSubmitUrna = async () => {
    // Solo validaciones antes de pasar al paso 2
    if (!imagenes.some((img) => img.principal)) {
      alert("⚠️ Debes seleccionar una imagen principal antes de continuar.");
      return;
    }
  
    // Valida campos obligatorios
    const camposRequeridos = ["nombre", "precio", "materialId", "colorId", "modeloId"];
    const vacios = camposRequeridos.filter((f) => !urnaData[f]);
    if (vacios.length > 0) {
      alert("⚠️ Debes completar todos los campos obligatorios antes de continuar.");
      return;
    }
  
    // Si todo ok, avanza sin guardar todavía
    setStep(2);
  };

  // ======================================================
  //  PASO 2️⃣ → CONFIGURAR INVENTARIO
  // ======================================================
  const handleSubmitInventario = async () => {
    try {
      setLoading(true);
  
      // 🧩 Convertir imágenes a base64 de forma asíncrona
      const imagenesBase64 = await Promise.all(
        imagenes.map(async (img) => ({
          nombre: img.file.name,
          principal: img.principal,
          contenido: await toBase64(img.file), // ahora sí permitido
        }))
      );
  
      // 🧩 Construir cuerpo combinado
      const payload = {
        urna: urnaData,
        inventario: inventarioData,
        imagenes: imagenesBase64,
      };
  
      // 🧩 Enviar al endpoint unificado
      await crearUrnaConInventario(payload);
  
      alert("✅ Urna, imágenes e inventario creados correctamente.");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error al crear urna e inventario:", err);
      alert("❌ Ocurrió un error al crear la urna y su inventario.");
    } finally {
      setLoading(false);
    }
  };
  
  
  // Helper para convertir archivos a base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  
  

  // ======================================================
  //  RENDER
  // ======================================================
  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        className="modal-content admin-modal"
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          animation: "fadeIn 0.4s ease",
        }}
      >
        {/* === Header === */}
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center modal-step-header">
          <h5 className="m-0">
            {step === 1 ? "Crear Urna" : "Configurar Inventario"}
          </h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* === Contenido === */}
        <div className="p-3">
          {/* ====================== Paso 1 ====================== */}
          {step === 1 && (
            <>
              {/* ID Interno + Nombre + Precio */}
              <div className="row g-3">
                <div className="col-md-4">
                  <label>ID Interno</label>
                  <input
                    type="text"
                    name="idInterno"
                    className="form-control"
                    value={urnaData.idInterno}
                    onChange={handleUrnaChange}
                  />
                </div>
                <div className="col-md-4">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={urnaData.nombre}
                    onChange={handleUrnaChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label>Precio ($)</label>
                  <input
                    type="number"
                    name="precio"
                    className="form-control"
                    value={urnaData.precio}
                    onChange={handleUrnaChange}
                    required
                  />
                </div>
              </div>

              {/* Descripciones */}
              <div className="mt-3">
                <label>Descripción Corta</label>
                <input
                  type="text"
                  name="descripcionCorta"
                  className="form-control"
                  value={urnaData.descripcionCorta}
                  onChange={handleUrnaChange}
                />
              </div>

              <div className="mt-3">
                <label>Descripción Detallada</label>
                <textarea
                  name="descripcionDetallada"
                  className="form-control"
                  rows="3"
                  value={urnaData.descripcionDetallada}
                  onChange={handleUrnaChange}
                ></textarea>
              </div>

              {/* Dimensiones */}
              <div className="row g-3 mt-3">
                {["ancho", "alto", "profundidad", "peso"].map((campo) => (
                  <div className="col-md-3" key={campo}>
                    <label>
                      {campo.charAt(0).toUpperCase() + campo.slice(1)} (cm/kg)
                    </label>
                    <input
                      type="number"
                      name={campo}
                      className="form-control"
                      value={urnaData[campo]}
                      onChange={handleUrnaChange}
                    />
                  </div>
                ))}
              </div>

              {/* Estado y Disponibilidad */}
              <div className="row g-3 mt-3">
                <div className="col-md-6">
                  <label>Disponible</label>
                  <select
                    name="disponible"
                    className="form-select"
                    value={urnaData.disponible}
                    onChange={handleUrnaChange}
                  >
                    <option value="s">Sí</option>
                    <option value="n">No</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>Estado</label>
                  <select
                    name="estado"
                    className="form-select"
                    value={urnaData.estado}
                    onChange={handleUrnaChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Material, Color, Modelo */}
              <div className="row g-3 mt-3">
                <div className="col-md-4">
                  <label>Material</label>
                  <select
                    name="materialId"
                    className="form-select"
                    value={urnaData.materialId}
                    onChange={handleUrnaChange}
                  >
                    <option value="">Seleccione...</option>
                    {materiales.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label>Color</label>
                  <select
                    name="colorId"
                    className="form-select"
                    value={urnaData.colorId}
                    onChange={handleUrnaChange}
                  >
                    <option value="">Seleccione...</option>
                    {colores.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label>Modelo</label>
                  <select
                    name="modeloId"
                    className="form-select"
                    value={urnaData.modeloId}
                    onChange={handleUrnaChange}
                  >
                    <option value="">Seleccione...</option>
                    {modelos.map((mo) => (
                      <option key={mo.id} value={mo.id}>
                        {mo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Imágenes */}
              <div className="mt-4">
                <label className="form-label fw-semibold">Imágenes</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    handleImagesChange(
                      Array.from(e.target.files).map((f) => ({
                        file: f,
                        principal: false,
                      }))
                    )
                  }
                />
                {imagenes.length > 0 && (
                  <>
                    <small className="text-muted d-block mt-2 mb-1">
                      👉 Haz clic sobre una imagen para marcarla como{" "}
                      <strong>principal</strong>.
                    </small>
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
                            cursor: "pointer",
                            border: imgObj.principal
                              ? "3px solid gold"
                              : "1px solid #ccc",
                          }}
                          onClick={() => {
                            const newImgs = imagenes.map((img, i) => ({
                              ...img,
                              principal: i === index,
                            }));
                            setImagenes(newImgs);
                          }}
                        >
                          <img
                            src={URL.createObjectURL(imgObj.file)}
                            alt={`imagen-${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {imgObj.principal && (
                            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-1 px-2 rounded">
                              Principal
                            </span>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 rounded-circle"
                            style={{ lineHeight: 0.8 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const newImgs = imagenes.filter(
                                (_, i) => i !== index
                              );
                              setImagenes(newImgs);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ====================== Paso 2 ====================== */}
          {step === 2 && (
            <>
              <h6 className="mb-3">Configuración de Inventario</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label>Cantidad Actual</label>
                  <input
                    type="number"
                    name="cantidadActual"
                    value={inventarioData.cantidadActual}
                    onChange={handleInventarioChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label>Cantidad Máxima</label>
                  <input
                    type="number"
                    name="cantidadMaxima"
                    value={inventarioData.cantidadMaxima}
                    onChange={handleInventarioChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label>Cantidad Mínima</label>
                  <input
                    type="number"
                    name="cantidadMinima"
                    value={inventarioData.cantidadMinima}
                    onChange={handleInventarioChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label>Ubicación Física</label>
                <input
                  type="text"
                  name="ubicacionFisica"
                  value={inventarioData.ubicacionFisica}
                  onChange={handleInventarioChange}
                  className="form-control"
                />
              </div>
            </>
          )}
        </div>

        {/* === Footer dinámico === */}
        <div className="p-3 border-top d-flex justify-content-end gap-2">
          {step === 2 && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              ← Atrás
            </button>
          )}
          <button className="btn btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-guardar"
            onClick={step === 1 ? handleSubmitUrna : handleSubmitInventario}
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : step === 1
              ? "Siguiente →"
              : "Guardar Inventario"}
          </button>
        </div>
      </div>
    </div>
  );
}
