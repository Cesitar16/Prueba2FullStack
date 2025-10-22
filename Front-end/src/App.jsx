import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Catalogo } from "./pages/Catalogo";
import { Nosotros } from "./pages/Nosotros";
import { Login } from "./pages/Login";
import { Checkout } from "./pages/Checkout";
import { AdminPanel } from "./pages/AdminPanel";
import { Usuarios } from "./pages/Usuarios";
import { NotFound } from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import "./assets/styles/estilos.css"; // Importa tus estilos globales
import "./assets/styles/variables.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
