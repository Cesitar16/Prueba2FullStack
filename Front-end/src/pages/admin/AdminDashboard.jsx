import { useEffect, useState } from "react";
import { api, BASE } from "../../services/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        usuarios: 0,
        urnas: 0,
        inventario: 0,
        pedidos: 0,
    });

    useEffect(() => {
        async function loadStats() {
            try {
                const [usuarios, urnas, inventario, pedidos] = await Promise.all([
                    api.get(`${BASE.USUARIOS}/api/usuarios`),
                    api.get(`${BASE.CATALOGO}/api/urnas`),
                    api.get(`${BASE.INVENTARIO}/api/inventario`),
                    api.get(`${BASE.PEDIDOS}/api/pedidos`),
                ]);
                setStats({
                    usuarios: usuarios.data.length,
                    urnas: urnas.data.length,
                    inventario: inventario.data.length,
                    pedidos: pedidos.data.length,
                });
            } catch (err) {
                console.error("Error al cargar estadísticas", err);
            }
        }
        loadStats();
    }, []);

    return (
        <div className="dashboard-cards d-flex flex-wrap gap-4">
            <div className="card stat-card">
                <h4>Usuarios</h4>
                <p>{stats.usuarios}</p>
            </div>
            <div className="card stat-card">
                <h4>Urnas</h4>
                <p>{stats.urnas}</p>
            </div>
            <div className="card stat-card">
                <h4>Inventario</h4>
                <p>{stats.inventario}</p>
            </div>
            <div className="card stat-card">
                <h4>Pedidos</h4>
                <p>{stats.pedidos}</p>
            </div>
        </div>
    );
}