import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Catalogo } from "./pages/Catalogo";
import { Nosotros } from "./pages/Nosotros";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./assets/styles/estilos.css";
import "./assets/styles/variables.css";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin.jsx";
import UrnasAdmin from "./pages/admin/UrnasAdmin.jsx";
import InventarioAdmin from "./pages/admin/InventarioAdmin.jsx";
import PedidosAdmin from "./pages/admin/PedidosAdmin.jsx";
import {Foro} from "./pages/Foro.jsx";
import { UserProfile } from "./pages/UserProfile";

function App() {
    return (
        <Router>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Catalogo />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/foro" element={<Foro />} />
                    <Route path="/login" element={<Login />} />

                    {/* Nueva Ruta de Perfil */}
                    <Route
                        path="/perfil"
                        element={
                            <ProtectedRoute>
                                <UserProfile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Rutas protegidas del administrador */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute roleRequired="Administrador">
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="usuarios" element={<UsuariosAdmin />} />
                        <Route path="urnas" element={<UrnasAdmin />} />
                        <Route path="inventario" element={<InventarioAdmin />} />
                        <Route path="pedidos" element={<PedidosAdmin />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;