import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Form, Button, FloatingLabel, Alert, Spinner } from "react-bootstrap";
import { usuariosApi } from "../services/api";
import "../assets/styles/login.css"; // Reutilizamos diseño

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Capturamos el token de la URL
    const token = searchParams.get("token");

    const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", msg: "" });

    useEffect(() => {
        if (!token) {
            setStatus({ type: "danger", msg: "Token no válido o faltante. Por favor solicita un nuevo enlace." });
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "", msg: "" });

        if (passwords.newPass !== passwords.confirmPass) {
            return setStatus({ type: "danger", msg: "Las contraseñas no coinciden." });
        }
        if (passwords.newPass.length < 6) {
            return setStatus({ type: "danger", msg: "La contraseña debe tener al menos 6 caracteres." });
        }

        try {
            setLoading(true);
            // Llamada al backend con el token y la nueva clave
            await usuariosApi.confirmPasswordReset(token, passwords.newPass);

            setStatus({ type: "success", msg: "¡Contraseña actualizada exitosamente!" });

            // Redirigir al login después de 2 segundos
            setTimeout(() => navigate("/login"), 3000);

        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || "El enlace ha expirado o es inválido.";
            setStatus({ type: "danger", msg: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* IZQUIERDA */}
            <div className="login-left">
                <div className="login-left-content">
                    <div className="brand-logo">
                        <i className="bi bi-key-fill"></i>
                    </div>
                    <h2 className="brand-name">Nueva Contraseña</h2>
                    <p className="brand-subtitle">
                        Crea una nueva contraseña segura para proteger tu cuenta.
                    </p>
                    <div className="decorative-line"></div>
                </div>
            </div>

            {/* DERECHA */}
            <div className="login-right">
                <div className="login-header">
                    <h2 className="login-title">Restablecer Clave</h2>
                    <p className="login-subtitle">Ingresa tu nueva contraseña</p>
                </div>

                {/* Mensajes de Estado */}
                {status.msg && (
                    <Alert variant={status.type} className="border-0 shadow-sm text-center">
                        {status.type === "success" ? (
                            <i className="bi bi-check-circle-fill me-2"></i>
                        ) : (
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        )}
                        {status.msg}
                        {status.type === "success" && <div className="mt-2 small">Redirigiendo al login...</div>}
                    </Alert>
                )}

                {/* Formulario (Solo visible si hay token y no hay éxito aún) */}
                {token && status.type !== "success" && (
                    <Form onSubmit={handleSubmit}>
                        <FloatingLabel controlId="newPass" label="Nueva Contraseña" className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={passwords.newPass}
                                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </FloatingLabel>

                        <FloatingLabel controlId="confirmPass" label="Confirmar Contraseña" className="mb-4">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={passwords.confirmPass}
                                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </FloatingLabel>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 btn-login"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Actualizando...
                                </>
                            ) : (
                                "Cambiar Contraseña"
                            )}
                        </Button>
                    </Form>
                )}

                <div className="text-center mt-4">
                    <Link to="/login" className="text-muted text-decoration-none small">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}