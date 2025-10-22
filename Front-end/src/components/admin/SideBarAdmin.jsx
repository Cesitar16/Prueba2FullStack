import { NavLink } from "react-router-dom";
import { FaUsers, FaBoxOpen, FaClipboardList, FaWarehouse, FaChartPie } from "react-icons/fa";
import "../../assets/styles/admin.css";

export function SidebarAdmin() {
    return (
        <aside className="sidebar-admin">
            <h3 className="logo">Admin Panel</h3>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/admin/dashboard" className="nav-item">
                            <FaChartPie /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/usuarios" className="nav-item">
                            <FaUsers /> Usuarios
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/urnas" className="nav-item">
                            <FaBoxOpen /> Urnas / Productos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/inventario" className="nav-item">
                            <FaWarehouse /> Inventario
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/pedidos" className="nav-item">
                            <FaClipboardList /> Pedidos
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}