import React, { useState } from "react";
import "../assets/css/categorias.css";
import "font-awesome/css/font-awesome.min.css";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

type CategoriaKey =
  | "hogar"
  | "accesorios"
  | "bisuteria"
  | "modaMujer"
  | "electricidad"
  | "deporte"
  | "modaHombre"
  | "muebles"
  | "mascota"
  | "seguridad"
  | "juguetes";

const categorias: { key: CategoriaKey; label: string }[] = [
  { key: "hogar", label: "Hogar" },
  { key: "accesorios", label: "Accesorios" },
  { key: "bisuteria", label: "Bisutería" },
  { key: "modaMujer", label: "Moda Mujer" },
  { key: "electricidad", label: "Electricidad" },
  { key: "deporte", label: "Deporte y Ocio" },
  { key: "modaHombre", label: "Moda Hombre" },
  { key: "muebles", label: "Muebles" },
  { key: "mascota", label: "Mascota" },
  { key: "seguridad", label: "Seguridad" },
  { key: "juguetes", label: "Juguetes" },
];

const secciones: Record<CategoriaKey, React.ReactNode> = {
  hogar: (
    <>
      <div className="columna">
        <h3>Cocina</h3>
        <p>Sartenes</p>
        <p>Ollas</p>
        <p>Organizadores</p>
        <p>Espátulas</p>
        <p>Batidoras</p>
        <p>Cafeteras</p>
        <p>Hornos eléctricos</p>
        <p>Freidoras de aire</p>
        <p>Cuchillos</p>
        <p>Tablas de picar</p>
        <h3>Decoración</h3>
        <p>Cuadros</p>
        <p>Espejos</p>
        <p>Alfombras</p>
        <p>Plantas artificiales</p>
        <p>Relojes de pared</p>
        <p>Velas decorativas</p>
      </div>
      <div className="columna">
        <h3>Limpieza</h3>
        <p>Escobas</p>
        <p>Traperos</p>
        <p>Desinfectantes</p>
        <p>Recogedores</p>
        <p>Trapeadores giratorios</p>
        <p>Guantes de caucho</p>
        <p>Escurridores</p>
        <p>Ambientadores</p>
        <h3>Baño</h3>
        <p>Alfombrillas</p>
        <p>Cortinas de baño</p>
        <p>Dispensadores de jabón</p>
        <p>Espejos LED</p>
        <p>Estantes</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/hogar">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
  accesorios: (
    <>
      <div className="columna">
        <h3>Para mujer</h3>
        <p>Lentes de sol</p>
        <p>Sombreros</p>
        <p>Bolsos</p>
        <p>Pañuelos</p>
        <p>Cinturones</p>
        <p>Guantes</p>
        <p>Monederos</p>
        <p>Cadenas</p>
        <p>Diademas</p>
        <p>Pasadores</p>
      </div>
      <div className="columna">
        <h3>Para hombre</h3>
        <p>Relojes</p>
        <p>Morrales</p>
        <p>Gorras</p>
        <p>Carteras</p>
        <p>Corbatas</p>
        <p>Bufandas</p>
        <p>Manillas</p>
        <p>Gafas oscuras</p>
        <p>Cinturones</p>
        <p>Sombrillas</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/accesorios">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
  bisuteria: (
    <>
      <div className="columna">
        <h3>Anillos</h3>
        <p>Acero</p>
        <p>Personalizados</p>
        <p>Con piedras</p>
        <p>Minimalistas</p>
        <p>Con iniciales</p>
        <p>Con cristales</p>
        <h3>Collares</h3>
        <p>Perlas</p>
        <p>Dorados</p>
        <p>Con dijes</p>
        <p>Estilo coreano</p>
        <p>Estilo vintage</p>
      </div>
      <div className="columna">
        <h3>Pulseras</h3>
        <p>De cuero</p>
        <p>Con cuentas</p>
        <p>De tela</p>
        <p>Paracord</p>
        <p>De pareja</p>
        <h3>Aretes</h3>
        <p>Minimalistas</p>
        <p>Largos</p>
        <p>Argollas</p>
        <p>Colgantes</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/bisuteria">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
  modaMujer: (
    <>
      <div className="columna">
        <h3>Ropa</h3>
        <p>Blusas</p>
        <p>Vestidos</p>
        <p>Pantalones</p>
        <p>Faldas</p>
        <p>Chaquetas</p>
        <p>Tops</p>
        <p>Enterizos</p>
        <p>Shorts</p>
        <p>Sacos</p>
        <p>Overoles</p>
      </div>
      <div className="columna">
        <h3>Zapatos</h3>
        <p>Sandalias</p>
        <p>Botas</p>
        <p>Zapatillas</p>
        <p>Plataformas</p>
        <p>Mocasines</p>
        <p>Tacones</p>
        <p>Zapatos casuales</p>
        <h3>Accesorios</h3>
        <p>Aretes</p>
        <p>Bufandas</p>
        <p>Medias</p>
        <p>Sombreros</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/moda-mujer">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
  electricidad: (
    <>
      <div className="columna">
        <h3>Iluminación</h3>
        <p>Bombillos LED</p>
        <p>Lámparas de escritorio</p>
        <p>Tiras LED</p>
        <p>Lámparas colgantes</p>
        <p>Focos inteligentes</p>
        <h3>Conectores</h3>
        <p>Multitomas</p>
        <p>Extensiones</p>
        <p>Cables USB</p>
        <p>Cargadores rápidos</p>
      </div>
      <div className="columna">
        <h3>Herramientas</h3>
        <p>Taladros</p>
        <p>Destornilladores</p>
        <p>Multímetros</p>
        <p>Tester</p>
        <p>Medidores de voltaje</p>
        <p>Soldadores</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/electricidad">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
  deporte: (
    <>
      <div className="columna">
        <h3>Yoga</h3>
        <p>Esterillas</p>
        <p>Bolsas</p>
        <p>Bloques</p>
        <p>Bandas elásticas</p>
        <h3>Ciclismo</h3>
        <p>Cascos</p>
        <p>Guantes</p>
        <p>Chalecos</p>
        <p>Luces LED</p>
        <p>Portabidones</p>
      </div>
      <div className="columna">
        <h3>Pesca</h3>
        <p>Cañas</p>
        <p>Reeles</p>
        <p>Aparejos</p>
        <p>Anzuelos</p>
        <p>Linternas</p>
        <h3>Acampada</h3>
        <p>Refugios</p>
        <p>Parrillas</p>
        <p>Sacos de dormir</p>
        <p>Colchonetas</p>
        <p>Estufas portátiles</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/deporte">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
  modaHombre: (
    <>
      <div className="columna">
        <h3>Ropa</h3>
        <p>Camisetas</p>
        <p>Jeans</p>
        <p>Camisas</p>
        <p>Chaquetas</p>
        <p>Sudaderas</p>
        <p>Shorts</p>
        <p>Sacos</p>
        <p>Overoles</p>
      </div>
      <div className="columna">
        <h3>Zapatos</h3>
        <p>Tenis</p>
        <p>Botines</p>
        <p>Mocasines</p>
        <p>Sandalias</p>
        <p>Zapatos deportivos</p>
        <p>Zapatos casuales</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/moda-hombre">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
  muebles: (
    <>
      <div className="columna">
        <h3>Sala</h3>
        <p>Sofás</p>
        <p>Mesas de centro</p>
        <p>Sillas decorativas</p>
        <p>Repisas</p>
        <p>Lámparas de pie</p>
        <p>Estanterías</p>
      </div>
      <div className="columna">
        <h3>Dormitorio</h3>
        <p>Camas</p>
        <p>Closets</p>
        <p>Burós</p>
        <p>Espejos grandes</p>
        <p>Almohadas</p>
        <p>Colchones</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/muebles">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
  mascota: (
    <>
      <div className="columna">
        <h3>Perros</h3>
        <p>Comederos</p>
        <p>Juguetes</p>
        <p>Ropa</p>
        <p>Correas</p>
        <p>Casas</p>
        <p>Champú</p>
        <p>Tapetes</p>
      </div>
      <div className="columna">
        <h3>Gatos</h3>
        <p>Rascadores</p>
        <p>Arenas</p>
        <p>Camas</p>
        <p>Areneras</p>
        <p>Juguetes</p>
        <p>Transportadoras</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/mascota">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
  seguridad: (
    <>
      <div className="columna">
        <h3>Casa</h3>
        <p>Cámaras</p>
        <p>Sensores</p>
        <p>Alarmas</p>
        <p>Videoporteros</p>
        <p>Puertas reforzadas</p>
        <p>Luces con sensor</p>
      </div>
      <div className="columna">
        <h3>Personal</h3>
        <p>Sprays</p>
        <p>Llaveros defensa</p>
        <p>Alarma personal</p>
        <p>Mini linternas</p>
        <p>Silbatos</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/seguridad">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
  juguetes: (
    <>
      <div className="columna">
        <h3>Niños</h3>
        <p>Muñecos</p>
        <p>Juegos educativos</p>
        <p>Bloques</p>
        <p>Sonajeros</p>
        <p>Rompecabezas</p>
        <p>Peluches</p>
      </div>
      <div className="columna">
        <h3>Jóvenes</h3>
        <p>Cartas</p>
        <p>Juegos de mesa</p>
        <p>Juegos de magia</p>
        <p>Cubos Rubik</p>
        <p>Juegos interactivos</p>
      </div>
      <div className="columna">
        <h3>Adultos</h3>
        <p>Futbolines</p>
        <p>Dardos</p>
        <p>Juegos de trivia</p>
        <p>Rompecabezas complejos</p>
      </div>
      <div className="boton-contenedor">
        <Link to="/categoria/juguetes">¿Lo quieres? ¡Haz click aquí para ver más!</Link>
      </div>
    </>
  ),
};

const Categorias: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriaActiva, setCategoriaActiva] =
    useState<CategoriaKey>("hogar");

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  return (
    <div>
      {/* Menú superior compartido */}
      <NavBar onOpenMenu={handleMenuOpen} />

      {/* Menú hamburguesa lateral */}
      <nav className={`hamburger-menu${menuOpen ? " active" : ""}`}>
        <button className="close-btn" onClick={handleMenuClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Contenido visible solo en móvil */}
        <div className="menu-header-logo menu-mobile-only">
          <img src="/logo.png" alt="Logo JOSNISHOP" className="logo" />
          <span className="titulo-menu">JOSNISHOP</span>
        </div>
        <div
          className="menu-search-container menu-mobile-only"
          style={{ position: "relative" }}
        >
          <input
            type="text"
            placeholder="Buscar..."
            className="buscador-lateral"
          />
          <span className="icono-lupa-lateral">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>
        
        {/* Lista de enlaces */}
        <ul className="menu-list">
          <li>
            <a href="/" className="menu-link menu-inicio">
              <i className="fa-solid fa-home"></i> Inicio
            </a>
          </li>
          <li>
            <a href="/nosotros" className="menu-link">
              <i className="fa-solid fa-users"></i> ¿Quiénes somos?
            </a>
          </li>
          <li>
            <a href="/noticias" className="menu-link">
              <i className="fa-solid fa-newspaper"></i> Noticias
            </a>
          </li>
          <li>
            <a href="/contactanos" className="menu-link">
              <i className="fa-solid fa-envelope"></i> Contáctanos
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/inicio" className="menu-link">
              <i className="fa-solid fa-bag-shopping"></i> Mis pedidos
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/carrito" className="menu-link">
              <i className="fa-solid fa-cart-shopping"></i> Carrito
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/panel" className="menu-link">
              <i className="fa-solid fa-user"></i> Mi cuenta
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/login" className="menu-link">
              <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
            </a>
          </li>
        </ul>

        {/* Footer del menú lateral (solo para móvil) */}
        <footer className="menu-footer">
          <div className="footer-columns">
            <div>
              <span className="footer-title">Atención al cliente</span>
              <ul>
                <li>Atención al cliente</li>
                <li>Encuesta de satisfacción</li>
              </ul>
            </div>
            <div>
              <span className="footer-title">Guía de Compra</span>
              <ul>
                <li>Crear una cuenta</li>
                <li>Pago</li>
                <li>Envío</li>
                <li>Protección del comprador</li>
              </ul>
            </div>
            <div>
              <span className="footer-title">Ayuda</span>
              <ul>
                <li>Centro de ayuda y preguntas frecuentes</li>
                <li>Centro de seguridad</li>
                <li>Protección de compras</li>
                <li>Adócate</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>©2025</span>
            <ul>
              <li>Términos de uso</li>
              <li>Política de privacidad</li>
              <li>Tus preferencias de privacidad</li>
              <li>Gestión de anuncios</li>
            </ul>
          </div>
        </footer>
      </nav>

      {/* Contenido principal de categorías */}
      <div className="contenedor">
        <div className="menu-lateral">
          <ul>
            {categorias.map((c) => (
              <li
                key={c.key}
                data-categoria={c.key}
                className={categoriaActiva === c.key ? "activo" : ""}
                onClick={() => setCategoriaActiva(c.key)}
              >
                {c.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="contenido" id="contenido">
          {secciones[categoriaActiva]}
        </div>
      </div>
    </div>
  );
};

export default Categorias;