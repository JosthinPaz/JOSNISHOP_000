import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/producto_sele/Producto_selec.css";
import NavBar from "../NavBar";

const ProductoZapatillas: React.FC = () => {
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
          <img src="/src/assets/IMG/index/zapatillas.jpg" alt="Zapatillas deportivas" />
        </div>
        <div className="producto-info">
          <h2>
            Zapatillas deportivas cómodas y ligeras, ideales para correr y actividades al aire libre.
          </h2>
          <div className="precio">$300.000 COP</div>
          <button
            className="videos-btn"
            onClick={() => setShowVideos(!showVideos)}
          >
            Vídeos ▼
          </button>
          <div className="estrellas">★★★★★ 4.8</div>
          <p className="detalle">Productos Disponibles: 25</p>
        </div>
        <div className="lateral">
          <p><strong>Vendido por:</strong> ZapatillasStore</p>
          <p><strong>Envío:</strong> COP$8,000.00</p>
          <p><strong>Entrega:</strong> 17 de JUN.</p>
          <p>✔ Política de devoluciones y reembolsos</p>
          <p>✔ Seguridad & Privacidad</p>
          <label htmlFor="cantidad-zapatillas">Cantidad:</label>
          <input
            type="number"
            id="cantidad-zapatillas"
            min={1}
            max={10}
            defaultValue={1}
            style={{ width: "50px", marginLeft: "5px" }}
          />
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <button className="comprar-btn" onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) return window.location.href = "/login";
                const cantidad = parseInt((document.getElementById("cantidad-zapatillas") as HTMLInputElement)?.value) || 1;
                const producto = { id: 101, nombre: 'Zapatillas', precio: 129900, imagen: 'src/assets/IMG/index/zapatillas.png', cantidad };
                const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
                const idx = carrito.findIndex((p: any) => p.id === producto.id);
                if (idx >= 0) carrito[idx].cantidad += cantidad; else carrito.push(producto);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                window.location.href = '/carrito';
              }}>Agregar al carrito</button>
            </div>
        </div>
      </div>

      {/* VIDEOS */}
      {showVideos && (
        <div id="videosContainer" className="videos-container">
          <video controls>
            <source src="/src/assets/videos/index/zapatillas/video1.mp4" type="video/mp4" />
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

export default ProductoZapatillas;