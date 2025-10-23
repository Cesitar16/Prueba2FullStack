import { useContext } from "react";
import {Link, NavLink, useNavigate} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/estilos.css";

/**
 * Navbar.jsx
 * Barra de navegación dinámica con detección de rol y sesión.
 */
export function Navbar() {
  const { usuario, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige al inicio después de cerrar sesión
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm sticky-top custom-navbar">
      <div className="container">
        {/* LOGO / NOMBRE */}
        <Link className="navbar-brand fw-bold text-light" to="/">
          🕊️ Descansos del Recuerdo
        </Link>

        {/* BOTÓN RESPONSIVE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CONTENIDO */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* LINKS IZQUIERDA */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/catalogo">
                Catálogo
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-light" to="/nosotros">
                Nosotros
              </Link>
            </li>

            {/* 👑 Solo visible si el usuario es Administrador */}
              {isAuthenticated && usuario?.rol?.toLowerCase() === "administrador" && (
                  <li className="nav-item dropdown">
                      <a
                          className="nav-link dropdown-toggle fw-semibold"
                          href="#"
                          id="navbarAdminDropdown"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                      >
                          🛠 Vista Admin
                      </a>
                      <ul className="dropdown-menu animate__animated animate__fadeInUp" aria-labelledby="navbarAdminDropdown">
                          <li>
                              <NavLink className="dropdown-item" to="/admin/dashboard">
                                  📊 Dashboard
                              </NavLink>
                          </li>
                          <li>
                              <NavLink className="dropdown-item" to="/admin/usuarios">
                                  👥 Gestión de Usuarios
                              </NavLink>
                          </li>
                          <li>
                              <NavLink className="dropdown-item" to="/admin/urnas">
                                  ⚱️ Gestión de Urnas
                              </NavLink>
                          </li>
                          <li>
                              <NavLink className="dropdown-item" to="/admin/inventario">
                                  📦 Inventario
                              </NavLink>
                          </li>
                          <li>
                              <NavLink className="dropdown-item" to="/admin/pedidos">
                                  🧾 Pedidos
                              </NavLink>
                          </li>
                      </ul>
                  </li>
              )}
          </ul>

          {/* SECCIÓN DERECHA */}
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <>
                <span className="me-3 text-light fw-semibold">
                  <i className="bi bi-person-circle me-1"></i>
                  {usuario?.nombre || usuario?.correo || "Usuario"}
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Loguearse
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
