SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `color` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `color` (`id`, `nombre`) VALUES
(1, 'Blanco'),
(2, 'Roble'),
(3, 'Gris Metalizado'),
(4, 'Negro'),
(5, 'Blanco Mate'),
(6, 'Crema'),
(7, 'Azul Marino');

CREATE TABLE `comuna` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `region_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `comuna` (`id`, `nombre`, `region_id`) VALUES
(1, 'Maipú', 1),
(2, 'Quinta Normal', 1),
(3, 'Providencia', 1);

CREATE TABLE `detalle_pedido` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `urna_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `precio_unitario`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `detalle_pedido` (`id`, `pedido_id`, `urna_id`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 1, 1, 89990.00),
(2, 1, 2, 1, 89990.00);

CREATE TABLE `direccion` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `calle` varchar(255) DEFAULT NULL,
  `comuna` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `pais` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `direccion` (`id`, `usuario_id`, `calle`, `comuna`, `region`, `pais`, `telefono`) VALUES
(1, 1, 'Av. Los Pinos 123', 'Maipú', 'Región Metropolitana de Santiago', 'Chile', '934455635'),
(2, 2, 'Vicuña Rozas 5574', 'Quinta Normal', 'Región Metropolitana de Santiago', 'Chile', '920851421'),
(3, 3, 'Av. Providencia 1020', 'Providencia', 'Región Metropolitana de Santiago', 'Chile', '987654321');

CREATE TABLE `estado_pedido` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `estado_pedido` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Pendiente', 'Pedido recibido en espera de confirmación.'),
(2, 'En Proceso', 'Pedido en preparación.'),
(3, 'Enviado', 'Pedido despachado al cliente.'),
(4, 'Entregado', 'Pedido recibido por el cliente.'),
(5, 'Cancelado', 'Pedido cancelado.');

CREATE TABLE `historial_stock` (
  `id` int(11) NOT NULL,
  `urna_id` int(11) NOT NULL,
  `cantidad_anterior` int(11) DEFAULT NULL,
  `cantidad_nueva` int(11) DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `historial_stock` (`id`, `urna_id`, `cantidad_anterior`, `cantidad_nueva`, `motivo`, `fecha`) VALUES
(1, 1, 8, 7, 'Venta realizada - Pedido #1', '2025-10-21 23:36:52'),
(2, 2, 4, 3, 'Venta realizada - Pedido #1', '2025-10-21 23:36:52');

CREATE TABLE `imagen_urna` (
  `id` int(11) NOT NULL,
  `urna_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `principal` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `imagen_urna` (`id`, `urna_id`, `url`, `principal`) VALUES
(1, 1, '/img/urnasimg/roble_detalle1.jpg', 0),
(2, 1, '/img/urnasimg/roble_detalle2.jpg', 0),
(3, 4, '/img/urnasimg/metal_lateral.jpg', 0);

CREATE TABLE `inventario` (
  `id` bigint(20) NOT NULL,
  `cantidad_actual` int(11) NOT NULL,
  `cantidad_maxima` int(11) NOT NULL,
  `cantidad_minima` int(11) NOT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `ubicacion_fisica` varchar(255) DEFAULT NULL,
  `ultima_actualizacion` datetime(6) DEFAULT NULL,
  `urna_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `inventario` (`id`, `cantidad_actual`, `cantidad_maxima`, `cantidad_minima`, `estado`, `ubicacion_fisica`, `ultima_actualizacion`, `urna_id`) VALUES
(1, 7, 20, 2, 'Disponible', 'Bodega Central - Estante A3', '2025-10-21 21:40:11.000000', 1),
(2, 8, 25, 3, 'Disponible', 'Bodega Central - Estante B2', '2025-10-21 21:40:11.000000', 2),
(3, 3, 10, 2, 'Bajo Stock', 'Bodega Secundaria - Estante C1', '2025-10-21 21:40:11.000000', 3),
(4, 19, 40, 5, 'Disponible', 'Bodega Central - Estante D5', '2025-10-21 21:40:11.000000', 4),
(5, 10, 25, 3, 'Disponible', 'Bodega Central - Estante B2', '2025-10-22 00:51:22.000000', 2);

CREATE TABLE `material` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `material` (`id`, `nombre`) VALUES
(1, 'Metal'),
(2, 'Madera'),
(3, 'Cerámica'),
(4, 'Mármol'),
(5, 'Biodegradable');

CREATE TABLE `modelo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `modelo` (`id`, `nombre`) VALUES
(1, 'Clásico'),
(2, 'Moderno'),
(3, 'Lujo'),
(4, 'Ecológico');

CREATE TABLE `movimiento_stock` (
  `id` bigint(20) NOT NULL,
  `cantidad_anterior` int(11) NOT NULL,
  `cantidad_nueva` int(11) NOT NULL,
  `fecha_movimiento` datetime(6) DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `tipo_movimiento` varchar(50) NOT NULL,
  `usuario_responsable` varchar(120) DEFAULT NULL,
  `inventario_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `movimiento_stock` (`id`, `cantidad_anterior`, `cantidad_nueva`, `fecha_movimiento`, `motivo`, `tipo_movimiento`, `usuario_responsable`, `inventario_id`) VALUES
(1, 0, 7, '2025-10-21 21:45:29.000000', 'Carga inicial de stock desde catálogo', 'Entrada', 'Administrador', 1),
(2, 7, 6, '2025-10-21 21:45:29.000000', 'Venta realizada - Pedido #101', 'Salida', 'Sistema', 1),
(3, 6, 7, '2025-10-21 21:45:29.000000', 'Reposición semanal de inventario', 'Entrada', 'Operario Bodega', 1),
(4, 0, 8, '2025-10-21 21:45:29.000000', 'Carga inicial de stock desde catálogo', 'Entrada', 'Administrador', 2),
(5, 8, 7, '2025-10-21 21:45:29.000000', 'Venta realizada - Pedido #102', 'Salida', 'Sistema', 2),
(6, 7, 8, '2025-10-21 21:45:29.000000', 'Reposición automática semanal', 'Entrada', 'Sistema', 2),
(7, 0, 3, '2025-10-21 21:45:29.000000', 'Carga inicial de stock desde catálogo', 'Entrada', 'Administrador', 3),
(8, 3, 2, '2025-10-21 21:45:29.000000', 'Venta especial - Pedido #103', 'Salida', 'Sistema', 3),
(9, 2, 3, '2025-10-21 21:45:29.000000', 'Ajuste manual de stock (verificado)', 'Entrada', 'Supervisor', 3),
(10, 0, 19, '2025-10-21 21:45:29.000000', 'Carga inicial de stock desde catálogo', 'Entrada', 'Administrador', 4),
(11, 19, 18, '2025-10-21 21:45:29.000000', 'Venta registrada - Pedido #104', 'Salida', 'Sistema', 4),
(12, 18, 19, '2025-10-21 21:45:29.000000', 'Ajuste de conteo físico de inventario', 'Entrada', 'Supervisor Bodega', 4);

CREATE TABLE `pedido` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `direccion_id` int(11) DEFAULT NULL,
  `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado_pedido_id` int(11) NOT NULL,
  `total` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `pedido` (`id`, `usuario_id`, `direccion_id`, `fecha_pedido`, `estado_pedido_id`, `total`) VALUES
(1, 3, 2, '2025-10-21 23:36:52', 1, 179980.00);

CREATE TABLE `region` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `region` (`id`, `nombre`) VALUES
(1, 'Región Metropolitana de Santiago');

CREATE TABLE `urna` (
  `id` int(11) NOT NULL,
  `id_interno` varchar(50) DEFAULT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion_corta` text DEFAULT NULL,
  `descripcion_detallada` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `disponible` enum('s','n') DEFAULT 's',
  `ancho` decimal(6,2) DEFAULT NULL,
  `alto` decimal(6,2) DEFAULT NULL,
  `profundidad` decimal(6,2) DEFAULT NULL,
  `peso` decimal(6,2) DEFAULT NULL,
  `imagen_principal` varchar(255) DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `material_id` int(11) DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL,
  `modelo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `urna` (`id`, `id_interno`, `nombre`, `descripcion_corta`, `descripcion_detallada`, `precio`, `stock`, `disponible`, `ancho`, `alto`, `profundidad`, `peso`, `imagen_principal`, `estado`, `fecha_creacion`, `material_id`, `color_id`, `modelo_id`) VALUES
(1, 'U005', 'Urna Clásica de Madera', 'Clásica', 'Urna de madera con acabado natural', 76000.00, 7, 's', 25.50, 30.00, 20.00, 3.50, '/img/urnasimg/clasicamadera.jpg', 'Activo', '2025-10-21 23:36:52', 2, 2, 1),
(2, 'U006', 'Urna Moderna de Cerámica', 'Moderna', 'Urna de cerámica con líneas minimalistas', 59000.00, 8, 's', 18.00, 28.00, 18.00, 4.00, '/img/urnasimg/ceramica.png', 'Activo', '2025-10-21 23:36:52', 3, 5, 2),
(3, 'U007', 'Urna de Lujo con Incrustaciones', 'Lujo', 'Urna de mármol con detalles de oro', 45000.00, 3, 's', 24.00, 35.00, 24.00, 5.00, '/img/urnasimg/urna_lujo.jpg', 'Activo', '2025-10-21 23:36:52', 4, 6, 3),
(4, 'U008', 'Urna Metálica Resistente', 'Metálica', 'Urna de metal con acabado pulido', 99000.00, 19, 's', 20.00, 30.00, 20.00, 3.00, '/img/urnasimg/urna_metalica.png', 'Activo', '2025-10-21 23:36:52', 1, 4, 2);

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(120) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(20) NOT NULL,
  `estado` varchar(10) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuario` (`id`, `nombre`, `correo`, `password`, `rol`, `estado`, `fecha_creacion`) VALUES
(1, 'María González', 'MariaG@DescansosDelRecuerdo.cl', 'Admin123', 'Administrador', 'Activo', '2025-10-21 23:36:52'),
(2, 'Carlos Rodríguez', 'CarlosR@DescansosDelRecuerdo.cl', 'Admin123', 'Administrador', 'Activo', '2025-10-21 23:36:52'),
(3, 'César Rojas', 'CesarR@DescansosDelRecuerdo.cl', '$2a$12$E.a8euTEhDTPpY3Aw5YqrOFkJ0Mm85tFtI/p3MZDB4sM6VIdwqHg.', 'Administrador', 'Activo', '2025-10-21 23:36:52'),
(5, 'LucasMoncada', 'lucasmoncada017@gmail.com', '$2a$12$Se8HgKF7pb8YRr8SYQsYS.NyBV92vOupFvSgAGVDtD0qbQowEj3Vu', 'Administrador', 'Activo', '2025-10-22 05:21:14');


ALTER TABLE `color`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `comuna`
  ADD PRIMARY KEY (`id`),
  ADD KEY `region_id` (`region_id`);

ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `urna_id` (`urna_id`);

ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

ALTER TABLE `estado_pedido`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `historial_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `urna_id` (`urna_id`);

ALTER TABLE `imagen_urna`
  ADD PRIMARY KEY (`id`),
  ADD KEY `urna_id` (`urna_id`);

ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `material`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `modelo`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `movimiento_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKje6wfvt36fv0aq2h1fux3wl4b` (`inventario_id`);

ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `direccion_id` (`direccion_id`),
  ADD KEY `estado_pedido_id` (`estado_pedido_id`);

ALTER TABLE `region`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `urna`
  ADD PRIMARY KEY (`id`),
  ADD KEY `material_id` (`material_id`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `modelo_id` (`modelo_id`);

ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);


ALTER TABLE `color`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `comuna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `detalle_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `direccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `estado_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `historial_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `imagen_urna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `inventario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `material`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `modelo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `movimiento_stock`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `region`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `urna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;


ALTER TABLE `comuna`
  ADD CONSTRAINT `comuna_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `region` (`id`);

ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedido` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`urna_id`) REFERENCES `urna` (`id`);

ALTER TABLE `direccion`
  ADD CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

ALTER TABLE `historial_stock`
  ADD CONSTRAINT `historial_stock_ibfk_1` FOREIGN KEY (`urna_id`) REFERENCES `urna` (`id`) ON DELETE CASCADE;

ALTER TABLE `imagen_urna`
  ADD CONSTRAINT `imagen_urna_ibfk_1` FOREIGN KEY (`urna_id`) REFERENCES `urna` (`id`) ON DELETE CASCADE;

ALTER TABLE `movimiento_stock`
  ADD CONSTRAINT `FKje6wfvt36fv0aq2h1fux3wl4b` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`);

ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`direccion_id`) REFERENCES `direccion` (`id`),
  ADD CONSTRAINT `pedido_ibfk_3` FOREIGN KEY (`estado_pedido_id`) REFERENCES `estado_pedido` (`id`);

ALTER TABLE `urna`
  ADD CONSTRAINT `urna_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`),
  ADD CONSTRAINT `urna_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `color` (`id`),
  ADD CONSTRAINT `urna_ibfk_3` FOREIGN KEY (`modelo_id`) REFERENCES `modelo` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
