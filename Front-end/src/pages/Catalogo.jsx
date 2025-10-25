import { useEffect, useState } from "react";
import { UrnaCard } from "../components/UrnaCard";
import { UrnaModal } from "../components/UrnaModal";
import { CarritoModal } from "../components/CarritoModal";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { catalogoApi, inventarioApi } from "../services/api"; // ⬅️ usamos ambos
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

    // --- helpers ---

    // Construye un mapa urnaId -> stock total
    const buildStockMap = (items = []) => {
        return items.reduce((acc, it) => {
            // Si tu API maneja estado, cuenta sólo los "Disponibles"
            if (it?.estado && it.estado !== "Disponible") return acc;

            const uid = it.urnaId;
            const cant = Number(it.cantidadActual || 0);
            acc[uid] = (acc[uid] || 0) + cant;
            return acc;
        }, {});
    };

    // Une urnas + stock
    const mergeUrnasConStock = (urnas = [], inventario = []) => {
        const stockPorUrna = buildStockMap(inventario);
        return urnas.map((u) => ({ ...u, stock: stockPorUrna[u.id] ?? 0 }));
    };

    // Llamada unificada (con o sin filtros)
    const fetchUrnasConStock = async (filters = {}) => {
        setLoading(true);
        try {
            // urnas (con filtros) + inventario
            const [uRes, invRes] = await Promise.all([
                catalogoApi.getUrnasFiltered(filters),
                inventarioApi.getAll(),
            ]);
            const urnasBase = uRes.data || [];
            const inventario = invRes.data || [];

            const conStock = mergeUrnasConStock(urnasBase, inventario);
            setUrnas(conStock);
        } catch (err) {
            console.error("Error obteniendo catálogo/inventario:", err);
            alert("No se pudo cargar el catálogo. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    // Carga inicial
    useEffect(() => {
        (async () => {
            try {
                const m = await catalogoApi.getMateriales();
                setMateriales(m.data || []);
            } catch (err) {
                console.error("Error cargando materiales:", err);
            }
            // urnas + stock
            await fetchUrnasConStock({});
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFiltrar = async () => {
        const filters = {
            nombre: busquedaNombre || undefined,
            codigo: codigo || undefined,
            materialId: materialId || undefined,
            min: precioMin || undefined,
            max: precioMax || undefined,
        };
        await fetchUrnasConStock(filters);
    };

    const limpiarFiltros = async () => {
        setBusquedaNombre("");
        setCodigo("");
        setMaterialId("");
        setPrecioMin("");
        setPrecioMax("");
        await fetchUrnasConStock({});
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
                            urna={urna}               // ← ahora trae urna.stock
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
