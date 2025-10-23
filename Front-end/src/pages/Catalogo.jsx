import { useEffect, useState } from "react";
import { UrnaCard } from "../components/UrnaCard";
import { UrnaModal } from "../components/UrnaModal";
import { CarritoModal } from "../components/CarritoModal";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { catalogoApi } from "../services/api"; // ✅ usamos la capa API
import "../assets/styles/estilos.css";

export function Catalogo() {
  const [urnas, setUrnas] = useState([]);
  const [urnaSeleccionada, setUrnaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔎 filtros
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  // combos
  const [materiales, setMateriales] = useState([]);

  // Carga inicial
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [u, m] = await Promise.all([
          catalogoApi.getUrnasFiltered({}), // lista completa (o getUrnas())
          catalogoApi.getMateriales(),
        ]);
        setUrnas(u.data || []);
        setMateriales(m.data || []);
      } catch (err) {
        console.error("Error inicial Catálogo:", err);
        alert("No se pudo cargar el catálogo. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const handleFiltrar = async () => {
    setLoading(true);
    try {
      const res = await catalogoApi.getUrnasFiltered({
        nombre: busquedaNombre,
        codigo,
        materialId: materialId || undefined,
        min: precioMin || undefined,
        max: precioMax || undefined,
      });
      setUrnas(res.data || []);
    } catch (err) {
      console.error("Error al filtrar:", err);
      alert("Ocurrió un error al aplicar los filtros.");
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = async () => {
    setBusquedaNombre("");
    setCodigo("");
    setMaterialId("");
    setPrecioMin("");
    setPrecioMax("");
    setLoading(true);
    try {
      const res = await catalogoApi.getUrnasFiltered({});
      setUrnas(res.data || []);
    } catch (err) {
      console.error("Error al limpiar filtros:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      {/* HERO encabezado */}
      <section className="hero-section rounded shadow-sm mb-4">
        <h1>Honrando memorias con dignidad</h1>
        <p>
          Nuestra colección de urnas funerarias está diseñada para ofrecer un
          tributo digno y respetuoso a la memoria de nuestros seres queridos.
        </p>
      </section>

      {/* PANEL DE FILTROS */}
      <div className="filter-card shadow-sm mb-5">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre"
              value={busquedaNombre}
              onChange={(e) => setBusquedaNombre(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Código</label>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Material</label>
            <select
              className="form-control"
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
            >
              <option value="">Todos los materiales</option>
              {materiales.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label d-block">Rango de precio</label>
            <div className="d-flex gap-2">
              <input
                type="number"
                className="form-control"
                placeholder="Mín"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Máx"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="filter-actions mt-3">
          <button className="btn-filtrar" onClick={handleFiltrar}>
            <i className="bi bi-funnel-fill me-2"></i> Filtrar
          </button>
          <button className="btn-limpiar" onClick={limpiarFiltros}>
            <i className="bi bi-eraser-fill me-2"></i> Limpiar filtros
          </button>
        </div>
      </div>


      {/* TÍTULO */}
      <h2 className="titulo-seccion">Nuestro Catálogo</h2>

      {/* LISTA */}
      {loading ? (
        <div className="text-center text-muted py-5">
          <div className="spinner-border text-secondary" role="status" />
          <p className="mt-3">Cargando catálogo...</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {urnas.map((urna) => (
            <UrnaCard
              key={urna.id}
              urna={urna}
              onVerDetalle={setUrnaSeleccionada}
            />
          ))}

          {urnas.length === 0 && (
            <div className="text-center text-muted py-5">
              <i className="bi bi-search"></i> Sin resultados con los filtros
              actuales.
            </div>
          )}
        </div>
      )}

      {/* Modal de Detalle */}
      <UrnaModal urnaSeleccionada={urnaSeleccionada} />

      {/* Modal de Carrito + Botón flotante */}
      <CarritoModal />
      <FloatingCartButton />
    </div>
  );
}
