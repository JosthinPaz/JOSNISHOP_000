import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/producto_sele/Producto_selec.css";
import NavBar from "../NavBar";

const ProductoSet: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideos, setShowVideos] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  const items = [
    "/JOSNISHOP_000/assets/IMG/index/carrusel1.png",
    "/JOSNISHOP_000/assets/IMG/index/carrusel2.png",
    "/JOSNISHOP_000/assets/IMG/index/carrusel3.png",
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
          <img src="/JOSNISHOP_000/assets/IMG/index/set.jpg" alt="Set de pinturas" />
        </div>
        <div className="producto-info">
          <h2>
            Set de pintura acrílica profesional, ideal para artistas y principiantes.
          </h2>
          <div className="precio">$29.990 COP</div>
          <button
            className="videos-btn"
            onClick={() => setShowVideos(!showVideos)}
          >
            Vídeos ▼
          </button>
          <div className="estrellas">★★★★★ 4.8</div>
          <p className="detalle">Productos Disponibles: 40</p>
        </div>
        <div className="lateral">
          <p><strong>Vendido por:</strong> PinturasStore</p>
          <p><strong>Envío:</strong> COP$3,000.00</p>
          <p><strong>Entrega:</strong> 16 de JUN.</p>
          <p>✔ Política de devoluciones y reembolsos</p>
          <p>✔ Seguridad & Privacidad</p>
          <label htmlFor="cantidad-set">Cantidad:</label>
          <input
            type="number"
            id="cantidad-set"
            min={1}
            max={10}
            defaultValue={1}
            style={{ width: "50px", marginLeft: "5px" }}
          />
          <button
            className="comprar-btn"
            onClick={() => {
              // Verificar si el usuario está logueado
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
              const cantidad = parseInt((document.getElementById("cantidad-set") as HTMLInputElement).value) || 1;
              const producto: ProductoCarrito = {
                id: 67,
                nombre: "Set de cocina",
                precio: 49999,
                imagen: "src/assets/IMG/index/set.jpg",
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

      {/* VIDEOS */}
      {showVideos && (
        <div id="videosContainer" className="videos-container">
          <video controls>
            <source src="/JOSNISHOP_000/assets/videos/index/set/video1.mp4" type="video/mp4" />
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

export default ProductoSet;