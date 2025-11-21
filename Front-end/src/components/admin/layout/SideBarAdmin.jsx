import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import {
    FaUsers,
    FaBoxOpen,
    FaClipboardList,
    FaWarehouse,
    FaChartPie,
    FaBars,         // Icono hamburguesa
    FaChevronLeft   // Icono flecha
} from "react-icons/fa";
import "../../../assets/styles/vistaAdmin.css";
import "../../../assets/styles/admin.css";

export function SidebarAdmin({ collapsed, toggle }) {
    return (
        <aside className={`sidebar-admin-modern ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>

            {/* === HEADER DEL SIDEBAR === */}
            <div
                className="d-flex align-items-center p-3 mb-2"
                style={{
                    height: '70px',
                    justifyContent: collapsed ? 'center' : 'space-between'
                }}
            >
                {/* Logo texto (se oculta al colapsar) */}
                {!collapsed && (
                    <h4 className="text-warning mb-0 fw-bold text-truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Admin
                    </h4>
                )}

                {/* Botón Toggle */}
                <button
                    className="btn-toggle-sidebar"
                    onClick={toggle}
                    title={collapsed ? "Expandir menú" : "Colapsar menú"}
                >
                    {collapsed ? <FaBars /> : <FaChevronLeft size={20} />}
                </button>
            </div>

            {/* Línea separadora sutil */}
            <div className="px-3 mb-3">
                <hr className="border-secondary m-0" style={{ opacity: 0.3 }} />
            </div>

            {/* === NAV LINKS === */}
            <Nav className="flex-column px-2 gap-1 w-100" variant="pills">

                <Nav.Item>
                    <Nav.Link as={NavLink} to="/admin/dashboard" title="Dashboard">
                        <FaChartPie />
                        <span className="sidebar-link-text">Dashboard</span>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link as={NavLink} to="/admin/usuarios" title="Gestión de Usuarios">
                        <FaUsers />
                        <span className="sidebar-link-text">Usuarios</span>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link as={NavLink} to="/admin/urnas" title="Catálogo de Urnas">
                        <FaBoxOpen />
                        <span className="sidebar-link-text">Urnas</span>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link as={NavLink} to="/admin/inventario" title="Control de Stock">
                        <FaWarehouse />
                        <span className="sidebar-link-text">Inventario</span>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link as={NavLink} to="/admin/pedidos" title="Pedidos de Clientes">
                        <FaClipboardList />
                        <span className="sidebar-link-text">Pedidos</span>
                    </Nav.Link>
                </Nav.Item>

            </Nav>

            {/* === FOOTER DEL SIDEBAR === */}
            <div className="sidebar-footer">
                {!collapsed ? (
                    <>
                        <div className="fw-bold text-white">Descansos SPA</div>
                        <small>v1.0.0</small>
                    </>
                ) : (
                    <small>v1.0</small>
                )}
            </div>
        </aside>
    );
}