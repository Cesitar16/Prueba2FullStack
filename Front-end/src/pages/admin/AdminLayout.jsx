import { Outlet } from "react-router-dom";
import { SidebarAdmin } from "../../components/admin/layout/SideBarAdmin";
import { HeaderAdmin } from "../../components/admin/layout/HeaderAdmin";
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