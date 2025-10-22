import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Catalogo } from "./pages/Catalogo";
import { Nosotros } from "./pages/Nosotros";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import "./assets/styles/estilos.css";
import "./assets/styles/variables.css";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin.jsx";
import UrnasAdmin from "./pages/admin/UrnasAdmin.jsx";
import InventarioAdmin from "./pages/admin/InventarioAdmin.jsx";
import PedidosAdmin from "./pages/admin/PedidosAdmin.jsx";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Catalogo />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/login" element={<Login />} />

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
        <Footer />
        <Toaster position="top-right" reverseOrder={false} />
    </Router>

  );
}

export default App;
