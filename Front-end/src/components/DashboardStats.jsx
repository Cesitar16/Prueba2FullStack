import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/vistaAdmin.css";

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalUrnas: 0,
    urnasDisponibles: 0,
    stockBajo: 0,
    valorInventario: 0,
    totalUsuarios: 0,
    totalPedidos: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [urnasRes, inventarioRes, usuariosRes, pedidosRes] =
          await Promise.all([
            axios.get("http://localhost:8002/api/urnas"),
            axios.get("http://localhost:8003/api/inventario"),
            axios.get("http://localhost:8004/api/usuarios"),
            axios.get("http://localhost:8005/api/pedidos"),
          ]);

        const urnas = urnasRes.data;
        const inventario = inventarioRes.data;
        const usuarios = usuariosRes.data;
        const pedidos = pedidosRes.data;

        const totalUrnas = urnas.length;
        const urnasDisponibles = inventario.filter(
          (i) => i.estado === "Activo" || i.disponible === "s"
        ).length;
        const stockBajo = inventario.filter((i) => i.cantidadActual < 5).length;
        const valorInventario = inventario.reduce(
          (sum, i) => sum + (i.cantidadActual * (i.precio || 0)),
          0
        );

        setStats({
          totalUrnas,
          urnasDisponibles,
          stockBajo,
          valorInventario,
          totalUsuarios: usuarios.length,
          totalPedidos: pedidos.length,
        });
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="stats-cards mt-4">
      <div className="stat-card">
        <div className="icon">
          <i className="bi bi-box-seam"></i>
        </div>
        <h3>{stats.totalUrnas}</h3>
        <p>Total de Urnas Registradas</p>
      </div>

      <div className="stat-card">
        <div className="icon">
          <i className="bi bi-check-circle"></i>
        </div>
        <h3>{stats.urnasDisponibles}</h3>
        <p>Urnas Disponibles</p>
      </div>

      <div className="stat-card">
        <div className="icon">
          <i className="bi bi-exclamation-triangle text-warning"></i>
        </div>
        <h3>{stats.stockBajo}</h3>
        <p>Stock Bajo (&lt; 5 unidades)</p>
      </div>

      <div className="stat-card">
        <div className="icon">
          <i className="bi bi-currency-dollar text-success"></i>
        </div>
        <h3>${stats.valorInventario.toLocaleString("es-CL")}</h3>
        <p>Valor Total del Inventario</p>
      </div>

      <div className="stat-card">
        <div className="icon">
          <i className="bi bi-people"></i>
        </div>
        <h3>{stats.totalUsuarios}</h3>
        <p>Usuarios Registrados</p>
      </div>

      <div className="stat-card">
        <div className="icon">
          <i className="bi bi-receipt"></i>
        </div>
        <h3>{stats.totalPedidos}</h3>
        <p>Pedidos Totales</p>
      </div>
    </div>
  );
}
