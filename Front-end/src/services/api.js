import axios from "axios";

/* =========================================
   ⚙️ CONFIGURACIÓN BASE + ENV (Vite)
   ========================================= */
// Si no defines env, usa los puertos locales por defecto
const host = import.meta.env.VITE_API_HOST || "http://localhost";
const PORTS = {
  UBICACION: import.meta.env.VITE_PORT_UBICACION || 8001,
  CATALOGO: import.meta.env.VITE_PORT_CATALOGO || 8002,
  INVENTARIO: import.meta.env.VITE_PORT_INVENTARIO || 8003,
  USUARIOS: import.meta.env.VITE_PORT_USUARIOS || 8004,
  PEDIDOS: import.meta.env.VITE_PORT_PEDIDOS || 8005,
};

export const BASE = {
  UBICACION: `${host}:${PORTS.UBICACION}`,
  CATALOGO: `${host}:${PORTS.CATALOGO}`,
  INVENTARIO: `${host}:${PORTS.INVENTARIO}`,
  USUARIOS: `${host}:${PORTS.USUARIOS}`,
  PEDIDOS: `${host}:${PORTS.PEDIDOS}`,
};

/* =========================================
   🧰 AXIOS INSTANCE + INTERCEPTORES
   ========================================= */
export const api = axios.create({
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Permite setear/borrar token de forma centralizada
export function setAuthToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

// Agrega Authorization automáticamente si hay token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejo simple de errores y 401 -> logout suave
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      // redirección suave si estás fuera de /login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    // Opcional: mostrar toast/alert aquí
    return Promise.reject(error);
  }
);

/* =========================================
   🖼️ Helper para URLs de imagen del catálogo
   ========================================= */
export const buildImageUrl = (relativeOrAbsolute) => {
  if (!relativeOrAbsolute) return relativeOrAbsolute;
  if (/^https?:\/\//i.test(relativeOrAbsolute)) return relativeOrAbsolute;
  return `${BASE.CATALOGO}${relativeOrAbsolute}`;
};

/* =========================================
   🔁 Cache in-memory (listas estáticas)
   ========================================= */
const _cache = new Map();
const setCache = (k, v) => _cache.set(k, { v, t: Date.now() });
const getCache = (k, ttlMs = 5 * 60 * 1000) => {
  const it = _cache.get(k);
  if (!it) return null;
  if (Date.now() - it.t > ttlMs) return null;
  return it.v;
};

/* =========================================
   👤 USUARIOS / AUTH (8004)
   ========================================= */
export const usuariosApi = {
  getAll: () => api.get(`${BASE.USUARIOS}/api/usuarios`),
  getById: (id) => api.get(`${BASE.USUARIOS}/api/usuarios/${id}`),
  create: (data) => api.post(`${BASE.USUARIOS}/api/auth/register`, data),
  update: (id, data) => api.put(`${BASE.USUARIOS}/api/usuarios/${id}`, data),
  delete: (id) => api.delete(`${BASE.USUARIOS}/api/usuarios/${id}`),
  login: (credenciales) => api.post(`${BASE.USUARIOS}/api/auth/login`, credenciales),
  getProfile: () => api.get(`${BASE.USUARIOS}/api/auth/me`),
  getDireccionesByUsuario: (usuarioId) =>
    api.get(`http://localhost:${PORTS.USUARIOS}/api/direcciones/usuario/${usuarioId}`),

};

/* =========================================
   ⚰️ CATÁLOGO (8002)
   ========================================= */
export const catalogoApi = {
    // Lista completa
    getUrnas: () => api.get(`${BASE.CATALOGO}/api/urnas`),

    // Con filtros
    getUrnasFiltered: ({ nombre, codigo, materialId, min, max } = {}) => {
        const params = new URLSearchParams();
        if (nombre) params.append("nombre", nombre);
        if (codigo) params.append("codigo", codigo);
        if (materialId) params.append("materialId", materialId);
        if (min) params.append("min", min);
        if (max) params.append("max", max);

        return api.get(`${BASE.CATALOGO}/api/urnas`).then((r) => {
            let data = r.data || [];
            if (nombre) {
                const t = nombre.toLowerCase();
                data = data.filter((u) => u.nombre?.toLowerCase().includes(t));
            }
            if (codigo) {
                const t = codigo.toLowerCase();
                data = data.filter((u) => u.idInterno?.toLowerCase().includes(t));
            }
            if (materialId) data = data.filter((u) => String(u.material?.id) === String(materialId));
            if (min) data = data.filter((u) => Number(u.precio || 0) >= Number(min));
            if (max) data = data.filter((u) => Number(u.precio || 0) <= Number(max));
            return { data };
        });
    },

    getUrnaById: (id) => api.get(`${BASE.CATALOGO}/api/urnas/${id}`),
    createUrna: (data) => api.post(`${BASE.CATALOGO}/api/urnas`, data),

    // ✅ Cambiado de PUT → PATCH
    updateUrna: (id, data) => api.patch(`${BASE.CATALOGO}/api/urnas/${id}`, data),

    deleteUrna: (id) => api.delete(`${BASE.CATALOGO}/api/urnas/${id}`),

    getMateriales: async () => {
        const hit = getCache("materiales");
        if (hit) return { data: hit };
        const res = await api.get(`${BASE.CATALOGO}/api/materiales`);
        setCache("materiales", res.data);
        return res;
    },
    getColores: async () => {
        const hit = getCache("colores");
        if (hit) return { data: hit };
        const res = await api.get(`${BASE.CATALOGO}/api/colores`);
        setCache("colores", res.data);
        return res;
    },
    getModelos: async () => {
        const hit = getCache("modelos");
        if (hit) return { data: hit };
        const res = await api.get(`${BASE.CATALOGO}/api/modelos`);
        setCache("modelos", res.data);
        return res;
    },

    uploadImagen: (urnaId, archivo, principal = true) => {
        const formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("principal", principal);
        return api.post(`${BASE.CATALOGO}/api/imagenes/${urnaId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};;

/* =========================================
   📦 INVENTARIO (8003)
   ========================================= */
export const inventarioApi = {
  getAll: () => api.get(`${BASE.INVENTARIO}/api/inventario`),
  getByUrna: (urnaId) => api.get(`${BASE.INVENTARIO}/api/inventario/urna/${urnaId}`),
  ajustarStock: (urnaId, cantidad, motivo, usuario = "Sistema") =>
    api.patch(`${BASE.INVENTARIO}/api/inventario/ajustar/${urnaId}`, null, {
      params: { nuevaCantidad: cantidad, motivo, usuario },
    }),
  disminuirStock: (urnaId, cantidad, motivo, usuario = "Sistema") =>
    api.patch(`${BASE.INVENTARIO}/api/inventario/disminuir/${urnaId}`, null, {
      params: { cantidad, motivo, usuario },
    }),
  aumentarStock: (urnaId, cantidad, motivo, usuario = "Sistema") =>
    api.patch(`${BASE.INVENTARIO}/api/inventario/aumentar/${urnaId}`, null, {
      params: { cantidad, motivo, usuario },
    }),
};

/* =========================================
   🛒 PEDIDOS (8005)
   ========================================= */
export const pedidosApi = {
  createPedido: (data) => api.post(`${BASE.PEDIDOS}/api/pedidos`, data),
  getAll: () => api.get(`${BASE.PEDIDOS}/api/pedidos`),
  getByUsuario: (usuarioId) =>
    api.get(`${BASE.PEDIDOS}/api/pedidos/usuario/${usuarioId}`),
  updateEstado: (id, estadoId) =>
    api.put(`${BASE.PEDIDOS}/api/pedidos/${id}/estado/${estadoId}`),
  deletePedido: (id) => api.delete(`${BASE.PEDIDOS}/api/pedidos/${id}`),
};

/* =========================================
   🌎 UBICACIÓN (8001)
   ========================================= */
export const ubicacionApi = {
  getRegiones: () => api.get(`${BASE.UBICACION}/api/regiones`),
  getComunasByRegion: (regionId) =>
    api.get(`${BASE.UBICACION}/api/comunas/region/${regionId}`),
};
