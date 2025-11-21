import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { SidebarAdmin } from "../../components/admin/layout/SideBarAdmin";
import { HeaderAdmin } from "../../components/admin/layout/HeaderAdmin";
import "../../assets/styles/vistaAdmin.css";
import {useState} from "react";

export default function AdminLayout() {
    // Estado para controlar si el menú está colapsado o no
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => setCollapsed(!collapsed);

    return (
        <div className="admin-layout">
            {/* El Sidebar recibe el estado y la función de toggle */}
            <SidebarAdmin collapsed={collapsed} toggle={toggleSidebar} />

            {/* Contenedor principal (se ajusta automáticamente por flexbox) */}
            <div className="d-flex flex-column flex-grow-1 w-100" style={{ overflowX: "hidden" }}>
                <HeaderAdmin />

                <Container fluid className="p-4 flex-grow-1 bg-light">
                    <Outlet />
                </Container>
            </div>
        </div>
    );
}