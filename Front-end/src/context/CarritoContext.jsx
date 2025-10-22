import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CarritoContext = createContext();

/**
 * CarritoContext.jsx
 * Estado global del carrito, persistencia y compra (Pedidos)
 */
export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  // 🔹 Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("carrito");
    if (saved) setCarrito(JSON.parse(saved));
  }, []);

  // 🔹 Guardar carrito cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    const nuevoTotal = carrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    setTotal(nuevoTotal);
  }, [carrito]);

  // 🔹 Agregar producto
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + producto.cantidad }
            : p
        );
      } else {
        return [...prev, producto];
      }
    });
  };

  // 🔹 Eliminar producto
  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  // 🔹 Vaciar carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // 🔹 Confirmar compra (enviar al backend de Pedidos)
  const confirmarCompra = async (cliente) => {
    if (carrito.length === 0) return alert("Tu carrito está vacío.");

    try {
      const pedido = {
        cliente,
        items: carrito.map((p) => ({
          productoId: p.id,
          nombre: p.nombre,
          cantidad: p.cantidad,
          precio: p.precio,
        })),
        total,
        fecha: new Date().toISOString(),
      };

      const res = await axios.post("http://localhost:8005/api/pedidos", pedido);
      if (res.status === 200 || res.status === 201) {
        alert("✅ Pedido registrado con éxito.");
        vaciarCarrito();
      }
    } catch (err) {
      console.error("Error al enviar pedido:", err);
      alert("Ocurrió un error al procesar tu compra.");
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        total,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        confirmarCompra,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
