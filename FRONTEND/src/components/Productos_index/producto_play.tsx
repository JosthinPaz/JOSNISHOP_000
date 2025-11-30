import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/producto_sele/Producto_selec.css";
import NavBar from "../NavBar";

const ProductoPlay: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideos, setShowVideos] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  const items = [
    "/src/assets/IMG/index/carrusel1.png",
    "/src/assets/IMG/index/carrusel2.png",
    "/src/assets/IMG/index/carrusel3.png",
  ];

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
      <NavBar />

      {/* CONTENIDO PRINCIPAL */}
      <div className="producto-container">
        <div className="producto-imagen">
          <img src="/src/assets/IMG/index/consola.jpg" alt="Consola PlayStation" />
        </div>
        <div className="producto-info">
          <h2>
            Consola PlayStation de última generación, gráficos avanzados y gran capacidad de almacenamiento.
          </h2>
          <div className="precio">$1.590.990 COP</div>
          <button
            className="videos-btn"
            onClick={() => setShowVideos(!showVideos)}
          >
            Vídeos ▼
          </button>
          <div className="estrellas">★★★★★ 5.0</div>
          <p className="detalle">Productos Disponibles: 15</p>
        </div>
        <div className="lateral">
          <p><strong>Vendido por:</strong> PlayStore</p>
          <p><strong>Envío:</strong> COP$6,000.00</p>
          <p><strong>Entrega:</strong> 15 de JUN.</p>
          <p>✔ Política de devoluciones y reembolsos</p>
          <p>✔ Seguridad & Privacidad</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <label htmlFor="cantidad-play" style={{ margin: 0 }}>Cantidad:</label>
            <input
              type="number"
              id="cantidad-play"
              min={1}
              max={10}
              defaultValue={1}
              style={{ width: "50px", marginLeft: "5px" }}
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
                const cantidad = parseInt((document.getElementById("cantidad-play") as HTMLInputElement).value) || 1;
                const producto: ProductoCarrito = {
                  id: 67,
                  nombre: "Play Station 5",
                  precio: 2999999,
                  imagen: "src/assets/IMG/index/consola.jpg",
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
            <source src="/src/assets/videos/index/play/video1.mp4" type="video/mp4" />
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

export default ProductoPlay;