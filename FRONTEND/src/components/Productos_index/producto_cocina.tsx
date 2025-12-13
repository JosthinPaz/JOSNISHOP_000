import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/producto_sele/Producto_selec.css";

const ProductoCocina: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideos, setShowVideos] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  const items = [
    "/JOSNISHOP_000/assets/IMG/index/carrusel1.png",
    "/JOSNISHOP_000/assets/IMG/index/carrusel2.png",
    "/JOSNISHOP_000/assets/IMG/index/carrusel3.png",
  ];

  // Carrusel
  const goToSlide = (index: number) => {
    if (index < 0) index = items.length - 1;
    else if (index >= items.length) index = 0;
    setCurrentIndex(index);
    if (innerRef.current) {
      const itemWidth = innerRef.current.offsetWidth;
      innerRef.current.style.transform = `translateX(${-index * itemWidth}px)`;
    }
  };

  useEffect(() => {
    if (innerRef.current) {
      const itemWidth = innerRef.current.offsetWidth;
      innerRef.current.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
    }
  }, [currentIndex]);

  return (
    <div>
      {/* MENÚ SUPERIOR */}
      <header className="menu">
        <div className="hamburger">
          <i className="fa-solid fa-bars"></i>
        </div>
        <div className="logo">
          <img src="/logo.png" alt="Josnishop Logo" />
        </div>
        <a href="/categorias" className="categorias">Categorías</a>
        <div className="search-bar">
          <input type="text" placeholder="Buscar" />
          <i className="fa-solid fa-search"></i>
        </div>
        <nav className="nav-icons">
          <a href="/"><i className="fa-solid fa-house"></i></a>
          <a href="/inicio"><i className="fa-solid fa-bag-shopping"></i></a>
          <a href="/carrito"><i className="fa-solid fa-cart-shopping"></i></a>
          <a href="/panel">
            <i className="fa-solid fa-user"></i>
          </a>
          <a href="/login" className="iniciar-sesion">
            Iniciar Sesión
          </a>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="producto-container">
        <div className="producto-imagen">
          <img src="/JOSNISHOP_000/assets/IMG/index/cocina.jpg" alt="Utensilios de cocina" />
        </div>
        <div className="producto-info">
          <h2>
            Set de utensilios de cocina de alta calidad, resistentes al calor y fáciles de limpiar.
          </h2>
          <div className="precio">$30.990 COP</div>
          <button
            className="videos-btn"
            onClick={() => setShowVideos(!showVideos)}
          >
            Vídeos ▼
          </button>
          <div className="estrellas">★★★★★ 4.7</div>
          <p className="detalle">Productos Disponibles: 80</p>
        </div>
        <div className="lateral">
          <p><strong>Vendido por:</strong> CocinaStore</p>
          <p><strong>Envío:</strong> COP$4,500.00</p>
          <p><strong>Entrega:</strong> 14 de JUN.</p>
          <p>✔ Política de devoluciones y reembolsos</p>
          <p>✔ Seguridad & Privacidad</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <label htmlFor="cantidad-cocina" style={{ margin: 0 }}>Cantidad:</label>
            <input
              type="number"
              id="cantidad-cocina"
              min={1}
              max={10}
              defaultValue={1}
              style={{ width: "50px", marginLeft: "5px", padding: "2px 4px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button
              className="comprar-btn"
              onClick={() => {
                // Validar si el usuario está logueado (por ejemplo, si hay un token en localStorage)
                const token = localStorage.getItem("token");
                if (!token) {
                  window.location.href = "/login";
                  return;
                }
                type ProductoCarrito = {
                  id: number;
                  nombre: string;
                  precio: number;
                  imagen: string;
                  cantidad: number;
                };
                const cantidad = parseInt((document.getElementById("cantidad-cocina") as HTMLInputElement).value) || 1;
                const producto: ProductoCarrito = {
                  id: 65,
                  nombre: "Set de Cocina",
                  precio: 49999,
                  imagen: "src/assets/IMG/index/Cocina.jpg",
                  cantidad,
                };
                const carrito: ProductoCarrito[] = JSON.parse(localStorage.getItem("carrito") || "[]");
                const index = carrito.findIndex((p: ProductoCarrito) => p.id === producto.id);
                if (index >= 0) {
                  carrito[index].cantidad += cantidad;
                } else {
                  carrito.push(producto);
                }
                localStorage.setItem("carrito", JSON.stringify(carrito));
                window.location.href = "/carrito";
              }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>

      {/* VIDEOS */}
      {showVideos && (
        <div id="videosContainer" className="videos-container">
          <video controls>
            <source src="/JOSNISHOP_000/assets/videos/index/cocina/video1.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
        </div>
      )}

      {/* CARRUSEL */}
      <div className="carousel">
        <div className="carousel-inner" ref={innerRef}>
          {items.map((img, index) => (
            <div
              key={index}
              className={`carousel-item ${index === currentIndex ? "active" : ""}`}
            >
              <img src={img} alt={`Carrusel ${index + 1}`} />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          onClick={() => goToSlide(currentIndex - 1)}
        >
          <span>&lt;</span>
        </button>
        <button
          className="carousel-control-next"
          onClick={() => goToSlide(currentIndex + 1)}
        >
          <span>&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default ProductoCocina;