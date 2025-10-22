import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SidebarAdmin } from "../../components/admin/SidebarAdmin";
import { HeaderAdmin } from "../../components/admin/HeaderAdmin";
import "../../assets/styles/vistaAdmin.css";

export default function AdminLayout() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p className="text-center mt-5">Cargando sesión...</p>;
    if (!user || user.rol !== "Administrador") return <Navigate to="/" replace />;

    return (
        <div className="admin-layout d-flex">
            <SidebarAdmin />
            <div className="content flex-grow-1">
                <HeaderAdmin user={user} />
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}