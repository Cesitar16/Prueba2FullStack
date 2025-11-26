import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, FloatingLabel, Alert, Spinner } from "react-bootstrap";
import { usuariosApi } from "../services/api";
import "../assets/styles/login.css"; // Reutilizamos el diseño existente

export function ForgotPassword() {
    const [correo, setCorreo] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // Para mensaje de éxito
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setMessage(null);

        if (!correo) return setErrorMsg("Por favor ingresa tu correo.");

        try {
            setLoading(true);
            // Llamada al backend
            await usuariosApi.requestPasswordReset(correo);

            // Mensaje de éxito
            setMessage("Si el correo existe, recibirás instrucciones para restablecer tu contraseña.");
        } catch (err) {
            console.error(err);
            // Por seguridad, a veces es mejor mostrar el mismo mensaje de éxito
            // pero para desarrollo mostraremos el error si falla la conexión.
            setErrorMsg("Hubo un problema al procesar la solicitud. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* === IZQUIERDA: IMAGEN === */}
            <div className="login-left">
                <div className="login-left-content">
                    <div className="brand-logo">
                        <i className="bi bi-shield-lock"></i>
                    </div>
                    <h2 className="brand-name">Recuperar Acceso</h2>
                    <p className="brand-subtitle">
                        No te preocupes, te ayudaremos a recuperar tu contraseña para que puedas volver a ingresar.
                    </p>
                    <div className="decorative-line"></div>
                </div>
            </div>

            {/* === DERECHA: FORMULARIO === */}
            <div className="login-right">
                <div className="login-header">
                    <h2 className="login-title">¿Olvidaste tu contraseña?</h2>
                    <p className="login-subtitle">Ingresa tu correo electrónico asociado</p>
                </div>

                {/* Mensaje de Éxito */}
                {message ? (
                    <Alert variant="success" className="text-center border-0 shadow-sm">
                        <i className="bi bi-check-circle-fill fs-1 d-block mb-2 text-success"></i>
                        <h6 className="fw-bold">¡Solicitud Recibida!</h6>
                        <p className="small mb-0">{message}</p>
                        <div className="mt-4">
                            <Link to="/login" className="btn btn-outline-success w-100">
                                Volver al Login
                            </Link>
                        </div>
                    </Alert>
                ) : (
                    /* Formulario */
                    <Form onSubmit={handleSubmit}>
                        <FloatingLabel controlId="floatingEmail" label="Correo Electrónico" className="mb-4">
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </FloatingLabel>

                        {errorMsg && (
                            <Alert variant="danger" className="py-2 small">
                                <i className="bi bi-exclamation-triangle me-2"></i>{errorMsg}
                            </Alert>
                        )}

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 btn-login"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Enviando...
                                </>
                            ) : (
                                "Enviar instrucciones"
                            )}
                        </Button>

                        <div className="text-center mt-4">
                            <Link to="/login" className="text-muted text-decoration-none small">
                                <i className="bi bi-arrow-left me-1"></i> Volver al inicio de sesión
                            </Link>
                        </div>
                    </Form>
                )}
            </div>
        </div>
    );
}