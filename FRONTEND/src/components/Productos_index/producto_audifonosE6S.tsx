import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/producto_sele/Producto_selec.css";

const ProductoAudifonosE6S: React.FC = () => {
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
          <img src="/JOSNISHOP_000/assets/IMG/index/audifonos.png" alt="Audífonos E6S" />
        </div>
        <div className="producto-info">
          <h2>
            Auriculares inalámbricos E6S con cancelación de ruido, auriculares deportivos Bluetooth
          </h2>
          <div className="precio">$19.699 COP</div>
          <button
            className="videos-btn"
            onClick={() => setShowVideos(!showVideos)}
          >
            Vídeos ▼
          </button>
          <div className="estrellas">★★★★★ 4.8</div>
          <p className="detalle">Productos Disponibles: 50</p>
        </div>
        <div className="lateral">
          <p><strong>Vendido por:</strong> AudifonosPro Store</p>
          <p><strong>Envío:</strong> COP$3,500.00</p>
          <p><strong>Entrega:</strong> 15 de JUN.</p>
          <p>✔ Política de devoluciones y reembolsos</p>
          <p>✔ Seguridad & Privacidad</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <label htmlFor="cantidad-audifonosE6S" style={{ margin: 0 }}>Cantidad:</label>
            <input
              type="number"
              min={1}
              defaultValue={1}
              id="cantidad-audifonosE6S"
              style={{ width: "50px", padding: "2px 4px", borderRadius: "4px", border: "1px solid #ccc" }}
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
                const cantidad = parseInt((document.getElementById("cantidad-audifonosE6S") as HTMLInputElement).value) || 1;
                const producto: ProductoCarrito = {
                  id: 61,
                  nombre: "Auriculares E6S",
                  precio: 19699,
                  imagen: "src/assets/IMG/index/audifonos.png",
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
            <source src="/JOSNISHOP_000/assets/videos/index/audifonos/video1.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
          <video controls>
            <source src="/JOSNISHOP_000/assets/videos/index/audifonos/video2.mp4" type="video/mp4" />
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

export default ProductoAudifonosE6S;