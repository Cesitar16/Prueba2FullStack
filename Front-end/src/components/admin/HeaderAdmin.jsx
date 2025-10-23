import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export function HeaderAdmin({ user }) {
    const { logout } = useContext(AuthContext);

    return (
        <header className="admin-header d-flex justify-content-between align-items-center p-3 shadow-sm">
            <h2>Bienvenido, {user?.nombre}</h2>
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                Cerrar sesión
            </button>
        </header>
    );
}