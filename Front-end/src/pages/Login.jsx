import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, FloatingLabel, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/login.css";

export function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [credenciales, setCredenciales] = useState({ correo: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setCredenciales((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);
        try {
            await login(credenciales.correo.trim(), credenciales.password);
            navigate("/", { replace: true });
        } catch (err) {
            setErrorMsg(
                err?.response?.data?.message || "Correo o contraseña inválidos."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Izquierda: presentación - Mantenemos estructura para conservar tu CSS */}
            <div className="login-left">
                <div className="login-left-content">
                    <div className="brand-logo">
                        <i className="bi bi-dove"></i>
                    </div>
                    <h2 className="brand-name">Descansos del Recuerdo</h2>
                    <p className="brand-subtitle">
                        Urnas funerarias de la más alta calidad.
                        Un tributo eterno a quienes amamos.
                    </p>
                    <div className="decorative-line"></div>
                </div>
            </div>

            {/* Derecha: formulario */}
            <div className="login-right">
                <div className="login-header">
                    <h2 className="login-title">Bienvenido</h2>
                    <p className="login-subtitle">Inicia sesión para continuar</p>
                </div>

                <Form onSubmit={onSubmit}>
                    {/* Input Flotante Correo */}
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Correo electrónico"
                        className="mb-3"
                    >
                        <Form.Control
                            type="email"
                            name="correo"
                            placeholder="name@example.com"
                            value={credenciales.correo}
                            onChange={onChange}
                            required
                            disabled={loading}
                        />
                    </FloatingLabel>

                    {/* Input Flotante Contraseña */}
                    <FloatingLabel
                        controlId="floatingPassword"
                        label="Contraseña"
                        className="mb-3 password-field"
                    >
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={credenciales.password}
                            onChange={onChange}
                            required
                            disabled={loading}
                        />
                    </FloatingLabel>

                    {/* Alerta de Error */}
                    {errorMsg && (
                        <Alert variant="danger" className="mt-3 py-2">
                            {errorMsg}
                        </Alert>
                    )}

                    {/* Botón Submit */}
                    <Button
                        variant="primary" // Usa estilos base de Bootstrap
                        type="submit"
                        className="w-100 btn-login mt-2" // 'btn-login' mantiene tus estilos custom
                        disabled={loading}
                    >
                        {loading ? "Ingresando..." : "Iniciar Sesión"}
                    </Button>
                </Form>

                <div className="forgot-password">
                    <a href="#">¿Olvidaste tu contraseña?</a>
                </div>
            </div>
        </div>
    );
}