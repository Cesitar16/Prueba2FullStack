import { Outlet } from "react-router-dom";
import { SidebarAdmin } from "../../components/admin/SideBarAdmin";
import { HeaderAdmin } from "../../components/admin/HeaderAdmin";
import "../../assets/styles/vistaAdmin.css";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <SidebarAdmin />
            <div className="dashboard-container">
                <HeaderAdmin />
                {/* 👇 Aquí se montan las páginas hijas: dashboard, usuarios, urnas, etc. */}
                <Outlet />
            </div>
        </div>
    );
}