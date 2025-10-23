import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";

// 🧩 Bootstrap (debe ir antes que tus propios estilos)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// 🎨 Tus estilos personalizados (después de Bootstrap)
import "./index.css";
import "./assets/styles/estilos.css"; // 👈 sobrescribe los estilos de Bootstrap
import "./assets/styles/animate.css"; // 👈 opcional (animaciones globales)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </AuthProvider>
  </React.StrictMode>
);
