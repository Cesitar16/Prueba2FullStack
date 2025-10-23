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
            {[
                { label: "Usuarios", value: stats.usuarios, icon: "👤", color: "#6f42c1" },
                { label: "Urnas", value: stats.urnas, icon: "⚱️", color: "#0d6efd" },
                { label: "Inventario", value: stats.inventario, icon: "📦", color: "#198754" },
                { label: "Pedidos", value: stats.pedidos, icon: "🧾", color: "#ffc107" },
            ].map((card, i) => (
                <div key={i} className="stat-card-modern" style={{ "--card-color": card.color }}>
                    <span className="emoji">{card.icon}</span>
                    <h4>{card.label}</h4>
                    <p>{card.value}</p>
                </div>
            ))}
        </div>
    );
}