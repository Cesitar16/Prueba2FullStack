import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, FloatingLabel, Alert, Spinner } from "react-bootstrap";
import { usuariosApi } from "../services/api"; // Usamos tu servicio existente
import "../assets/styles/login.css"; // Reutilizamos estilos del login

export function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: "",
        correo: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        // 1. Validaciones básicas
        if (form.password !== form.confirmPassword) {
            return setErrorMsg("Las contraseñas no coinciden.");
        }
        if (form.password.length < 6) {
            return setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
        }

        try {
            setLoading(true);
            // 2. Llamada al Backend (usuariosApi ya apunta a /api/auth/register)
            // Enviamos rol 'Cliente' por defecto
            const payload = {
                nombre: form.nombre,
                correo: form.correo,
                password: form.password,
                rol: "Cliente",
                estado: "Activo"
            };

            await usuariosApi.create(payload);

            // 3. Éxito: Redirigir al Login
            alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
            navigate("/login");

        } catch (err) {
            console.error(err);
            // Manejo de errores del backend (ej: correo duplicado)
            const mensaje = err.response?.data?.message || "Error al registrar usuario. Intenta nuevamente.";
            setErrorMsg(mensaje);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* === IZQUIERDA: PRESENTACIÓN (Igual que Login) === */}
            <div className="login-left">
                <div className="login-left-content">
                    <div className="brand-logo">
                        <i className="bi bi-dove"></i>
                    </div>
                    <h2 className="brand-name">Únete a Nosotros</h2>
                    <p className="brand-subtitle">
                        Crea una cuenta para gestionar tus pedidos y honrar la memoria de tus seres queridos.
                    </p>
                    <div className="decorative-line"></div>
                </div>
            </div>

            {/* === DERECHA: FORMULARIO DE REGISTRO === */}
            <div className="login-right">
                <div className="login-header">
                    <h2 className="login-title">Crear Cuenta</h2>
                    <p className="login-subtitle">Completa tus datos para registrarte</p>
                </div>

                <Form onSubmit={handleSubmit}>
                    {/* Nombre Completo */}
                    <FloatingLabel controlId="floatingName" label="Nombre Completo" className="mb-3">
                        <Form.Control
                            type="text"
                            name="nombre"
                            placeholder="Juan Pérez"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    {/* Correo */}
                    <FloatingLabel controlId="floatingEmail" label="Correo Electrónico" className="mb-3">
                        <Form.Control
                            type="email"
                            name="correo"
                            placeholder="name@example.com"
                            value={form.correo}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    {/* Contraseña */}
                    <FloatingLabel controlId="floatingPassword" label="Contraseña" className="mb-3">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    {/* Confirmar Contraseña */}
                    <FloatingLabel controlId="floatingConfirm" label="Repetir Contraseña" className="mb-3">
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </FloatingLabel>

                    {errorMsg && (
                        <Alert variant="danger" className="py-2 small">
                            <i className="bi bi-exclamation-circle me-2"></i>{errorMsg}
                        </Alert>
                    )}

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 btn-login mt-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Registrando...
                            </>
                        ) : (
                            "Registrarse"
                        )}
                    </Button>
                </Form>

                <div className="forgot-password mt-4">
                    <span className="text-muted me-2">¿Ya tienes cuenta?</span>
                    <Link to="/login" className="fw-bold">Inicia Sesión aquí</Link>
                </div>
            </div>
        </div>
    );
}