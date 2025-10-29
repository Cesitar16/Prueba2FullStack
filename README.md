
# 🕊️ Descansos del Recuerdo SPA

<h3 align="center">Sistema de Gestión y Catálogo de Urnas Funerarias</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2018-61DBFB?style=for-the-badge&logo=react" alt="React 18 Badge"/>
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot%203.5.6-6DB33F?style=for-the-badge&logo=springboot" alt="Spring Boot 3.5.6 Badge"/>
  <img src="https://img.shields.io/badge/Database-MySQL%208-4479A1?style=for-the-badge&logo=mysql" alt="MySQL 8 Badge"/>
  <img src="https://img.shields.io/badge/Build-Vite%20%2B%20Maven-orange?style=for-the-badge" alt="Vite + Maven Badge"/>
</p>

<p align="center">
  <b>Proyecto FullStack desarrollado en React + Spring Boot con arquitectura de microservicios.</b>
</p>

---

## 🧾 Descripción del proyecto

**Descansos del Recuerdo SPA** es un sistema web completo para la **gestión integral de urnas funerarias**. Permite administrar productos, inventario, usuarios y pedidos a través de una plataforma moderna, rápida y adaptable a distintos dispositivos (responsive).

El proyecto se enfoca en ofrecer una **experiencia de usuario profesional y respetuosa**, combinando un catálogo público de productos con filtros dinámicos y un **panel de administración seguro (protegido con JWT)** para la gestión interna del negocio.

---

## 🖼️ Vistas principales

| 🏛️ Catálogo de Urnas                                          | 🔐 Panel de Administración                                       |
| :-----------------------------------------------------------: | :-----------------------------------------------------------: |
|  |  |

---

## ⚙️ Tecnologías Utilizadas

<details>
<summary>🖥️ <b>Frontend (Interfaz de Usuario)</b></summary>

-   ⚛️ **React 18**: Biblioteca principal para construir la interfaz con componentes funcionales y Hooks.
-   ⚡ **Vite**: Herramienta de construcción y servidor de desarrollo rápido para proyectos web modernos.
-   🎨 **Bootstrap 5 + Bootstrap Icons**: Framework CSS para diseño responsivo, componentes predefinidos e iconos.
-   🧠 **Context API**: Para manejo de estado global, como la sesión de usuario (`AuthContext`) y el carrito de compras (`CarritoContext`).
-   🔗 **Axios**: Cliente HTTP para realizar peticiones a los microservicios del backend.
-   🧭 **React Router DOM**: Para la gestión de rutas de navegación en la aplicación y protección de rutas administrativas.

</details>

<details>
<summary>☕ <b>Backend (Microservicios Spring Boot)</b></summary>

-   🌱 **Spring Boot 3.5.6**: Framework principal para el desarrollo de los microservicios Java.
-   🔐 **Spring Security + JWT**: Para la autenticación segura basada en tokens y autorización por roles (ej. Administrador).
-   🗂️ **Spring Data JPA (Hibernate)**: Para el mapeo objeto-relacional (ORM) y la interacción con la base de datos.
-   🔁 **WebClient (Spring WebFlux)**: Para la comunicación reactiva entre microservicios (ej. Pedidos consulta Inventario, Catálogo consulta Ubicación).
-   💾 **MySQL 8**: Sistema de gestión de bases de datos relacional utilizado para persistir los datos.
-   📄 **Swagger / OpenAPI**: Para la documentación interactiva de las APIs REST de cada microservicio.
-   🛠️ **Maven**: Herramienta de gestión de dependencias y construcción de los proyectos Java, con Maven Wrapper para consistencia (`mvnw`).

</details>

<details>
<summary>🧩 <b>Arquitectura General</b></summary>

-   🧱 **Microservicios**: El backend está dividido en servicios independientes por dominio funcional, cada uno con su propia base de código y puerto.
    -   🌎 **Ubicaciones** (Puerto 8001): Gestiona datos geográficos (Regiones, Comunas).
    -   🪶 **Catálogo** (Puerto 8002): Gestiona la información de las urnas (productos), incluyendo materiales, colores, modelos e imágenes. También maneja la subida y el servicio de archivos de imagen.
    -   📦 **Inventario** (Puerto 8003): Controla el stock de cada urna y registra los movimientos (entradas, salidas, ajustes).
    -   👤 **Usuarios** (Puerto 8004): Maneja el registro, login (autenticación JWT) y gestión de datos de usuarios y sus direcciones.
    -   🧾 **Pedidos** (Puerto 8005): Procesa la creación y gestión de los pedidos de los clientes.
-   🔄 **Comunicación**: Los servicios se comunican entre sí mediante peticiones HTTP REST utilizando `WebClient`.
-   💾 **Persistencia**: Cada microservicio (excepto quizás Ubicaciones si solo lee datos iniciales) interactúa con la misma base de datos `gestion_urnas`, pero idealmente manejan sus propias tablas o esquemas lógicos.
-   🔐 **Seguridad**: Centralizada en el microservicio de Usuarios, que emite tokens JWT validados por los demás servicios que requieren autenticación/autorización.

</details>

---

## 🌳 Estructura del Proyecto (Vista General)

```

.
├── .gitignore               \# Archivos y carpetas a ignorar por Git (nivel raíz)
├── Back-end/                \# Contenedor de todos los microservicios del backend
│   ├── ApiUbicacionesPruebaFullStack2/ \# Microservicio de Ubicaciones (Regiones/Comunas)
│   │   ├── .mvn/            \# Configuración del Maven Wrapper específico
│   │   ├── src/             \# Código fuente Java
│   │   │   ├── main/        \# Código principal de la aplicación
│   │   │   │   ├── java/    \# Clases Java (Controladores, Servicios, Repositorios, Entidades)
│   │   │   │   └── resources/ \# Archivos de configuración (application.properties)
│   │   │   └── test/        \# Código de pruebas (Unitarias/Integración)
│   │   ├── .gitattributes   \# Configuración de Git para finales de línea
│   │   ├── .gitignore       \# Archivos ignorados por Git para este módulo
│   │   ├── mvnw             \# Script Maven Wrapper para Linux/macOS
│   │   ├── mvnw.cmd         \# Script Maven Wrapper para Windows
│   │   └── pom.xml          \# Archivo de configuración de Maven (dependencias, build)
│   │
│   ├── catalogo\_api\_descansosdelrecuerdospa/ \# Microservicio de Catálogo (Urnas, etc.)
│   │   ├── .mvn/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/    \# Clases Java (Controladores, Servicios, Repositorios, Entidades, DTOs, Config)
│   │   │   │   └── resources/ \# application.properties
│   │   │   └── test/        \# Pruebas unitarias (Mockito)
│   │   ├── uploads/         \# Carpeta (posiblemente) para subida de imágenes (ver config)
│   │   │   └── urnas/       \# Imágenes de urnas subidas
│   │   ├── .gitattributes
│   │   ├── .gitignore
│   │   ├── mvnw
│   │   ├── mvnw.cmd
│   │   └── pom.xml
│   │
│   ├── inventario-stock\_api\_descansosdelrecuerdospa/ \# Microservicio de Inventario
│   │   ├── .mvn/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/    \# Clases Java (Controladores, Servicios, Repositorios, Entidades, DTOs, Config WebClient)
│   │   │   │   └── resources/ \# application.properties
│   │   │   └── test/        \# Pruebas unitarias (Mockito)
│   │   ├── .gitattributes
│   │   ├── .gitignore
│   │   ├── mvnw
│   │   ├── mvnw.cmd
│   │   └── pom.xml
│   │
│   ├── pedidos-api-descansosdelrecuerdospa/ \# Microservicio de Pedidos
│   │   ├── .mvn/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/    \# Clases Java (Controladores, Servicios, Repositorios, Entidades, DTOs, Config WebClient)
│   │   │   │   └── resources/ \# application.properties
│   │   │   └── test/        \# Pruebas unitarias (Mockito)
│   │   ├── .gitattributes
│   │   ├── .gitignore
│   │   ├── mvnw
│   │   ├── mvnw.cmd
│   │   └── pom.xml
│   │
│   └── usuarios\_api\_descansosdelrecuerdospa/ \# Microservicio de Usuarios y Autenticación
│       ├── .mvn/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/    \# Clases Java (Controladores Auth/User/Direccion, Servicios, Repositorios, Entidades, DTOs, Config Seguridad/JWT/CORS)
│       │   │   └── resources/ \# application.properties (incluye secret JWT)
│       │   └── test/        \# Pruebas unitarias (Mockito para AuthController, UsuarioService)
│       ├── .gitattributes
│       ├── .gitignore
│       ├── mvnw
│       ├── mvnw.cmd
│       └── pom.xml
│
├── Front-end/               \# Proyecto de la interfaz de usuario React con Vite
│   ├── public/              \# Archivos estáticos públicos (icono.png, vite.svg)
│   ├── src/                 \# Código fuente del frontend
│   │   ├── assets/          \# Recursos estáticos (imágenes, estilos)
│   │   │   ├── img/         \# Imágenes usadas directamente por el frontend (logos, placeholders)
│   │   │   └── styles/      \# Archivos CSS (estilos generales, login, admin, variables, etc.)
│   │   ├── components/      \# Componentes React reutilizables (Navbar, Footer, Cards, Modals, Forms, etc.)
│   │   │   └── admin/       \# Componentes específicos del panel de administración
│   │   ├── context/         \# React Context API providers (AuthContext, CarritoContext)
│   │   ├── pages/           \# Componentes que representan páginas completas (Catalogo, Login, AdminPanel, etc.)
│   │   │   └── admin/       \# Páginas específicas del panel de administración (Dashboard, Urnas, Usuarios, etc.)
│   │   ├── services/        \# Lógica para interactuar con las APIs del backend (api.js)
│   │   ├── utils/           \# Funciones de utilidad (formatters.js, validators.js)
│   │   ├── App.jsx          \# Componente principal que define las rutas
│   │   ├── index.css        \# Estilos CSS globales mínimos
│   │   └── main.jsx         \# Punto de entrada de la aplicación React (renderiza App)
│   ├── .gitignore           \# Archivos ignorados por Git para el frontend (node\_modules, dist, etc.)
│   ├── eslint.config.js     \# Configuración de ESLint para el análisis de código
│   ├── index.html           \# Plantilla HTML principal
│   ├── package-lock.json    \# Lockfile de dependencias NPM
│   ├── package.json         \# Dependencias y scripts del proyecto Node.js/React
│   ├── README.md            \# README específico del frontend (generado por Vite)
│   └── vite.config.js       \# Archivo de configuración de Vite
│
├── gestion\_urnas.sql        \# Script SQL para crear la estructura de la base de datos y datos iniciales
└── README.md                \# Este archivo README principal del proyecto

````

---

## 💻 Instalación y Ejecución

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### 📋 Prerrequisitos

* **Java JDK 17** o superior instalado.
* **Maven** (Aunque se recomienda usar el Maven Wrapper incluido: `mvnw`).
* **Node.js** (Versión LTS recomendada, ej. v20+) y **npm**.
* **MySQL Server** (versión 8 recomendada) en ejecución.
* Un **servidor web** (como XAMPP con Apache) si deseas servir las imágenes del catálogo desde la ruta configurada (`C:/xampp/htdocs/storage_descansos`). Alternativamente, puedes ajustar la configuración `storage.base-path` y `storage.base-url` en `catalogo_api_descansosdelrecuerdospa/src/main/resources/application.properties`.

### 💾 1. Configuración de la Base de Datos

1.  Asegúrate de que tu servidor MySQL esté corriendo (normalmente en `localhost:3306`).
2.  Crea una base de datos llamada `gestion_urnas`. Puedes usar un cliente MySQL como MySQL Workbench, DBeaver, o la línea de comandos:
    ```sql
    CREATE DATABASE gestion_urnas CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
    USE gestion_urnas;
    ```
3.  Ejecuta el script `gestion_urnas.sql` en la base de datos recién creada. Esto creará todas las tablas necesarias e insertará datos iniciales (usuarios, productos, etc.).
4.  Verifica y ajusta si es necesario las credenciales de la base de datos (usuario y contraseña) en los archivos `application.properties` de cada microservicio backend (ej. `Back-end/catalogo_api_descansosdelrecuerdospa/src/main/resources/application.properties`). Por defecto, usan `root` sin contraseña.

### ⚙️ 2. Levantar los Microservicios (Backend)

Cada microservicio es una aplicación Spring Boot independiente. Debes ejecutarlos todos. Navega a la carpeta de cada microservicio y ejecútalo usando el Maven Wrapper.

**Orden recomendado (aunque no estrictamente necesario si arrancan rápido):**

1.  **Ubicaciones:**
    ```bash
    cd Back-end/ApiUbicacionesPruebaFullStack2
    ./mvnw spring-boot:run
    # En Windows: mvnw.cmd spring-boot:run
    ```
    (Esperar a que inicie en el puerto 8001)

2.  **Catálogo:**
    ```bash
    cd ../catalogo_api_descansosdelrecuerdospa
    ./mvnw spring-boot:run
    # En Windows: mvnw.cmd spring-boot:run
    ```
    (Esperar a que inicie en el puerto 8002)

3.  **Inventario:**
    ```bash
    cd ../inventario-stock_api_descansosdelrecuerdospa
    ./mvnw spring-boot:run
    # En Windows: mvnw.cmd spring-boot:run
    ```
    (Esperar a que inicie en el puerto 8003)

4.  **Usuarios:**
    ```bash
    cd ../usuarios_api_descansosdelrecuerdospa
    ./mvnw spring-boot:run
    # En Windows: mvnw.cmd spring-boot:run
    ```
    (Esperar a que inicie en el puerto 8004)

5.  **Pedidos:**
    ```bash
    cd ../pedidos-api-descansosdelrecuerdospa
    ./mvnw spring-boot:run
    # En Windows: mvnw.cmd spring-boot:run
    ```
    (Esperar a que inicie en el puerto 8005)

**Nota:** Si es la primera vez, Maven descargará dependencias, lo cual puede tomar unos minutos.

### 🖥️ 3. Ejecutar el Frontend

1.  Abre una nueva terminal.
2.  Navega a la carpeta del frontend:
    ```bash
    cd Front-end
    ```
3.  Instala las dependencias de Node.js:
    ```bash
    npm install
    ```
4.  Inicia el servidor de desarrollo de Vite:
    ```bash
    npm run dev
    ```
5.  Abre tu navegador y ve a la dirección indicada (normalmente `http://localhost:5173`).

### ✅ ¡Listo!

Ahora deberías tener la aplicación completa funcionando localmente. Puedes navegar por el catálogo, iniciar sesión y acceder al panel de administración.

---

## 🧪 Pruebas Unitarias

El proyecto incluye pruebas unitarias escritas con **JUnit** y **Mockito** para verificar la lógica de negocio en los servicios del backend. Puedes encontrar estas pruebas en los directorios `src/test/java` de los microservicios correspondientes (Ubicaciones, Catálogo, Inventario, Pedidos, Usuarios).

Para ejecutar las pruebas de un microservicio específico, navega a su directorio y usa Maven:

```bash
cd Back-end/usuarios_api_descansosdelrecuerdospa
./mvnw test
# En Windows: mvnw.cmd test
````

-----

## 📚 Documentación de API (Swagger UI)

Cada microservicio expone su documentación de API a través de Swagger UI. Una vez que los servicios estén en ejecución, puedes acceder a la documentación en las siguientes URLs:

| Servicio                | URL local                                                                                  |
| :---------------------- | :----------------------------------------------------------------------------------------- |
| 🗺️ **Ubicación** | [http://localhost:8001/swagger-ui.html](http://localhost:8001/swagger-ui.html)             |
| 🪶 **Catálogo** | [http://localhost:8002/swagger-ui.html](http://localhost:8002/swagger-ui.html)             |
| 📦 **Inventario-Stock** | [http://localhost:8003/swagger-ui.html](http://localhost:8003/swagger-ui.html)             |
| 👤 **Usuarios / Auth** | [http://localhost:8004/swagger-ui.html](http://localhost:8004/swagger-ui.html)             |
| 🧾 **Pedidos** | [http://localhost:8005/swagger-ui.html](http://localhost:8005/swagger-ui.html)             |

-----

## 🔐 Credenciales de Prueba

Puedes usar las siguientes credenciales (definidas en `gestion_urnas.sql`) para probar la aplicación:

| Rol             | Correo                              | Contraseña   |
| :-------------- | :---------------------------------- | :----------- |
| 🧑‍💼 **Admin** | `CesarR@DescansosDelRecuerdo.cl` | `Admin123`   |
| 👤 **Admin** | `LucasMoncada@gmail.com`         | `Admin123`   |

*(Nota: Las contraseñas se almacenan hasheadas en la base de datos usando BCrypt)*.

-----

## 🧭 Funcionalidades Principales

✅ **Catálogo Público:**

  * Visualización de urnas con imágenes, detalles y stock.
  * Filtrado dinámico por nombre, código, material, rango de precios.
  * Vista detallada en modal con galería de imágenes.

✅ **Carrito de Compras:**

  * Añadir/Eliminar productos.
  * Gestión de estado global con Context API y persistencia en localStorage.
  * Modal de carrito con resumen y cálculo de total.
  * Flujo de compra integrado (requiere login y confirmación de datos).

✅ **Autenticación y Autorización:**

  * Registro y Login de usuarios.
  * Autenticación basada en JWT (JSON Web Tokens).
  * Rutas protegidas para el panel de administración (`/admin/*`).

✅ **Panel de Administración:**

  * Dashboard con estadísticas generales del sistema.
  * Gestión completa (CRUD) de:
      * Urnas (Productos).
      * Inventario.
      * Usuarios.
      * Pedidos.
      * (Implícito: Materiales, Colores, Modelos a través de sus respectivos controllers/services).
  * Interfaz dedicada con layout, sidebar y header.

✅ **Microservicios y Comunicación:**

  * Separación clara de responsabilidades por dominio.
  * Comunicación interna mediante APIs REST (`WebClient`).

✅ **Diseño Responsivo:**

  * Interfaz adaptable a diferentes tamaños de pantalla (móviles, tablets, escritorio).

-----

## 👥 Autores

| Nombre                | Rol                     | Contacto                                             |
| :-------------------- | :---------------------- | :--------------------------------------------------- |
| **Lucas Moncada** | Desarrollador FullStack | [@LucasMoncadaCL](https://github.com/LucasMoncadaCL) |
| **César Rojas Ramos** | Desarrollador FullStack | [@Cesitar16](https://github.com/Cesitar16)           |

> 🏫 Proyecto académico – Duoc UC
> **Profesor guía:** Viviana Soledad Poblete Lopez
> 🧩 Evaluación Experiencia 2 – FullStack II

-----

## 🏁 Estado Actual y Próximos Pasos

| Estado | Funcionalidad                                              |
| :----- | :--------------------------------------------------------- |
| ✅      | Catálogo funcional con filtros, modales y stock en vivo    |
| ✅      | Carrito con Context API, persistencia y flujo de compra    |
| ✅      | Autenticación JWT + rutas protegidas                       |
| ✅      | Panel administrativo con dashboard y CRUDs funcionales     |
| ✅      | Microservicios backend operativos y comunicándose          |
| ✅      | Pruebas unitarias para lógica clave del backend            |
| 🚧     | Despliegue en un entorno de producción                     |
| 🚧     | Integración con pasarela de pago real                      |
| 🚧     | Uso de almacenamiento externo para imágenes (ej. S3, Supabase) |

-----

## 🪶 Licencia y Frase de Cierre

<p align="center"\>
<b\>“Honrando memorias con tecnología y respeto.”\</b\><br><br>
<img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License Badge"/\>
</p\>
