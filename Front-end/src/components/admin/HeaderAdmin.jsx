import { AuthContext } from "../../context/AuthContext";

export function HeaderAdmin({ user }) {

    return (
        <header className="admin-header d-flex justify-content-between align-items-center p-3 shadow-sm">
            <h2>Bienvenido, {user?.nombre}</h2>
        </header>
    );
}