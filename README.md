
<h1 align="center">🕊️ Descansos del Recuerdo SPA</h1>
<h3 align="center">Sistema de Gestión y Catálogo de Urnas Funerarias</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2018-61DBFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot%203.3.4-6DB33F?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/Database-MySQL%208-4479A1?style=for-the-badge&logo=mysql" />
  <img src="https://img.shields.io/badge/Build-Vite%20%2B%20Maven-orange?style=for-the-badge" />
</p>

<p align="center">
  <b>Proyecto FullStack desarrollado en React + Spring Boot con arquitectura de microservicios</b>
</p>

---

## 🧾 Descripción del proyecto

**Descansos del Recuerdo SPA** es un sistema web para la **gestión integral de urnas funerarias**, permitiendo la administración de productos, inventario, usuarios y pedidos dentro de una plataforma moderna, rápida y responsiva.

El proyecto busca ofrecer una **experiencia profesional y respetuosa**, combinando un catálogo público con filtros dinámicos y un **panel administrativo protegido con JWT**.

---

## 🖼️ Vistas principales

| 🏛️ Catálogo de Urnas | 🔐 Panel de Administración |
|----------------------|----------------------------|
| <img src="https://i.imgur.com/8sP7RQO.png" width="500"/> | <img src="https://i.imgur.com/dSWmRqv.png" width="500"/> |

---

## ⚙️ Tecnologías utilizadas

<details>
<summary>🖥️ <b>Frontend</b></summary>

- ⚛️ **React 18** – Componentes funcionales y Hooks  
- ⚡ **Vite** – Empaquetado rápido para desarrollo moderno  
- 🎨 **Bootstrap 5** + Bootstrap Icons – Diseño responsivo y elegante  
- 🧠 **Context API** – Manejo global de sesión y carrito  
- 🔗 **Axios** – Consumo de APIs REST  
- 🧾 **React Router DOM** – Navegación y rutas protegidas  
</details>

<details>
<summary>☕ <b>Backend (Spring Boot)</b></summary>

- 🌱 **Spring Boot 3.3.4** – Framework principal  
- 🔐 **Spring Security + JWT** – Autenticación segura  
- 🗂️ **Spring Data JPA (Hibernate)** – ORM y persistencia  
- 🔁 **WebClient** – Comunicación entre microservicios  
- 💾 **MySQL** – Base de datos relacional  
- 📄 **Swagger** – Documentación interactiva  
</details>

<details>
<summary>🧩 <b>Arquitectura</b></summary>

- 🧱 Arquitectura de **microservicios** (por dominio)  
- ⚙️ API Gateway para enrutamiento centralizado  
- 🔄 Comunicación interna con WebClient  
- 🧾 Entidades y DTOs independientes  
</details>

---

## 🧩 Estructura del proyecto

```

frontend-web-prueba2-fullstack/
│
├── src/
│   ├── assets/
│   │   ├── img/ (imágenes fijas del frontend: logo, placeholder, íconos)
│   │   └── styles/ (estilos.css, login.css, variables.css, vistaAdmin.css)
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── UrnaCard.jsx
│   │   ├── UrnaModal.jsx
│   │   ├── CarritoModal.jsx
│   │   ├── FloatingCartButton.jsx
│   │   ├── DashboardStats.jsx
│   │   ├── ProductForm.jsx
│   │   ├── UserForm.jsx
│   │   ├── AlertBadge.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CarritoContext.jsx
│   ├── pages/
│   │   ├── Catalogo.jsx
│   │   ├── Nosotros.jsx
│   │   ├── Login.jsx
│   │   ├── Checkout.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── Usuarios.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
└── public/
└── index.html

````

---

## 💻 Instalación y ejecución

### 🧱 1. Clonar el repositorio
```bash
git clone https://github.com/<tu-usuario>/descansos-del-recuerdo-spa.git
cd descansos-del-recuerdo-spa/frontend-web-prueba2-fullstack
````

### 📦 2. Instalar dependencias del frontend

```bash
npm install
```

### ⚙️ 3. Configurar variables de entorno (opcional)

Crea un archivo **.env** en la raíz del proyecto con tus puertos locales:

```bash
VITE_API_HOST=http://localhost
VITE_PORT_UBICACION=8001
VITE_PORT_CATALOGO=8002
VITE_PORT_INVENTARIO=8003
VITE_PORT_USUARIOS=8004
VITE_PORT_PEDIDOS=8005
```

### 🧩 4. Levantar los microservicios (Spring Boot)

Cada módulo del backend corre de manera independiente:

| Servicio          | Puerto | Descripción                                    |
| ----------------- | ------ | ---------------------------------------------- |
| 🌎 **Ubicación**  | 8001   | Regiones y comunas                             |
| 🪶 **Catálogo**   | 8002   | Urnas, materiales, modelos, colores e imágenes |
| 📦 **Inventario** | 8003   | Control de stock y movimientos                 |
| 👤 **Usuarios**   | 8004   | Autenticación, roles y JWT                     |
| 🧾 **Pedidos**    | 8005   | Gestión de pedidos y estados                   |

Ejemplo:

```bash
cd backend/catalogo_api_descansosdelrecuerdo
mvn spring-boot:run
```

### 🚀 5. Ejecutar el frontend

```bash
npm run dev
```

📍 Accede en el navegador a:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🔐 Credenciales de prueba

| Rol                     | Correo                                                    | Contraseña |
| ----------------------- | --------------------------------------------------------- | ---------- |
| 🧑‍💼 **Administrador** | [admin@descansosspa.cl](mailto:admin@descansosspa.cl)     | admin123   |
| 👤 **Cliente**          | [cliente@descansosspa.cl](mailto:cliente@descansosspa.cl) | cliente123 |

---

## 🧭 Funcionalidades principales

✅ **Catálogo público de urnas**

* Filtrado dinámico por nombre, código, material o rango de precio.
* Visualización en tarjetas con imagen, modelo, color, stock y **código interno (idInterno)**.
* Detalle en modal con galería de imágenes (placeholder en caso de error).
* Botón de “Agregar al carrito” con control de stock.

✅ **Carrito de compras funcional**

* Manejo global con **Context API**.
* Vista flotante con lista de urnas agregadas.
* Control de cantidades, subtotal y limpieza de carrito.

✅ **Panel administrativo (AdminPanel)**

* Acceso protegido con **JWT**.
* Dashboard con métricas globales.
* CRUDs de urnas, materiales, modelos, colores, usuarios e inventario.

✅ **Comunicación entre microservicios**

* Catálogo ↔ Inventario ↔ Usuarios ↔ Pedidos ↔ Ubicación.

✅ **Diseño responsive**

* Adaptado para móviles, tablets y escritorio.

---

## 📚 Documentación de API

<details>
<summary>🌐 <b>Swagger UI (Documentación REST)</b></summary>

| Servicio                | URL local                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| 🗺️ **Ubicación**       | [http://localhost:8001/swagger-ui/index.html](http://localhost:8001/swagger-ui/index.html) |
| 🪶 **Catálogo**         | [http://localhost:8002/swagger-ui/index.html](http://localhost:8002/swagger-ui/index.html) |
| 📦 **Inventario-Stock** | [http://localhost:8003/swagger-ui/index.html](http://localhost:8003/swagger-ui/index.html) |
| 👤 **Usuarios / Auth**  | [http://localhost:8004/swagger-ui/index.html](http://localhost:8004/swagger-ui/index.html) |
| 🧾 **Pedidos**          | [http://localhost:8005/swagger-ui/index.html](http://localhost:8005/swagger-ui/index.html) |

</details>

<details>
<summary>📦 <b>Postman Collection</b></summary>

📄 Archivo: `/documentacion/DescansosDelRecuerdo_API_Collection.json`

Incluye ejemplos de:

* Login / Registro / Perfil (JWT)
* CRUD de urnas, materiales, modelos y colores
* Ajuste de stock: aumentar, disminuir, ajustar
* Creación, actualización y consulta de pedidos
* Endpoints de regiones y comunas

</details>

---

## 👥 Autores

| Nombre                | Rol                     | Contacto                                             |
| --------------------- | ----------------------- | ---------------------------------------------------- |
| **Lucas Moncada**     | Desarrollador FullStack | [@LucasMoncadaCL](https://github.com/LucasMoncadaCL) |
| **César Rojas Ramos** | Desarrollador FullStack | [@Cesitar16](https://github.com/Cesitar16)           |

> 🏫 Proyecto académico – Duoc UC
> **Profesor guía:** Ing. Eduardo Martínez
> 🧩 Evaluación Experiencia 2 – FullStack Developer

---

## 🏁 Estado actual

| Estado | Funcionalidad                                              |
| ------ | ---------------------------------------------------------- |
| ✅      | Catálogo funcional con filtros dinámicos y modales         |
| ✅      | Carrito con Context API y control de stock                 |
| ✅      | Autenticación JWT + rutas protegidas                       |
| ✅      | Panel administrativo con métricas y CRUDs                  |
| 🚧     | Integración completa de pedidos y checkout (en desarrollo) |

---

## 🪄 Próximos pasos

* 🧾 Integrar módulo de pedidos en el frontend (Checkout → PedidoService).
* 📤 Implementar carga de imágenes hacia **Supabase Storage** o similar.
* 🔄 Despliegue en **Render / Vercel** con conexión a base de datos remota.

---

## 🪶 Licencia y frase de cierre

<p align="center">
  <b>“Honrando memorias con tecnología y respeto.”</b><br><br>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" />
</p>
