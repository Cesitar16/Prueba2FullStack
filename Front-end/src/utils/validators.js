/**
 * validators.js
 * Funciones reutilizables para validar formularios y campos
 */

// 📧 Valida formato de correo electrónico
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

// 🔒 Valida longitud mínima de contraseña
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// 🔢 Valida si un valor es un número positivo
export const isPositiveNumber = (valor) => {
  return !isNaN(valor) && Number(valor) > 0;
};

// 🧾 Valida campos requeridos (no vacíos)
export const isRequired = (valor) => {
  return valor !== null && valor !== undefined && valor.toString().trim() !== "";
};

// 🧍‍♂️ Valida nombre (solo letras y espacios)
export const isValidName = (nombre) => {
  const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/;
  return regex.test(nombre.trim());
};

// 🏠 Valida dirección (mínimo 5 caracteres)
export const isValidAddress = (direccion) => {
  return direccion && direccion.trim().length >= 5;
};

// 📱 Valida número telefónico chileno básico
export const isValidPhone = (telefono) => {
  const regex = /^(\+?56)?(\s?9)[0-9]{8}$/;
  return regex.test(telefono.trim());
};

// 💲 Valida que un precio sea mayor a 0
export const isValidPrice = (precio) => {
  return !isNaN(precio) && Number(precio) > 0;
};

// 🔄 Valida stock no negativo
export const isValidStock = (stock) => {
  return !isNaN(stock) && Number(stock) >= 0;
};

// 🧩 Validación global de formulario (devuelve errores)
export const validateProductForm = (producto) => {
  const errores = {};
  if (!isRequired(producto.nombre)) errores.nombre = "El nombre es obligatorio.";
  if (!isValidPrice(producto.precio)) errores.precio = "El precio debe ser mayor a 0.";
  if (!isValidStock(producto.stock)) errores.stock = "El stock no puede ser negativo.";
  if (!producto.idMaterial) errores.idMaterial = "Selecciona un material.";
  if (!producto.idColor) errores.idColor = "Selecciona un color.";
  if (!producto.idModelo) errores.idModelo = "Selecciona un modelo.";
  return errores;
};
