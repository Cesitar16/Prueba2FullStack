import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Image, Badge, ProgressBar } from "react-bootstrap";
import "/src/assets/styles/admin-modal.css";
import { catalogoApi,crearUrnaConInventario } from "../../../services/api";

/**
 * AdminModalImagenes.jsx
 * Modal híbrido para CREAR (con wizard de 2 pasos) y EDITAR (solo datos de urna)
 */
export default function AdminModalImagenes({ open, onClose, onSuccess, editingUrna }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [imagenes, setImagenes] = useState([]);

    // Estado inicial para limpiar formulario
    const initialUrnaState = {
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
    };

    const [urnaData, setUrnaData] = useState(initialUrnaState);

    // Datos de Inventario (Solo se usan al CREAR)
    const [inventarioData, setInventarioData] = useState({
        cantidadActual: 0,
        cantidadMaxima: 50,
        cantidadMinima: 5,
        ubicacionFisica: "",
    });

    // Combos
    const [materiales, setMateriales] = useState([]);
    const [colores, setColores] = useState([]);
    const [modelos, setModelos] = useState([]);

    // === 1. Efecto al abrir el modal ===
    useEffect(() => {
        if (open) {
            cargarOpciones();
            setStep(1); // Siempre iniciar en paso 1

            if (editingUrna) {
                // MODO EDITAR: Poblar datos
                setUrnaData({
                    nombre: editingUrna.nombre || "",
                    idInterno: editingUrna.idInterno || "",
                    descripcionCorta: editingUrna.descripcionCorta || "",
                    descripcionDetallada: editingUrna.descripcionDetallada || "",
                    precio: editingUrna.precio || "",
                    ancho: editingUrna.ancho || "",
                    alto: editingUrna.alto || "",
                    profundidad: editingUrna.profundidad || "",
                    peso: editingUrna.peso || "",
                    disponible: editingUrna.disponible || "s",
                    estado: editingUrna.estado || "Activo",
                    // Extraer IDs de objetos relacionados si vienen populados
                    materialId: editingUrna.material?.id || editingUrna.materialId || "",
                    colorId: editingUrna.color?.id || editingUrna.colorId || "",
                    modeloId: editingUrna.modelo?.id || editingUrna.modeloId || "",
                });
                setImagenes([]); // Reseteamos imágenes nuevas al editar
            } else {
                // MODO CREAR: Limpiar todo
                setUrnaData(initialUrnaState);
                setInventarioData({
                    cantidadActual: 0,
                    cantidadMaxima: 50,
                    cantidadMinima: 5,
                    ubicacionFisica: "",
                });
                setImagenes([]);
            }
        }
    }, [open, editingUrna]);

    const cargarOpciones = async () => {
        try {
            const [mat, col, mod] = await Promise.all([
                catalogoApi.getMateriales(),
                catalogoApi.getColores(),
                catalogoApi.getModelos(),
            ]);
            setMateriales(mat.data || []);
            setColores(col.data || []);
            setModelos(mod.data || []);
        } catch (err) {
            console.error("Error al cargar opciones:", err);
        }
    };

    // === Manejadores de Inputs ===
    const handleUrnaChange = (e) => {
        const { name, value } = e.target;
        setUrnaData(prev => ({ ...prev, [name]: value }));
    };

    const handleInventarioChange = (e) => {
        const { name, value } = e.target;
        setInventarioData(prev => ({ ...prev, [name]: value }));
    };

    const handleImagesChange = (files) => {
        if (!files || files.length === 0) return;
        const newFiles = Array.from(files).map(file => ({ file, principal: false }));
        setImagenes(prev => [...prev, ...newFiles]);
    };

    // Helper para Base64
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

    // === ACCIÓN: CREAR NUEVO (Flujo Completo) ===
    const handleSubmitCreate = async () => {
        try {
            setLoading(true);

            // Procesar imágenes
            const imagenesBase64 = await Promise.all(
                imagenes.map(async (img) => ({
                    nombre: img.file.name,
                    principal: img.principal,
                    contenido: await toBase64(img.file),
                }))
            );

            const payload = {
                urna: urnaData,
                inventario: inventarioData,
                imagenes: imagenesBase64,
            };

            await crearUrnaConInventario(payload);

            alert("✅ Producto creado exitosamente.");
            onSuccess?.(); // Refrescar tabla padre
            onClose();     // Cerrar modal
        } catch (err) {
            console.error("Error creando:", err);
            alert("❌ Error al guardar la urna.");
        } finally {
            setLoading(false);
        }
    };

    // === ACCIÓN: EDITAR EXISTENTE (Solo Urna + Nuevas Imágenes) ===
    const handleSubmitEdit = async () => {
        try {
            setLoading(true);

            // 1. Actualizar datos de la urna
            await catalogoApi.updateUrna(editingUrna.id, urnaData);

            // 2. Subir nuevas imágenes si las hay
            if (imagenes.length > 0) {
                for (const img of imagenes) {
                    // Nota: Asegúrate que tu catalogoApi tenga este método 'uploadImagen'
                    await catalogoApi.uploadImagen(editingUrna.id, img.file, img.principal);
                }
            }

            alert("✅ Urna actualizada correctamente.");
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Error editando:", err);
            alert("❌ Error al actualizar la urna.");
        } finally {
            setLoading(false);
        }
    };

    // === Navegación del Wizard (Solo crear) ===
    const handleNext = () => {
        // Validaciones
        const requeridos = ["nombre", "precio", "materialId", "colorId", "modeloId"];
        if (requeridos.some(field => !urnaData[field])) {
            alert("⚠️ Por favor completa los campos obligatorios (*)");
            return;
        }

        // Validar imagen principal solo al crear (al editar es opcional subir nuevas)
        if (!editingUrna && imagenes.length > 0 && !imagenes.some((img) => img.principal)) {
            alert("⚠️ Debes marcar una imagen como principal.");
            return;
        }

        setStep(2);
    };

    const isEditMode = !!editingUrna;

    return (
        <Modal show={open} onHide={onClose} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEditMode ? `✏️ Editar Urna #${editingUrna.id}` : (step === 1 ? "1. Datos de la Urna" : "2. Configuración de Stock")}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Barra de progreso solo si estamos creando (wizard) */}
                {!isEditMode && (
                    <ProgressBar
                        now={step === 1 ? 50 : 100}
                        variant="warning"
                        className="mb-4"
                        style={{height: '5px'}}
                    />
                )}

                {/* === PASO 1: DATOS DE LA URNA === */}
                {/* Se muestra siempre en paso 1 o si estamos editando */}
                {(step === 1 || isEditMode) && (
                    <Form>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>ID Interno</Form.Label>
                                    <Form.Control name="idInterno" value={urnaData.idInterno} onChange={handleUrnaChange} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Nombre *</Form.Label>
                                    <Form.Control name="nombre" value={urnaData.nombre} onChange={handleUrnaChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Precio ($) *</Form.Label>
                                    <Form.Control type="number" name="precio" value={urnaData.precio} onChange={handleUrnaChange} required />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Descripción Corta</Form.Label>
                                    <Form.Control name="descripcionCorta" value={urnaData.descripcionCorta} onChange={handleUrnaChange} />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Descripción Detallada</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="descripcionDetallada" value={urnaData.descripcionDetallada} onChange={handleUrnaChange} />
                                </Form.Group>
                            </Col>

                            {/* Dimensiones */}
                            <Col md={3}>
                                <Form.Label>Ancho(cm)</Form.Label>
                                <Form.Control type="number" name="ancho" value={urnaData.ancho} onChange={handleUrnaChange} />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Alto (cm)</Form.Label>
                                <Form.Control type="number" name="alto" value={urnaData.alto} onChange={handleUrnaChange} />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Prof. (cm)</Form.Label>
                                <Form.Control type="number" name="profundidad" value={urnaData.profundidad} onChange={handleUrnaChange} />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Peso (kg)</Form.Label>
                                <Form.Control type="number" name="peso" value={urnaData.peso} onChange={handleUrnaChange} />
                            </Col>

                            {/* Combos */}
                            <Col md={4}>
                                <Form.Label>Material *</Form.Label>
                                <Form.Select name="materialId" value={urnaData.materialId} onChange={handleUrnaChange}>
                                    <option value="">Seleccione...</option>
                                    {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label>Color *</Form.Label>
                                <Form.Select name="colorId" value={urnaData.colorId} onChange={handleUrnaChange}>
                                    <option value="">Seleccione...</option>
                                    {colores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label>Modelo *</Form.Label>
                                <Form.Select name="modeloId" value={urnaData.modeloId} onChange={handleUrnaChange}>
                                    <option value="">Seleccione...</option>
                                    {modelos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                </Form.Select>
                            </Col>

                            <Col md={6}>
                                <Form.Label>Disponible</Form.Label>
                                <Form.Select name="disponible" value={urnaData.disponible} onChange={handleUrnaChange}>
                                    <option value="s">Sí</option>
                                    <option value="n">No</option>
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label>Estado</Form.Label>
                                <Form.Select name="estado" value={urnaData.estado} onChange={handleUrnaChange}>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </Form.Select>
                            </Col>

                            {/* Imágenes */}
                            <Col md={12} className="mt-4">
                                <Form.Label className="fw-bold">
                                    {isEditMode ? "Agregar Nuevas Imágenes (Opcional)" : "Imágenes del Producto"}
                                </Form.Label>
                                <Form.Control type="file" multiple accept="image/*" onChange={(e) => handleImagesChange(e.target.files)} />

                                {/* Grilla de previsualización */}
                                {imagenes.length > 0 && (
                                    <div className="mt-3 p-3 bg-light rounded border">
                                        <small className="text-muted mb-2 d-block">
                                            Haz clic en una imagen para marcarla como <strong>Principal</strong>.
                                        </small>
                                        <div className="d-flex flex-wrap gap-3">
                                            {imagenes.map((imgObj, index) => (
                                                <div
                                                    key={index}
                                                    className={`position-relative rounded overflow-hidden border ${imgObj.principal ? "border-warning border-3" : "border-secondary"}`}
                                                    style={{ width: 100, height: 100, cursor: "pointer" }}
                                                    onClick={() => {
                                                        const newImgs = imagenes.map((img, i) => ({ ...img, principal: i === index }));
                                                        setImagenes(newImgs);
                                                    }}
                                                >
                                                    <Image
                                                        src={URL.createObjectURL(imgObj.file)}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                    {imgObj.principal && (
                                                        <Badge bg="warning" text="dark" className="position-absolute top-0 start-0 m-1">Principal</Badge>
                                                    )}
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="position-absolute top-0 end-0 m-1 p-0 d-flex align-items-center justify-content-center"
                                                        style={{ width: 20, height: 20, borderRadius: '50%' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setImagenes(imagenes.filter((_, i) => i !== index));
                                                        }}
                                                    >
                                                        &times;
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </Form>
                )}

                {/* === PASO 2: INVENTARIO (Solo al crear) === */}
                {step === 2 && !isEditMode && (
                    <Form>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Cantidad Actual</Form.Label>
                                    <Form.Control type="number" name="cantidadActual" value={inventarioData.cantidadActual} onChange={handleInventarioChange} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Cantidad Mínima</Form.Label>
                                    <Form.Control type="number" name="cantidadMinima" value={inventarioData.cantidadMinima} onChange={handleInventarioChange} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Cantidad Máxima</Form.Label>
                                    <Form.Control type="number" name="cantidadMaxima" value={inventarioData.cantidadMaxima} onChange={handleInventarioChange} />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Ubicación Física (Bodega/Estante)</Form.Label>
                                    <Form.Control type="text" name="ubicacionFisica" value={inventarioData.ubicacionFisica} onChange={handleInventarioChange} placeholder="Ej: Pasillo 3, Estante B" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>

                {/* Botón Atrás solo en wizard */}
                {step === 2 && !isEditMode && (
                    <Button variant="outline-secondary" onClick={() => setStep(1)}>← Atrás</Button>
                )}

                {/* Botón de Acción Principal */}
                {isEditMode ? (
                    <Button variant="success" onClick={handleSubmitEdit} disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={step === 1 ? handleNext : handleSubmitCreate}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : (step === 1 ? "Siguiente →" : "Finalizar y Guardar")}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}