import React, { useState } from "react";
import "../../assets/css/nosotros.css";
import nosotrosImg from "../../assets/IMG/nosotros.png";
import { FaBars } from "react-icons/fa";
import "font-awesome/css/font-awesome.min.css";

const Nosotros: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  return (
    <div>
      {/* MENÚ SUPERIOR */}
      <header>
        <div className="navbar">
          <button className="hamburger-btn" onClick={handleMenuOpen}>
            <FaBars />
          </button>
          <a href="/">
            <img src="/public/logo.png" alt="Logo JOSNISHOP" className="logo" />
          </a>
          <a href="/categorias" className="titulo">
            Categorías
          </a>
          <div className="buscador-container">
            <input type="text" placeholder="Buscar" className="buscador" />
            <span className="icono-lupa">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
          <div className="iconos">
            <a href="/">
              <i className="fa-solid fa-house"></i>
            </a>
            <a href="/inicio">
              <i className="fa-solid fa-bag-shopping"></i>
            </a>
            <a href="/carrito">
              <i className="fa-solid fa-cart-shopping"></i>
            </a>
            <a href="/panel">
              <i className="fa-solid fa-user"></i>
            </a>
            <a href="/login" className="iniciar-sesion">
              Iniciar Sesión
            </a>
          </div>
        </div>
      </header>

      {/* Menú hamburguesa lateral */}
      <nav className={`hamburger-menu${menuOpen ? " active" : ""}`}>
        <button className="close-btn" onClick={handleMenuClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="menu-header-logo">
          <img src="/public/logo.png" alt="Logo JOSNISHOP" className="logo" />
          <span className="titulo-menu">JOSNISHOP</span>
        </div>
        <div className="menu-search-container" style={{ position: 'relative' }}>
          <input type="text" placeholder="Buscar..." className="buscador-lateral" />
          <span className="icono-lupa-lateral">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>
        <ul className="menu-list">
          <li>
            <a href="/categorias" className="menu-link">
              <i className="fa-solid fa-grip"></i> Categorías
            </a>
          </li>
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
          <li>
            <a href="/inicio" className="menu-link">
              <i className="fa-solid fa-bag-shopping"></i> Mis pedidos
            </a>
          </li>
          <li>
            <a href="/carrito" className="menu-link">
              <i className="fa-solid fa-cart-shopping"></i> Carrito
            </a>
          </li>
          <li>
            <a href="/panel" className="menu-link">
              <i className="fa-solid fa-user"></i> Mi cuenta
            </a>
          </li>
          <li>
            <a href="/login" className="menu-link">
              <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
            </a>
          </li>
        </ul>
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

      {/* Sección Nosotros */}
      <section className="nosotros-section">
        <div className="nosotros-texto">
          <h2 className="titulo-nosotros">NOSOTROS</h2>
          <p>
            Este proyecto nace del deseo de mejorar la experiencia dentro de REDDI2,
            es decir la empresa, una empresa de comercio electrónico enfocada en
            productos de uso personal.
          </p>
          <p>
            A través de una entrevista con su dueño, se identificaron varios retos:
            desde la desconfianza del cliente y una comunicación limitada, hasta
            problemas en la gestión de inventario y el uso general de la plataforma.
          </p>
          <p>
            Por eso, se propone desarrollar un software que responda a estas
            necesidades, haga más segura la interacción y ayude a los emprendedores
            a conectar mejor con sus clientes.
          </p>
        </div>
        <div className="nosotros-imagen">
          <img src={nosotrosImg} alt="Cliente feliz con paquete" />
        </div>
      </section>
    </div>
  );
};

export default Nosotros;