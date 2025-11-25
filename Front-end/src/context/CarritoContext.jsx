import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { carritoApi, catalogoApi } from "../services/api"; // 👈 IMPORTA catalogoApi TAMBIÉN

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
    const { usuario, isAuthenticated } = useContext(AuthContext);
    const [carrito, setCarrito] = useState([]);

    // 1. Cargar carrito inicial
    useEffect(() => {
        if (isAuthenticated && usuario) {
            cargarCarritoRemoto();
        } else {
            // Modo invitado: LocalStorage
            const carritoGuardado = localStorage.getItem("carrito");
            if (carritoGuardado) {
                setCarrito(JSON.parse(carritoGuardado));
            }
        }
    }, [isAuthenticated, usuario]);

    // 2. Guardar en LocalStorage solo si NO está logueado
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem("carrito", JSON.stringify(carrito));
        }
    }, [carrito, isAuthenticated]);

    // === FUNCIÓN CLAVE CORREGIDA ===
    const cargarCarritoRemoto = async () => {
        try {
            // A. Traemos los IDs y cantidades de la BD
            const res = await carritoApi.obtener(usuario.id);
            const itemsBackend = res.data.items || [];

            // B. Buscamos los detalles completos (precio, foto, nombre) en el Catálogo
            const promesasDeDetalles = itemsBackend.map(async (item) => {
                try {
                    // item.urnaId viene de tu Entity ItemCarrito
                    const respCatalogo = await catalogoApi.getUrnaById(item.urnaId);
                    const urnaCompleta = respCatalogo.data;

                    // C. Combinamos la info del producto con la cantidad que tenías guardada
                    return {
                        ...urnaCompleta,  // nombre, precio, imagenUrl...
                        cantidad: item.cantidad
                    };
                } catch (err) {
                    console.warn(`Producto ID ${item.urnaId} no encontrado en catálogo`, err);
                    return null; // Si se borró del catálogo, lo ignoramos
                }
            });

            // Esperamos a que todas las consultas terminen
            const carritoHidratado = (await Promise.all(promesasDeDetalles)).filter(i => i !== null);

            setCarrito(carritoHidratado);

        } catch (error) {
            console.error("Error sincronizando carrito remoto:", error);
        }
    };

    // === FUNCIONES DEL CARRITO ===

    const agregarAlCarrito = async (producto) => {
        // Optimista: Actualizamos UI inmediatamente
        setCarrito((prev) => {
            const existe = prev.find((item) => item.id === producto.id);
            if (existe) {
                return prev.map((item) =>
                    item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });

        // Sincronización silenciosa con BD
        if (isAuthenticated && usuario) {
            try {
                await carritoApi.agregar(usuario.id, producto.id, 1);
            } catch (error) {
                console.error("Error guardando en BD:", error);
                // Opcional: Revertir estado si falla
            }
        }
    };

    const eliminarDelCarrito = async (id) => {
        setCarrito((prev) => prev.filter((item) => item.id !== id));

        if (isAuthenticated && usuario) {
            try {
                await carritoApi.eliminar(usuario.id, id);
            } catch (error) {
                console.error("Error eliminando de BD:", error);
            }
        }
    };

    const vaciarCarrito = async () => {
        setCarrito([]);
        if (isAuthenticated && usuario) {
            try {
                await carritoApi.vaciar(usuario.id);
            } catch (error) {
                console.error("Error vaciando BD:", error);
            }
        } else {
            localStorage.removeItem("carrito");
        }
    };

    const total = carrito.reduce((acc, item) => acc + (item.precio || 0) * item.cantidad, 0);
    const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <CarritoContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                eliminarDelCarrito,
                vaciarCarrito,
                total,
                cantidadTotal,
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
};