import { Link, NavLink } from "react-router-dom";
import "../assets/styles/estilos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        {/* Marca / Logo */}
        <Link className="navbar-brand" to="/">
          Descansos Del Recuerdo
        </Link>

        {/* Botón Hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido del Navbar */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Catálogo
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotros">
                Nosotros
              </NavLink>
            </li>
          </ul>

          {/* Botones de acción */}
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex">
              <NavLink to="/login" className="btn btn-outline-primary me-2">
                Loguearse
              </NavLink>
              <button className="btn btn-primary" disabled>
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
