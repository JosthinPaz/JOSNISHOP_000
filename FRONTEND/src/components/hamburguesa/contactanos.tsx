import React, { useState } from "react";
import "../../assets/css/contactanos.css";
import { FaBars } from "react-icons/fa";
import "font-awesome/css/font-awesome.min.css";

const API_BASE = (import.meta.env && (import.meta.env.VITE_API_URL as string)) || "http://localhost:8000";

const Contactanos: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // simple client-side validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }
    // basic email pattern
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRe.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      // Try to post to backend contact endpoint (may not exist). If it fails, fallback to mailto.
      const resp = await fetch(`${API_BASE}/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (resp.ok) {
        setEnviado(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        // fallback: open mail client
        const subject = encodeURIComponent("Contacto desde JOSNISHOP");
        const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:info@pixtrade.com?subject=${subject}&body=${body}`;
        setEnviado(true);
      }
    } catch (err) {
      // network error -> fallback
      const subject = encodeURIComponent("Contacto desde JOSNISHOP");
      const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:info@pixtrade.com?subject=${subject}&body=${body}`;
      setEnviado(true);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  return (
    <div className="contact-page-root">
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

      {/* Contenido principal de contacto */}
      <div className="grid-container contact-grid">
        <main className="main-content contact-main">
          <div className="card contact-card">
            <section className="card-section contact-left">
              <h2>Servicio al cliente</h2>
              <div className="contact-info">
                <strong>Tel:</strong> 000-000-000<br />
                <strong>Email:</strong> <a href="mailto:info@pixtrade.com">info@pixtrade.com</a>
              </div>
              <hr />
              <h3>Distribuidores</h3>
              <ul className="distribuidores-list">
                <li>Distribuidora Calzado: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Ropa: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Bisutería: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Hogar: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Deportes: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Juegos: Carrera 0 sur # 0 - 0</li>
                <li>Distribuidora Belleza: Carrera 0 sur # 0 - 0</li>
              </ul>
            </section>

            <section className="card-section contacto contact-right">
              <div className="contacto-header">
                <h2>Contáctanos</h2>
                <p>Estamos aquí para ayudarte — escríbenos y te responderemos pronto.</p>
              </div>
              {!enviado ? (
                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  {error && <div className="form-error" role="alert">{error}</div>}
                  <div className="form-row">
                    <label htmlFor="name" className="sr-only">Nombre</label>
                    <input id="name" value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Nombre" aria-label="Nombre" required />
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" aria-label="Email" required />
                  </div>
                  <div className="form-row">
                    <label htmlFor="message" className="sr-only">Mensaje</label>
                    <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Escribe tu mensaje aquí..." aria-label="Mensaje" required rows={6}></textarea>
                  </div>
                  <div className="form-actions">
                    <button className="button primary" type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
                    <button type="button" className="button" onClick={() => { setName(''); setEmail(''); setMessage(''); setError(null); }}>Limpiar</button>
                  </div>
                </form>
              ) : (
                <div className="enviado" role="status">
                  <p>Gracias — tu mensaje ha sido enviado. Te contactaremos pronto.</p>
                  <button className="button" onClick={() => setEnviado(false)}>Enviar otro mensaje</button>
                </div>
              )}
            </section>
          </div>
        </main>

        {/* Footer general */}
        <footer className="footer contact-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Atención al cliente</h4>
              <p>Atención al cliente<br />Encuesta de satisfacción</p>
            </div>
            <div className="footer-section">
              <h4>Guía de Compra</h4>
              <p>Crear una cuenta<br />Pago<br />Envío<br />Protección del comprador</p>
            </div>
            <div className="footer-section">
              <h4>Ayuda</h4>
              <p>Centro de ayuda y preguntas frecuentes<br />Centro de seguridad<br />Protección de compras<br />Asistencia</p>
            </div>
          </div>
          <div className="footer-legal">
            ©2025 · Términos de uso · Política de privacidad
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Contactanos;