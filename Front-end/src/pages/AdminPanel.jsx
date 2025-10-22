import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { DashboardStats } from "../components/DashboardStats";
import { ProductTable } from "../components/ProductTable";
import { UserTable } from "../components/UserTable";
import "../assets/styles/vistaAdmin.css";

/**
 * AdminPanel.jsx
 * Vista principal del administrador con Dashboard, Productos y Usuarios
 */
export function AdminPanel() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container py-5">
      <header className="text-center mb-4">
        <h2 className="titulo-seccion">Panel de Administración</h2>
        <p className="text-muted">
          Bienvenido, <strong>{user?.nombre}</strong> ({user?.rol})
        </p>
      </header>

      {/* 📊 Dashboard de estadísticas */}
      <section className="mb-5">
        <DashboardStats />
      </section>

      {/* ⚰️ Gestión de productos (Urnas) */}
      <section className="mb-5">
        <ProductTable />
      </section>

      {/* 👥 Gestión de usuarios */}
      <section className="mb-5">
        <UserTable />
      </section>
    </div>
  );
}
