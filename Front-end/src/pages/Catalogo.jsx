import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { UrnaCard } from "../components/catalogo/UrnaCard";
import { UrnaModal } from "../components/catalogo/UrnaModal";
import { CarritoModal } from "../components/carrito/CarritoModal";
import { FloatingCartButton } from "../components/carrito/FloatingCartButton";
import { catalogoApi, inventarioApi } from "../services/api"; // ⬅️ usamos ambos
import "../assets/styles/estilos.css";

export function Catalogo() {
    const [urnas, setUrnas] = useState([]);
    const [urnaSeleccionada, setUrnaSeleccionada] = useState(null);
    const [showCarrito, setShowCarrito] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🔎 Filtros
    const [busquedaNombre, setBusquedaNombre] = useState("");
    const [codigo, setCodigo] = useState("");
    const [materialId, setMaterialId] = useState("");
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");

    // Combos
    const [materiales, setMateriales] = useState([]);

    // 📄 Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const urnasPorPagina = 12;

    // --- Helpers ---
    const buildStockMap = (items = []) => {
        return items.reduce((acc, it) => {
            if (it?.estado && it.estado !== "Disponible") return acc;
            const uid = it.urnaId;
            const cant = Number(it.cantidadActual || 0);
            acc[uid] = (acc[uid] || 0) + cant;
            return acc;
        }, {});
    };

    const mergeUrnasConStock = (urnas = [], inventario = []) => {
        const stockPorUrna = buildStockMap(inventario);
        return urnas.map((u) => ({ ...u, stock: stockPorUrna[u.id] ?? 0 }));
    };

    const fetchUrnasConStock = async (filters = {}) => {
        setLoading(true);
        setPaginaActual(1);
        try {
            const [uRes, invRes] = await Promise.all([
                catalogoApi.getUrnasFiltered(filters),
                inventarioApi.getAll(),
            ]);
            const urnasBase = uRes.data || [];
            const inventario = invRes.data || [];
            const conStock = mergeUrnasConStock(urnasBase, inventario);
            setUrnas(conStock);
        } catch (err) {
            console.error("Error obteniendo catálogo:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const m = await catalogoApi.getMateriales();
                setMateriales(m.data || []);
            } catch (err) { console.error(err); }
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

    // --- Lógica de Paginación ---
    const indiceUltimaUrna = paginaActual * urnasPorPagina;
    const indicePrimeraUrna = indiceUltimaUrna - urnasPorPagina;
    const urnasPaginaActual = urnas.slice(indicePrimeraUrna, indiceUltimaUrna);
    const totalPaginas = Math.ceil(urnas.length / urnasPorPagina);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) heroSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Componente de Paginación con FIX de estilos
    const Paginacion = () => (
        <div className="paginacion-catalogo d-flex justify-content-center gap-2 mt-5">
            <Button
                variant="" // 🔴 Quita el estilo azul por defecto
                className="btn-brand-outline"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
            >
                ← Anterior
            </Button>

            {[...Array(totalPaginas)].map((_, index) => (
                <Button
                    key={index}
                    variant="" // 🔴 Quita el estilo azul por defecto
                    className={paginaActual === index + 1 ? "btn-brand" : "btn-brand-outline"}
                    onClick={() => cambiarPagina(index + 1)}
                >
                    {index + 1}
                </Button>
            ))}

            <Button
                variant="" // 🔴 Quita el estilo azul por defecto
                className="btn-brand-outline"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
            >
                Siguiente →
            </Button>
        </div>
    );

    return (
        <Container className="my-4">
            <section className="hero-section rounded shadow-sm mb-4 text-center py-5">
                <h1 className="display-4 fw-bold" style={{color: 'var(--color-principal)'}}>Honrando memorias con dignidad</h1>
                <p className="lead text-muted">Nuestra colección de urnas funerarias está diseñada para ofrecer un tributo digno.</p>
            </section>

            <div className="filter-card shadow-sm mb-5 p-4 rounded" style={{backgroundColor: '#fcfcfc', border: '1px solid #e0e0e0'}}>
                <div className="row g-3 align-items-end">
                    <div className="col-md-3">
                        <label className="form-label fw-semibold text-secondary">Nombre</label>
                        <input type="text" className="form-control" placeholder="Buscar..." value={busquedaNombre} onChange={(e) => setBusquedaNombre(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold text-secondary">Código</label>
                        <input type="text" className="form-control" placeholder="Código..." value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-semibold text-secondary">Material</label>
                        <select className="form-select" value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
                            <option value="">Todos</option>
                            {materiales.map((m) => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label d-block fw-semibold text-secondary">Rango de precio</label>
                        <div className="d-flex gap-2">
                            <input type="number" className="form-control" placeholder="Mín" value={precioMin} onChange={(e) => setPrecioMin(e.target.value)} />
                            <input type="number" className="form-control" placeholder="Máx" value={precioMax} onChange={(e) => setPrecioMax(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button
                        variant="" // 🔴 Quita el estilo azul
                        className="btn-brand px-4"
                        onClick={handleFiltrar}
                    >
                        <i className="bi bi-funnel-fill me-2"></i> Filtrar
                    </Button>
                    <Button
                        variant="" // 🔴 Quita el estilo azul
                        className="btn-brand-outline px-4"
                        onClick={limpiarFiltros}
                    >
                        <i className="bi bi-eraser-fill me-2"></i> Limpiar
                    </Button>
                </div>
            </div>

            <h2 className="titulo-seccion mb-4" style={{color: 'var(--color-principal)'}}>Nuestro Catálogo</h2>

            {loading ? (
                <div className="text-center text-muted py-5">
                    <Spinner animation="border" style={{color: 'var(--color-secundario)'}} />
                    <p className="mt-3">Cargando catálogo...</p>
                </div>
            ) : (
                <>
                    <Row xs={1} md={3} className="g-4">
                        {urnasPaginaActual.map((urna) => (
                            <Col key={urna.id}>
                                <UrnaCard urna={urna} onVerDetalle={setUrnaSeleccionada} />
                            </Col>
                        ))}
                        {urnas.length === 0 && (
                            <Col xs={12} className="text-center text-muted py-5">
                                <i className="bi bi-search display-4 mb-3"></i>
                                <p>Sin resultados con los filtros actuales.</p>
                            </Col>
                        )}
                    </Row>
                    {urnas.length > urnasPorPagina && <Paginacion />}
                </>
            )}

            <UrnaModal show={!!urnaSeleccionada} urnaSeleccionada={urnaSeleccionada} onHide={() => setUrnaSeleccionada(null)} />
            <CarritoModal show={showCarrito} onHide={() => setShowCarrito(false)} />
            <FloatingCartButton onClick={() => setShowCarrito(true)} />
        </Container>
    );
}