import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar as BSNavbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import "../../assets/styles/estilos.css";

/**
 * Navbar.jsx
 * Barra de navegación dinámica con detección de rol y sesión.
 */
export function Navbar() {
    const { usuario, logout, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <BSNavbar expand="lg" className="custom-navbar sticky-top" variant="dark">
            <Container>
                {/* LOGO - El color dorado se controla desde el CSS .custom-navbar .navbar-brand */}
                <BSNavbar.Brand as={Link} to="/">
                    🕊️ Descansos del Recuerdo
                </BSNavbar.Brand>

                <BSNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

                <BSNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto mb-2 mb-lg-0 align-items-center">
                        <Nav.Link as={Link} to="/catalogo">
                            Catálogo
                        </Nav.Link>

                        <Nav.Link as={Link} to="/nosotros">
                            Nosotros
                        </Nav.Link>

                        {/* 👑 Menú Admin (Visible solo para Administradores) */}
                        {isAuthenticated &&
                            usuario?.rol?.toLowerCase() === "administrador" && (
                                <NavDropdown
                                    title={
                                        <span className="text-warning fw-bold">
                                            <i className="bi bi-speedometer2 me-1"></i> Admin
                                        </span>
                                    }
                                    id="admin-nav-dropdown"
                                    menuVariant="dark" // Menú oscuro para combinar con el fondo
                                >
                                    <NavDropdown.Item as={Link} to="/admin/dashboard">📊 Dashboard</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/admin/urnas">⚰️ Urnas</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/admin/inventario">📦 Inventario</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/admin/usuarios">👤 Usuarios</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/admin/pedidos">🧾 Pedidos</NavDropdown.Item>
                                </NavDropdown>
                            )}
                    </Nav>

                    {/* SECCIÓN DERECHA: Usuario / Login */}
                    <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                        {isAuthenticated ? (
                            <>
                                <span className="text-white-50 fw-medium d-flex align-items-center gap-2">
                                    <i className="bi bi-person-circle fs-5"></i>
                                    {usuario?.nombre || "Usuario"}
                                </span>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="px-3 rounded-pill"
                                >
                                    Salir
                                </Button>
                            </>
                        ) : (
                            <Button
                                as={Link}
                                to="/login"
                                variant="outline-warning" // Botón Dorado (outline)
                                size="sm"
                                className="px-4 fw-semibold rounded-pill"
                            >
                                <i className="bi bi-person-fill me-1"></i> Acceder
                            </Button>
                        )}
                    </div>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
}