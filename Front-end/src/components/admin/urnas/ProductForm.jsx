import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import "../../../assets/styles/vistaAdmin.css";

export function ProductForm({ productoEdit, onSave }) {
    const [producto, setProducto] = useState({
        idInterno: "",
        nombre: "",
        descripcionCorta: "",
        descripcionDetallada: "",
        precio: "",
        stock: "",
        idMaterial: "",
        idColor: "",
        idModelo: "",
        estado: "Activo",
    });

    const [imagen, setImagen] = useState(null);
    const [materiales, setMateriales] = useState([]);
    const [colores, setColores] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Cargar listas desde el backend
        const fetchData = async () => {
            try {
                const [mat, col, mod] = await Promise.all([
                    axios.get("http://localhost:8002/api/materiales"),
                    axios.get("http://localhost:8002/api/colores"),
                    axios.get("http://localhost:8002/api/modelos"),
                ]);
                setMateriales(mat.data);
                setColores(col.data);
                setModelos(mod.data);
            } catch (error) {
                console.error("Error al cargar catálogos:", error);
            }
        };
        fetchData();

        if (productoEdit) setProducto(productoEdit);
    }, [productoEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!producto.nombre || !producto.precio || !producto.stock) {
            return alert("Por favor completa los campos requeridos.");
        }

        try {
            setLoading(true);
            let response;

            // 1️⃣ Crear o actualizar urna
            if (producto.id) {
                response = await axios.put(
                    `http://localhost:8002/api/urnas/${producto.id}`,
                    producto
                );
            } else {
                response = await axios.post("http://localhost:8002/api/urnas", producto);
            }

            const urnaId = response.data.id || producto.id;

            // 2️⃣ Si hay imagen, subirla
            if (imagen) {
                const formData = new FormData();
                formData.append("archivo", imagen);
                formData.append("principal", true);

                await axios.post(
                    `http://localhost:8002/api/imagenes/${urnaId}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            }

            alert("✅ Producto guardado correctamente.");

            // Resetear formulario
            setProducto({
                idInterno: "",
                nombre: "",
                descripcionCorta: "",
                descripcionDetallada: "",
                precio: "",
                stock: "",
                idMaterial: "",
                idColor: "",
                idModelo: "",
                estado: "Activo",
            });
            setImagen(null);
            onSave?.();
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert("Ocurrió un error al guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 rounded shadow-sm bg-light">
            <h5 className="mb-3 text-dark fw-bold">
                {producto.id ? "Editar Urna" : "Registrar Nueva Urna"}
            </h5>

            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Row className="g-3">
                    {/* Nombre */}
                    <Col md={6}>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre *</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={producto.nombre}
                                onChange={handleChange}
                                placeholder="Nombre de la urna"
                                required
                            />
                        </Form.Group>
                    </Col>

                    {/* ID Interno */}
                    <Col md={6}>
                        <Form.Group controlId="formIdInterno">
                            <Form.Label>ID Interno</Form.Label>
                            <Form.Control
                                type="text"
                                name="idInterno"
                                value={producto.idInterno}
                                onChange={handleChange}
                                placeholder="Código interno (opcional)"
                            />
                        </Form.Group>
                    </Col>

                    {/* Descripción Corta */}
                    <Col md={12}>
                        <Form.Group controlId="formDescCorta">
                            <Form.Label>Descripción Corta</Form.Label>
                            <Form.Control
                                type="text"
                                name="descripcionCorta"
                                value={producto.descripcionCorta}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    {/* Descripción Detallada */}
                    <Col md={12}>
                        <Form.Group controlId="formDescDetallada">
                            <Form.Label>Descripción Detallada</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="descripcionDetallada"
                                value={producto.descripcionDetallada}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    {/* Precio */}
                    <Col md={4}>
                        <Form.Group controlId="formPrecio">
                            <Form.Label>Precio *</Form.Label>
                            <Form.Control
                                type="number"
                                name="precio"
                                value={producto.precio}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    {/* Stock */}
                    <Col md={4}>
                        <Form.Group controlId="formStock">
                            <Form.Label>Stock *</Form.Label>
                            <Form.Control
                                type="number"
                                name="stock"
                                value={producto.stock}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    {/* Estado */}
                    <Col md={4}>
                        <Form.Group controlId="formEstado">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select
                                name="estado"
                                value={producto.estado}
                                onChange={handleChange}
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Material */}
                    <Col md={4}>
                        <Form.Group controlId="formMaterial">
                            <Form.Label>Material</Form.Label>
                            <Form.Select
                                name="idMaterial"
                                value={producto.idMaterial}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar...</option>
                                {materiales.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Color */}
                    <Col md={4}>
                        <Form.Group controlId="formColor">
                            <Form.Label>Color</Form.Label>
                            <Form.Select
                                name="idColor"
                                value={producto.idColor}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar...</option>
                                {colores.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Modelo */}
                    <Col md={4}>
                        <Form.Group controlId="formModelo">
                            <Form.Label>Modelo</Form.Label>
                            <Form.Select
                                name="idModelo"
                                value={producto.idModelo}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar...</option>
                                {modelos.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Imagen Principal */}
                    <Col md={12}>
                        <Form.Group controlId="formImagen">
                            <Form.Label>Imagen Principal</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImagen(e.target.files[0])}
                            />
                        </Form.Group>
                    </Col>

                    {/* Botón Guardar */}
                    <Col xs={12} className="text-end mt-3">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Producto"
                            )}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}