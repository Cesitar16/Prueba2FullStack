import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../assets/styles/estilos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export function Navbar() {
    const { user, isLoggedIn, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Descansos Del Recuerdo
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarMain"
                    aria-controls="navbarMain"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon">≡</span>
                </button>

                <div className="collapse navbar-collapse" id="navbarMain">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Catálogo</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/nosotros" className="nav-link">Nosotros</NavLink>
                        </li>
                        {isLoggedIn && user?.rol === "Administrador" && (
                            <li className="nav-item">
                                <NavLink to="/admin" className="nav-link">Admin</NavLink>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center gap-2">
                        {isLoggedIn ? (
                            <>
                <span className="me-2">
                  Hola, <strong>{user?.nombre || user?.correo}</strong>{" "}
                    <small className="text-muted">({user?.rol})</small>
                </span>
                                <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                                    Salir
                                </button>
                            </>
                        ) : (
                            <NavLink to="/login" className="btn btn-outline-primary">
                                Loguearse
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
