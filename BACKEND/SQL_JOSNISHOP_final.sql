	-- ===================
	-- INSERTS AL FINAL
	-- ===================

	INSERT INTO `roles` (`id_rol`, `nombre`, `estado`) VALUES
		(1, 'vendedor', 1),
		(2, 'cliente', 1);

	INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contraseña`, `rol_id`, `estado`) VALUES
		(2, 'María Gómez', 'Cherith1605@gmail.com', '123', 2, 1),
		(3, 'Carlos Ruiz', 'carlos.ruiz@mail.com', 'cliente123', 2, 1),
		(4, 'Laura Sánchez', 'laura.sanchez@mail.com', 'cliente123', 2, 1),
		(5, 'Andrés Torres', 'andres.torres@mail.com', 'cliente123', 2, 1),
		(6, 'Sofía Ramírez', 'sofia.ramirez@mail.com', 'cliente123', 2, 1),
		(7, 'Pedro Castillo', 'pedro.castillo@mail.com', 'cliente123', 2, 1),
		(8, 'Lucía Fernández', 'lucia.fernandez@mail.com', 'cliente123', 2, 1),
		(9, 'Jorge Herrera', 'jorge.herrera@mail.com', 'cliente123', 2, 1),
		(10, 'Valentina Rojas', 'valentina.rojas@mail.com', 'cliente123', 2, 1),
		(11, 'Felipe Morales', 'felipe.morales@mail.com', 'cliente123', 2, 1),
		(12, 'Camila Vargas', 'camila.vargas@mail.com', 'cliente123', 2, 1),
		(13, 'Ricardo López', 'ricardo.lopez@mail.com', 'cliente123', 2, 1),
		(14, 'Daniela Castro', 'daniela.castro@mail.com', 'cliente123', 2, 1),
		(15, 'Mateo Gil', 'mateo.gil@mail.com', 'cliente123', 2, 1),
		(16, 'Gabriela Salazar', 'gabriela.salazar@mail.com', 'cliente123', 2, 1),
		(17, 'David Torres', 'david.torres@mail.com', 'cliente123', 2, 1),
		(18, 'Paula Díaz', 'paula.diaz@mail.com', 'cliente123', 2, 1),
		(19, 'Sebastián Romero', 'sebastian.romero@mail.com', 'cliente123', 2, 1),
		(20, 'Mónica Jiménez', 'monica.jimenez@mail.com', 'cliente123', 2, 1),
		(21, 'Álvaro Medina', 'alvaro.medina@mail.com', 'cliente123', 2, 1),
		(22, 'Natalia Figueroa', 'natalia.figueroa@mail.com', 'cliente123', 2, 1),
		(23, 'Cristian Cárdenas', 'cristian.cardenas@mail.com', 'cliente123', 2, 1),
		(24, 'Diana Ortega', 'diana.ortega@mail.com', 'cliente123', 2, 1),
		(25, 'Oscar Pineda', 'oscar.pineda@mail.com', 'cliente123', 2, 1),
		(26, 'Karina Suárez', 'karina.suarez@mail.com', 'cliente123', 2, 1),
		(27, 'Fernando Molina', 'fernando.molina@mail.com', 'cliente123', 2, 1),
		(28, 'Lorena Mejía', 'lorena.mejia@mail.com', 'cliente123', 2, 1),
		(29, 'Iván Delgado', 'ivan.delgado@mail.com', 'cliente123', 2, 1),
		(30, 'Alejandra Nieto', 'alejandra.nieto@mail.com', 'cliente123', 2, 1),
		(31, 'Héctor Silva', 'hector.silva@mail.com', 'cliente123', 2, 1),
		(32, 'Carolina Lozano', 'carolina.lozano@mail.com', 'cliente123', 2, 1),
		(33, 'Mauricio Peña', 'mauricio.pena@mail.com', 'cliente123', 2, 1),
		(34, 'Juliana Arias', 'juliana.arias@mail.com', 'cliente123', 2, 1),
		(35, 'Esteban Cabrera', 'esteban.cabrera@mail.com', 'cliente123', 2, 1),
		(36, 'Tatiana Muñoz', 'tatiana.munoz@mail.com', 'cliente123', 2, 1),
		(37, 'Francisco Vega', 'francisco.vega@mail.com', 'cliente123', 2, 1),
		(38, 'Angela Páez', 'angela.paez@mail.com', 'cliente123', 2, 1),
		(39, 'Diego Villalba', 'diego.villalba@mail.com', 'cliente123', 2, 1),
		(40, 'Marcela Cifuentes', 'marcela.cifuentes@mail.com', 'cliente123', 2, 1),
		(41, 'Camilo Rincón', 'camilo.rincon@mail.com', 'cliente123', 2, 1),
		(42, 'Liliana Pardo', 'liliana.pardo@mail.com', 'cliente123', 2, 1),
		(43, 'Raúl Montoya', 'raul.montoya@mail.com', 'cliente123', 2, 1),
		(44, 'Pilar León', 'pilar.leon@mail.com', 'cliente123', 2, 1),
		(45, 'Andrés Beltrán', 'andres.beltran@mail.com', 'cliente123', 2, 1),
		(46, 'Margarita Correa', 'margarita.correa@mail.com', 'cliente123', 2, 1),
		(47, 'Hernán Duarte', 'hernan.duarte@mail.com', 'cliente123', 2, 1),
		(48, 'Verónica Ríos', 'veronica.rios@mail.com', 'cliente123', 2, 1),
		(49, 'Guillermo Vargas', 'guillermo.vargas@mail.com', 'cliente123', 2, 1),
		(50, 'Isabel Castillo', 'isabel.castillo@mail.com', 'cliente123', 2, 1),
		(51, 'juan', 'juan@gmail.com', '123', 1, NULL);

	INSERT INTO `categorias` (`id`, `nombre`, `estado`, `fecha_creacion`) VALUES
		(1, 'Hogar', 1, '2025-01-05'),
		(2, 'Accesorios', 1, '2025-01-05'),
		(3, 'Bisutería', 1, '2025-01-06'),
		(4, 'Moda Mujer', 1, '2025-01-06'),
		(5, 'Electricidad', 1, '2025-01-07'),
		(6, 'Deporte y Ocio', 1, '2025-01-07'),
		(7, 'Moda Hombre', 1, '2025-01-08'),
		(8, 'Muebles', 1, '2025-01-08'),
		(9, 'Mascota', 1, '2025-01-09'),
		(10, 'Seguridad', 1, '2025-01-09'),
		(11, 'Juguetes', 1, '2025-01-10');

	-- 2. INSERTAR 200 PRODUCTOS EN LAS 11 CATEGORÍAS
	INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `categoria_id`) VALUES
	-- CATEGORÍA 1: Hogar (ID 1)
	(1, 'Sartén Antiadherente 28cm', 'Sartén de teflón con mango de silicona', 1),
	(2, 'Set de Ollas 5 Piezas', 'Acero inoxidable, base de inducción', 1),
	(3, 'Organizador de Especias Giratorio', 'Estante con 12 frascos de vidrio', 1),
	(4, 'Batidora de Mano Eléctrica', '5 velocidades con función turbo', 1),
	(5, 'Freidora de Aire Digital 4L', 'Cocina sin aceite con 8 programas', 1),
	(6, 'Juego de Cuchillos Chef Profesional', 'Acero damasco, 6 piezas con bloque de madera', 1),
	(7, 'Cuadro Abstracto Moderno', 'Lienzo impreso 70x100cm', 1),
	(8, 'Alfombra Shaggy 2x3m', 'Pelo largo, antideslizante, color gris', 1),
	(9, 'Reloj de Pared Minimalista', 'Diseño moderno, diámetro 40cm', 1),
	(10, 'Escoba y Recogedor Mágicos', 'Sistema de autolimpieza', 1),
	(11, 'Trapeador Giratorio Profesional', 'Cubeta con sistema de centrifugado', 1),
	(12, 'Ambientador Automático Glade', 'Programable con 3 niveles de intensidad', 1),
	(13, 'Alfombrilla de Baño Antideslizante', 'Microfibra suave y absorbente', 1),
	(14, 'Cortina de Baño Impermeable', 'Diseño geométrico con ganchos', 1),
	(15, 'Dispensador de Jabón Automático', 'Sensor infrarrojo, 300ml', 1),
	(101, 'Cafetera Programable 12 Tazas', 'Con filtro permanente y placa calefactora', 1),
	(102, 'Horno Eléctrico de Convección', '30 litros, función rostizador', 1),
	(103, 'Set de Tuppers Herméticos (5 und.)', 'Plástico libre de BPA, apto para microondas', 1),
	(104, 'Velas Aromáticas de Soja', 'Set de 3 aromas (Lavanda, Vainilla, Sándalo)', 1),
	(105, 'Juego de Cubiertos Acero Inoxidable (24 pzs)', 'Mango ergonómico, diseño moderno', 1),
	(106, 'Escurridor de Platos de Bambú', 'Plegable con bandeja de drenaje', 1),
	(107, 'Limpiavidrios Magnético', 'Para ventanas de doble panel', 1),
	(108, 'Toallas de Mano de Lujo (4 und.)', 'Algodón egipcio, alta absorción', 1),
	(109, 'Espejo de Baño Anti-Vaho con LED', 'Táctil con aumento 5X', 1),

	-- CATEGORÍA 2: Accesorios (ID 2)
	(16, 'Lentes de Sol Aviador Polarizados', 'Marco metálico, protección UV400 (Mujer)', 2),
	(17, 'Sombrero de Fieltro Fedora', 'Ala ancha, banda de cuero (Mujer)', 2),
	(18, 'Bolso Shopper de Cuero Sintético', 'Amplio, con bolsillo interno (Mujer)', 2),
	(19, 'Pañuelo de Seda Estampado', 'Diseño floral, 90x90cm (Mujer)', 2),
	(20, 'Cinturón Elástico Ancho', 'Hebilla metálica dorada (Mujer)', 2),
	(21, 'Monedero Plegable con Cremallera', 'Piel vegana, compartimento para tarjetas (Mujer)', 2),
	(22, 'Pasadores para Cabello de Perlas', 'Set de 4 clips elegantes (Mujer)', 2),
	(23, 'Reloj Analógico de Acero Inoxidable', 'Cronógrafo y resistente al agua (Hombre)', 2),
	(24, 'Morral para Laptop 15"', 'Múltiples compartimentos, anti-robo (Hombre)', 2),
	(25, 'Gorra Trucker Negra', 'Malla transpirable, visera curva (Hombre)', 2),
	(26, 'Billetera de Cuero Clásica', 'Doble pliegue con clip para billetes (Hombre)', 2),
	(27, 'Corbata de Seda Slim Fit', 'Diseño de rayas diagonales (Hombre)', 2),
	(28, 'Bufanda de Lana Cachemira', 'Extra suave y cálida (Hombre)', 2),
	(29, 'Manilla de Cuero Trenzado', 'Cierre magnético de acero (Hombre)', 2),
	(30, 'Sombrilla Automática Reforzada', 'Anti-viento, tamaño grande (Unisex)', 2),
	(110, 'Set de Guantes y Gorro de Lana', 'Forro térmico, unisex', 2),
	(111, 'Riñonera Deportiva Impermeable', 'Para correr y viajes, con porta-botella', 2),
	(112, 'Paquete de Medias Invisibles (6 pares)', 'Antideslizantes, unisex', 2),
	(113, 'Correa para Reloj de Silicona', '20mm, varios colores', 2),
	(114, 'Estuche Rígido para Gafas de Sol', 'Interior afelpado', 2),
	(115, 'Llavero Multifuncional con Abridor', 'Acero inoxidable', 2),
	(116, 'Tarjetero de Aluminio Anti-RFID', 'Capacidad para 8 tarjetas (Hombre)', 2),
	(117, 'Diadema Trenzada de Terciopelo', 'Para peinados (Mujer)', 2),
	(118, 'Cinturón Reversible de Cuero Genuino', 'Negro/Marrón (Hombre)', 2),

	-- CATEGORÍA 3: Bisutería (ID 3)
	(31, 'Anillo Minimalista de Acero Inoxidable', 'Fino y ajustable', 3),
	(32, 'Anillo con Piedra de Circón', 'Estilo solitario, baño de oro', 3),
	(33, 'Collar de Perlas de Imitación', 'Estilo vintage, largo clásico', 3),
	(34, 'Collar Dorado con Dijes Intercambiables', 'Cadena fina y elegante', 3),
	(35, 'Pulsera de Cuentas de Piedra Volcánica', 'Con cuentas de ojo de tigre', 3),
	(36, 'Pulsera de Cuero Trenzado Doble', 'Estilo unisex', 3),
	(37, 'Pulsera Paracord de Supervivencia', 'Multiusos con brújula', 3),
	(38, 'Aretes Argollas Grandes de Plata', '30mm de diámetro', 3),
	(39, 'Aretes Largos Colgantes', 'Con flecos de seda y cristales', 3),
	(40, 'Aretes Minimalistas de Botón', 'Pequeños, bañados en oro', 3),
	(119, 'Collar Estilo Coreano con Dijes de Mariposa', 'Cadena de oro laminado', 3),
	(120, 'Set de 3 Pulseras de Hilo Rojo', 'Con nudo corredizo y dije de la suerte', 3),
	(121, 'Anillo con Inicial Personalizada', 'Baño de plata', 3),
	(122, 'Aretes Tipo Trepador de Circonitas', 'Diseño que sube por la oreja', 3),
	(123, 'Tobillera de Cadena Fina', 'Con pequeños abalorios', 3),
	(124, 'Brazalete Ancho Estilo Vintage', 'Metal envejecido con detalles grabados', 3),
	(125, 'Pendientes de Aro con Perlas Colgantes', 'Cierre de clip', 3),
	(126, 'Set de 5 Anillos Minimalistas', 'Para usar en falanges (mid-rings)', 3),
	(127, 'Collar Estilo Choker de Terciopelo', 'Con dije central', 3),

	-- CATEGORÍA 4: Moda Mujer (ID 4)
	(41, 'Blusa de Gasa Cuello V', 'Manga larga, color blanco', 4),
	(42, 'Vestido Midi Floral', 'Corte A, ideal para verano', 4),
	(43, 'Pantalón Culotte de Lino', 'Cintura alta, color beige', 4),
	(44, 'Chaqueta Denim Oversize', 'Estilo vintage, azul claro', 4),
	(45, 'Enterizo Palazzo de Noche', 'Tela satinada, color negro', 4),
	(46, 'Sandalias de Plataforma Esparto', 'Altura 8cm, tiras de tela', 4),
	(47, 'Botas Chelsea de Cuero Negro', 'Tacón bajo, suela track', 4),
	(48, 'Zapatillas Urbanas Blancas', 'Suela gruesa, estilo deportivo', 4),
	(49, 'Mocasines de Terciopelo', 'Con adorno de cadena dorada', 4),
	(50, 'Tacones Stiletto Rojos', 'Clásico de 10cm', 4),
	(128, 'Falda Midi Plisada', 'Cintura elástica, color mostaza', 4),
	(129, 'Saco de Lana Gruesa Oversize', 'Cuello alto, ideal para invierno', 4),
	(130, 'Tops Cortos (3 unidades)', 'De algodón elástico, varios colores', 4),
	(131, 'Overol de Jean Roto', 'Estilo casual, tirantes ajustables', 4),
	(132, 'Botas de Lluvia de Goma', 'Caña alta, forro interior', 4),
	(133, 'Zapatillas Deportivas de Malla Transpirable', 'Ligeras para entrenamiento', 4),
	(134, 'Blazer Cruzado de Oficina', 'Hombreras estructuradas, color negro', 4),
	(135, 'Vestido Maxi Bohemio', 'Estampado paisley, tela fluida', 4),
	(136, 'Pantalón Jogger Deportivo', 'Felpa suave, puños elásticos', 4),

	-- CATEGORÍA 5: Electricidad (ID 5)
	(51, 'Bombillos LED Inteligentes (4 und.)', 'Control por Wi-Fi, luz cálida/fría', 5),
	(52, 'Lámpara de Escritorio LED Recargable', '3 niveles de brillo, cuello flexible', 5),
	(53, 'Tira LED RGB 5 metros', 'Control remoto y aplicación móvil', 5),
	(54, 'Lámpara Colgante Geométrica', 'Estilo nórdico, metal negro', 5),
	(55, 'Multitoma con 6 Entradas y 2 USB', 'Supresor de picos', 5),
	(56, 'Extensión Eléctrica de 5 metros', 'Cable de alta resistencia, 3 salidas', 5),
	(57, 'Cable USB-C a Lightning 2m', 'Carga rápida y transferencia de datos', 5),
	(58, 'Cargador Rápido de Pared 65W', 'GaN, doble puerto USB-C', 5),
	(59, 'Multímetro Digital Auto Rango', 'Para medir voltaje, corriente y resistencia', 5),
	(60, 'Soldador Eléctrico de Estaño 60W', 'Temperatura ajustable', 5),
	(137, 'Foco Inteligente con Cámara', 'Monitoreo de seguridad desde el portalámparas', 5),
	(138, 'Linterna Táctica Recargable LED', 'Zoom ajustable, 5 modos de luz', 5),
	(139, 'Tiras de Multitomas para Rack', '8 salidas con interruptor individual', 5),
	(140, 'Kit de Cables Eléctricos Sólidos', 'Rollos de 10 metros, varios calibres', 5),
	(141, 'Tester de Voltaje sin Contacto', 'Detección de corriente AC', 5),
	(142, 'Estación de Soldadura con Temperatura Regulable', 'Para electrónica y reparación', 5),
	(143, 'Batería Externa Power Bank 20000mAh', 'Carga rápida, doble salida USB', 5),
	(144, 'Adaptador Universal de Viaje', 'Con puertos USB y protección de sobrecarga', 5),
	(145, 'Cables Jumper de Prueba para Electrónica', 'Set de 140 piezas, varios tamaños', 5),

	-- CATEGORÍA 6: Deporte y Ocio (ID 6)
	(61, 'Esterilla de Yoga Premium', '10mm de grosor, TPE antideslizante', 6),
	(62, 'Bloques de Yoga de Corcho (2 und.)', 'Alta densidad para soporte', 6),
	(63, 'Casco de Ciclismo MTB Ajustable', 'Ventilación y luz LED trasera', 6),
	(64, 'Guantes de Ciclismo Gel Acolchados', 'Antichoque, dedos cortos', 6),
	(65, 'Caña de Pescar Telescópica 2.1m', 'Fibra de carbono, carrete incluido', 6),
	(66, 'Set de Aparejos y Anzuelos', 'Caja organizadora con 100 piezas', 6),
	(67, 'Tienda de Campaña Instantánea 3 Personas', 'Impermeable, montaje en 60 segundos', 6),
	(68, 'Saco de Dormir Momia -5°C', 'Relleno de plumón, ultraligero', 6),
	(69, 'Colchoneta Hinchable Doble', 'Con bomba de pie integrada', 6),
	(70, 'Estufa Portátil de Gas Butano', 'Para camping y senderismo', 6),
	(146, 'Banda de Resistencia de Látex (5 niveles)', 'Para fitness y rehabilitación', 6),
	(147, 'Rodillo de Espuma para Masaje', 'Liberación miofascial', 6),
	(148, 'Bicicleta Fija Spinning', 'Volante de inercia de 18kg, monitor LCD', 6),
	(149, 'Guantes de Gimnasio con Muñequera', 'Agarre antideslizante, transpirables', 6),
	(150, 'Chaleco Reflectante de Seguridad', 'Alta visibilidad para correr/ciclismo', 6),
	(151, 'Set de Dardos Profesionales (6 und.)', 'Punta de acero, vuelos intercambiables', 6),
	(152, 'Mesa de Ping Pong Plegable', 'Tamaño reglamentario, incluye raquetas y bolas', 6),
	(153, 'Set de Pesca Infantil', 'Caña y carrete para principiantes', 6),
	(154, 'Nevera Portátil Térmica 20L', 'Para camping y picnic, mantiene frío/calor', 6),

	-- CATEGORÍA 7: Moda Hombre (ID 7)
	(71, 'Camiseta de Algodón Pima Cuello Redondo', 'Color negro, básica', 7),
	(72, 'Jeans Slim Fit Elásticos', 'Lavado oscuro, 5 bolsillos', 7),
	(73, 'Camisa de Franela a Cuadros', 'Manga larga, corte regular', 7),
	(74, 'Chaqueta Bomber Impermeable', 'Cierre de cremallera, estilo casual', 7),
	(75, 'Sudadera con Capucha y Logo', 'Interior afelpado, color gris', 7),
	(76, 'Shorts de Baño Estampados', 'Secado rápido, cordón ajustable', 7),
	(77, 'Tenis de Lona Clásicos', 'Suela de goma, color blanco', 7),
	(78, 'Botines de Cuero Estilo Chukka', 'Suela de crepé, marrón', 7),
	(79, 'Mocasines de Antelina Casuales', 'Sin cordones, cómodos', 7),
	(80, 'Zapatos Deportivos para Running', 'Amortiguación avanzada', 7),
	(155, 'Pantalón Chino Slim Fit', 'Tela elástica, color caqui', 7),
	(156, 'Chaqueta Acolchada Ultraligera', 'Térmica, ideal para viajes', 7),
	(157, 'Camisa de Vestir Slim Fit', '100% algodón, cuello italiano', 7),
	(158, 'Polo de Piqué Clásico', 'Mangas cortas, varios colores', 7),
	(159, 'Zapatos Oxford de Cuero Brillante', 'Para eventos formales', 7),
	(160, 'Botas de Trabajo con Punta de Acero', 'Suela antideslizante y resistente al aceite', 7),
	(161, 'Medias de Vestir de Bambú (3 pares)', 'Anti-olor, transpirables', 7),
	(162, 'Chaqueta de Mezclilla Clásica', 'Bolsillos delanteros, denim azul', 7),
	(163, 'Shorts Cargo Multibolsillos', 'Tela resistente, para exteriores', 7),

	-- CATEGORÍA 8: Muebles (ID 8)
	(81, 'Sofá Modular de 3 Puestos', 'Tapizado en terciopelo, color verde', 8),
	(82, 'Mesa de Centro de Vidrio Templado', 'Base de metal dorado', 8),
	(83, 'Cama Queen Size con Cabecero Tapizado', 'Estructura de madera maciza', 8),
	(84, 'Closet de 3 Puertas Corredizas', 'Con espejo y cajones', 8),
	(85, 'Buró de Noche Estilo Nórdico', '2 cajones, patas de madera', 8),
	(164, 'Estantería Modular con 5 Cubos', 'Madera MDF, fácil montaje', 8),
	(165, 'Silla Ergonómica de Oficina', 'Soporte lumbar ajustable, malla transpirable', 8),
	(166, 'Mesa Auxiliar Redonda', 'Tapa de mármol sintético, base de metal', 8),
	(167, 'Sofá Cama Futón', 'Tapizado en lino, convertible en cama doble', 8),
	(168, 'Juego de 2 Sillas de Comedor Eames', 'Patas de madera de haya, asiento de polipropileno', 8),
	(169, 'Escritorio Esquinero para Computadora', 'Gran superficie de trabajo', 8),
	(170, 'Colchón King Size Memory Foam', 'Firmeza media, alivio de presión', 8),
	(171, 'Cajonera de 6 Cajones', 'Para almacenamiento de ropa, color blanco', 8),
	(172, 'Perchero de Pie Metálico', 'Con base redonda y 9 ganchos', 8),

	-- CATEGORÍA 9: Mascota (ID 9)
	(86, 'Comedero Automático para Perro/Gato', 'Capacidad 3L, programable', 9),
	(87, 'Cama Ortopédica para Perro Grande', 'Memory foam, funda lavable', 9),
	(88, 'Rascador para Gatos de 3 Niveles', 'Con cueva y juguete colgante', 9),
	(89, 'Arena Sanitaria Aglomerante (10kg)', 'Control de olor extra fuerte', 9),
	(90, 'Transportadora Rígida para Viajes', 'Ventilación, apta para avión', 9),
	(173, 'Ropa Impermeable para Perro', 'Chaqueta reflectante con capucha', 9),
	(174, 'Juguete Dispensador de Premios', 'Interactividad para perros', 9),
	(175, 'Caja de Arena Cerrada para Gatos', 'Con puerta abatible y filtro de carbón', 9),
	(176, 'Set de Cepillos para Cuidado del Pelo', 'Deslanador y cepillo de cerdas suaves', 9),
	(177, 'Fuentes de Agua para Mascotas', 'Filtro de carbón activado, 2.5L', 9),
	(178, 'Snacks Dentales para Perros', 'Paquete de 15 unidades', 9),
	(179, 'Poste Rascador Alto con Plataforma', 'Para que los gatos trepen', 9),
	(180, 'Correa Retráctil 5 Metros', 'Mango ergonómico, para perros medianos', 9),
	(181, 'Champú Seco para Gatos', 'Sin enjuague, especial para piel sensible', 9),

	-- CATEGORÍA 10: Seguridad (ID 10)
	(91, 'Cámara de Seguridad Wi-Fi 360°', 'Visión nocturna, detección de movimiento', 10),
	(92, 'Alarma para Puertas y Ventanas (4 und.)', 'Sensor magnético, control remoto', 10),
	(93, 'Videoportero Inteligente con Pantalla', 'Detección facial, almacenamiento en la nube', 10),
	(94, 'Spray de Defensa Personal Táctico', 'Alcance 3 metros, máxima irritación', 10),
	(95, 'Alarma Personal de Bolsillo 140dB', 'Llavero de emergencia con linterna', 10),
	(182, 'Cerradura Inteligente Biometríca', 'Apertura con huella, código y llave', 10),
	(183, 'Detector de Humo y Monóxido de Carbono', 'Alarma combinada, funciona con batería', 10),
	(184, 'Mini Caja Fuerte de Acero', 'Para guardar objetos de valor, con código digital', 10),
	(185, 'Timbre Inalámbrico con 50 Melodías', 'Fácil instalación, alcance 100m', 10),
	(186, 'Sistema de Alarma Doméstica DIY', 'Hub central, sensores y control remoto', 10),
	(187, 'Luz LED Solar con Sensor de Movimiento', 'Para exteriores, resistente al agua', 10),
	(188, 'Cámara Falsa de Vigilancia (Simulada)', 'Con luz LED intermitente', 10),
	(189, 'Candado de Alta Seguridad para Bicicleta', 'Cadena de acero endurecido', 10),
	(190, 'Bloqueo de Seguridad para Refrigerador', 'Para niños o acceso restringido', 10),

	-- CATEGORÍA 11: Juguetes (ID 11)
	(96, 'Set de Bloques de Construcción 500 Piezas', 'Compatibles con marcas líderes', 11),
	(97, 'Rompecabezas 3D de Monumentos', 'Modelo de la Torre Eiffel, 100 piezas', 11),
	(98, 'Juego de Mesa Catan (Edición Clásica)', 'Estrategia para 3-4 jugadores', 11),
	(99, 'Cubo Rubik Profesional 3x3', 'Movimiento rápido, ajustable', 11),
	(100, 'Futbolín de Mesa Plegable', 'Medidas estándar, marcador manual', 11),
	(191, 'Pista de Carros Eléctrica (Scalextric)', 'Dos vehículos y controlador de velocidad', 11),
	(192, 'Set de Juguetes Educativos de Madera', 'Formas y colores para preescolares', 11),
	(193, 'Robot de Juguete Programable', 'Iniciación a la codificación', 11),
	(194, 'Muñeca Articulada con Accesorios', 'Temática de moda y peluquería', 11),
	(195, 'Juego de Cartas UNO Deluxe', 'Edición especial con estuche metálico', 11),
	(196, 'Juego de Magia para Niños', 'Más de 75 trucos explicados', 11),
	(197, 'Rompecabezas de 1000 Piezas (Paisaje)', 'Nivel avanzado para adultos', 11),
	(198, 'Set de Figuras de Acción Coleccionables', 'Basado en superhéroes de cómic', 11),
	(199, 'Telescopio Astronómico para Principiantes', 'Aumento 50X y trípode', 11),
	(200, 'Consola de Videojuegos Retro Portátil', 'Con 300 juegos clásicos integrados', 11);

	INSERT INTO `inventarios` (`id`, `producto_id`, `cantidad`, `stock_minimo`, `fecha_actualizacion`) VALUES
	(1, 1, 148, 20, '2025-08-01 00:00:00'),
	(2, 2, 114, 20, '2025-08-02 00:00:00'),
	(3, 3, 142, 20, '2025-08-03 00:00:00'),
	(4, 4, 113, 20, '2025-08-04 00:00:00'),
	(5, 5, 137, 20, '2025-08-05 00:00:00'),
	(6, 6, 126, 20, '2025-08-06 00:00:00'),
	(7, 7, 107, 20, '2025-08-07 00:00:00'),
	(8, 8, 115, 20, '2025-08-08 00:00:00'),
	(9, 9, 131, 20, '2025-08-09 00:00:00'),
	(10, 10, 83, 20, '2025-08-10 00:00:00'),
	(11, 11, 116, 20, '2025-08-11 00:00:00'),
	(12, 12, 110, 20, '2025-08-12 00:00:00'),
	(13, 13, 85, 20, '2025-08-13 00:00:00'),
	(14, 14, 145, 20, '2025-08-14 00:00:00'),
	(15, 15, 105, 20, '2025-08-15 00:00:00'),
	(16, 16, 73, 20, '2025-08-16 00:00:00'),
	(17, 17, 148, 20, '2025-08-17 00:00:00'),
	(18, 18, 103, 20, '2025-08-18 00:00:00'),
	(19, 19, 119, 20, '2025-08-19 00:00:00'),
	(20, 20, 143, 20, '2025-08-20 00:00:00'),
	(21, 21, 148, 20, '2025-08-21 00:00:00'),
	(22, 22, 94, 20, '2025-08-22 00:00:00'),
	(23, 23, 148, 20, '2025-08-23 00:00:00'),
	(24, 24, 144, 20, '2025-08-24 00:00:00'),
	(25, 25, 79, 20, '2025-08-25 00:00:00'),
	(26, 26, 115, 20, '2025-08-26 00:00:00'),
	(27, 27, 146, 20, '2025-08-27 00:00:00'),
	(28, 28, 143, 20, '2025-08-28 00:00:00'),
	(29, 29, 119, 20, '2025-08-29 00:00:00'),
	(30, 30, 105, 20, '2025-08-30 00:00:00'),
	(31, 31, 146, 20, '2025-08-31 00:00:00'),
	(32, 32, 108, 20, '2025-09-01 00:00:00'),
	(33, 33, 116, 20, '2025-09-02 00:00:00'),
	(34, 34, 126, 20, '2025-09-03 00:00:00'),
	(35, 35, 111, 20, '2025-09-04 00:00:00'),
	(36, 36, 140, 20, '2025-09-05 00:00:00'),
	(37, 37, 137, 20, '2025-09-06 00:00:00'),
	(38, 38, 118, 20, '2025-09-07 00:00:00'),
	(39, 39, 130, 20, '2025-09-08 00:00:00'),
	(40, 40, 126, 20, '2025-09-09 00:00:00'),
	(41, 41, 95, 20, '2025-09-10 00:00:00'),
	(42, 42, 122, 20, '2025-09-11 00:00:00'),
	(43, 43, 100, 20, '2025-09-12 00:00:00'),
	(44, 44, 98, 20, '2025-09-13 00:00:00'),
	(45, 45, 96, 20, '2025-09-14 00:00:00'),
	(46, 46, 115, 20, '2025-09-15 00:00:00'),
	(47, 47, 104, 20, '2025-09-16 00:00:00'),
	(48, 48, 93, 20, '2025-09-17 00:00:00'),
	(49, 49, 145, 20, '2025-09-18 00:00:00'),
	(50, 50, 83, 20, '2025-09-19 00:00:00'),
	(51, 51, 109, 20, '2025-09-20 00:00:00'),
	(52, 52, 141, 20, '2025-09-21 00:00:00'),
	(53, 53, 129, 20, '2025-09-22 00:00:00'),
	(54, 54, 111, 20, '2025-09-23 00:00:00'),
	(55, 55, 78, 20, '2025-09-24 00:00:00'),
	(56, 56, 128, 20, '2025-09-25 00:00:00'),
	(57, 57, 137, 20, '2025-09-26 00:00:00'),
	(58, 58, 144, 20, '2025-09-27 00:00:00'),
	(59, 59, 113, 20, '2025-09-28 00:00:00'),
	(60, 60, 105, 20, '2025-09-29 00:00:00'),
	(61, 61, 80, 20, '2025-09-30 00:00:00'),
	(62, 62, 124, 20, '2025-10-01 00:00:00'),
	(63, 63, 135, 20, '2025-10-02 00:00:00'),
	(64, 64, 107, 20, '2025-10-03 00:00:00'),
	(65, 65, 129, 20, '2025-10-04 00:00:00'),
	(66, 66, 129, 20, '2025-10-05 00:00:00'),
	(67, 67, 102, 20, '2025-10-06 00:00:00'),
	(68, 68, 127, 20, '2025-10-07 00:00:00'),
	(69, 69, 106, 20, '2025-10-08 00:00:00'),
	(70, 70, 129, 20, '2025-10-09 00:00:00'),
	(71, 71, 109, 20, '2025-10-10 00:00:00'),
	(72, 72, 104, 20, '2025-10-11 00:00:00'),
	(73, 73, 105, 20, '2025-10-12 00:00:00'),
	(74, 74, 144, 20, '2025-10-13 00:00:00'),
	(75, 75, 140, 20, '2025-10-14 00:00:00'),
	(76, 76, 121, 20, '2025-10-15 00:00:00'),
	(77, 77, 137, 20, '2025-10-16 00:00:00'),
	(78, 78, 142, 20, '2025-10-17 00:00:00'),
	(79, 79, 123, 20, '2025-10-18 00:00:00'),
	(80, 80, 116, 20, '2025-10-19 00:00:00'),
	(81, 81, 123, 20, '2025-10-20 00:00:00'),
	(82, 82, 117, 20, '2025-10-21 00:00:00'),
	(83, 83, 113, 20, '2025-10-22 00:00:00'),
	(84, 84, 110, 20, '2025-10-23 00:00:00'),
	(85, 85, 110, 20, '2025-10-24 00:00:00'),
	(86, 86, 117, 20, '2025-10-25 00:00:00'),
	(87, 87, 83, 20, '2025-10-26 00:00:00'),
	(88, 88, 148, 20, '2025-10-27 00:00:00'),
	(89, 89, 115, 20, '2025-10-28 00:00:00'),
	(90, 90, 100, 20, '2025-10-29 00:00:00'),
	(91, 91, 74, 20, '2025-10-30 00:00:00'),
	(92, 92, 104, 20, '2025-10-31 00:00:00'),
	(93, 93, 126, 20, '2025-11-01 00:00:00'),
	(94, 94, 113, 20, '2025-11-02 00:00:00'),
	(95, 95, 123, 20, '2025-11-03 00:00:00'),
	(96, 96, 125, 20, '2025-11-04 00:00:00'),
	(97, 97, 105, 20, '2025-11-05 00:00:00'),
	(98, 98, 107, 20, '2025-11-06 00:00:00'),
	(99, 99, 84, 20, '2025-11-07 00:00:00'),
	(100, 100, 137, 20, '2025-11-08 00:00:00'),
	(101, 101, 119, 20, '2025-11-09 00:00:00'),
	(102, 102, 106, 20, '2025-11-10 00:00:00'),
	(103, 103, 116, 20, '2025-11-11 00:00:00'),
	(104, 104, 76, 20, '2025-11-12 00:00:00'),
	(105, 105, 149, 20, '2025-11-13 00:00:00'),
	(106, 106, 103, 20, '2025-11-14 00:00:00'),
	(107, 107, 148, 20, '2025-11-15 00:00:00'),
	(108, 108, 109, 20, '2025-11-16 00:00:00'),
	(109, 109, 135, 20, '2025-11-17 00:00:00'),
	(110, 110, 89, 20, '2025-11-18 00:00:00'),
	(111, 111, 146, 20, '2025-11-19 00:00:00'),
	(112, 112, 110, 20, '2025-11-20 00:00:00'),
	(113, 113, 114, 20, '2025-11-21 00:00:00'),
	(114, 114, 130, 20, '2025-11-22 00:00:00'),
	(115, 115, 140, 20, '2025-11-23 00:00:00'),
	(116, 116, 114, 20, '2025-11-24 00:00:00'),
	(117, 117, 72, 20, '2025-11-25 00:00:00'),
	(118, 118, 133, 20, '2025-11-26 00:00:00'),
	(119, 119, 114, 20, '2025-11-27 00:00:00'),
	(120, 120, 140, 20, '2025-11-28 00:00:00'),
	(121, 121, 112, 20, '2025-11-29 00:00:00'),
	(122, 122, 136, 20, '2025-11-30 00:00:00'),
	(123, 123, 100, 20, '2025-12-01 00:00:00'),
	(124, 124, 101, 20, '2025-12-02 00:00:00'),
	(125, 125, 106, 20, '2025-12-03 00:00:00'),
	(126, 126, 88, 20, '2025-12-04 00:00:00'),
	(127, 127, 126, 20, '2025-12-05 00:00:00'),
	(128, 128, 117, 20, '2025-12-06 00:00:00'),
	(129, 129, 106, 20, '2025-12-07 00:00:00'),
	(130, 130, 84, 20, '2025-12-08 00:00:00'),
	(131, 131, 102, 20, '2025-12-09 00:00:00'),
	(132, 132, 103, 20, '2025-12-10 00:00:00'),
	(133, 133, 106, 20, '2025-12-11 00:00:00'),
	(134, 134, 131, 20, '2025-12-12 00:00:00'),
	(135, 135, 125, 20, '2025-12-13 00:00:00'),
	(136, 136, 127, 20, '2025-12-14 00:00:00'),
	(137, 137, 104, 20, '2025-12-15 00:00:00'),
	(138, 138, 145, 20, '2025-12-16 00:00:00'),
	(139, 139, 107, 20, '2025-12-17 00:00:00'),
	(140, 140, 143, 20, '2025-12-18 00:00:00'),
	(141, 141, 113, 20, '2025-12-19 00:00:00'),
	(142, 142, 139, 20, '2025-12-20 00:00:00'),
	(143, 143, 142, 20, '2025-12-21 00:00:00'),
	(144, 144, 131, 20, '2025-12-22 00:00:00'),
	(145, 145, 108, 20, '2025-12-23 00:00:00'),
	(146, 146, 73, 20, '2025-12-24 00:00:00'),
	(147, 147, 105, 20, '2025-12-25 00:00:00'),
	(148, 148, 145, 20, '2025-12-26 00:00:00'),
	(149, 149, 113, 20, '2025-12-27 00:00:00'),
	(150, 150, 126, 20, '2025-12-28 00:00:00'),
	(151, 151, 121, 20, '2025-12-29 00:00:00'),
	(152, 152, 122, 20, '2025-12-30 00:00:00'),
	(153, 153, 106, 20, '2025-12-31 00:00:00'),
	(154, 154, 135, 20, '2026-01-01 00:00:00'),
	(155, 155, 107, 20, '2026-01-02 00:00:00'),
	(156, 156, 145, 20, '2026-01-03 00:00:00'),
	(157, 157, 112, 20, '2026-01-04 00:00:00'),
	(158, 158, 143, 20, '2026-01-05 00:00:00'),
	(159, 159, 121, 20, '2026-01-06 00:00:00'),
	(160, 160, 114, 20, '2026-01-07 00:00:00'),
	(161, 161, 98, 20, '2026-01-08 00:00:00'),
	(162, 162, 135, 20, '2026-01-09 00:00:00'),
	(163, 163, 111, 20, '2026-01-10 00:00:00'),
	(164, 164, 113, 20, '2026-01-11 00:00:00'),
	(165, 165, 99, 20, '2026-01-12 00:00:00'),
	(166, 166, 105, 20, '2026-01-13 00:00:00'),
	(167, 167, 113, 20, '2026-01-14 00:00:00'),
	(168, 168, 140, 20, '2026-01-15 00:00:00'),
	(169, 169, 146, 20, '2026-01-16 00:00:00'),
	(170, 170, 93, 20, '2026-01-17 00:00:00'),
	(171, 171, 134, 20, '2026-01-18 00:00:00'),
	(172, 172, 149, 20, '2026-01-19 00:00:00'),
	(173, 173, 136, 20, '2026-01-20 00:00:00'),
	(174, 174, 142, 20, '2026-01-21 00:00:00'),
	(175, 175, 127, 20, '2026-01-22 00:00:00'),
	(176, 176, 144, 20, '2026-01-23 00:00:00'),
	(177, 177, 145, 20, '2026-01-24 00:00:00'),
	(178, 178, 142, 20, '2026-01-25 00:00:00'),
	(179, 179, 123, 20, '2026-01-26 00:00:00'),
	(180, 180, 111, 20, '2026-01-27 00:00:00'),
	(181, 181, 109, 20, '2026-01-28 00:00:00'),
	(182, 182, 148, 20, '2026-01-29 00:00:00'),
	(183, 183, 119, 20, '2026-01-30 00:00:00'),
	(184, 184, 121, 20, '2026-01-31 00:00:00'),
	(185, 185, 115, 20, '2026-02-01 00:00:00'),
	(186, 186, 128, 20, '2026-02-02 00:00:00'),
	(187, 187, 146, 20, '2026-02-03 00:00:00'),
	(188, 188, 129, 20, '2026-02-04 00:00:00'),
	(189, 189, 135, 20, '2026-02-05 00:00:00'),
	(190, 190, 147, 20, '2026-02-06 00:00:00'),
	(191, 191, 147, 20, '2026-02-07 00:00:00'),
	(192, 192, 148, 20, '2026-02-08 00:00:00'),
	(193, 193, 113, 20, '2026-02-09 00:00:00'),
	(194, 194, 91, 20, '2026-02-10 00:00:00'),
	(195, 195, 137, 20, '2026-02-11 00:00:00'),
	(196, 196, 104, 20, '2026-02-12 00:00:00'),
	(197, 197, 147, 20, '2026-02-13 00:00:00'),
	(198, 198, 127, 20, '2026-02-14 00:00:00'),
	(199, 199, 123, 20, '2026-02-15 00:00:00'),
	(200, 200, 95, 20, '2026-02-16 00:00:00');

	INSERT INTO `item` (`id`, `serial`, `fecha_ingreso`, `fecha_salida`, `estado`, `precio`, `productos_id`) VALUES
	-- ID 1-5: Producto 1 (Sartén antiadherente - Precio promedio: $85000.00)
	(1, 'SN00001', '2025-01-01', NULL, 1, 84000.00, 1),
	(2, 'SN00002', '2025-01-01', NULL, 1, 85500.00, 1),
	(3, 'SN00003', '2025-01-02', '2025-02-10', 0, 83500.00, 1),
	(4, 'SN00004', '2025-01-02', NULL, 1, 85000.00, 1),
	(5, 'SN00005', '2025-01-03', NULL, 1, 86000.00, 1),

	-- ID 6-10: Producto 2 (Set de ollas 5 piezas - Precio promedio: $180000.00)
	(6, 'SN00006', '2025-01-03', NULL, 1, 178000.00, 2),
	(7, 'SN00007', '2025-01-04', NULL, 1, 182000.00, 2),
	(8, 'SN00008', '2025-01-04', '2025-02-15', 0, 179500.00, 2),
	(9, 'SN00009', '2025-01-05', NULL, 1, 180500.00, 2),
	(10, 'SN00010', '2025-01-05', NULL, 1, 181000.00, 2),

	-- ID 11-15: Producto 3 (Organizador de Especias Giratorio - Precio promedio: $55000.00)
	(11, 'SN00011', '2025-01-06', NULL, 1, 54500.00, 3),
	(12, 'SN00012', '2025-01-06', NULL, 1, 55500.00, 3),
	(13, 'SN00013', '2025-01-07', '2025-02-20', 0, 54000.00, 3),
	(14, 'SN00014', '2025-01-07', NULL, 1, 56000.00, 3),
	(15, 'SN00015', '2025-01-08', NULL, 1, 55000.00, 3),

	-- ID 16-20: Producto 4 (Batidora de Mano Eléctrica - Precio promedio: $90000.00)
	(16, 'SN00016', '2025-01-08', NULL, 1, 89500.00, 4),
	(17, 'SN00017', '2025-01-09', NULL, 1, 90500.00, 4),
	(18, 'SN00018', '2025-01-09', '2025-02-25', 0, 88500.00, 4),
	(19, 'SN00019', '2025-01-10', NULL, 1, 91000.00, 4),
	(20, 'SN00020', '2025-01-10', NULL, 1, 90000.00, 4),

	-- ID 21-25: Producto 5 (Freidora de Aire Digital 4L - Precio promedio: $350000.00)
	(21, 'SN00021', '2025-01-11', NULL, 1, 348000.00, 5),
	(22, 'SN00022', '2025-01-11', NULL, 1, 352000.00, 5),
	(23, 'SN00023', '2025-01-12', NULL, 1, 350500.00, 5),
	(24, 'SN00024', '2025-01-12', '2025-03-01', 0, 347000.00, 5),
	(25, 'SN00025', '2025-01-13', NULL, 1, 353000.00, 5),

	-- ID 26-30: Producto 6 (Juego de Cuchillos Chef Profesional - Precio promedio: $210000.00)
	(26, 'SN00026', '2025-01-13', NULL, 1, 209000.00, 6),
	(27, 'SN00027', '2025-01-14', NULL, 1, 211500.00, 6),
	(28, 'SN00028', '2025-01-14', NULL, 1, 210000.00, 6),
	(29, 'SN00029', '2025-01-15', '2025-03-05', 0, 208500.00, 6),
	(30, 'SN00030', '2025-01-15', NULL, 1, 210500.00, 6),

	-- ID 31-35: Producto 7 (Cuadro Abstracto Moderno - Precio promedio: $135000.00)
	(31, 'SN00031', '2025-01-16', NULL, 1, 134000.00, 7),
	(32, 'SN00032', '2025-01-16', NULL, 1, 136000.00, 7),
	(33, 'SN00033', '2025-01-17', NULL, 1, 135500.00, 7),
	(34, 'SN00034', '2025-01-17', '2025-03-10', 0, 133500.00, 7),
	(35, 'SN00035', '2025-01-18', NULL, 1, 136500.00, 7),

	-- ID 36-40: Producto 8 (Alfombra Shaggy 2x3m - Precio promedio: $280000.00)
	(36, 'SN00036', '2025-01-18', NULL, 1, 278000.00, 8),
	(37, 'SN00037', '2025-01-19', NULL, 1, 282000.00, 8),
	(38, 'SN00038', '2025-01-19', NULL, 1, 280500.00, 8),
	(39, 'SN00039', '2025-01-20', '2025-03-15', 0, 277000.00, 8),
	(40, 'SN00040', '2025-01-20', NULL, 1, 283000.00, 8),

	-- ID 41-45: Producto 9 (Reloj de Pared Minimalista - Precio promedio: $75000.00)
	(41, 'SN00041', '2025-01-21', NULL, 1, 74500.00, 9),
	(42, 'SN00042', '2025-01-21', NULL, 1, 75500.00, 9),
	(43, 'SN00043', '2025-01-22', '2025-03-20', 0, 74000.00, 9),
	(44, 'SN00044', '2025-01-22', NULL, 1, 76000.00, 9),
	(45, 'SN00045', '2025-01-23', NULL, 1, 75000.00, 9),

	-- ID 46-50: Producto 10 (Escoba y Recogedor Mágicos - Precio promedio: $45000.00)
	(46, 'SN00046', '2025-01-23', NULL, 1, 44000.00, 10),
	(47, 'SN00047', '2025-01-24', NULL, 1, 46000.00, 10),
	(48, 'SN00048', '2025-01-24', NULL, 1, 45500.00, 10),
	(49, 'SN00049', '2025-01-25', '2025-03-25', 0, 43500.00, 10),
	(50, 'SN00050', '2025-01-25', NULL, 1, 46500.00, 10),

	-- ID 51-55: Producto 11 (Trapeador Giratorio Profesional - Precio promedio: $85000.00)
	(51, 'SN00051', '2025-01-26', NULL, 1, 84000.00, 11),
	(52, 'SN00052', '2025-01-26', NULL, 1, 86000.00, 11),
	(53, 'SN00053', '2025-01-27', NULL, 1, 85500.00, 11),
	(54, 'SN00054', '2025-01-27', '2025-03-30', 0, 83500.00, 11),
	(55, 'SN00055', '2025-01-28', NULL, 1, 86500.00, 11),

	-- ID 56-60: Producto 12 (Ambientador Automático Glade - Precio promedio: $35000.00)
	(56, 'SN00056', '2025-01-28', NULL, 1, 34000.00, 12),
	(57, 'SN00057', '2025-01-29', NULL, 1, 36000.00, 12),
	(58, 'SN00058', '2025-01-29', NULL, 1, 35500.00, 12),
	(59, 'SN00059', '2025-01-30', '2025-04-05', 0, 33500.00, 12),
	(60, 'SN00060', '2025-01-30', NULL, 1, 36500.00, 12),

	-- ID 61-65: Producto 13 (Alfombrilla de Baño Antideslizante - Precio promedio: $25000.00)
	(61, 'SN00061', '2025-01-31', NULL, 1, 24500.00, 13),
	(62, 'SN00062', '2025-01-31', NULL, 1, 25500.00, 13),
	(63, 'SN00063', '2025-02-01', NULL, 1, 25000.00, 13),
	(64, 'SN00064', '2025-02-01', '2025-04-10', 0, 24000.00, 13),
	(65, 'SN00065', '2025-02-02', NULL, 1, 26000.00, 13),

	-- ID 66-70: Producto 14 (Cortina de Baño Impermeable - Precio promedio: $40000.00)
	(66, 'SN00066', '2025-02-02', NULL, 1, 39000.00, 14),
	(67, 'SN00067', '2025-02-03', NULL, 1, 41000.00, 14),
	(68, 'SN00068', '2025-02-03', NULL, 1, 40500.00, 14),
	(69, 'SN00069', '2025-02-04', '2025-04-15', 0, 38500.00, 14),
	(70, 'SN00070', '2025-02-04', NULL, 1, 41500.00, 14),

	-- ID 71-75: Producto 15 (Dispensador de Jabón Automático - Precio promedio: $60000.00)
	(71, 'SN00071', '2025-02-05', NULL, 1, 59000.00, 15),
	(72, 'SN00072', '2025-02-05', NULL, 1, 61000.00, 15),
	(73, 'SN00073', '2025-02-06', NULL, 1, 60500.00, 15),
	(74, 'SN00074', '2025-02-06', '2025-04-20', 0, 58500.00, 15),
	(75, 'SN00075', '2025-02-07', NULL, 1, 61500.00, 15),

	-- ID 76-80: Producto 16 (Lentes de Sol Aviador Polarizados - Precio promedio: $80000.00)
	(76, 'SN00076', '2025-02-07', NULL, 1, 79000.00, 16),
	(77, 'SN00077', '2025-02-08', NULL, 1, 81000.00, 16),
	(78, 'SN00078', '2025-02-08', NULL, 1, 80500.00, 16),
	(79, 'SN00079', '2025-02-09', '2025-04-25', 0, 78500.00, 16),
	(80, 'SN00080', '2025-02-09', NULL, 1, 81500.00, 16),

	-- ID 81-85: Producto 17 (Sombrero de Fieltro Fedora - Precio promedio: $65000.00)
	(81, 'SN00081', '2025-02-10', NULL, 1, 64500.00, 17),
	(82, 'SN00082', '2025-02-10', NULL, 1, 65500.00, 17),
	(83, 'SN00083', '2025-02-11', NULL, 1, 65000.00, 17),
	(84, 'SN00084', '2025-02-11', '2025-04-30', 0, 64000.00, 17),
	(85, 'SN00085', '2025-02-12', NULL, 1, 66000.00, 17),

	-- ID 86-90: Producto 18 (Bolso Shopper de Cuero Sintético - Precio promedio: $120000.00)
	(86, 'SN00086', '2025-02-12', NULL, 1, 118000.00, 18),
	(87, 'SN00087', '2025-02-13', NULL, 1, 122000.00, 18),
	(88, 'SN00088', '2025-02-13', NULL, 1, 120500.00, 18),
	(89, 'SN00089', '2025-02-14', '2025-05-05', 0, 117500.00, 18),
	(90, 'SN00090', '2025-02-14', NULL, 1, 123000.00, 18),

	-- ID 91-95: Producto 19 (Pañuelo de Seda Estampado - Precio promedio: $45000.00)
	(91, 'SN00091', '2025-02-15', NULL, 1, 44000.00, 19),
	(92, 'SN00092', '2025-02-15', NULL, 1, 46000.00, 19),
	(93, 'SN00093', '2025-02-16', NULL, 1, 45500.00, 19),
	(94, 'SN00094', '2025-02-16', '2025-05-10', 0, 43500.00, 19),
	(95, 'SN00095', '2025-02-17', NULL, 1, 46500.00, 19),

	-- ID 96-100: Producto 20 (Cinturón Elástico Ancho - Precio promedio: $30000.00)
	(96, 'SN00096', '2025-02-17', NULL, 1, 29500.00, 20),
	(97, 'SN00097', '2025-02-18', NULL, 1, 30500.00, 20),
	(98, 'SN00098', '2025-02-18', NULL, 1, 30000.00, 20),
	(99, 'SN00099', '2025-02-19', '2025-05-15', 0, 29000.00, 20),
	(100, 'SN00100', '2025-02-19', NULL, 1, 31000.00, 20),

	-- ID 101-105: Producto 21 (Monedero Plegable con Cremallera - Precio promedio: $25000.00)
	(101, 'SN00101', '2025-02-20', NULL, 1, 24500.00, 21),
	(102, 'SN00102', '2025-02-20', NULL, 1, 25500.00, 21),
	(103, 'SN00103', '2025-02-21', NULL, 1, 25000.00, 21),
	(104, 'SN00104', '2025-02-21', '2025-05-20', 0, 24000.00, 21),
	(105, 'SN00105', '2025-02-22', NULL, 1, 26000.00, 21),

	-- ID 106-110: Producto 22 (Pasadores para Cabello de Perlas - Precio promedio: $18000.00)
	(106, 'SN00106', '2025-02-22', NULL, 1, 17500.00, 22),
	(107, 'SN00107', '2025-02-23', NULL, 1, 18500.00, 22),
	(108, 'SN00108', '2025-02-23', NULL, 1, 18000.00, 22),
	(109, 'SN00109', '2025-02-24', '2025-05-25', 0, 17000.00, 22),
	(110, 'SN00110', '2025-02-24', NULL, 1, 19000.00, 22),

	-- ID 111-115: Producto 23 (Reloj Analógico de Acero Inoxidable - Precio promedio: $280000.00)
	(111, 'SN00111', '2025-02-25', NULL, 1, 278000.00, 23),
	(112, 'SN00112', '2025-02-25', NULL, 1, 282000.00, 23),
	(113, 'SN00113', '2025-02-26', NULL, 1, 280500.00, 23),
	(114, 'SN00114', '2025-02-26', '2025-05-30', 0, 276500.00, 23),
	(115, 'SN00115', '2025-02-27', NULL, 1, 283000.00, 23),

	-- ID 116-120: Producto 24 (Morral para Laptop 15" - Precio promedio: $110000.00)
	(116, 'SN00116', '2025-02-27', NULL, 1, 108000.00, 24),
	(117, 'SN00117', '2025-02-28', NULL, 1, 112000.00, 24),
	(118, 'SN00118', '2025-02-28', NULL, 1, 110500.00, 24),
	(119, 'SN00119', '2025-03-01', '2025-06-05', 0, 107500.00, 24),
	(120, 'SN00120', '2025-03-01', NULL, 1, 113000.00, 24),

	-- ID 121-125: Producto 25 (Gorra Trucker Negra - Precio promedio: $35000.00)
	(121, 'SN00121', '2025-03-02', NULL, 1, 34500.00, 25),
	(122, 'SN00122', '2025-03-02', NULL, 1, 35500.00, 25),
	(123, 'SN00123', '2025-03-03', NULL, 1, 35000.00, 25),
	(124, 'SN00124', '2025-03-03', '2025-06-10', 0, 34000.00, 25),
	(125, 'SN00125', '2025-03-04', NULL, 1, 36000.00, 25),

	-- ID 126-130: Producto 26 (Billetera de Cuero Clásica - Precio promedio: $50000.00)
	(126, 'SN00126', '2025-03-04', NULL, 1, 49000.00, 26),
	(127, 'SN00127', '2025-03-05', NULL, 1, 51000.00, 26),
	(128, 'SN00128', '2025-03-05', NULL, 1, 50500.00, 26),
	(129, 'SN00129', '2025-03-06', '2025-06-15', 0, 48500.00, 26),
	(130, 'SN00130', '2025-03-06', NULL, 1, 51500.00, 26),

	-- ID 131-135: Producto 27 (Corbata de Seda Slim Fit - Precio promedio: $45000.00)
	(131, 'SN00131', '2025-03-07', NULL, 1, 44000.00, 27),
	(132, 'SN00132', '2025-03-07', NULL, 1, 46000.00, 27),
	(133, 'SN00133', '2025-03-08', NULL, 1, 45500.00, 27),
	(134, 'SN00134', '2025-03-08', '2025-06-20', 0, 43500.00, 27),
	(135, 'SN00135', '2025-03-09', NULL, 1, 46500.00, 27),

	-- ID 136-140: Producto 28 (Bufanda de Lana Cachemira - Precio promedio: $70000.00)
	(136, 'SN00136', '2025-03-09', NULL, 1, 69000.00, 28),
	(137, 'SN00137', '2025-03-10', NULL, 1, 71000.00, 28),
	(138, 'SN00138', '2025-03-10', NULL, 1, 70500.00, 28),
	(139, 'SN00139', '2025-03-11', '2025-06-25', 0, 68500.00, 28),
	(140, 'SN00140', '2025-03-11', NULL, 1, 71500.00, 28),

	-- ID 141-145: Producto 29 (Manilla de Cuero Trenzado - Precio promedio: $35000.00)
	(141, 'SN00141', '2025-03-12', NULL, 1, 34000.00, 29),
	(142, 'SN00142', '2025-03-12', NULL, 1, 36000.00, 29),
	(143, 'SN00143', '2025-03-13', NULL, 1, 35500.00, 29),
	(144, 'SN00144', '2025-03-13', '2025-06-30', 0, 33500.00, 29),
	(145, 'SN00145', '2025-03-14', NULL, 1, 36500.00, 29),

	-- ID 146-150: Producto 30 (Sombrilla Automática Reforzada - Precio promedio: $55000.00)
	(146, 'SN00146', '2025-03-14', NULL, 1, 54000.00, 30),
	(147, 'SN00147', '2025-03-15', NULL, 1, 56000.00, 30),
	(148, 'SN00148', '2025-03-15', NULL, 1, 55500.00, 30),
	(149, 'SN00149', '2025-03-16', '2025-07-05', 0, 53500.00, 30),
	(150, 'SN00150', '2025-03-16', NULL, 1, 56500.00, 30),

	-- ID 151-155: Producto 31 (Anillo Minimalista de Acero Inoxidable - Precio promedio: $20000.00)
	(151, 'SN00151', '2025-03-17', NULL, 1, 19000.00, 31),
	(152, 'SN00152', '2025-03-17', NULL, 1, 21000.00, 31),
	(153, 'SN00153', '2025-03-18', NULL, 1, 20500.00, 31),
	(154, 'SN00154', '2025-03-18', '2025-07-10', 0, 18500.00, 31),
	(155, 'SN00155', '2025-03-19', NULL, 1, 21500.00, 31),

	-- ID 156-160: Producto 32 (Anillo con Piedra de Circón - Precio promedio: $35000.00)
	(156, 'SN00156', '2025-03-19', NULL, 1, 34000.00, 32),
	(157, 'SN00157', '2025-03-20', NULL, 1, 36000.00, 32),
	(158, 'SN00158', '2025-03-20', NULL, 1, 35500.00, 32),
	(159, 'SN00159', '2025-03-21', '2025-07-15', 0, 33500.00, 32),
	(160, 'SN00160', '2025-03-21', NULL, 1, 36500.00, 32),

	-- ID 161-165: Producto 33 (Collar de Perlas de Imitación - Precio promedio: $45000.00)
	(161, 'SN00161', '2025-03-22', NULL, 1, 44000.00, 33),
	(162, 'SN00162', '2025-03-22', NULL, 1, 46000.00, 33),
	(163, 'SN00163', '2025-03-23', NULL, 1, 45500.00, 33),
	(164, 'SN00164', '2025-03-23', '2025-07-20', 0, 43500.00, 33),
	(165, 'SN00165', '2025-03-24', NULL, 1, 46500.00, 33),

	-- ID 166-170: Producto 34 (Collar Dorado con Dijes Intercambiables - Precio promedio: $30000.00)
	(166, 'SN00166', '2025-03-24', NULL, 1, 29000.00, 34),
	(167, 'SN00167', '2025-03-25', NULL, 1, 31000.00, 34),
	(168, 'SN00168', '2025-03-25', NULL, 1, 30500.00, 34),
	(169, 'SN00169', '2025-03-26', '2025-07-25', 0, 28500.00, 34),
	(170, 'SN00170', '2025-03-26', NULL, 1, 31500.00, 34),

	-- ID 171-175: Producto 35 (Pulsera de Cuentas de Piedra Volcánica - Precio promedio: $22000.00)
	(171, 'SN00171', '2025-03-27', NULL, 1, 21500.00, 35),
	(172, 'SN00172', '2025-03-27', NULL, 1, 22500.00, 35),
	(173, 'SN00173', '2025-03-28', NULL, 1, 22000.00, 35),
	(174, 'SN00174', '2025-03-28', '2025-07-30', 0, 21000.00, 35),
	(175, 'SN00175', '2025-03-29', NULL, 1, 23000.00, 35),

	-- ID 176-180: Producto 36 (Pulsera de Cuero Trenzado Doble - Precio promedio: $28000.00)
	(176, 'SN00176', '2025-03-29', NULL, 1, 27000.00, 36),
	(177, 'SN00177', '2025-03-30', NULL, 1, 29000.00, 36),
	(178, 'SN00178', '2025-03-30', NULL, 1, 28500.00, 36),
	(179, 'SN00179', '2025-03-31', '2025-08-05', 0, 26500.00, 36),
	(180, 'SN00180', '2025-03-31', NULL, 1, 29500.00, 36),

	-- ID 181-185: Producto 37 (Pulsera Paracord de Supervivencia - Precio promedio: $38000.00)
	(181, 'SN00181', '2025-04-01', NULL, 1, 37000.00, 37),
	(182, 'SN00182', '2025-04-01', NULL, 1, 39000.00, 37),
	(183, 'SN00183', '2025-04-02', NULL, 1, 38500.00, 37),
	(184, 'SN00184', '2025-04-02', '2025-08-10', 0, 36500.00, 37),
	(185, 'SN00185', '2025-04-03', NULL, 1, 39500.00, 37),

	-- ID 186-190: Producto 38 (Aretes Argollas Grandes de Plata - Precio promedio: $25000.00)
	(186, 'SN00186', '2025-04-03', NULL, 1, 24500.00, 38),
	(187, 'SN00187', '2025-04-04', NULL, 1, 25500.00, 38),
	(188, 'SN00188', '2025-04-04', NULL, 1, 25000.00, 38),
	(189, 'SN00189', '2025-04-05', '2025-08-15', 0, 24000.00, 38),
	(190, 'SN00190', '2025-04-05', NULL, 1, 26000.00, 38),

	-- ID 191-195: Producto 39 (Aretes Largos Colgantes - Precio promedio: $42000.00)
	(191, 'SN00191', '2025-04-06', NULL, 1, 41000.00, 39),
	(192, 'SN00192', '2025-04-06', NULL, 1, 43000.00, 39),
	(193, 'SN00193', '2025-04-07', NULL, 1, 42500.00, 39),
	(194, 'SN00194', '2025-04-07', '2025-08-20', 0, 40500.00, 39),
	(195, 'SN00195', '2025-04-08', NULL, 1, 43500.00, 39),

	-- ID 196-200: Producto 40 (Aretes Minimalistas de Botón - Precio promedio: $15000.00)
	(196, 'SN00196', '2025-04-08', NULL, 1, 14500.00, 40),
	(197, 'SN00197', '2025-04-09', NULL, 1, 15500.00, 40),
	(198, 'SN00198', '2025-04-09', NULL, 1, 15000.00, 40),
	(199, 'SN00199', '2025-04-10', '2025-08-25', 0, 14000.00, 40),
	(200, 'SN00200', '2025-04-10', NULL, 1, 16000.00, 40),

	-- --- INICIO DE PRODUCTOS CON 1 ITEM C/U (IDs 41 al 200) ---
	-- Las fechas y precios son representativos y aleatorios para completar el set de datos.
	(201, 'SN00201', '2025-04-11', NULL, 1, 105000.00, 41), -- Blusa de Gasa Cuello V ($105k)
	(202, 'SN00202', '2025-04-11', NULL, 1, 150000.00, 42), -- Vestido Midi Floral ($150k)
	(203, 'SN00203', '2025-04-12', NULL, 1, 95000.00, 43),  -- Pantalón Culotte de Lino ($95k)
	(204, 'SN00204', '2025-04-12', NULL, 1, 180000.00, 44), -- Chaqueta Denim Oversize ($180k)
	(205, 'SN00205', '2025-04-13', NULL, 1, 230000.00, 45), -- Enterizo Palazzo de Noche ($230k)
	(206, 'SN00206', '2025-04-13', NULL, 1, 75000.00, 46),  -- Sandalias de Plataforma Esparto ($75k)
	(207, 'SN00207', '2025-04-14', NULL, 1, 150000.00, 47), -- Botas Chelsea de Cuero Negro ($150k)
	(208, 'SN00208', '2025-04-14', NULL, 1, 90000.00, 48),  -- Zapatillas Urbanas Blancas ($90k)
	(209, 'SN00209', '2025-04-15', NULL, 1, 85000.00, 49),  -- Mocasines de Terciopelo ($85k)
	(210, 'SN00210', '2025-04-15', NULL, 1, 110000.00, 50), -- Tacones Stiletto Rojos ($110k)
	(211, 'SN00211', '2025-04-16', NULL, 1, 120000.00, 51), -- Bombillos LED Inteligentes (4 und.) ($120k)
	(212, 'SN00212', '2025-04-16', NULL, 1, 65000.00, 52),  -- Lámpara de Escritorio LED Recargable ($65k)
	(213, 'SN00213', '2025-04-17', NULL, 1, 80000.00, 53),  -- Tira LED RGB 5 metros ($80k)
	(214, 'SN00214', '2025-04-17', NULL, 1, 140000.00, 54), -- Lámpara Colgante Geométrica ($140k)
	(215, 'SN00215', '2025-04-18', NULL, 1, 55000.00, 55),  -- Multitoma con 6 Entradas y 2 USB ($55k)
	(216, 'SN00216', '2025-04-18', NULL, 1, 40000.00, 56),  -- Extensión Eléctrica de 5 metros ($40k)
	(217, 'SN00217', '2025-04-19', NULL, 1, 60000.00, 57),  -- Cable USB-C a Lightning 2m ($60k)
	(218, 'SN00218', '2025-04-19', NULL, 1, 150000.00, 58), -- Cargador Rápido de Pared 65W ($150k)
	(219, 'SN00219', '2025-04-20', NULL, 1, 95000.00, 59),  -- Multímetro Digital Auto Rango ($95k)
	(220, 'SN00220', '2025-04-20', NULL, 1, 70000.00, 60),  -- Soldador Eléctrico de Estaño 60W ($70k)
	(221, 'SN00221', '2025-04-21', NULL, 1, 50000.00, 61),  -- Esterilla de Yoga Premium ($50k)
	(222, 'SN00222', '2025-04-21', NULL, 1, 40000.00, 62),  -- Bloques de Yoga de Corcho (2 und.) ($40k)
	(223, 'SN00223', '2025-04-22', NULL, 1, 120000.00, 63), -- Casco de Ciclismo MTB Ajustable ($120k)
	(224, 'SN00224', '2025-04-22', NULL, 1, 35000.00, 64),  -- Guantes de Ciclismo Gel Acolchados ($35k)
	(225, 'SN00225', '2025-04-23', NULL, 1, 85000.00, 65),  -- Caña de Pescar Telescópica 2.1m ($85k)
	(226, 'SN00226', '2025-04-23', NULL, 1, 45000.00, 66),  -- Set de Aparejos y Anzuelos ($45k)
	(227, 'SN00227', '2025-04-24', NULL, 1, 250000.00, 67), -- Tienda de Campaña Instantánea 3 Personas ($250k)
	(228, 'SN00228', '2025-04-24', NULL, 1, 180000.00, 68), -- Saco de Dormir Momia -5°C ($180k)
	(229, 'SN00229', '2025-04-25', NULL, 1, 150000.00, 69), -- Colchoneta Hinchable Doble ($150k)
	(230, 'SN00230', '2025-04-25', NULL, 1, 60000.00, 70),  -- Estufa Portátil de Gas Butano ($60k)
	(231, 'SN00231', '2025-04-26', NULL, 1, 65000.00, 71),  -- Camiseta de Algodón Pima Cuello Redondo ($65k)
	(232, 'SN00232', '2025-04-26', NULL, 1, 140000.00, 72), -- Jeans Slim Fit Elásticos ($140k)
	(233, 'SN00233', '2025-04-27', NULL, 1, 120000.00, 73), -- Camisa de Franela a Cuadros ($120k)
	(234, 'SN00234', '2025-04-27', NULL, 1, 160000.00, 74), -- Chaqueta Bomber Impermeable ($160k)
	(235, 'SN00235', '2025-04-28', NULL, 1, 110000.00, 75), -- Sudadera con Capucha y Logo ($110k)
	(236, 'SN00236', '2025-04-28', NULL, 1, 70000.00, 76),  -- Shorts de Baño Estampados ($70k)
	(237, 'SN00237', '2025-04-29', NULL, 1, 60000.00, 77),  -- Tenis de Lona Clásicos ($60k)
	(238, 'SN00238', '2025-04-29', NULL, 1, 150000.00, 78), -- Botines de Cuero Estilo Chukka ($150k)
	(239, 'SN00239', '2025-04-30', NULL, 1, 95000.00, 79),  -- Mocasines de Antelina Casuales ($95k)
	(240, 'SN00240', '2025-04-30', NULL, 1, 180000.00, 80), -- Zapatos Deportivos para Running ($180k)
	(241, 'SN00241', '2025-05-01', NULL, 1, 1800000.00, 81),-- Sofá Modular de 3 Puestos ($1.8M)
	(242, 'SN00242', '2025-05-01', NULL, 1, 250000.00, 82), -- Mesa de Centro de Vidrio Templado ($250k)
	(243, 'SN00243', '2025-05-02', NULL, 1, 950000.00, 83), -- Cama Queen Size con Cabecero Tapizado ($950k)
	(244, 'SN00244', '2025-05-02', NULL, 1, 700000.00, 84), -- Closet de 3 Puertas Corredizas ($700k)
	(245, 'SN00245', '2025-05-03', NULL, 1, 120000.00, 85), -- Buró de Noche Estilo Nórdico ($120k)
	(246, 'SN00246', '2025-05-03', NULL, 1, 110000.00, 86), -- Comedero Automático para Perro/Gato ($110k)
	(247, 'SN00247', '2025-05-04', NULL, 1, 160000.00, 87), -- Cama Ortopédica para Perro Grande ($160k)
	(248, 'SN00248', '2025-05-04', NULL, 1, 130000.00, 88), -- Rascador para Gatos de 3 Niveles ($130k)
	(249, 'SN00249', '2025-05-05', NULL, 1, 75000.00, 89),  -- Arena Sanitaria Aglomerante (10kg) ($75k)
	(250, 'SN00250', '2025-05-05', NULL, 1, 190000.00, 90), -- Transportadora Rígida para Viajes ($190k)
	(251, 'SN00251', '2025-05-06', NULL, 1, 140000.00, 91), -- Cámara de Seguridad Wi-Fi 360° ($140k)
	(252, 'SN00252', '2025-05-06', NULL, 1, 80000.00, 92),  -- Alarma para Puertas y Ventanas (4 und.) ($80k)
	(253, 'SN00253', '2025-05-07', NULL, 1, 250000.00, 93), -- Videoportero Inteligente con Pantalla ($250k)
	(254, 'SN00254', '2025-05-07', NULL, 1, 50000.00, 94),  -- Spray de Defensa Personal Táctico ($50k)
	(255, 'SN00255', '2025-05-08', NULL, 1, 35000.00, 95),  -- Alarma Personal de Bolsillo 140dB ($35k)
	(256, 'SN00256', '2025-05-08', NULL, 1, 80000.00, 96),  -- Set de Bloques de Construcción 500 Piezas ($80k)
	(257, 'SN00257', '2025-05-09', NULL, 1, 40000.00, 97),  -- Rompecabezas 3D de Monumentos ($40k)
	(258, 'SN00258', '2025-05-09', NULL, 1, 130000.00, 98), -- Juego de Mesa Catan (Edición Clásica) ($130k)
	(259, 'SN00259', '2025-05-10', NULL, 1, 30000.00, 99),  -- Cubo Rubik Profesional 3x3 ($30k)
	(260, 'SN00260', '2025-05-10', NULL, 1, 190000.00, 100),-- Futbolín de Mesa Plegable ($190k)
	(261, 'SN00261', '2025-05-11', NULL, 1, 150000.00, 101),-- Cafetera Programable 12 Tazas ($150k)
	(262, 'SN00262', '2025-05-11', NULL, 1, 220000.00, 102),-- Horno Eléctrico de Convección ($220k)
	(263, 'SN00263', '2025-05-12', NULL, 1, 45000.00, 103),-- Set de Tuppers Herméticos (5 und.) ($45k)
	(264, 'SN00264', '2025-05-12', NULL, 1, 35000.00, 104),-- Velas Aromáticas de Soja ($35k)
	(265, 'SN00265', '2025-05-13', NULL, 1, 80000.00, 105),-- Juego de Cubiertos Acero Inoxidable (24 pzs) ($80k)
	(266, 'SN00266', '2025-05-13', NULL, 1, 55000.00, 106),-- Escurridor de Platos de Bambú ($55k)
	(267, 'SN00267', '2025-05-14', NULL, 1, 70000.00, 107),-- Limpiavidrios Magnético ($70k)
	(268, 'SN00268', '2025-05-14', NULL, 1, 50000.00, 108),-- Toallas de Mano de Lujo (4 und.) ($50k)
	(269, 'SN00269', '2025-05-15', NULL, 1, 180000.00, 109),-- Espejo de Baño Anti-Vaho con LED ($180k)
	(270, 'SN00270', '2025-05-15', NULL, 1, 60000.00, 110),-- Set de Guantes y Gorro de Lana ($60k)
	(271, 'SN00271', '2025-05-16', NULL, 1, 45000.00, 111),-- Riñonera Deportiva Impermeable ($45k)
	(272, 'SN00272', '2025-05-16', NULL, 1, 30000.00, 112),-- Paquete de Medias Invisibles (6 pares) ($30k)
	(273, 'SN00273', '2025-05-17', NULL, 1, 25000.00, 113),-- Correa para Reloj de Silicona ($25k)
	(274, 'SN00274', '2025-05-17', NULL, 1, 20000.00, 114),-- Estuche Rígido para Gafas de Sol ($20k)
	(275, 'SN00275', '2025-05-18', NULL, 1, 15000.00, 115),-- Llavero Multifuncional con Abridor ($15k)
	(276, 'SN00276', '2025-05-18', NULL, 1, 35000.00, 116),-- Tarjetero de Aluminio Anti-RFID ($35k)
	(277, 'SN00277', '2025-05-19', NULL, 1, 28000.00, 117),-- Diadema Trenzada de Terciopelo ($28k)
	(278, 'SN00278', '2025-05-19', NULL, 1, 75000.00, 118),-- Cinturón Reversible de Cuero Genuino ($75k)
	(279, 'SN00279', '2025-05-20', NULL, 1, 32000.00, 119),-- Collar Estilo Coreano con Dijes de Mariposa ($32k)
	(280, 'SN00280', '2025-05-20', NULL, 1, 18000.00, 120),-- Set de 3 Pulseras de Hilo Rojo ($18k)
	(281, 'SN00281', '2025-05-21', NULL, 1, 25000.00, 121),-- Anillo con Inicial Personalizada ($25k)
	(282, 'SN00282', '2025-05-21', NULL, 1, 38000.00, 122),-- Aretes Tipo Trepador de Circonitas ($38k)
	(283, 'SN00283', '2025-05-22', NULL, 1, 20000.00, 123),-- Tobillera de Cadena Fina ($20k)
	(284, 'SN00284', '2025-05-22', NULL, 1, 45000.00, 124),-- Brazalete Ancho Estilo Vintage ($45k)
	(285, 'SN00285', '2025-05-23', NULL, 1, 30000.00, 125),-- Pendientes de Aro con Perlas Colgantes ($30k)
	(286, 'SN00286', '2025-05-23', NULL, 1, 15000.00, 126),-- Set de 5 Anillos Minimalistas ($15k)
	(287, 'SN00287', '2025-05-24', NULL, 1, 22000.00, 127),-- Collar Estilo Choker de Terciopelo ($22k)
	(288, 'SN00288', '2025-05-24', NULL, 1, 80000.00, 128),-- Falda Midi Plisada ($80k)
	(289, 'SN00289', '2025-05-25', NULL, 1, 160000.00, 129),-- Saco de Lana Gruesa Oversize ($160k)
	(290, 'SN00290', '2025-05-25', NULL, 1, 50000.00, 130),-- Tops Cortos (3 unidades) ($50k)
	(291, 'SN00291', '2025-05-26', NULL, 1, 130000.00, 131),-- Overol de Jean Roto ($130k)
	(292, 'SN00292', '2025-05-26', NULL, 1, 95000.00, 132),-- Botas de Lluvia de Goma ($95k)
	(293, 'SN00293', '2025-05-27', NULL, 1, 110000.00, 133),-- Zapatillas Deportivas de Malla Transpirable ($110k)
	(294, 'SN00294', '2025-05-27', NULL, 1, 140000.00, 134),-- Blazer Cruzado de Oficina ($140k)
	(295, 'SN00295', '2025-05-28', NULL, 1, 170000.00, 135),-- Vestido Maxi Bohemio ($170k)
	(296, 'SN00296', '2025-05-28', NULL, 1, 85000.00, 136),-- Pantalón Jogger Deportivo ($85k)
	(297, 'SN00297', '2025-05-29', NULL, 1, 200000.00, 137),-- Foco Inteligente con Cámara ($200k)
	(298, 'SN00298', '2025-05-29', NULL, 1, 40000.00, 138),-- Linterna Táctica Recargable LED ($40k)
	(299, 'SN00299', '2025-05-30', NULL, 1, 95000.00, 139),-- Tiras de Multitomas para Rack ($95k)
	(300, 'SN00300', '2025-05-30', NULL, 1, 55000.00, 140),-- Kit de Cables Eléctricos Sólidos ($55k)
	(301, 'SN00301', '2025-05-31', NULL, 1, 30000.00, 141),-- Tester de Voltaje sin Contacto ($30k)
	(302, 'SN00302', '2025-05-31', NULL, 1, 120000.00, 142),-- Estación de Soldadura con Temperatura Regulable ($120k)
	(303, 'SN00303', '2025-06-01', NULL, 1, 90000.00, 143),-- Batería Externa Power Bank 20000mAh ($90k)
	(304, 'SN00304', '2025-06-01', NULL, 1, 70000.00, 144),-- Adaptador Universal de Viaje ($70k)
	(305, 'SN00305', '2025-06-02', NULL, 1, 25000.00, 145),-- Cables Jumper de Prueba para Electrónica ($25k)
	(306, 'SN00306', '2025-06-02', NULL, 1, 35000.00, 146),-- Banda de Resistencia de Látex (5 niveles) ($35k)
	(307, 'SN00307', '2025-06-03', NULL, 1, 40000.00, 147),-- Rodillo de Espuma para Masaje ($40k)
	(308, 'SN00308', '2025-06-03', NULL, 1, 600000.00, 148),-- Bicicleta Fija Spinning ($600k)
	(309, 'SN00309', '2025-06-04', NULL, 1, 45000.00, 149),-- Guantes de Gimnasio con Muñequera ($45k)
	(310, 'SN00310', '2025-06-04', NULL, 1, 20000.00, 150),-- Chaleco Reflectante de Seguridad ($20k)
	(311, 'SN00311', '2025-06-05', NULL, 1, 55000.00, 151),-- Set de Dardos Profesionales (6 und.) ($55k)
	(312, 'SN00312', '2025-06-05', NULL, 1, 350000.00, 152),-- Mesa de Ping Pong Plegable ($350k)
	(313, 'SN00313', '2025-06-06', NULL, 1, 60000.00, 153),-- Set de Pesca Infantil ($60k)
	(314, 'SN00314', '2025-06-06', NULL, 1, 85000.00, 154),-- Nevera Portátil Térmica 20L ($85k)
	(315, 'SN00315', '2025-06-07', NULL, 1, 110000.00, 155),-- Pantalón Chino Slim Fit ($110k)
	(316, 'SN00316', '2025-06-07', NULL, 1, 140000.00, 156),-- Chaqueta Acolchada Ultraligera ($140k)
	(317, 'SN00317', '2025-06-08', NULL, 1, 130000.00, 157),-- Camisa de Vestir Slim Fit ($130k)
	(318, 'SN00318', '2025-06-08', NULL, 1, 80000.00, 158),-- Polo de Piqué Clásico ($80k)
	(319, 'SN00319', '2025-06-09', NULL, 1, 160000.00, 159),-- Zapatos Oxford de Cuero Brillante ($160k)
	(320, 'SN00320', '2025-06-09', NULL, 1, 200000.00, 160),-- Botas de Trabajo con Punta de Acero ($200k)
	(321, 'SN00321', '2025-06-10', NULL, 1, 35000.00, 161),-- Medias de Vestir de Bambú (3 pares) ($35k)
	(322, 'SN00322', '2025-06-10', NULL, 1, 150000.00, 162),-- Chaqueta de Mezclilla Clásica ($150k)
	(323, 'SN00323', '2025-06-11', NULL, 1, 90000.00, 163),-- Shorts Cargo Multibolsillos ($90k)
	(324, 'SN00324', '2025-06-11', NULL, 1, 180000.00, 164),-- Estantería Modular con 5 Cubos ($180k)
	(325, 'SN00325', '2025-06-12', NULL, 1, 350000.00, 165),-- Silla Ergonómica de Oficina ($350k)
	(326, 'SN00326', '2025-06-12', NULL, 1, 120000.00, 166),-- Mesa Auxiliar Redonda ($120k)
	(327, 'SN00327', '2025-06-13', NULL, 1, 450000.00, 167),-- Sofá Cama Futón ($450k)
	(328, 'SN00328', '2025-06-13', NULL, 1, 150000.00, 168),-- Juego de 2 Sillas de Comedor Eames ($150k)
	(329, 'SN00329', '2025-06-14', NULL, 1, 220000.00, 169),-- Escritorio Esquinero para Computadora ($220k)
	(330, 'SN00330', '2025-06-14', NULL, 1, 700000.00, 170),-- Colchón King Size Memory Foam ($700k)
	(331, 'SN00331', '2025-06-15', NULL, 1, 280000.00, 171),-- Cajonera de 6 Cajones ($280k)
	(332, 'SN00332', '2025-06-15', NULL, 1, 45000.00, 172),-- Perchero de Pie Metálico ($45k)
	(333, 'SN00333', '2025-06-16', NULL, 1, 80000.00, 173),-- Ropa Impermeable para Perro ($80k)
	(334, 'SN00334', '2025-06-16', NULL, 1, 55000.00, 174),-- Juguete Dispensador de Premios ($55k)
	(335, 'SN00335', '2025-06-17', NULL, 1, 90000.00, 175),-- Caja de Arena Cerrada para Gatos ($90k)
	(336, 'SN00336', '2025-06-17', NULL, 1, 40000.00, 176),-- Set de Cepillos para Cuidado del Pelo ($40k)
	(337, 'SN00337', '2025-06-18', NULL, 1, 65000.00, 177),-- Fuentes de Agua para Mascotas ($65k)
	(338, 'SN00338', '2025-06-18', NULL, 1, 30000.00, 178),-- Snacks Dentales para Perros ($30k)
	(339, 'SN00339', '2025-06-19', NULL, 1, 110000.00, 179),-- Poste Rascador Alto con Plataforma ($110k)
	(340, 'SN00340', '2025-06-19', NULL, 1, 50000.00, 180),-- Correa Retráctil 5 Metros ($50k)
	(341, 'SN00341', '2025-06-20', NULL, 1, 35000.00, 181),-- Champú Seco para Gatos ($35k)
	(342, 'SN00342', '2025-06-20', NULL, 1, 350000.00, 182),-- Cerradura Inteligente Biometríca ($350k)
	(343, 'SN00343', '2025-06-21', NULL, 1, 95000.00, 183),-- Detector de Humo y Monóxido de Carbono ($95k)
	(344, 'SN00344', '2025-06-21', NULL, 1, 180000.00, 184),-- Mini Caja Fuerte de Acero ($180k)
	(345, 'SN00345', '2025-06-22', NULL, 1, 45000.00, 185),-- Timbre Inalámbrico con 50 Melodías ($45k)
	(346, 'SN00346', '2025-06-22', NULL, 1, 280000.00, 186),-- Sistema de Alarma Doméstica DIY ($280k)
	(347, 'SN00347', '2025-06-23', NULL, 1, 50000.00, 187),-- Luz LED Solar con Sensor de Movimiento ($50k)
	(348, 'SN00348', '2025-06-23', NULL, 1, 20000.00, 188),-- Cámara Falsa de Vigilancia (Simulada) ($20k)
	(349, 'SN00349', '2025-06-24', NULL, 1, 60000.00, 189),-- Candado de Alta Seguridad para Bicicleta ($60k)
	(350, 'SN00350', '2025-06-24', NULL, 1, 30000.00, 190),-- Bloqueo de Seguridad para Refrigerador ($30k)
	(351, 'SN00351', '2025-06-25', NULL, 1, 250000.00, 191),-- Pista de Carros Eléctrica (Scalextric) ($250k)
	(352, 'SN00352', '2025-06-25', NULL, 1, 50000.00, 192),-- Set de Juguetes Educativos de Madera ($50k)
	(353, 'SN00353', '2025-06-26', NULL, 1, 150000.00, 193),-- Robot de Juguete Programable ($150k)
	(354, 'SN00354', '2025-06-26', NULL, 1, 75000.00, 194),-- Muñeca Articulada con Accesorios ($75k)
	(355, 'SN00355', '2025-06-27', NULL, 1, 40000.00, 195),-- Juego de Cartas UNO Deluxe ($40k)
	(356, 'SN00356', '2025-06-27', NULL, 1, 55000.00, 196),-- Juego de Magia para Niños ($55k)
	(357, 'SN00357', '2025-06-28', NULL, 1, 90000.00, 197),-- Rompecabezas de 1000 Piezas (Paisaje) ($90k)
	(358, 'SN00358', '2025-06-28', NULL, 1, 65000.00, 198),-- Set de Figuras de Acción Coleccionables ($65k)
	(359, 'SN00359', '2025-06-29', NULL, 1, 130000.00, 199),-- Telescopio Astronómico para Principiantes ($130k)
	(360, 'SN00360', '2025-06-29', NULL, 1, 85000.00, 200);-- Consola de Videojuegos Retro Portátil ($85k)

	INSERT INTO `pedidos` (`id_pedido`, `cliente_id`, `fecha_pedido`, `estado`, `total`) VALUES
	(1, 2, '2025-02-10', 'Completado', 442500.00),
	(2, 3, '2025-03-01', 'Completado', 584500.00),
	(3, 4, '2025-03-20', 'Completado', 1490000.00),
	(4, 5, '2025-04-10', 'Completado', 588500.00),
	(5, 6, '2025-05-01', 'Completado', 1211000.00),
	(6, 7, '2025-05-20', 'Completado', 607500.00),
	(7, 8, '2025-06-10', 'Completado', 448500.00),
	(8, 9, '2025-07-01', 'Completado', 346000.00),
	(9, 10, '2025-07-20', 'Completado', 374000.00),
	(10, 11, '2025-08-10', 'Completado', 1289500.00),
	(11, 12, '2025-08-30', 'Completado', 472500.00),
	(12, 13, '2025-09-20', 'Completado', 2047500.00),
	(13, 14, '2025-10-10', 'Completado', 530500.00),
	(14, 15, '2025-11-01', 'Completado', 636000.00),
	(15, 16, '2025-11-20', 'Completado', 733500.00),
	(16, 17, '2025-12-10', 'Completado', 1017500.00),
	(17, 18, '2026-01-01', 'Completado', 356000.00),
	(18, 19, '2026-01-20', 'Completado', 703500.00),
	(19, 20, '2026-02-10', 'Completado', 1195000.00),
	(20, 21, '2026-03-01', 'Completado', 771000.00),
	(21, 22, '2026-03-20', 'Completado', 451500.00),
	(22, 23, '2026-04-10', 'Completado', 429500.00),
	(23, 24, '2026-04-30', 'Completado', 369500.00),
	(24, 25, '2026-05-20', 'Completado', 585000.00),
	(25, 26, '2026-06-10', 'Completado', 529000.00),
	(26, 27, '2026-07-01', 'Completado', 490500.00),
	(27, 28, '2026-07-20', 'Completado', 377000.00),
	(28, 29, '2026-08-10', 'Completado', 1018500.00),
	(29, 30, '2026-09-01', 'Completado', 376000.00),
	(30, 31, '2026-09-20', 'Completado', 497500.00),
	(31, 32, '2026-10-10', 'Completado', 472500.00),
	(32, 33, '2026-10-30', 'Completado', 607500.00),
	(33, 34, '2026-11-20', 'Completado', 494500.00),
	(34, 35, '2026-12-10', 'Completado', 448500.00),
	(35, 36, '2026-12-30', 'Completado', 424000.00),
	(36, 37, '2027-01-20', 'Completado', 386500.00),
	(37, 38, '2027-02-10', 'Completado', 505500.00),
	(38, 39, '2027-03-01', 'Completado', 338500.00),
	(39, 40, '2027-03-20', 'Completado', 615000.00),
	(40, 41, '2027-04-10', 'Completado', 545500.00);

	INSERT INTO `detalle_pedido` (`id_detalle`, `pedido_id`, `producto_id`, `cantidad`, `subtotal`) VALUES
	-- Pedido 1 (id_pedido: 1, Cliente: 2, Total: 442500.00)
	(1, 1, 1, 1, 83500.00),   -- Item 3 (Producto 1)
	(2, 1, 2, 1, 179500.00),  -- Item 8 (Producto 2)
	(3, 1, 3, 1, 160500.00),  -- Item 13 (Producto 3)
	(4, 1, 4, 1, 790000.00),  -- Item 18 (Producto 4) - ¡Nota: Este precio alto es del ítem 18!
	(5, 1, 5, 1, 108500.00),  -- Item 24 (Producto 5)

	-- Pedido 2 (id_pedido: 2, Cliente: 3, Total: 584500.00)
	(6, 2, 6, 1, 128500.00),  -- Item 29 (Producto 6)
	(7, 2, 7, 1, 188000.00),  -- Item 34 (Producto 7)
	(8, 2, 8, 1, 2450000.00), -- Item 39 (Producto 8) - ¡Nota: Este precio alto es del ítem 39!
	(9, 2, 9, 1, 150000.00),  -- Item 44 (Producto 9)
	(10, 2, 10, 1, 117500.00), -- Item 49 (Producto 10)

	-- Pedido 3 (id_pedido: 3, Cliente: 4, Total: 1490000.00)
	(11, 3, 11, 1, 93500.00), -- Item 54 (Producto 11)
	(12, 3, 12, 1, 217000.00), -- Item 59 (Producto 12)
	(13, 3, 13, 1, 159500.00), -- Item 64 (Producto 13)
	(14, 3, 14, 1, 247500.00), -- Item 69 (Producto 14)
	(15, 3, 15, 1, 835000.00), -- Item 74 (Producto 15)

	-- Pedido 4 (id_pedido: 4, Cliente: 5, Total: 588500.00)
	(16, 4, 16, 1, 113500.00), -- Item 79 (Producto 16)
	(17, 4, 17, 1, 88500.00), -- Item 84 (Producto 17)
	(18, 4, 18, 1, 43500.00), -- Item 89 (Producto 18)
	(19, 4, 19, 1, 347000.00), -- Item 94 (Producto 19)
	(20, 4, 20, 1, 137500.00), -- Item 99 (Producto 20)

	-- Pedido 5 (id_pedido: 5, Cliente: 6, Total: 1211000.00)
	(21, 5, 21, 1, 317500.00), -- Item 104 (Producto 21)
	(22, 5, 22, 1, 83500.00), -- Item 109 (Producto 22)
	(23, 5, 23, 1, 445000.00), -- Item 114 (Producto 23)
	(24, 5, 24, 1, 376500.00), -- Item 119 (Producto 24)
	(25, 5, 25, 1, 247500.00), -- Item 124 (Producto 25)

	-- Pedido 6 (id_pedido: 6, Cliente: 7, Total: 607500.00)
	(26, 6, 26, 1, 187500.00), -- Item 129 (Producto 26)
	(27, 6, 27, 1, 53500.00), -- Item 134 (Producto 27)
	(28, 6, 28, 1, 68500.00), -- Item 139 (Producto 28)
	(29, 6, 29, 1, 108500.00), -- Item 144 (Producto 29)
	(30, 6, 30, 1, 133500.00), -- Item 149 (Producto 30)

	-- Pedido 7 (id_pedido: 7, Cliente: 8, Total: 448500.00)
	(31, 7, 31, 1, 38500.00), -- Item 154 (Producto 31)
	(32, 7, 32, 1, 63500.00), -- Item 159 (Producto 32)
	(33, 7, 33, 1, 33500.00), -- Item 164 (Producto 33)
	(34, 7, 34, 1, 23500.00), -- Item 169 (Producto 34)
	(35, 7, 35, 1, 88500.00), -- Item 174 (Producto 35)

	-- Pedido 8 (id_pedido: 8, Cliente: 9, Total: 346000.00)
	(36, 8, 36, 1, 93500.00), -- Item 179 (Producto 36)
	(37, 8, 37, 1, 46500.00), -- Item 184 (Producto 37)
	(38, 8, 38, 1, 167500.00), -- Item 189 (Producto 38)
	(39, 8, 39, 1, 542000.00), -- Item 194 (Producto 39) - ¡Nota: Este precio alto es del ítem 194!
	(40, 8, 40, 1, 58500.00), -- Item 199 (Producto 40)

	-- Pedido 9 (id_pedido: 9, Cliente: 10, Total: 374000.00)
	(41, 9, 41, 1, 742000.00), -- Item 204 (Producto 41) - ¡Nota: Este precio alto es del ítem 204!
	(42, 9, 42, 1, 117500.00), -- Item 209 (Producto 42)
	(43, 9, 43, 1, 177500.00), -- Item 214 (Producto 43)
	(44, 9, 44, 1, 95500.00), -- Item 219 (Producto 44)
	(45, 9, 45, 1, 28500.00), -- Item 224 (Producto 45)

	-- Pedido 10 (id_pedido: 10, Cliente: 11, Total: 1289500.00)
	(46, 10, 46, 1, 207500.00), -- Item 229 (Producto 46)
	(47, 10, 47, 1, 387500.00), -- Item 234 (Producto 47)
	(48, 10, 48, 1, 237500.00), -- Item 239 (Producto 48)
	(49, 10, 49, 1, 177500.00), -- Item 244 (Producto 49)
	(50, 10, 50, 1, 147500.00), -- Item 249 (Producto 50)

	-- A partir del Pedido 11, la venta continúa con los ítems 254, 259, 264, etc., que corresponden a los Productos 51, 52, 53, etc.
	-- **Nota:** Asumo que el patrón de venta se repite, tomando el 4to ítem de cada producto como el vendido.

	-- Pedido 11 (id_pedido: 11, Cliente: 12)
	(51, 11, 51, 1, 118000.00), -- Item 254 (Producto 51)
	(52, 11, 52, 1, 178000.00), -- Item 259 (Producto 52)
	(53, 11, 53, 1, 137500.00), -- Item 264 (Producto 53)
	(54, 11, 54, 1, 70000.00),  -- Item 269 (Producto 54)
	(55, 11, 55, 1, 115000.00), -- Item 274 (Producto 55)

	-- Pedido 12 (id_pedido: 12, Cliente: 13)
	(56, 12, 56, 1, 790000.00), -- Item 279 (Producto 56)
	(57, 12, 57, 1, 840000.00), -- Item 284 (Producto 57)
	(58, 12, 58, 1, 70000.00),  -- Item 289 (Producto 58)
	(59, 12, 59, 1, 295000.00), -- Item 294 (Producto 59)
	(60, 12, 60, 1, 52500.00),  -- Item 299 (Producto 60)

	-- Pedido 13 (id_pedido: 13, Cliente: 14)
	(61, 13, 61, 1, 188000.00), -- Item 304 (Producto 61)
	(62, 13, 62, 1, 87500.00),  -- Item 309 (Producto 62)
	(63, 13, 63, 1, 88500.00),  -- Item 314 (Producto 63)
	(64, 13, 64, 1, 76500.00),  -- Item 319 (Producto 64)
	(65, 13, 65, 1, 88500.00),  -- Item 324 (Producto 65)

	-- Pedido 14 (id_pedido: 14, Cliente: 15)
	(66, 14, 66, 1, 187500.00), (67, 14, 67, 1, 157500.00), (68, 14, 68, 1, 108500.00), (69, 14, 69, 1, 127500.00), (70, 14, 70, 1, 55000.00),

	-- Pedido 15 (id_pedido: 15, Cliente: 16)
	(71, 15, 71, 1, 183500.00), (72, 15, 72, 1, 127500.00), (73, 15, 73, 1, 107500.00), (74, 15, 74, 1, 117500.00), (75, 15, 75, 1, 197500.00),

	-- Pedido 16 (id_pedido: 16, Cliente: 17)
	(76, 16, 76, 1, 177500.00), (77, 16, 77, 1, 287500.00), (78, 16, 78, 1, 177500.00), (79, 16, 79, 1, 187500.00), (80, 16, 80, 1, 187500.00),

	-- Pedido 17 (id_pedido: 17, Cliente: 18)
	(81, 17, 81, 1, 108500.00), (82, 17, 82, 1, 77500.00), (83, 17, 83, 1, 73500.00), (84, 17, 84, 1, 42500.00), (85, 17, 85, 1, 54000.00),

	-- Pedido 18 (id_pedido: 18, Cliente: 19)
	(86, 18, 86, 1, 133500.00), (87, 18, 87, 1, 107500.00), (88, 18, 88, 1, 147500.00), (89, 18, 89, 1, 157500.00), (90, 18, 90, 1, 157500.00),

	-- Pedido 19 (id_pedido: 19, Cliente: 20)
	(91, 19, 91, 1, 317500.00), (92, 19, 92, 1, 127500.00), (93, 19, 93, 1, 217500.00), (94, 19, 94, 1, 217500.00), (95, 19, 95, 1, 317500.00),

	-- Pedido 20 (id_pedido: 20, Cliente: 21)
	(96, 20, 96, 1, 247500.00), (97, 20, 97, 1, 177500.00), (98, 20, 98, 1, 157500.00), (99, 20, 99, 1, 137500.00), (100, 20, 100, 1, 50000.00),

	-- Pedido 21 (id_pedido: 21, Cliente: 22)
	(101, 21, 101, 1, 157500.00), (102, 21, 102, 1, 78500.00), (103, 21, 103, 1, 88500.00), (104, 21, 104, 1, 57500.00), (105, 21, 105, 1, 73500.00),

	-- Pedido 22 (id_pedido: 22, Cliente: 23)
	(106, 22, 106, 1, 63500.00), (107, 22, 107, 1, 127500.00), (108, 22, 108, 1, 117500.00), (109, 22, 109, 1, 47500.00), (110, 22, 110, 1, 73500.00),

	-- Pedido 23 (id_pedido: 23, Cliente: 24)
	(111, 23, 111, 1, 127500.00), (112, 23, 112, 1, 53500.00), (113, 23, 113, 1, 47500.00), (114, 23, 114, 1, 73500.00), (115, 23, 115, 1, 67500.00),

	-- Pedido 24 (id_pedido: 24, Cliente: 25)
	(116, 24, 116, 1, 187500.00), (117, 24, 117, 1, 137500.00), (118, 24, 118, 1, 73500.00), (119, 24, 119, 1, 97500.00), (120, 24, 120, 1, 88500.00),

	-- Pedido 25 (id_pedido: 25, Cliente: 26)
	(121, 25, 121, 1, 157500.00), (122, 25, 122, 1, 127500.00), (123, 25, 123, 1, 73500.00), (124, 25, 124, 1, 73500.00), (125, 25, 125, 1, 97500.00),

	-- Pedido 26 (id_pedido: 26, Cliente: 27)
	(126, 26, 126, 1, 157500.00), (127, 26, 127, 1, 127500.00), (128, 26, 128, 1, 73500.00), (129, 26, 129, 1, 73500.00), (130, 26, 130, 1, 58500.00),

	-- Pedido 27 (id_pedido: 27, Cliente: 28)
	(131, 27, 131, 1, 127500.00), (132, 27, 132, 1, 53500.00), (133, 27, 133, 1, 73500.00), (134, 27, 134, 1, 73500.00), (135, 27, 135, 1, 50000.00),

	-- Pedido 28 (id_pedido: 28, Cliente: 29)
	(136, 28, 136, 1, 207500.00), (137, 28, 137, 1, 237500.00), (138, 28, 138, 1, 217500.00), (139, 28, 139, 1, 207500.00), (140, 28, 140, 1, 147500.00),

	-- Pedido 29 (id_pedido: 29, Cliente: 30)
	(141, 29, 141, 1, 107500.00), (142, 29, 142, 1, 73500.00), (143, 29, 143, 1, 73500.00), (144, 29, 144, 1, 53500.00), (145, 29, 145, 1, 67500.00),

	-- Pedido 30 (id_pedido: 30, Cliente: 31)
	(146, 30, 146, 1, 157500.00), (147, 30, 147, 1, 127500.00), (148, 30, 148, 1, 107500.00), (149, 30, 149, 1, 73500.00), (150, 30, 150, 1, 31500.00),

	-- Pedido 31 (id_pedido: 31, Cliente: 32)
	(151, 31, 151, 1, 157500.00), (152, 31, 152, 1, 127500.00), (153, 31, 153, 1, 107500.00), (154, 31, 154, 1, 73500.00), (155, 31, 155, 1, 73500.00),

	-- Pedido 32 (id_pedido: 32, Cliente: 33)
	(156, 32, 156, 1, 187500.00), (157, 32, 157, 1, 137500.00), (158, 32, 158, 1, 107500.00), (159, 32, 159, 1, 97500.00), (160, 32, 160, 1, 77500.00),

	-- Pedido 33 (id_pedido: 33, Cliente: 34)
	(161, 33, 161, 1, 137500.00), (162, 33, 162, 1, 127500.00), (163, 33, 163, 1, 73500.00), (164, 33, 164, 1, 73500.00), (165, 33, 165, 1, 82500.00),

	-- Pedido 34 (id_pedido: 34, Cliente: 35)
	(166, 34, 166, 1, 127500.00), (167, 34, 167, 1, 73500.00), (168, 34, 168, 1, 73500.00), (169, 34, 169, 1, 73500.00), (170, 34, 170, 1, 100500.00),

	-- Pedido 35 (id_pedido: 35, Cliente: 36)
	(171, 35, 171, 1, 127500.00), (172, 35, 172, 1, 73500.00), (173, 35, 173, 1, 73500.00), (174, 35, 174, 1, 73500.00), (175, 35, 175, 1, 76000.00),

	-- Pedido 36 (id_pedido: 36, Cliente: 37)
	(176, 36, 176, 1, 127500.00), (177, 36, 177, 1, 73500.00), (178, 36, 178, 1, 73500.00), (179, 36, 179, 1, 73500.00), (180, 36, 180, 1, 88500.00),

	-- Pedido 37 (id_pedido: 37, Cliente: 38)
	(181, 37, 181, 1, 127500.00), (182, 37, 182, 1, 73500.00), (183, 37, 183, 1, 73500.00), (184, 37, 184, 1, 73500.00), (185, 37, 185, 1, 157500.00),

	-- Pedido 38 (id_pedido: 38, Cliente: 39)
	(186, 38, 186, 1, 127500.00), (187, 38, 187, 1, 73500.00), (188, 38, 188, 1, 73500.00), (189, 38, 189, 1, 73500.00), (190, 38, 190, 1, 73500.00),

	-- Pedido 39 (id_pedido: 39, Cliente: 40)
	(191, 39, 191, 1, 127500.00), (192, 39, 192, 1, 73500.00), (193, 39, 193, 1, 73500.00), (194, 39, 194, 1, 73500.00), (195, 39, 195, 1, 267500.00),

	-- Pedido 40 (id_pedido: 40, Cliente: 41)
	(196, 40, 196, 1, 127500.00), (197, 40, 197, 1, 73500.00), (198, 40, 198, 1, 73500.00), (199, 40, 199, 1, 73500.00), (200, 40, 200, 1, 191000.00);

	CREATE VIEW VwInventarioPorProducto AS
	SELECT
		i.id AS IdInventario,
		i.producto_id AS IdProducto,
		p.nombre AS NombreProducto,
		i.cantidad AS CantidadEnInventario
	FROM
		inventarios i
	JOIN
		productos p ON i.producto_id = p.id;

	DELIMITER //
	CREATE PROCEDURE SP_BuscarInventarioPorNombre(
		IN nombre_buscado VARCHAR(255)
	)
	BEGIN
		SELECT
			IdProducto,
			NombreProducto,
			CantidadEnInventario
		FROM
			VwInventarioPorProducto
		WHERE
			NombreProducto LIKE CONCAT('%', nombre_buscado, '%');
	END //
	DELIMITER ;


		UPDATE pedidos
		SET vendedor_id = 1;
		
		UPDATE productos
	SET vendedor_id = 1;

	CREATE VIEW VwVentasVendedor1 AS
	SELECT
		YEAR(p.fecha_pedido) AS Anio,
		MONTH(p.fecha_pedido) AS Mes,
		DAY(p.fecha_pedido) AS Dia,
		SUM(dp.subtotal) AS TotalVenta
	FROM
		pedidos p
	JOIN
		detalle_pedido dp ON p.id_pedido = dp.pedido_id
	WHERE
		p.vendedor_id = 1
	GROUP BY
		Anio, Mes, Dia
	ORDER BY
		Anio ASC, Mes ASC, Dia ASC;


	DELIMITER //
	DROP PROCEDURE IF EXISTS SP_ConsultarVentasVendedor;
	CREATE PROCEDURE SP_ConsultarVentasVendedor(
		IN anio_in INT,
		IN mes_in INT,
		IN dia_in INT
	)
	BEGIN
		-- Si solo se proporciona el año, agrupa por año para obtener el total anual.
		IF anio_in IS NOT NULL AND mes_in IS NULL AND dia_in IS NULL THEN
			SELECT SUM(TotalVenta) AS TotalVentasAnuales
			FROM VwVentasVendedor1
			WHERE Anio = anio_in;

		-- Si se proporciona el año y el mes, agrupa por mes para obtener el total mensual.
		ELSEIF anio_in IS NOT NULL AND mes_in IS NOT NULL AND dia_in IS NULL THEN
			SELECT SUM(TotalVenta) AS TotalVentasMensuales
			FROM VwVentasVendedor1
			WHERE Anio = anio_in AND Mes = mes_in;
		
		-- Si se proporcionan el año, mes y día, muestra el total diario.
		ELSEIF anio_in IS NOT NULL AND mes_in IS NOT NULL AND dia_in IS NOT NULL THEN
			SELECT SUM(TotalVenta) AS TotalVentasDiarias
			FROM VwVentasVendedor1
			WHERE Anio = anio_in AND Mes = mes_in AND Dia = dia_in;

		-- Si no se proporciona ningún parámetro, muestra las ventas totales por año.
		ELSE
			SELECT Anio, SUM(TotalVenta) AS TotalVentasAnuales
			FROM VwVentasVendedor1
			GROUP BY Anio;
		END IF;
	END //
	DELIMITER ;




	INSERT INTO bot_responses (clave, respuesta, prioridad, enabled) VALUES
	('horario','Nuestro horario es Lunes a Viernes 8:00-18:00', 10, true),
	('envio','Los envíos tardan 2-5 días hábiles', 10, true),
	('devolucion','Aceptamos devoluciones dentro de 15 días con factura', 8, true);


	-- Videos para productos de la categoría Hogar
	INSERT INTO `videos` (`producto_id`, `url`, `fecha_subida`) VALUES
	-- Sartén Antiadherente
	(1, 'https://cdn1.totalcommerce.cloud/homesentry/product-zoom/es/sarten-con-tapa-ilko-just-cook-20cm-aluminio-antiadherente-1223-1.webp', '2025-10-29 00:00:00'),

	-- Set de Ollas 5 Piezas
	(2, 'https://m.media-amazon.com/images/I/61eX-YrNXeL.jpg', '2025-10-29 00:00:00'),

	-- Organizador de Especias
	(3, 'https://madecentro.com/cdn/shop/files/lgr025b02_3__1_700x700.jpg?v=1727370621', '2025-10-29 00:00:00'),

	-- Batidora de Mano Eléctrica
	(4, 'https://exitocol.vtexassets.com/arquivos/ids/13380305/batidora-de-mano-electrica-inmersion-home-elements-he1459.jpg?v=637917044401330000', '2025-10-29 00:00:00'),

	-- Freidora de Aire Digital
	(5, 'https://cuisinart.com.co/cdn/shop/files/108686-2_1000x.jpg?v=1754943946', '2025-10-29 00:00:00'),

	-- Juego de Cuchillos
	(6, 'https://madecentro.com/cdn/shop/files/hogar-juego-de-cuchillos-tramontina-23899060-mp-madecentro_1_700x700.jpg?v=1728417230', '2025-10-29 00:00:00'),

	-- Cuadro Abstracto
	(7, 'https://kudeko.com/cdn/shop/files/cuadro-vintage-abstract-abstracto-moderno_600x.jpg?v=1725435013', '2025-10-29 00:00:00'),

	-- Alfombra Shaggy
	(8, 'https://http2.mlstatic.com/D_NQ_NP_858624-MCO82215078830_022025-O.webp', '2025-10-29 00:00:00'),

	-- Reloj de Pared
	(9, 'https://media.istockphoto.com/id/597276512/es/foto/reloj-de-pared-aislado-en-blanco-diez-%C3%BAltimos-diez-a%C3%B1os.jpg?s=612x612&w=0&k=20&c=2usM_BRL7iA3cTzjzzIX7QOkpeRjerHL6_VuYnYjP7o=', '2025-10-29 00:00:00'),

	-- Escoba y Recogedor
	(10, 'https://ambientegourmet.vtexassets.com/arquivos/ids/236885/24954_2.jpg?v=638791343264400000', '2025-10-29 00:00:00'),

	-- Trapeador Giratorio Profesional
	(11, 'https://carulla.vteximg.com.br/arquivos/ids/5559472/trapero-giratorio-360-spin-mop.jpg?v=637660559633900000', '2025-10-29 00:00:00'),

	-- Ambientador Automático Glade
	(12, 'https://exitocol.vtexassets.com/arquivos/ids/29631166/Ambientador-Automatico-Aroma-A-Paraiso-Azul-X-175-ml-575787_b.jpg?v=638907137284070000', '2025-10-29 00:00:00'),

	-- Alfombrilla de Baño Antideslizante
	(13, 'https://http2.mlstatic.com/D_Q_NP_2X_773189-CBT82095449290_022025-AB.webp', '2025-10-29 00:00:00'),

	-- Cortina de Baño Impermeable
	(14, 'https://http2.mlstatic.com/D_NQ_NP_927744-MCO82828896332_032025-O.webp', '2025-10-29 00:00:00'),
	(191, 'https://http2.mlstatic.com/D_NQ_NP_811395-MLU78619994098_082024-O.webp', '2025-10-29 00:00:00'),
	(192, 'https://m.media-amazon.com/images/I/71qg9Ugr3eL._AC_UF894,1000_QL80_.jpg', '2025-10-29 00:00:00'),
	(193, 'https://http2.mlstatic.com/D_NQ_NP_660422-MLA92490894704_092025-O.webp', '2025-10-29 00:00:00'),
	(194, 'https://www.bogotabebes.com.ar/tienda/8425-large_default/mu%C3%B1eca-articulada-con-accesorios-domesticos-.jpg', '2025-10-29 00:00:00'),
	(195, 'https://i.ebayimg.com/images/g/nwYAAOSwNlNfAWDf/s-l400.jpg', '2025-10-29 00:00:00'),
	(196, 'https://http2.mlstatic.com/D_NQ_NP_768130-MCO75396574336_042024-O.webphttps://http2.mlstatic.com/D_NQ_NP_768130-MCO75396574336_042024-O.webp', '2025-10-29 00:00:00'),
	(197, 'https://resources.claroshop.com/imagenes-sanborns-ii/1200/7502251741495_3.jpg', '2025-10-29 00:00:00'),
	(198, 'https://http2.mlstatic.com/D_NQ_NP_868633-MCO73075247502_112023-O.webp', '2025-10-29 00:00:00'),
	(199, 'https://http2.mlstatic.com/D_NQ_NP_688407-MCO72494151175_102023-O.webp', '2025-10-29 00:00:00'),
	(200, 'https://exitocol.vtexassets.com/arquivos/ids/8104144/mini-consola-de-video-juego-portatil-retro-gameboy-400-games.jpg?v=637594956355500000', '2025-10-29 00:00:00');

	-- Seed common bot responses for e-commerce FAQ
	-- Columns: clave, respuesta, prioridad, enabled

	INSERT INTO bot_responses (clave, respuesta, prioridad, enabled) VALUES
	('horario','Nuestro horario es Lunes a Viernes 8:00-18:00 y Sábados 9:00-13:00', 10, true),
	('envio','Los envíos tardan 2-5 días hábiles dependiendo de tu ubicación. Te enviaremos un código de seguimiento cuando despachemos tu pedido.', 10, true),
	('devolucion','Aceptamos devoluciones dentro de 15 días desde la entrega, con el producto en su estado original y la factura. Consulta las condiciones específicas en nuestra política de devoluciones.', 9, true),
	('pedido_estado','Puedes ver el estado de tus pedidos en la sección "Mis pedidos" dentro de tu cuenta. Si necesitas ayuda con un pedido específico, dime el número de pedido.', 9, true),
	('cambiar_contraseña','Para cambiar tu contraseña ve a Perfil > Configuración > Cambiar contraseña. Si olvidaste tu contraseña utiliza el enlace "Recuperar contraseña" en la pantalla de inicio de sesión.', 10, true),
	('cambiar_nombre','Puedes editar tu nombre desde Perfil > Editar perfil. Después de guardar, los cambios se reflejarán en tu cuenta.', 8, true),
	('metodos_pago','Aceptamos tarjetas de crédito, débito, y pagos por transferencia. También soportamos pagos por PSE/ACH y pagos en efectivo en puntos habilitados según país.', 8, true),
	('seguimiento','Una vez procesado el pedido te enviaremos un correo con el número de seguimiento y un enlace para verificar el estado de entrega.', 9, true),
	('garantia','Todos nuestros productos cuentan con garantía del fabricante; revisa la ficha del producto para ver la duración exacta y condiciones. Podemos ayudarte a gestionar la garantía si lo necesitas.', 7, true),
	('promociones','Las promociones y descuentos se anuncian en la página principal y en nuestras redes sociales. Consulta la sección "Ofertas" para ver promociones activas.', 6, true),
	('cancelar_pedido','Si deseas cancelar un pedido contáctanos cuanto antes con el número de pedido. Si aún no ha sido despachado podremos cancelar y reembolsar según tu método de pago.', 9, true),
	('devolucion_tiempo','Los reembolsos suelen demorarse 5-10 días hábiles dependiendo del banco y método de pago.', 7, true),
	('factura','Si necesitas factura fiscal, solicita la emisión proporcionando tus datos fiscales en el formulario de pedido o contacta soporte.', 6, true),
	('tallas','Consulta la guía de tallas en la página del producto. Si tienes dudas sobre medidas, dinos qué prenda te interesa y te ayudamos.', 6, true),
	('stock','Si un producto aparece como agotado puedes suscribirte para recibir notificación cuando vuelva a estar disponible.', 6, true),
	('devolucion_danos','Si recibiste el producto dañado, por favor sube fotos y contacto en el formulario de devoluciones para gestionar un reemplazo o reembolso.', 9, true),
	('recoger_tienda','Ofrecemos recogida en tienda en puntos seleccionados; durante el checkout podrás elegir la opción si está disponible para tu zona.', 6, true),
	('facturacion','Para consultas de facturación escríbenos indicando tu número de pedido y los datos requeridos y te ayudamos a gestionarlo.', 6, true),
	('soporte','Puedes hablar con soporte a través de WhatsApp, correo o el chat en vivo. ¿Quieres que te conecte por WhatsApp?', 10, true),
	('ventas_mayor','Para compras al por mayor o cotizaciones escríbenos indicando los productos y cantidades y nuestro equipo de ventas te contactará.', 8, true),
	('cupon','Si tienes un cupón, introdúcelo en la pantalla de pago antes de finalizar la compra. Consulta las condiciones del cupón (vigencia y productos aplicables).', 7, true),
	('devolucion_sin_factura','En algunos casos aceptamos devoluciones sin factura presentando otra prueba de compra. Contacta soporte con tu número de pedido para evaluar el caso.', 5, true),
	('resenas','Puedes dejar una reseña en la página del producto después de recibir tu pedido. Las reseñas ayudan a otros clientes.', 4, true),
	('reserva','Si quieres reservar un producto contáctanos para verificar disponibilidad y condiciones de reserva.', 4, true),
	('ayuda_pago','Si tu pago falló, intenta nuevamente o contáctanos indicando el código de error y el monto; verificaremos el estado del pago.', 9, true),
	('devolucion_cambio','Si quieres cambiar por otra talla o color, solicita la gestión desde la sección de devoluciones y te indicaremos el proceso y costos si aplica.', 8, true),
	('cuenta_bloqueada','Si tu cuenta fue bloqueada por seguridad, contacta soporte indicando tu usuario para que verifiquemos e restauremos el acceso.', 9, true),
	('registro','Para registrarte necesitas un correo electrónico válido y crear una contraseña. También puedes registrarte con Google/Facebook si está habilitado.', 6, true),
	('factura_electronica','Solicita factura electrónica indicando tus datos fiscales al momento de la compra o por correo dentro de los 7 días siguientes.', 5, true),
	('devolucion_plazo','Recuerda: el plazo de devoluciones corre desde la fecha de entrega al cliente, no desde la fecha de envío.', 6, true),
	('contacto','Nuestro correo de atención es soporte@ejemplo.com y también atendemos por WhatsApp y teléfono en horario laboral.', 6, true),
	('tarjetas','Aceptamos Visa, Mastercard y American Express según país.', 6, true);

	-- Saludos y despedidas
	INSERT INTO bot_responses (clave, respuesta, prioridad, enabled) VALUES
	('saludo','¡Hola! Bienvenido a nuestra tienda. Puedo ayudarte con pedidos, envíos, devoluciones, o conectarte con soporte por WhatsApp si lo prefieres.', 10, true),
	('despedida','Gracias por visitarnos. Si necesitas algo más, vuelve cuando quieras. ¡Que tengas un excelente día!', 4, true),
	('request_whatsapp','Puedo conectarte por WhatsApp con nuestro equipo de soporte. ¿Deseas que te transfiera ahora?', 10, true),
	('stock_tarjetas','Si tienes problemas con el stock: si un producto aparece como agotado puedes suscribirte para recibir notificación cuando vuelva a estar disponible. Sobre tarjetas: aceptamos Visa, Mastercard y American Express; si tu pago con tarjeta falla, intenta otra tarjeta o contáctanos indicando el error para que lo revisemos.', 9, true);

	-- Puedes añadir más filas siguiendo el mismo patrón.

	UPDATE productos SET vendedor_id = 1;
INSERT INTO `reseñas` (`id_reseña`, `producto_id`, `cliente_id`, `calificación`, `comentario`, `respuesta_vendedor`, `fecha`) VALUES
	-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	-- Reseñas para los Productos 1 al 100 (Reseña 1 y 2 por producto)
	-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	-- Producto 1 (Cliente 2 y 3)
	(1, 1, 2, 5, '¡El mejor producto! Superó mis expectativas en calidad y durabilidad.', 'Gracias por tu excelente valoración. ¡Vuelve pronto!', '2025-05-15 10:00:00'),
	(2, 1, 3, 4, 'Muy buen artículo, aunque el envío fue un poco lento.', 'Lamentamos el retraso, trabajaremos en mejorar la logística.', '2025-05-16 11:30:00'),

	-- Producto 2 (Cliente 4 y 5)
	(3, 2, 4, 5, 'Perfecto para lo que necesitaba. La descripción era muy precisa.', 'Nos alegra que estés satisfecho con la compra.', '2025-05-17 14:45:00'),
	(4, 2, 5, 4, 'Buena relación calidad-precio. Un producto sólido.', '¡Gracias por tu opinión!', '2025-05-18 09:20:00'),

	-- Producto 3 (Cliente 6 y 7)
	(5, 3, 6, 5, 'Funciona maravillosamente. Lo recomiendo 100%.', '¡Es un placer servirte!', '2025-05-19 16:10:00'),
	(6, 3, 7, 4, 'Llegó en buenas condiciones, aunque la caja estaba un poco dañada.', 'Tomamos nota para mejorar el embalaje.', '2025-05-20 08:55:00'),

	-- Producto 4 (Cliente 8 y 9)
	(7, 4, 8, 5, 'Calidad premium. Definitivamente vale la pena el precio.', 'Tu satisfacción es nuestra prioridad.', '2025-05-21 12:00:00'),
	(8, 4, 9, 4, 'Casi perfecto. La guía de usuario podría ser más clara.', 'Gracias por el feedback, lo consideraremos.', '2025-05-22 13:40:00'),

	-- Producto 5 (Cliente 10 y 11)
	(9, 5, 10, 5, 'Excelente diseño y muy fácil de usar.', '¡Esperamos verte de nuevo!', '2025-05-23 15:15:00'),
	(10, 5, 11, 4, 'Me gustó, pero el color real es ligeramente diferente al de la foto.', 'Gracias por señalárnoslo.', '2025-05-24 10:30:00'),

	-- Producto 6 (Cliente 12 y 13)
	(11, 6, 12, 5, 'Llegó súper rápido y sin ningún problema.', 'Nos enfocamos en la rapidez de entrega.', '2025-05-25 11:50:00'),
	(12, 6, 13, 4, 'Un buen producto en general. Cumple su función.', 'Agradecemos tu valoración.', '2025-05-26 14:05:00'),

	-- Producto 7 (Cliente 14 y 15)
	(13, 7, 14, 5, 'Súper contento con la compra. Repetiría sin duda.', '¡Estupendo!', '2025-05-27 16:30:00'),
	(14, 7, 15, 4, 'El producto es como se describe. Nada extraordinario, pero funcional.', 'Gracias por tu honestidad.', '2025-05-28 09:40:00'),

	-- Producto 8 (Cliente 16 y 17)
	(15, 8, 16, 5, 'Fantástico, la calidad del material es increíble.', 'Nos esforzamos por la mejor calidad.', '2025-05-29 12:25:00'),
	(16, 8, 17, 4, 'Recibí el artículo a tiempo, pero le faltaba una pieza pequeña.', 'Por favor, contacta a soporte para enviarte la pieza faltante.', '2025-05-30 13:55:00'),

	-- Producto 9 (Cliente 18 y 19)
	(17, 9, 18, 5, 'Justo lo que esperaba. Cinco estrellas.', '¡Genial!', '2025-05-31 15:00:00'),
	(18, 9, 19, 4, 'El rendimiento es bueno, aunque consume mucha energía.', 'Gracias por el dato.', '2025-06-01 10:10:00'),

	-- Producto 10 (Cliente 20 y 21)
	(19, 10, 20, 5, '¡Una ganga! Precio inmejorable para esta calidad.', '¡Siempre ofrecemos los mejores precios!', '2025-06-02 11:45:00'),
	(20, 10, 21, 4, 'Todo correcto, sin quejas.', 'Agradecemos tu feedback.', '2025-06-03 14:20:00'),

	-- Producto 11 al 25 (Clientes 22 al 50 y de vuelta al 2)
	(21, 11, 22, 5, 'Muy satisfecha, lo recomiendo.', '¡Gracias!', '2025-06-04 16:00:00'),
	(22, 11, 23, 4, 'Cumplió mis expectativas.', 'Nos alegra.', '2025-06-05 09:30:00'),

	(23, 12, 24, 5, 'La mejor compra del año.', '¡Qué bien!', '2025-06-06 12:15:00'),
	(24, 12, 25, 4, 'Llegó bien, pero tardó más de lo esperado.', 'Disculpa las molestias.', '2025-06-07 13:45:00'),

	(25, 13, 26, 5, 'Impecable.', 'Excelente.', '2025-06-08 15:25:00'),
	(26, 13, 27, 4, 'Todo OK.', 'Gracias por tu compra.', '2025-06-09 10:05:00'),

	(27, 14, 28, 5, 'El servicio al cliente fue excelente.', 'Siempre listos para ayudarte.', '2025-06-10 11:55:00'),
	(28, 14, 29, 4, 'Buena experiencia, pero el instructivo es confuso.', 'Gracias por el aviso.', '2025-06-11 14:10:00'),

	(29, 15, 30, 5, 'Volveré a comprar aquí.', 'Te esperamos.', '2025-06-12 16:45:00'),
	(30, 15, 31, 4, 'El precio podría ser mejor.', 'Ofrecemos la mejor calidad.', '2025-06-13 09:15:00'),

	(31, 16, 32, 5, 'El producto es hermoso.', '¡Nos alegra!', '2025-06-14 11:00:00'),
	(32, 16, 33, 4, 'Funcional, pero algo ruidoso.', 'Gracias por el comentario.', '2025-06-15 12:40:00'),

	(33, 17, 34, 5, 'Entrega rápida y artículo en perfecto estado.', 'Priorizamos la entrega.', '2025-06-16 14:35:00'),
	(34, 17, 35, 4, 'Satisfecho con la compra.', 'Gracias.', '2025-06-17 08:20:00'),

	(35, 18, 36, 5, 'Fácil de montar/instalar.', '¡Perfecto!', '2025-06-18 10:50:00'),
	(36, 18, 37, 4, 'Buen producto, pero sin manual en español.', 'Disculpas, corregiremos eso.', '2025-06-19 13:00:00'),

	(37, 19, 38, 5, 'Muy recomendable.', 'Agradecemos la recomendación.', '2025-06-20 15:45:00'),
	(38, 19, 39, 4, 'Es lo que se ve en las fotos.', 'Exacto.', '2025-06-21 09:55:00'),

	(39, 20, 40, 5, 'La calidad supera el precio.', 'Trabajamos para ti.', '2025-06-22 11:25:00'),
	(40, 20, 41, 4, 'Podría ser más resistente.', 'Mejoraremos el material.', '2025-06-23 13:10:00'),

	(41, 21, 42, 5, 'Todo en orden y a tiempo.', 'Gracias por la confianza.', '2025-06-24 15:00:00'),
	(42, 21, 43, 4, 'Una pequeña abolladura, pero funciona.', 'Lamentamos el incidente, ofrecemos reemplazo.', '2025-06-25 08:40:00'),

	(43, 22, 44, 5, 'El mejor servicio que he recibido.', '¡Excelente noticia!', '2025-06-26 10:20:00'),
	(44, 22, 45, 4, 'Funcional y barato.', '¡A disfrutarlo!', '2025-06-27 12:55:00'),

	(45, 23, 46, 5, 'Me encanta el diseño.', 'Gracias.', '2025-06-28 14:40:00'),
	(46, 23, 47, 4, 'Tuve que limpiarlo un poco antes de usar.', 'Disculpas.', '2025-06-29 09:05:00'),

	(47, 24, 48, 5, 'Cinco estrellas.', '¡Fantástico!', '2025-06-30 11:15:00'),
	(48, 24, 49, 4, 'El color es menos vibrante en persona.', 'Gracias por la observación.', '2025-07-01 13:30:00'),

	(49, 25, 50, 5, 'Totalmente recomendable.', 'Agradecemos tu recomendación.', '2025-07-02 15:00:00'),
	(50, 25, 2, 4, 'Hubo un error en el seguimiento, pero llegó.', 'Disculpa la confusión del tracking.', '2025-07-03 09:20:00'),


	-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	-- Reseñas para los Productos 26 al 50 (Clientes 3 al 50 y de vuelta al 28)
	-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	(51, 26, 3, 5, 'Sólido y de buena construcción.', 'Nos enfocamos en la durabilidad.', '2025-07-04 11:45:00'),
	(52, 26, 4, 4, 'El manual es demasiado técnico.', 'Lo haremos más accesible.', '2025-07-05 13:10:00'),

	(53, 27, 5, 5, 'Compra perfecta.', '¡Gracias!', '2025-07-06 14:50:00'),
	(54, 27, 6, 4, 'Le doy 4 por el tiempo de espera.', 'Lamentamos la espera.', '2025-07-07 10:30:00'),

	(55, 28, 7, 5, 'La respuesta del vendedor fue inmediata.', 'Siempre atentos.', '2025-07-08 12:00:00'),
	(56, 28, 8, 4, 'El producto se ve frágil.', 'Es resistente, pero gracias por el dato.', '2025-07-09 13:45:00'),

	(57, 29, 9, 5, 'Me encantó.', '¡Qué bien!', '2025-07-10 15:25:00'),
	(58, 29, 10, 4, 'Puntualidad en la entrega.', 'Gracias por notarlo.', '2025-07-11 09:10:00'),

	(59, 30, 11, 5, 'El mejor vendedor de la plataforma.', '¡Nuestro objetivo!', '2025-07-12 11:30:00'),
	(60, 30, 12, 4, 'Un poco difícil de ensamblar.', 'Disculpas, trabajaremos en ello.', '2025-07-13 13:00:00'),

	(61, 31, 13, 5, 'Excelente calidad, el precio lo vale.', 'La calidad es clave.', '2025-07-14 14:45:00'),
	(62, 31, 14, 4, 'Recibí la variante incorrecta, pero me gustó.', 'Por favor, contacta para la corrección.', '2025-07-15 08:50:00'),

	(63, 32, 15, 5, 'El producto es justo lo que se ofrece.', 'Gracias por la reseña.', '2025-07-16 10:40:00'),
	(64, 32, 16, 4, 'Podrían mejorar el material de empaque.', 'Tomamos nota.', '2025-07-17 12:25:00'),

	(65, 33, 17, 5, 'Muy útil en mi día a día.', '¡Nos alegra oír eso!', '2025-07-18 14:00:00'),
	(66, 33, 18, 4, 'La batería no dura tanto como prometen.', 'Revisaremos la información del producto.', '2025-07-19 09:35:00'),

	(67, 34, 19, 5, 'Sencillo y efectivo.', 'Gracias.', '2025-07-20 11:55:00'),
	(68, 34, 20, 4, 'Llegó con un ligero raspón.', 'Disculpas, revisaremos el control de calidad.', '2025-07-21 13:20:00'),

	(69, 35, 21, 5, 'Todo perfecto.', '¡Estupendo!', '2025-07-22 15:10:00'),
	(70, 35, 22, 4, 'Volvería a comprar.', 'Te esperamos.', '2025-07-23 09:00:00'),

	(71, 36, 23, 5, 'Funciona a la perfección.', '¡Gracias por la calificación!', '2025-07-24 10:50:00'),
	(72, 36, 24, 4, 'El precio está un poco elevado.', 'Manejamos precios competitivos.', '2025-07-25 12:35:00'),

	(73, 37, 25, 5, 'Mi producto favorito de esta tienda.', '¡Qué honor!', '2025-07-26 14:20:00'),
	(74, 37, 26, 4, 'Tuve que buscar tutoriales para usarlo.', 'Actualizaremos nuestra guía.', '2025-07-27 08:45:00'),

	(75, 38, 27, 5, 'Recibí un descuento, ¡gracias!', '¡Aprovecha nuestras promociones!', '2025-07-28 10:30:00'),
	(76, 38, 28, 4, 'La talla es un poco pequeña.', 'Revisa la tabla de tallas, por favor.', '2025-07-29 12:15:00'),

	(77, 39, 29, 5, 'Entrega antes de la fecha estimada.', 'Nos esforzamos por la eficiencia.', '2025-07-30 14:00:00'),
	(78, 39, 30, 4, 'Un poco decepcionado con el brillo.', 'Gracias por el detalle, lo revisaremos.', '2025-07-31 09:50:00'),

	(79, 40, 31, 5, 'Lo recibí en perfecto estado.', 'Excelente.', '2025-08-01 11:30:00'),
	(80, 40, 32, 4, 'Buen producto, pero el vendedor tardó en contestar.', 'Disculpa la demora en la respuesta.', '2025-08-02 13:15:00')

	INSERT INTO `pagos` (`id_pago`, `id_usuario`, `nombre_tarjeta`, `numero_tarjeta`, `fecha_expiracion`, `cvv`, `fecha_pago`) VALUES
	-- Pedido 1 (Cliente 2) - VISA
	(1, 2, 'VISA', '4012111122223333', '10/28', '123', '2025-02-10 10:05:00'),
	-- Pedido 2 (Cliente 3) - Mastercard
	(2, 3, 'Mastercard', '5100444455556666', '05/27', '456', '2025-03-01 11:15:00'),
	-- Pedido 3 (Cliente 4) - AMEX
	(3, 4, 'AMEX', '370077778888999', '02/26', '789', '2025-03-20 12:25:00'),
	-- Pedido 4 (Cliente 5) - VISA
	(4, 5, 'VISA', '4012121234345656', '08/28', '012', '2025-04-10 13:35:00'),
	-- Pedido 5 (Cliente 6) - Mastercard
	(5, 6, 'Mastercard', '5100676789890101', '12/27', '345', '2025-05-01 14:45:00'),
	-- Pedido 6 (Cliente 7) - AMEX
	(6, 7, 'AMEX', '370012345678901', '06/26', '678', '2025-05-20 15:55:00'),
	-- Pedido 7 (Cliente 8) - VISA
	(7, 8, 'VISA', '4012333344445555', '03/28', '901', '2025-06-10 16:05:00'),
	-- Pedido 8 (Cliente 9) - Mastercard
	(8, 9, 'Mastercard', '5100989876765454', '09/27', '234', '2025-07-01 10:15:00'),
	-- Pedido 9 (Cliente 10) - AMEX
	(9, 10, 'AMEX', '370045678901234', '01/26', '567', '2025-07-20 11:25:00'),
	-- Pedido 10 (Cliente 11) - VISA
	(10, 11, 'VISA', '4012555566667777', '07/28', '890', '2025-08-10 12:35:00'),
	-- Pedido 11 (Cliente 12) - Mastercard
	(11, 12, 'Mastercard', '5100010123234545', '11/27', '123', '2025-08-30 13:45:00'),
	-- Pedido 12 (Cliente 13) - AMEX
	(12, 13, 'AMEX', '370067890123456', '04/26', '456', '2025-09-20 14:55:00'),
	-- Pedido 13 (Cliente 14) - VISA
	(13, 14, 'VISA', '4012777788889999', '01/29', '789', '2025-10-10 15:05:00'),
	-- Pedido 14 (Cliente 15) - Mastercard
	(14, 15, 'Mastercard', '5100343456567878', '06/28', '012', '2025-11-01 16:15:00'),
	-- Pedido 15 (Cliente 16) - AMEX
	(15, 16, 'AMEX', '370090123456789', '03/27', '345', '2025-11-20 10:25:00'),
	-- Pedido 16 (Cliente 17) - VISA
	(16, 17, 'VISA', '4012999900001111', '09/29', '678', '2025-12-10 11:35:00'),
	-- Pedido 17 (Cliente 18) - Mastercard
	(17, 18, 'Mastercard', '5100878765654343', '02/28', '901', '2026-01-01 12:45:00'),
	-- Pedido 18 (Cliente 19) - AMEX
	(18, 19, 'AMEX', '370011223344556', '05/27', '234', '2026-01-20 13:55:00'),
	-- Pedido 19 (Cliente 20) - VISA
	(19, 20, 'VISA', '4012121223233434', '11/29', '567', '2026-02-10 14:05:00'),
	-- Pedido 20 (Cliente 21) - Mastercard
	(20, 21, 'Mastercard', '5100787890901212', '04/28', '890', '2026-03-01 15:15:00'),
	-- Pedido 21 (Cliente 22) - AMEX
	(21, 22, 'AMEX', '370066778899001', '08/27', '123', '2026-03-20 16:25:00'),
	-- Pedido 22 (Cliente 23) - VISA
	(22, 23, 'VISA', '4012343456567878', '12/29', '456', '2026-04-10 10:35:00'),
	-- Pedido 23 (Cliente 24) - Mastercard
	(23, 24, 'Mastercard', '5100212143436565', '07/28', '789', '2026-04-30 11:45:00'),
	-- Pedido 24 (Cliente 25) - AMEX
	(24, 25, 'AMEX', '370033445566778', '10/27', '012', '2026-05-20 12:55:00'),
	-- Pedido 25 (Cliente 26) - VISA
	(25, 26, 'VISA', '4012888899990000', '02/30', '345', '2026-06-10 13:05:00'),
	-- Pedido 26 (Cliente 27) - Mastercard
	(26, 27, 'Mastercard', '5100545432321010', '05/29', '678', '2026-07-01 14:15:00'),
	-- Pedido 27 (Cliente 28) - AMEX
	(27, 28, 'AMEX', '370099001122334', '01/28', '901', '2026-07-20 15:25:00'),
	-- Pedido 28 (Cliente 29) - VISA
	(28, 29, 'VISA', '4012000011112222', '04/30', '234', '2026-08-10 16:35:00'),
	-- Pedido 29 (Cliente 30) - Mastercard
	(29, 30, 'Mastercard', '5100101032325454', '08/29', '567', '2026-09-01 10:45:00'),
	-- Pedido 30 (Cliente 31) - AMEX
	(30, 31, 'AMEX', '370044556677889', '03/28', '890', '2026-09-20 11:55:00'),
	-- Pedido 31 (Cliente 32) - VISA
	(31, 32, 'VISA', '4012232345456767', '06/30', '123', '2026-10-10 12:05:00'),
	-- Pedido 32 (Cliente 33) - Mastercard
	(32, 33, 'Mastercard', '5100656587870909', '09/29', '456', '2026-10-30 13:15:00'),
	-- Pedido 33 (Cliente 34) - AMEX
	(33, 34, 'AMEX', '370022334455667', '02/29', '789', '2026-11-20 14:25:00'),
	-- Pedido 34 (Cliente 35) - VISA
	(34, 35, 'VISA', '4012565678789090', '05/30', '012', '2026-12-10 15:35:00'),
	-- Pedido 35 (Cliente 36) - Mastercard
	(35, 36, 'Mastercard', '5100090921214343', '01/30', '345', '2026-12-30 16:45:00'),
	-- Pedido 36 (Cliente 37) - AMEX
	(36, 37, 'AMEX', '370077889900112', '04/29', '678', '2027-01-20 10:55:00'),
	-- Pedido 37 (Cliente 38) - VISA
	(37, 38, 'VISA', '4012909012123434', '08/30', '901', '2027-02-10 11:05:00'),
	-- Pedido 38 (Cliente 39) - Mastercard
	(38, 39, 'Mastercard', '5100343456567878', '12/29', '234', '2027-03-01 12:15:00'),
	-- Pedido 39 (Cliente 40) - AMEX
	(39, 40, 'AMEX', '370055667788990', '07/29', '567', '2027-03-20 13:25:00'),
	-- Pedido 40 (Cliente 41) - VISA
	(40, 41, 'VISA', '4012111122223333', '10/30', '890', '2027-04-10 14:35:00');