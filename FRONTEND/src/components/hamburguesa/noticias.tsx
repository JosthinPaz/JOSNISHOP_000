import React, { useState, useMemo } from "react";
import "../../assets/css/noticias.css"; // Importa tu CSS
import "font-awesome/css/font-awesome.min.css"; // Asegúrate de tener Font Awesome
import { FaBars } from "react-icons/fa";
import noticia1 from '../../assets/IMG/noticias1.png';
import noticia2 from '../../assets/IMG/noticias2.png';
import noticia3 from '../../assets/IMG/noticias3.png';

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  date?: string;
};

const sampleNews: NewsItem[] = [
  {
    id: 'n1',
    title: 'Función para vendedores: publica tus productos',
    excerpt: 'Abrimos nuestra sección para que puedas vender tus propios productos.',
    content: 'Hemos lanzado una nueva sección que permite a usuarios registrar productos para la venta. Revisa las condiciones y empieza hoy mismo.',
    image: noticia2,
    date: '2025-10-01'
  },
  {
    id: 'n2',
    title: 'Mejoras en la experiencia de compra',
    excerpt: 'Actualizamos la UI y el proceso de pago para mayor rapidez.',
    content: 'Optimizamos el flujo de compra y mejoramos la seguridad en los pagos. Disfruta de una experiencia más rápida y segura.',
    image: noticia3,
    date: '2025-09-15'
  },
  {
    id: 'n3',
    title: 'Nueva funcionalidad para recomendaciones',
    excerpt: 'Sugerencias personalizadas según tu historial de búsqueda.',
    content: 'Usamos señales de navegación para recomendar productos relevantes y mejorar la descubribilidad.',
    image: noticia1,
    date: '2025-08-20'
  }
];

const Noticias: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sampleNews;
    return sampleNews.filter(n => (n.title + ' ' + n.excerpt + ' ' + n.content).toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="noticias-root">
      {/* Menú superior */}
      <header>
        <div className="navbar">
          <button className="hamburger-btn" onClick={handleMenuOpen}>
            <FaBars />
          </button>
          <a href="/">
            <img src="/public/logo.png" alt="Logo JOSNISHOP" className="logo" />
          </a>
          <a href="/categorias" className="titulo menu-desktop-only">
            Categorías
          </a>
          <div className="buscador-container menu-desktop-only">
            <input type="text" placeholder="Buscar" className="buscador" />
            <span className="icono-lupa">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
          <div className="iconos menu-desktop-only">
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

        {/* Contenido visible solo en móvil */}
        <div className="menu-header-logo menu-mobile-only">
          <img src="/public/logo.png" alt="Logo JOSNISHOP" className="logo" />
          <span className="titulo-menu">JOSNISHOP</span>
        </div>
        <div className="menu-search-container menu-mobile-only" style={{ position: 'relative' }}>
          <input type="text" placeholder="Buscar..." className="buscador-lateral" />
          <span className="icono-lupa-lateral">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>
        <div className="account-links-mobile menu-mobile-only">
          <a href="/panel" className="menu-link-mobile">
            <i className="fa-solid fa-user"></i> Mi cuenta
          </a>
          <a href="/login" className="menu-link-mobile">
            <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
          </a>
        </div>

        {/* Lista de enlaces */}
        <ul className="menu-list">
          <li className="menu-mobile-only">
            <a href="/categorias" className="menu-link">
              <i className="fa-solid fa-grip"></i> Categorías
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/inicio" className="menu-link">
              <i className="fa-solid fa-bag-shopping"></i> Productos
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/carrito" className="menu-link">
              <i className="fa-solid fa-cart-shopping"></i> Carrito
            </a>
          </li>
          <li>
            <a href="/" className="menu-link">
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

      {/* Contenido principal de noticias */}
      <main>
        <section className="noticias-container">
          {/* Lateral */}
          <aside className="noticias-lateral">
            <div className="buscador-noticia-container">
              <i className="fa-solid fa-magnifying-glass" aria-hidden></i>
              <input aria-label="Buscar noticias" value={query} onChange={e => setQuery(e.target.value)} type="text" placeholder="Buscar noticia ..." className="buscador-noticia" />
            </div>
            {sampleNews.slice(0,2).map(n => (
              <div className="noticia-lateral" key={n.id}>
                {n.image && <img src={n.image} alt={n.title} className="img-lateral" />}
                <p className="texto-lateral">{n.excerpt}</p>
              </div>
            ))}
          </aside>

          {/* Principal */}
          <section className="noticia-principal">
            <h1 className="titulo-principal">Noticias</h1>

            <div className="news-list">
              {filtered.map(n => (
                <article className="news-card" key={n.id}>
                  {n.image && <img src={n.image} alt={n.title} className="news-image" />}
                  <div className="news-body">
                    <h3 className="news-title">{n.title}</h3>
                    <p className="news-excerpt">{n.excerpt}</p>
                    <div className="news-meta">{n.date}</div>
                    <div className="news-actions">
                      <button className="button" onClick={() => setSelected(n)}>Leer más</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        {/* Modal/overlay para detalle */}
        {selected && (
          <div className="news-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="news-modal-content">
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Cerrar">×</button>
              <h2 id="modal-title">{selected.title}</h2>
              {selected.image && <img src={selected.image} alt="" className="modal-image" />}
              <p className="modal-date">{selected.date}</p>
              <div className="modal-body">{selected.content}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Noticias;