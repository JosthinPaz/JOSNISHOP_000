import React from 'react';
import { FaBars } from 'react-icons/fa';
import '../assets/css/producto_sele/Producto_selec.css';

type NavBarProps = {
  onOpenMenu?: () => void;
};

const NavBar: React.FC<NavBarProps> = ({ onOpenMenu }) => {
  return (
    <header>
      <div className="navbar">
        <button className="hamburger-btn" onClick={() => onOpenMenu && onOpenMenu()}>
          <FaBars />
        </button>
        <a href="/">
          <img src="/logo.png" alt="Logo JOSNISHOP" className="logo" />
        </a>
        <a href="/categorias" className="titulo">
          Categorías
        </a>
        <div className="buscador-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select defaultValue="nombre" style={{ height: '32px', borderRadius: '4px' }}>
            <option value="nombre">Nombre</option>
            <option value="precio">Precio</option>
            <option value="categoria">Categoría</option>
          </select>
          <input
            type="text"
            placeholder={`Buscar producto...`}
            className="buscador"
          />
          <span className="icono-lupa" title="Buscar">
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
          {(() => {
            const userName = localStorage.getItem('userName');
            const userId = localStorage.getItem('userId');
            if (userId) {
              return (
                <a href="/panel" className="user-session" style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1b3a2b', marginLeft: 8 }}>
                  <i className="fa-solid fa-user" style={{ fontSize: 22, marginRight: 6 }}></i>
                  <span style={{ fontSize: 16 }}>{userName ? `Hola, ${userName}` : 'Mi cuenta'}</span>
                </a>
              );
            } else {
              return (
                <a href="/login" className="iniciar-sesion">
                  <i className="fa-solid fa-user" style={{ marginRight: 6 }}></i>
                  Iniciar Sesión
                </a>
              );
            }
          })()}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
