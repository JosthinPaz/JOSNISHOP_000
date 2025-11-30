import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/producto_sele/Producto_selec.css"; // Ajusta la ruta a tu CSS
import ResenasProducto from "./ResenasProducto";
import NavBar from "../NavBar";

const Productobolso: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideos, setShowVideos] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  const items = [
    "src/assets/IMG/index/carrusel1.png",
    "src/assets/IMG/index/carrusel2.png",
    "src/assets/IMG/index/carrusel3.png",
  ];

  // Función para cambiar de slide
  const goToSlide = (index: number) => {
    if (index < 0) index = items.length - 1;
    else if (index >= items.length) index = 0;

    setCurrentIndex(index);
    if (innerRef.current) {
      const itemWidth = innerRef.current.offsetWidth;
      innerRef.current.style.transform = `translateX(${-index * itemWidth}px)`;
    }
  };

  // Ajustar posición al redimensionar
  useEffect(() => {
    if (innerRef.current) {
      const itemWidth = innerRef.current.offsetWidth;
      innerRef.current.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
    }
  }, [currentIndex]);

  const id_producto = 63; // Cambia por el ID real del bolso en tu base de datos

  return (
    <div>
      <NavBar />

      {/* CONTENIDO PRINCIPAL */}
      <div className="producto-container">
        <div className="producto-imagen">
          <img src="src/assets/IMG/index/bolso.png" alt="Bolso de mujer" />
        </div>

        <div className="producto-info">
          <h2>
            Bolso de hombro para mujer, bolso de gran capacidad, bolso cruzado con patrón de lichi,
            bolso de cubo portátil de PU, bolsos de mensajero para mujer
          </h2>
          <div className="precio">$102.639 COP</div>
          <button
            className="videos-btn"
            onClick={() => setShowVideos(!showVideos)}
          >
            Vídeos ▼
          </button>
          <div className="estrellas">★★★★★ 5.0</div>
          <p className="detalle">Productos Disponibles: 108</p>
        </div>

        <div className="lateral">
          <p><strong>Vendido por:</strong> ShopID1389401 Store (Vendedor)</p>
          <p><strong>Envío:</strong> COP$5,327.72</p>
          <p><strong>Entrega:</strong> 12 de JUN.</p>
          <p>✔ Política de devoluciones y reembolsos</p>
          <p>✔ Seguridad & Privacidad</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <label htmlFor="cantidad-bolso" style={{ margin: 0 }}>Cantidad:</label>
            <input
              type="number"
              min={1}
              defaultValue={1}
              id="cantidad-bolso"
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
                const cantidad = parseInt((document.getElementById("cantidad-bolso") as HTMLInputElement).value) || 1;
                const producto: ProductoCarrito = {
                  id: 63,
                  nombre: "Bolso de hombro para mujer",
                  precio: 102639,
                  imagen: "src/assets/IMG/index/bolso.png",
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

        {/* Reseñas del Producto (ahora arriba del carrusel) */}
      <ResenasProducto id_producto={id_producto} />

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

      {/* VIDEOS */}
      {showVideos && (
        <div id="videosContainer" className="videos-container">
          <video controls>
            <source src="src/assets/videos/index/bolso/video1.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
          <video controls>
            <source src="src/assets/videos/index/bolso/video2.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
          <video controls>
            <source src="src/assets/videos/index/bolso/video3.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
        </div>
      )}
    </div>
  );
};

export default Productobolso;
