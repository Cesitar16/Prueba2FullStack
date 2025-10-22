/**
 * formatters.js
 * Utilidades para dar formato a valores visuales
 */

// 💲 Formatea un número como precio en CLP (con separadores)
export const formatCurrency = (valor) => {
  if (isNaN(valor)) return "$0";
  return `$${Number(valor).toLocaleString("es-CL")}`;
};

// 📅 Formatea fechas a formato legible (dd/mm/yyyy)
export const formatDate = (fecha) => {
  if (!fecha) return "-";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// 🔡 Capitaliza la primera letra de un texto
export const capitalize = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

// 🟢 Retorna una clase CSS para estados (activo/inactivo)
export const getStatusBadgeClass = (estado) => {
  if (!estado) return "badge bg-secondary";
  const normalized = estado.toLowerCase();
  if (normalized === "activo") return "badge bg-success";
  if (normalized === "inactivo") return "badge bg-secondary";
  return "badge bg-warning text-dark";
};

// 🕒 Convierte timestamps ISO a texto amigable
export const formatDateTime = (fechaIso) => {
  if (!fechaIso) return "";
  const fecha = new Date(fechaIso);
  return `${fecha.toLocaleDateString("es-CL")} ${fecha.toLocaleTimeString(
    "es-CL",
    { hour: "2-digit", minute: "2-digit" }
  )}`;
};

// 🧮 Calcula subtotal de un producto
export const calcularSubtotal = (precio, cantidad) => {
  if (isNaN(precio) || isNaN(cantidad)) return 0;
  return precio * cantidad;
};

// 📦 Devuelve texto según stock
export const formatStockLabel = (stock) => {
  if (stock === 0) return "Sin stock";
  if (stock < 5) return `Bajo (${stock})`;
  return `Stock: ${stock}`;
};
