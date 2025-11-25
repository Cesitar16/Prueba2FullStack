-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 25-11-2025 a las 23:13:05
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestion_urnas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
                           `id` bigint(20) NOT NULL,
                           `usuario_id` bigint(20) NOT NULL,
                           `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id`, `usuario_id`, `fecha_actualizacion`) VALUES
                                                                      (1, 5, '2025-11-25 21:41:13'),
                                                                      (2, 11, '2025-11-25 21:54:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `color`
--

CREATE TABLE `color` (
                         `id` int(11) NOT NULL,
                         `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `color`
--

INSERT INTO `color` (`id`, `nombre`) VALUES
                                         (1, 'Blanco'),
                                         (2, 'Roble'),
                                         (3, 'Gris Metalizado'),
                                         (4, 'Negro'),
                                         (5, 'Blanco Mate'),
                                         (6, 'Crema'),
                                         (7, 'Color Nuevo 2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
                              `id` bigint(20) NOT NULL,
                              `usuario_id` int(11) NOT NULL,
                              `urna_id` int(11) DEFAULT NULL,
                              `contenido` text NOT NULL,
                              `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
                              `calificacion` int(1) DEFAULT NULL,
                              `tipo` varchar(255) NOT NULL,
                              `estado` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentario`
--

INSERT INTO `comentario` (`id`, `usuario_id`, `urna_id`, `contenido`, `fecha`, `calificacion`, `tipo`, `estado`) VALUES
    (1, 5, NULL, 'hola', '2025-11-26 00:12:29', NULL, 'FORO', 'VISIBLE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comuna`
--

CREATE TABLE `comuna` (
                          `id` int(11) NOT NULL,
                          `nombre` varchar(100) NOT NULL,
                          `region_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comuna`
--

INSERT INTO `comuna` (`id`, `nombre`, `region_id`) VALUES
                                                       (1, 'Maipú', 1),
                                                       (2, 'Quinta Normal', 1),
                                                       (3, 'Providencia', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
                                  `id` bigint(20) NOT NULL,
                                  `pedido_id` int(11) NOT NULL,
                                  `urna_id` int(11) NOT NULL,
                                  `cantidad` int(11) NOT NULL,
                                  `precio_unitario` decimal(10,2) NOT NULL,
                                  `subtotal` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `precio_unitario`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`id`, `pedido_id`, `urna_id`, `cantidad`, `precio_unitario`) VALUES
                                                                                               (1, 1, 1, 1, 89990.00),
                                                                                               (2, 1, 2, 1, 89990.00),
                                                                                               (3, 2, 1, 1, 76000.00),
                                                                                               (4, 3, 4, 1, 99000.00),
                                                                                               (5, 4, 1, 2, 76000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion`
--

CREATE TABLE `direccion` (
                             `id` int(11) NOT NULL,
                             `usuario_id` int(11) NOT NULL,
                             `calle` varchar(255) DEFAULT NULL,
                             `comuna` varchar(255) DEFAULT NULL,
                             `region` varchar(255) DEFAULT NULL,
                             `pais` varchar(255) DEFAULT NULL,
                             `telefono` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direccion`
--

INSERT INTO `direccion` (`id`, `usuario_id`, `calle`, `comuna`, `region`, `pais`, `telefono`) VALUES
                                                                                                  (1, 1, 'Av. Los Pinos 123', 'Maipú', 'Región Metropolitana de Santiago', 'Chile', '934455635'),
                                                                                                  (2, 2, 'Vicuña Rozas 5574', 'Quinta Normal', 'Región Metropolitana de Santiago', 'Chile', '920851421'),
                                                                                                  (3, 3, 'Av. Providencia 1020', 'Providencia', 'Región Metropolitana de Santiago', 'Chile', '987654321'),
                                                                                                  (4, 5, 'calle 123', 'Maipú', 'Región Metropolitana de Santiago', 'Chile', '+56912341234'),
                                                                                                  (5, 11, 'calledeaca 123', 'Maipú', 'Región Metropolitana de Santiago', 'Chile', '+56987678767');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_pedido`
--

CREATE TABLE `estado_pedido` (
                                 `id` int(11) NOT NULL,
                                 `nombre` varchar(60) NOT NULL,
                                 `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_pedido`
--

INSERT INTO `estado_pedido` (`id`, `nombre`, `descripcion`) VALUES
                                                                (1, 'Pendiente', 'Pedido recibido en espera de confirmación.'),
                                                                (2, 'En Proceso', 'Pedido en preparación.'),
                                                                (3, 'Enviado', 'Pedido despachado al cliente.'),
                                                                (4, 'Entregado', 'Pedido recibido por el cliente.'),
                                                                (5, 'Cancelado', 'Pedido cancelado.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_stock`
--

CREATE TABLE `historial_stock` (
                                   `id` int(11) NOT NULL,
                                   `urna_id` int(11) NOT NULL,
                                   `cantidad_anterior` int(11) DEFAULT NULL,
                                   `cantidad_nueva` int(11) DEFAULT NULL,
                                   `motivo` varchar(255) DEFAULT NULL,
                                   `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_stock`
--

INSERT INTO `historial_stock` (`id`, `urna_id`, `cantidad_anterior`, `cantidad_nueva`, `motivo`, `fecha`) VALUES
                                                                                                              (1, 1, 8, 7, 'Venta realizada - Pedido #1', '2025-10-21 23:36:52'),
                                                                                                              (2, 2, 4, 3, 'Venta realizada - Pedido #1', '2025-10-21 23:36:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen_urna`
--

CREATE TABLE `imagen_urna` (
                               `id` int(11) NOT NULL,
                               `nombre` varchar(255) DEFAULT NULL,
                               `urna_id` int(11) NOT NULL,
                               `url` varchar(255) NOT NULL,
                               `principal` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagen_urna`
--

INSERT INTO `imagen_urna` (`id`, `nombre`, `urna_id`, `url`, `principal`) VALUES
                                                                              (1, NULL, 1, '/img/urnasimg/roble_detalle1.jpg', 0),
                                                                              (2, NULL, 1, '/img/urnasimg/roble_detalle2.jpg', 0),
                                                                              (3, NULL, 4, '/img/urnasimg/metal_lateral.jpg', 0),
                                                                              (4, NULL, 5, '/uploads/urnas/1761211823879_UrnaPruebaPost1.jpg', 0),
                                                                              (5, NULL, 5, '/uploads/urnas/1761211823879_UrnaPruebaPost2.jpg', 1),
                                                                              (6, '1761251558132_UrnaPruebaPost1.jpg', 6, 'http://localhost/storage_descansos/urnas/1761251558132_UrnaPruebaPost1.jpg', 0),
                                                                              (7, '1761251558132_UrnaPruebaPost2.jpg', 6, 'http://localhost/storage_descansos/urnas/1761251558132_UrnaPruebaPost2.jpg', 1),
                                                                              (8, '1761253424970_UrnaPruebaPost1.jpg', 7, 'http://localhost/storage_descansos/urnas/1761253424970_UrnaPruebaPost1.jpg', 0),
                                                                              (9, '1761253424970_UrnaPruebaPost2.jpg', 7, 'http://localhost/storage_descansos/urnas/1761253424970_UrnaPruebaPost2.jpg', 0),
                                                                              (10, '1761254276956_UrnaPruebaPost1.jpg', 12, 'http://localhost/storage_descansos/urnas/1761254276956_UrnaPruebaPost1.jpg', 0),
                                                                              (11, '1761254339303_UrnaPruebaPost1.jpg', 13, 'http://localhost/storage_descansos/urnas/1761254339303_UrnaPruebaPost1.jpg', 0),
                                                                              (12, '1761254339303_UrnaPruebaPost2.jpg', 13, 'http://localhost/storage_descansos/urnas/1761254339303_UrnaPruebaPost2.jpg', 0),
                                                                              (13, '1761254359890_UrnaPruebaPost1.jpg', 14, 'http://localhost/storage_descansos/urnas/1761254359890_UrnaPruebaPost1.jpg', 0),
                                                                              (14, '1761254359890_UrnaPruebaPost2.jpg', 14, 'http://localhost/storage_descansos/urnas/1761254359890_UrnaPruebaPost2.jpg', 0),
                                                                              (15, '1761254400259_UrnaPruebaPost1.jpg', 15, 'http://localhost/storage_descansos/urnas/1761254400259_UrnaPruebaPost1.jpg', 0),
                                                                              (16, '1761254400259_UrnaPruebaPost2.jpg', 15, 'http://localhost/storage_descansos/urnas/1761254400259_UrnaPruebaPost2.jpg', 1),
                                                                              (17, '1761254682307_UrnaPruebaPost1.jpg', 16, 'http://localhost/storage_descansos/urnas/1761254682307_UrnaPruebaPost1.jpg', 0),
                                                                              (18, '1761254682308_UrnaPruebaPost2.jpg', 16, 'http://localhost/storage_descansos/urnas/1761254682308_UrnaPruebaPost2.jpg', 0),
                                                                              (19, '1761254686076_UrnaPruebaPost1.jpg', 17, 'http://localhost/storage_descansos/urnas/1761254686076_UrnaPruebaPost1.jpg', 0),
                                                                              (20, '1761254686077_UrnaPruebaPost2.jpg', 17, 'http://localhost/storage_descansos/urnas/1761254686077_UrnaPruebaPost2.jpg', 0),
                                                                              (21, '1761254691188_UrnaPruebaPost1.jpg', 18, 'http://localhost/storage_descansos/urnas/1761254691188_UrnaPruebaPost1.jpg', 0),
                                                                              (22, '1761254691189_UrnaPruebaPost2.jpg', 18, 'http://localhost/storage_descansos/urnas/1761254691189_UrnaPruebaPost2.jpg', 1),
                                                                              (23, '1761254918739_UrnaPruebaPost2.jpg', 22, 'http://localhost/storage_descansos/urnas/1761254918739_UrnaPruebaPost2.jpg', 0),
                                                                              (24, '1761254918740_UrnaPruebaPost1.jpg', 22, 'http://localhost/storage_descansos/urnas/1761254918740_UrnaPruebaPost1.jpg', 0),
                                                                              (25, '1761254921828_UrnaPruebaPost2.jpg', 23, 'http://localhost/storage_descansos/urnas/1761254921828_UrnaPruebaPost2.jpg', 0),
                                                                              (26, '1761254921829_UrnaPruebaPost1.jpg', 23, 'http://localhost/storage_descansos/urnas/1761254921829_UrnaPruebaPost1.jpg', 1),
                                                                              (27, '1761255017590_UrnaPruebaPost2.jpg', 24, 'http://localhost/storage_descansos/urnas/1761255017590_UrnaPruebaPost2.jpg', 0),
                                                                              (28, '1761255017591_UrnaPruebaPost1.jpg', 24, 'http://localhost/storage_descansos/urnas/1761255017591_UrnaPruebaPost1.jpg', 0),
                                                                              (29, '1761255081376_UrnaPruebaPost2.jpg', 25, 'http://localhost/storage_descansos/urnas/1761255081376_UrnaPruebaPost2.jpg', 0),
                                                                              (30, '1761255081376_UrnaPruebaPost1.jpg', 25, 'http://localhost/storage_descansos/urnas/1761255081376_UrnaPruebaPost1.jpg', 0),
                                                                              (31, '1761255081388_urnanosotrsos.jpg', 25, 'http://localhost/storage_descansos/urnas/1761255081388_urnanosotrsos.jpg', 1),
                                                                              (32, '1761262913293_UrnaPruebaPost2.jpg', 26, 'http://localhost/storage_descansos/urnas/1761262913293_UrnaPruebaPost2.jpg', 0),
                                                                              (33, '1761262913294_UrnaPruebaPost1.jpg', 26, 'http://localhost/storage_descansos/urnas/1761262913294_UrnaPruebaPost1.jpg', 0),
                                                                              (34, '1761262913295_urnas-funeraria.jpg', 26, 'http://localhost/storage_descansos/urnas/1761262913295_urnas-funeraria.jpg', 1),
                                                                              (35, '1761262913303_urnanosotrsos.jpg', 26, 'http://localhost/storage_descansos/urnas/1761262913303_urnanosotrsos.jpg', 0),
                                                                              (36, '1761262913310_FondoCatalogo.png', 26, 'http://localhost/storage_descansos/urnas/1761262913310_FondoCatalogo.png', 0),
                                                                              (37, '1761276887469_UrnaPruebaPost2.jpg', 27, 'http://localhost/storage_descansos/urnas/1761276887469_UrnaPruebaPost2.jpg', 0),
                                                                              (38, '1761276887483_UrnaPruebaPost1.jpg', 27, 'http://localhost/storage_descansos/urnas/1761276887483_UrnaPruebaPost1.jpg', 1),
                                                                              (39, '1761277271625_urnas-funeraria.jpg', 28, 'http://localhost/storage_descansos/urnas/1761277271625_urnas-funeraria.jpg', 0),
                                                                              (40, '1761277271644_UrnaPruebaPost2.jpg', 28, 'http://localhost/storage_descansos/urnas/1761277271644_UrnaPruebaPost2.jpg', 1),
                                                                              (41, '1761277271667_UrnaPruebaPost1.jpg', 28, 'http://localhost/storage_descansos/urnas/1761277271667_UrnaPruebaPost1.jpg', 0),
                                                                              (42, '1761277282783_urnas-funeraria.jpg', 29, 'http://localhost/storage_descansos/urnas/1761277282783_urnas-funeraria.jpg', 0),
                                                                              (43, '1761277282795_UrnaPruebaPost2.jpg', 29, 'http://localhost/storage_descansos/urnas/1761277282795_UrnaPruebaPost2.jpg', 1),
                                                                              (44, '1761277708534_urnas-funeraria.jpg', 30, 'http://localhost/storage_descansos/urnas/1761277708534_urnas-funeraria.jpg', 1),
                                                                              (45, '1761277708549_UrnaPruebaPost2.jpg', 30, 'http://localhost/storage_descansos/urnas/1761277708549_UrnaPruebaPost2.jpg', 0),
                                                                              (46, '1761278067815_urnas-funeraria.jpg', 31, 'http://localhost/storage_descansos/urnas/1761278067815_urnas-funeraria.jpg', 1),
                                                                              (47, '1761278067829_UrnaPruebaPost2.jpg', 31, 'http://localhost/storage_descansos/urnas/1761278067829_UrnaPruebaPost2.jpg', 0),
                                                                              (48, '1761278112723_urnas-funeraria.jpg', 32, 'http://localhost/storage_descansos/urnas/1761278112723_urnas-funeraria.jpg', 0),
                                                                              (49, '1761278112736_UrnaPruebaPost2.jpg', 32, 'http://localhost/storage_descansos/urnas/1761278112736_UrnaPruebaPost2.jpg', 0),
                                                                              (50, '1761278112748_UrnaPruebaPost1.jpg', 32, 'http://localhost/storage_descansos/urnas/1761278112748_UrnaPruebaPost1.jpg', 0),
                                                                              (51, '1761278112768_urnanosotrsos.jpg', 32, 'http://localhost/storage_descansos/urnas/1761278112768_urnanosotrsos.jpg', 0),
                                                                              (52, '1761278112800_FondoCatalogo.png', 32, 'http://localhost/storage_descansos/urnas/1761278112800_FondoCatalogo.png', 1),
                                                                              (53, '1761278618339_urnas-funeraria.jpg', 33, 'http://localhost/storage_descansos/urnas/1761278618339_urnas-funeraria.jpg', 0),
                                                                              (54, '1761278618349_UrnaPruebaPost2.jpg', 33, 'http://localhost/storage_descansos/urnas/1761278618349_UrnaPruebaPost2.jpg', 1),
                                                                              (55, '1761280344700_urnas-funeraria.jpg', 36, 'http://localhost/storage_descansos/urnas/1761280344700_urnas-funeraria.jpg', 1),
                                                                              (56, '1761280344718_UrnaPruebaPost2.jpg', 36, 'http://localhost/storage_descansos/urnas/1761280344718_UrnaPruebaPost2.jpg', 0),
                                                                              (57, '1761321736573_imgUrnPruebaPost2.jpg', 37, 'http://localhost/storage_descansos/urnas/1761321736573_imgUrnPruebaPost2.jpg', 0),
                                                                              (58, '1761321736983_imgUrnPruebaPost.jpg', 37, 'http://localhost/storage_descansos/urnas/1761321736983_imgUrnPruebaPost.jpg', 1),
                                                                              (59, '1761676311928_OIP.jpeg', 38, 'http://localhost/storage_descansos/urnas/1761676311928_OIP.jpeg', 1),
                                                                              (60, '1761676312073_R.jpeg', 38, 'http://localhost/storage_descansos/urnas/1761676312073_R.jpeg', 0),
                                                                              (61, '1761761139946_R (1).jpeg', 39, 'http://localhost/storage_descansos/urnas/1761761139946_R (1).jpeg', 0),
                                                                              (62, '1761761140002_OIP.webp', 39, 'http://localhost/storage_descansos/urnas/1761761140002_OIP.webp', 1),
                                                                              (63, '1764105423531_10226734.png', 40, 'http://localhost/storage_descansos/urnas/1764105423531_10226734.png', 0),
                                                                              (64, '1764105423613_urnaprueba.jpg', 40, 'http://localhost/storage_descansos/urnas/1764105423613_urnaprueba.jpg', 0),
                                                                              (65, '1764105570930_10226734.png', 40, 'http://localhost/storage_descansos/urnas/1764105570930_10226734.png', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

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

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id`, `cantidad_actual`, `cantidad_maxima`, `cantidad_minima`, `estado`, `ubicacion_fisica`, `ultima_actualizacion`, `urna_id`) VALUES
                                                                                                                                                              (1, 4, 20, 2, 'Disponible', 'Bodega Central - Estante A3', '2025-11-25 22:07:18.000000', 1),
                                                                                                                                                              (2, 8, 25, 3, 'Disponible', 'Bodega Central - Estante B2', '2025-10-21 21:40:11.000000', 2),
                                                                                                                                                              (3, 3, 10, 2, 'Bajo Stock', 'Bodega Secundaria - Estante C1', '2025-10-21 21:40:11.000000', 3),
                                                                                                                                                              (4, 18, 40, 5, 'Disponible', 'Bodega Central - Estante D5', '2025-11-25 22:04:03.000000', 4),
                                                                                                                                                              (5, 10, 25, 3, 'Disponible', 'Bodega Central - Estante B2', '2025-10-22 00:51:22.000000', 2),
                                                                                                                                                              (6, 10, 50, 5, 'Disponible', 'Bodeguita de Prueba3', '2025-10-24 04:32:24.000000', 36),
                                                                                                                                                              (7, 10, 50, 5, 'Disponible', 'Bodeguita 4Post', '2025-10-24 16:02:17.000000', 37),
                                                                                                                                                              (8, 10, 50, 5, 'Disponible', 'ewfesfew', '2025-10-28 18:31:52.000000', 38),
                                                                                                                                                              (9, 10, 50, 5, 'Disponible', 'Bodegua 3', '2025-10-29 18:05:40.000000', 39),
                                                                                                                                                              (10, 12, 50, 5, 'Disponible', 'Bodega Norte - Estante C09', '2025-11-25 21:17:03.000000', 40);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item_carrito`
--

CREATE TABLE `item_carrito` (
                                `id` bigint(20) NOT NULL,
                                `carrito_id` bigint(20) NOT NULL,
                                `urna_id` bigint(20) NOT NULL,
                                `cantidad` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `item_carrito`
--

INSERT INTO `item_carrito` (`id`, `carrito_id`, `urna_id`, `cantidad`) VALUES
                                                                           (1, 1, 1, 2),
                                                                           (2, 1, 2, 1),
                                                                           (5, 2, 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `material`
--

CREATE TABLE `material` (
                            `id` int(11) NOT NULL,
                            `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `material`
--

INSERT INTO `material` (`id`, `nombre`) VALUES
                                            (1, 'Metal'),
                                            (2, 'Madera'),
                                            (3, 'Cerámica'),
                                            (4, 'Mármol'),
                                            (5, 'Biodegradable');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelo`
--

CREATE TABLE `modelo` (
                          `id` int(11) NOT NULL,
                          `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modelo`
--

INSERT INTO `modelo` (`id`, `nombre`) VALUES
                                          (1, 'Clásico'),
                                          (2, 'Moderno'),
                                          (3, 'Lujo'),
                                          (4, 'Ecológico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento_stock`
--

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

--
-- Volcado de datos para la tabla `movimiento_stock`
--

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
                                                                                                                                                                          (12, 18, 19, '2025-10-21 21:45:29.000000', 'Ajuste de conteo físico de inventario', 'Entrada', 'Supervisor Bodega', 4),
                                                                                                                                                                          (13, 7, 6, '2025-11-25 21:14:01.000000', 'Venta%20Web', 'Salida', 'LucasMoncada', 1),
                                                                                                                                                                          (14, 19, 18, '2025-11-25 22:04:03.000000', 'Venta%20Web', 'Salida', 'otroprueba', 4),
                                                                                                                                                                          (15, 6, 4, '2025-11-25 22:07:18.000000', 'Venta%20Web', 'Salida', 'otroprueba', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
                          `id` int(11) NOT NULL,
                          `usuario_id` int(11) NOT NULL,
                          `direccion_id` int(11) DEFAULT NULL,
                          `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp(),
                          `estado_pedido_id` int(11) NOT NULL,
                          `total` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id`, `usuario_id`, `direccion_id`, `fecha_pedido`, `estado_pedido_id`, `total`) VALUES
                                                                                                           (1, 3, 2, '2025-10-21 23:36:52', 1, 179980.00),
                                                                                                           (2, 5, 4, '2025-11-25 21:14:00', 3, 76000.00),
                                                                                                           (3, 11, 5, '2025-11-25 22:04:03', 1, 99000.00),
                                                                                                           (4, 11, 5, '2025-11-25 22:07:18', 1, 152000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `region`
--

CREATE TABLE `region` (
                          `id` int(11) NOT NULL,
                          `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `region`
--

INSERT INTO `region` (`id`, `nombre`) VALUES
    (1, 'Región Metropolitana de Santiago');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `urna`
--

CREATE TABLE `urna` (
                        `id` int(11) NOT NULL,
                        `id_interno` varchar(50) DEFAULT NULL,
                        `nombre` varchar(120) NOT NULL,
                        `descripcion_corta` text DEFAULT NULL,
                        `descripcion_detallada` text DEFAULT NULL,
                        `precio` decimal(10,2) NOT NULL,
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

--
-- Volcado de datos para la tabla `urna`
--

INSERT INTO `urna` (`id`, `id_interno`, `nombre`, `descripcion_corta`, `descripcion_detallada`, `precio`, `disponible`, `ancho`, `alto`, `profundidad`, `peso`, `imagen_principal`, `estado`, `fecha_creacion`, `material_id`, `color_id`, `modelo_id`) VALUES
                                                                                                                                                                                                                                                            (1, 'U005', 'Urna Clásica de Madera', 'Clásica', 'Urna de madera con acabado natural', 76000.00, 's', 25.50, 30.00, 20.00, 3.50, '/img/urnasimg/clasicamadera.jpg', 'Activo', '2025-10-21 23:36:52', 2, 2, 1),
                                                                                                                                                                                                                                                            (2, 'U006', 'Urna Moderna de Cerámica', 'Moderna', 'Urna de cerámica con líneas minimalistas', 59000.00, 's', 18.00, 28.00, 18.00, 4.00, '/img/urnasimg/ceramica.png', 'Activo', '2025-10-21 23:36:52', 3, 5, 2),
                                                                                                                                                                                                                                                            (3, 'U007', 'Urna de Lujo con Incrustaciones', 'Lujo', 'Urna de mármol con detalles de oro', 45000.00, 's', 24.00, 35.00, 24.00, 5.00, '/img/urnasimg/urna_lujo.jpg', 'Activo', '2025-10-21 23:36:52', 4, 6, 3),
                                                                                                                                                                                                                                                            (4, 'U008', 'Urna Metálica Resistente', 'Metálica', 'Urna de metal con acabado pulido', 99000.00, 's', 20.00, 30.00, 20.00, 3.00, '/img/urnasimg/urna_metalica.png', 'Activo', '2025-10-21 23:36:52', 1, 4, 2),
                                                                                                                                                                                                                                                            (5, NULL, 'Urna De Madera prueba Post', 'Prueba de Post', 'Prueba de post mediante Interfaz web (Desde la Vista del Administrados)', 500000.00, 's', 60.00, 50.00, 200.00, 20.00, '/uploads/urnas/1761211823879_UrnaPruebaPost2.jpg', 'Activo', '2025-10-23 12:30:23', 2, 2, 1),
                                                                                                                                                                                                                                                            (6, 'URN-012', 'Prueba2Post', 'Prueba Post', 'Prueba Post Storage Xamp', 60000.00, 's', 60.00, 50.00, 200.00, 20.00, '', 'Activo', '2025-10-23 23:32:38', 2, 2, 1),
                                                                                                                                                                                                                                                            (7, 'sddfsdfsdf', 'sdfsdfsdf', 'sdfsdfds', 'dfsdfdsfsdfds', 34234.00, 's', 23.00, 32.00, 200.00, 23.00, '', 'Activo', '2025-10-24 00:03:44', 1, 2, 1),
                                                                                                                                                                                                                                                            (8, 'asd', 'sdsa', 'asdas', 'asdsadsa', 232333.00, 's', 23.00, 32.00, 32.00, 323.00, '', 'Activo', '2025-10-24 00:14:33', 1, 2, 3),
                                                                                                                                                                                                                                                            (11, 'asdas', 'sdasdsa', 'asdsa', 'asdsad', 2132.00, 's', 32.00, 32.00, 223.00, 23.00, '', 'Activo', '2025-10-24 00:16:02', 1, 2, 2),
                                                                                                                                                                                                                                                            (12, 'asdas', 'sdasdsa', 'asdsa', 'asdsad', 2132.00, 's', 32.00, 32.00, 223.00, 23.00, '', 'Activo', '2025-10-24 00:17:56', 1, 2, 2),
                                                                                                                                                                                                                                                            (13, 'asdsa', 'asdasd', 'asdas', 'asdas', 32.00, 's', 23.00, 32.00, 323.00, 32.00, '', 'Activo', '2025-10-24 00:18:59', 1, 2, 2),
                                                                                                                                                                                                                                                            (14, 'asdsa', 'asdasd', 'asdas', 'asdas', 32.00, 's', 23.00, 32.00, 323.00, 32.00, '', 'Activo', '2025-10-24 00:19:19', 1, 2, 2),
                                                                                                                                                                                                                                                            (15, '012', 'sdfds', 'dsfdsfsd', '32ewrfewfsre', 23.00, 's', 23.00, 23.00, 23.00, 23.00, 'http://localhost/storage_descansos/urnas/1761254400259_UrnaPruebaPost2.jpg', 'Activo', '2025-10-24 00:20:00', 3, 3, 1),
                                                                                                                                                                                                                                                            (16, 'asdsadas', 'sadsadsa', 'asdsad', 'sadsadsada', 2323.00, 's', 23.00, 342.00, 32.00, 23.00, '', 'Activo', '2025-10-24 00:24:42', 2, 2, 2),
                                                                                                                                                                                                                                                            (17, 'asdsadas', 'sadsadsa', 'asdsad', 'sadsadsada', 2323.00, 's', 23.00, 342.00, 32.00, 23.00, '', 'Activo', '2025-10-24 00:24:46', 2, 2, 2),
                                                                                                                                                                                                                                                            (18, 'asdsadas', 'sadsadsa', 'asdsad', 'sadsadsada', 2323.00, 's', 23.00, 342.00, 32.00, 23.00, 'http://localhost/storage_descansos/urnas/1761254691189_UrnaPruebaPost2.jpg', 'Activo', '2025-10-24 00:24:51', 2, 2, 2),
                                                                                                                                                                                                                                                            (19, 'asdas', 'sdsas', 'asdsaddasasdas', 'asdasd', 2323.00, 's', 32.00, 32.00, 32.00, 323.00, '', 'Activo', '2025-10-24 00:26:59', 1, 2, 2),
                                                                                                                                                                                                                                                            (20, 'asdas', 'sdsas', 'asdsaddasasdas', 'asdasd', 2323.00, 's', 32.00, 32.00, 32.00, 323.00, '', 'Activo', '2025-10-24 00:27:02', 1, 2, 2),
                                                                                                                                                                                                                                                            (21, 'asdas', 'sdsas', 'asdsaddasasdas', 'asdasd', 2323.00, 's', 32.00, 32.00, 32.00, 323.00, '', 'Activo', '2025-10-24 00:27:07', 1, 2, 2),
                                                                                                                                                                                                                                                            (22, 'asdas', 'sdsas', 'asdsaddasasdas', 'asdasd', 2323.00, 's', 32.00, 32.00, 32.00, 323.00, '', 'Activo', '2025-10-24 00:28:38', 1, 2, 2),
                                                                                                                                                                                                                                                            (23, 'asdas', 'sdsas', 'asdsaddasasdas', 'asdasd', 2323.00, 's', 32.00, 32.00, 32.00, 323.00, 'http://localhost/storage_descansos/urnas/1761254921829_UrnaPruebaPost1.jpg', 'Activo', '2025-10-24 00:28:41', 1, 2, 2),
                                                                                                                                                                                                                                                            (24, 'asdas', 'sdsas', 'asdsaddasasdas', 'asdasd', 2323.00, 's', 32.00, 32.00, 32.00, 323.00, '', 'Activo', '2025-10-24 00:30:17', 1, 2, 2),
                                                                                                                                                                                                                                                            (25, 'asdas', 'sdsas', 'asdsaddasasdas', 'asdasd', 2323.00, 's', 32.00, 32.00, 32.00, 323.00, 'http://localhost/storage_descansos/urnas/1761255081388_urnanosotrsos.jpg', 'Activo', '2025-10-24 00:31:21', 1, 2, 2),
                                                                                                                                                                                                                                                            (26, '', 'qwdasdas', 'sadsadsa', 'asdasdasd', 112.00, 's', 2312.00, 23.00, 21.00, 232.00, 'http://localhost/storage_descansos/urnas/1761262913295_urnas-funeraria.jpg', 'Activo', '2025-10-24 02:41:53', 1, 1, 3),
                                                                                                                                                                                                                                                            (27, NULL, 'sdassad', 'wersefsd', 'sdfdsfdsf', 442.00, 's', 32.00, 23.00, 34.00, 43.00, 'http://localhost/storage_descansos/urnas/1761276887483_UrnaPruebaPost1.jpg', NULL, '2025-10-24 06:34:47', NULL, NULL, NULL),
                                                                                                                                                                                                                                                            (28, '324', 'sdsadsad', 'asdasdsad', 'sadsadsadsad', 32423.00, 's', 34.00, 34.00, 32.00, 32.00, 'http://localhost/storage_descansos/urnas/1761277271644_UrnaPruebaPost2.jpg', 'Activo', '2025-10-24 06:41:11', 1, 2, 1),
                                                                                                                                                                                                                                                            (29, '324', 'sdsadsad', 'asdasdsad', 'sadsadsadsad', 32423.00, 's', 34.00, 34.00, 32.00, 32.00, 'http://localhost/storage_descansos/urnas/1761277282795_UrnaPruebaPost2.jpg', 'Activo', '2025-10-24 06:41:22', 1, 2, 1),
                                                                                                                                                                                                                                                            (30, 'sadas', 'asdas', 'sadasdsadas', 'sadasdasdsad', 56756.00, 's', 234.00, 324.00, 23.00, 23.00, 'http://localhost/storage_descansos/urnas/1761277708534_urnas-funeraria.jpg', 'Activo', '2025-10-24 06:48:28', 2, 2, 3),
                                                                                                                                                                                                                                                            (31, 'sadas', 'asdas', 'sadasdsadas', 'sadasdasdsad', 56756.00, 's', 234.00, 324.00, 23.00, 23.00, 'http://localhost/storage_descansos/urnas/1761278067815_urnas-funeraria.jpg', 'Activo', '2025-10-24 06:54:27', 2, 2, 3),
                                                                                                                                                                                                                                                            (32, '3434', 'ssadsa', 'dasdsa', 'asdasdas', 678.00, 's', 342.00, 234.00, 234.00, 324.00, 'http://localhost/storage_descansos/urnas/1761278112800_FondoCatalogo.png', 'Activo', '2025-10-24 06:55:12', 1, 1, 2),
                                                                                                                                                                                                                                                            (33, 'dsadsad', 'assadas', 'dsadasds', 'asdsadasdadas', 32423432.00, 's', 454.00, 54.00, 54.00, 55.00, 'http://localhost/storage_descansos/urnas/1761278618349_UrnaPruebaPost2.jpg', 'Activo', '2025-10-24 07:03:38', 2, 2, 3),
                                                                                                                                                                                                                                                            (34, 'saDSA', 'ASDAS', 'ASDASDAS', 'ASDASDASD', 33.00, 's', 43.00, 65.00, 87.00, 87.00, NULL, 'Activo', '2025-10-24 07:29:05', 2, 3, 3),
                                                                                                                                                                                                                                                            (35, 'ASDSAD', 'SADSAD', 'ASDSAD', 'ASDSAD', 32423.00, 's', 324.00, 234.00, 32.00, 343.00, NULL, 'Activo', '2025-10-24 07:29:38', 2, 3, 2),
                                                                                                                                                                                                                                                            (36, 'ASDSAD', 'SADSAD', 'ASDSAD', 'ASDSAD', 32423.00, 's', 324.00, 234.00, 32.00, 343.00, 'http://localhost/storage_descansos/urnas/1761280344700_urnas-funeraria.jpg', 'Activo', '2025-10-24 07:32:24', 2, 3, 2),
                                                                                                                                                                                                                                                            (37, 'URN-037', 'Urna37PruebaPost', 'PruebaPost37Local', 'PruebaLocalNotebookCesar', 100000.00, 's', 43.00, 45.00, 65.00, 32.00, 'http://localhost/storage_descansos/urnas/1761321736983_imgUrnPruebaPost.jpg', 'Activo', '2025-10-24 19:02:15', 4, 5, 3),
                                                                                                                                                                                                                                                            (38, '453453', 'TallerFullStack', 'dgfdfsdgsdgdgd', 'argrgegrete', 342333.00, 's', 32.00, 43.00, 34.00, 54.00, 'http://localhost/storage_descansos/urnas/1761676311928_OIP.jpeg', 'Activo', '2025-10-28 21:31:51', 2, 4, 3),
                                                                                                                                                                                                                                                            (39, 'URN-002', 'Urnas Prueba Fullstacj', 'DEsfaddfsfds', 'asdsadsadsadassdas', 200000.00, 's', 200.00, 32.00, 32.00, 43.00, 'http://localhost/storage_descansos/urnas/1761761140002_OIP.webp', 'Activo', '2025-10-29 21:05:39', 2, 2, 3),
                                                                                                                                                                                                                                                            (40, 'AHA8', 'Urna Clásica de Piedra', 'Urna Clásica de Piedra', '', 100000.00, 's', 12.00, 12.00, 12.00, 90.00, 'http://localhost/storage_descansos/urnas/1764105570930_10226734.png', 'Activo', '2025-11-26 00:17:03', 3, 6, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
                           `id` int(11) NOT NULL,
                           `nombre` varchar(100) NOT NULL,
                           `correo` varchar(120) NOT NULL,
                           `password` varchar(255) NOT NULL,
                           `rol` varchar(20) NOT NULL,
                           `estado` varchar(10) NOT NULL,
                           `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `correo`, `password`, `rol`, `estado`, `fecha_creacion`) VALUES
                                                                                                    (1, 'María González', 'MariaG@DescansosDelRecuerdo.cl', 'Admin123', 'Administrador', 'Activo', '2025-10-21 23:36:52'),
                                                                                                    (2, 'Carlos Rodríguez', 'CarlosR@DescansosDelRecuerdo.cl', 'Admin123', 'Administrador', 'Activo', '2025-10-21 23:36:52'),
                                                                                                    (3, 'César Rojas', 'CesarR@DescansosDelRecuerdo.cl', '$2a$12$E.a8euTEhDTPpY3Aw5YqrOFkJ0Mm85tFtI/p3MZDB4sM6VIdwqHg.', 'Administrador', 'Activo', '2025-10-21 23:36:52'),
                                                                                                    (5, 'LucasMoncada', 'lucasmoncada017@gmail.com', '$2a$12$Se8HgKF7pb8YRr8SYQsYS.NyBV92vOupFvSgAGVDtD0qbQowEj3Vu', 'Administrador', 'Activo', '2025-10-22 05:21:14'),
                                                                                                    (6, 'cesar', 'cesarrojasramos160@gmail.com', '$2a$12$gQD7T90EPTNyVLEMuD.nxuPMB.qYQZGtDPkjQlXdWy6TZ5VTG3pM6', 'Admin', 'Activo', '2025-10-22 09:59:51'),
                                                                                                    (7, 'cesar123', 'cesarrojasramos1123@gmail.com', '$2a$12$r/72bkO8XrjsXFhppVq4/Oqq/om2ewZ2qHqmgn7YcGfsRijniXMcS', 'Admin', 'Activo', '2025-10-22 10:07:27'),
                                                                                                    (8, 'cesar1235', 'cesarrojasramos1w123@gmail.com', '$2a$12$UxnsB0Fvc06wa3/byIvurOMtHnH7AeMPCiSpqiEGae2ouLpyW3Bqm', 'Administrador', 'Activo', '2025-10-22 10:20:16'),
                                                                                                    (9, 'cesar123', 'cesar@gmail.com', '$2a$12$oorhlkdbIcRJ/u5pqV1rau9CxKEf7ISiOaL7JFs4ytWBqXRjfWgf2', 'Administrador', 'Activo', '2025-10-24 17:48:35'),
                                                                                                    (10, 'Cliente', 'Cliente@gmail.com', '$2a$12$3k01cLw6cDez7w6.WVYP0eGO9yO/rwfGlgpznZfdOM5rC5Y8wQ5Pi', 'Cliente', 'Activo', '2025-10-29 19:18:37'),
                                                                                                    (11, 'otroprueba', 'otroprueba@gmail.com', '$2a$12$Q.X8WHA7xTau15o3ou0FAOp0mPCJa9DsKFG6xzQ.sajXGqR3m0pfe', 'Cliente', 'Activo', '2025-11-26 00:48:56');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_usuario` (`usuario_id`);

--
-- Indices de la tabla `color`
--
ALTER TABLE `color`
    ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
    ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `urna_id` (`urna_id`);

--
-- Indices de la tabla `comuna`
--
ALTER TABLE `comuna`
    ADD PRIMARY KEY (`id`),
  ADD KEY `region_id` (`region_id`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
    ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `urna_id` (`urna_id`);

--
-- Indices de la tabla `direccion`
--
ALTER TABLE `direccion`
    ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `estado_pedido`
--
ALTER TABLE `estado_pedido`
    ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `historial_stock`
--
ALTER TABLE `historial_stock`
    ADD PRIMARY KEY (`id`),
  ADD KEY `urna_id` (`urna_id`);

--
-- Indices de la tabla `imagen_urna`
--
ALTER TABLE `imagen_urna`
    ADD PRIMARY KEY (`id`),
  ADD KEY `urna_id` (`urna_id`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
    ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `item_carrito`
--
ALTER TABLE `item_carrito`
    ADD PRIMARY KEY (`id`),
  ADD KEY `fk_carrito_item` (`carrito_id`);

--
-- Indices de la tabla `material`
--
ALTER TABLE `material`
    ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `modelo`
--
ALTER TABLE `modelo`
    ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimiento_stock`
--
ALTER TABLE `movimiento_stock`
    ADD PRIMARY KEY (`id`),
  ADD KEY `FKje6wfvt36fv0aq2h1fux3wl4b` (`inventario_id`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
    ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `direccion_id` (`direccion_id`),
  ADD KEY `estado_pedido_id` (`estado_pedido_id`);

--
-- Indices de la tabla `region`
--
ALTER TABLE `region`
    ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `urna`
--
ALTER TABLE `urna`
    ADD PRIMARY KEY (`id`),
  ADD KEY `material_id` (`material_id`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `modelo_id` (`modelo_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `color`
--
ALTER TABLE `color`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `comuna`
--
ALTER TABLE `comuna`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `direccion`
--
ALTER TABLE `direccion`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estado_pedido`
--
ALTER TABLE `estado_pedido`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `historial_stock`
--
ALTER TABLE `historial_stock`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `imagen_urna`
--
ALTER TABLE `imagen_urna`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `item_carrito`
--
ALTER TABLE `item_carrito`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `material`
--
ALTER TABLE `material`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `modelo`
--
ALTER TABLE `modelo`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `movimiento_stock`
--
ALTER TABLE `movimiento_stock`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `region`
--
ALTER TABLE `region`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `urna`
--
ALTER TABLE `urna`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
    ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`urna_id`) REFERENCES `urna` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comuna`
--
ALTER TABLE `comuna`
    ADD CONSTRAINT `comuna_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `region` (`id`);

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
    ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedido` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`urna_id`) REFERENCES `urna` (`id`);

--
-- Filtros para la tabla `direccion`
--
ALTER TABLE `direccion`
    ADD CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `historial_stock`
--
ALTER TABLE `historial_stock`
    ADD CONSTRAINT `historial_stock_ibfk_1` FOREIGN KEY (`urna_id`) REFERENCES `urna` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagen_urna`
--
ALTER TABLE `imagen_urna`
    ADD CONSTRAINT `imagen_urna_ibfk_1` FOREIGN KEY (`urna_id`) REFERENCES `urna` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `item_carrito`
--
ALTER TABLE `item_carrito`
    ADD CONSTRAINT `fk_carrito_item` FOREIGN KEY (`carrito_id`) REFERENCES `carrito` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `movimiento_stock`
--
ALTER TABLE `movimiento_stock`
    ADD CONSTRAINT `FKje6wfvt36fv0aq2h1fux3wl4b` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
    ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`direccion_id`) REFERENCES `direccion` (`id`),
  ADD CONSTRAINT `pedido_ibfk_3` FOREIGN KEY (`estado_pedido_id`) REFERENCES `estado_pedido` (`id`);

--
-- Filtros para la tabla `urna`
--
ALTER TABLE `urna`
    ADD CONSTRAINT `urna_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`),
  ADD CONSTRAINT `urna_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `color` (`id`),
  ADD CONSTRAINT `urna_ibfk_3` FOREIGN KEY (`modelo_id`) REFERENCES `modelo` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
