import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResenasProducto from "./ResenasProducto";
import "../../assets/css/producto_sele/Producto_selec.css";
import NavBar from "../NavBar";
import { useToast } from "../../contexts/useToastContext";

type Producto = {
  id: number;
  nombre?: string;
  vendedor_id?: string | number | null;
};

type ProductoRich = {
  id: number;
  precio?: number;
  image?: string | null;
};

type InventarioItem = {
  id?: number;
  producto_id?: number;
  cantidad?: number;
  stock_minimo?: number;
};

type CarritoItem = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

const ProductoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productoId = Number(id || 0);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [precio, setPrecio] = useState<number | null>(null);
  const [img, setImg] = useState<string | null>(null);
  const [availableCount, setAvailableCount] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [showVideos, setShowVideos] = useState(false);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!productoId) return;
    (async () => {
      try {
        // Get api base from environment (Vite). If not set, use relative paths.
        const API = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
        // fetch basic producto
        const res = await fetch(`${API || ''}/productos/${productoId}`);
        if (res.ok) {
          const data = await res.json();
          setProducto(data);
        }
      } catch (err) {
        console.error("Error cargando producto", err);
      }

      try {
        const res2 = await fetch(`${API || ''}/productos/rich`);
        if (res2.ok) {
          const list: ProductoRich[] = await res2.json();
          const found = list.find((p) => p.id === productoId);
          if (found) {
            setPrecio(found.precio ?? null);
            // if found.image is absolute (http/https or protocol-relative //) use it as-is,
            // otherwise prefix with backend host for relative paths
            let imgUrl: string | null = null;
            if (found.image) {
              const v = String(found.image).trim();
                if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('//')) {
                imgUrl = v;
              } else {
                imgUrl = `${API || ''}${v}`;
              }
            }
            setImg(imgUrl);
          }
        }
      } catch (err) {
        console.error('Error cargando productos rich', err);
      }
      // fetch inventory for this product and compute available quantity
      try {
        const invRes = await fetch(`${API || ''}/inventarios/reportes?producto_id=${productoId}`);
        if (invRes.ok) {
          const invList: InventarioItem[] = await invRes.json();
          // invList is an array of inventories with `cantidad`
          const total = Array.isArray(invList) ? invList.reduce((s: number, it: InventarioItem) => s + (Number(it.cantidad) || 0), 0) : 0;
          setAvailableCount(total);
        }
      } catch (e) {
        console.error('Error cargando inventario', e);
      }
    })();
  }, [productoId]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Show a toast like in category pages, then redirect after a short delay
      showToast("Debes iniciar sesión para comprar. Serás redirigido al login.", "warning");
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    // if we have inventory info, prevent adding more than available
    if (availableCount !== null && cantidad > availableCount) {
      showToast(`Solo hay ${availableCount} unidad(es) disponibles.`, "warning");
      return;
    }
    const prod: CarritoItem = {
      id: productoId,
      nombre: producto?.nombre || "Producto",
      precio: precio || 0,
      imagen: img || "",
      cantidad: cantidad || 1,
    };
    const carrito: CarritoItem[] = JSON.parse(localStorage.getItem("carrito") || "[]") as CarritoItem[];
    const idx = carrito.findIndex((p: CarritoItem) => p.id === prod.id);
    if (idx >= 0) carrito[idx].cantidad += prod.cantidad;
    else carrito.push(prod);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    navigate('/carrito');
  };

  const items = [img || "/src/assets/IMG/index/carrusel1.png", "/src/assets/IMG/index/carrusel2.png", "/src/assets/IMG/index/carrusel3.png"];

  const goToSlide = (index: number) => {
    if (!innerRef.current) return;
    if (index < 0) index = items.length - 1;
    else if (index >= items.length) index = 0;
    setCurrentIndex(index);
    const itemWidth = innerRef.current.offsetWidth;
    innerRef.current.style.transform = `translateX(${-index * itemWidth}px)`;
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

      <div className="producto-container">
        <div className="producto-imagen">
          {img ? (
            <img
              src={img}
              alt={producto?.nombre}
              onError={(e) => {
                // if image fails to load, replace with a local fallback
                const target = e.currentTarget as HTMLImageElement;
                if (!target.dataset.fallback) {
                  target.dataset.fallback = '1';
                  target.src = '/src/assets/IMG/index/bolso.png';
                }
              }}
            />
          ) : (
            <img src="/src/assets/IMG/index/bolso.png" alt="producto" />
          )}
        </div>

        <div className="producto-info">
          <h2>{producto?.nombre}</h2>
          <div className="precio">{precio ? `$${Number(precio).toLocaleString('es-CO')} COP` : ""}</div>
          <button className="videos-btn" onClick={() => setShowVideos(!showVideos)}>Vídeos ▼</button>
          <div className="estrellas">★★★★★ {producto ? '5.0' : ''}</div>
          <p className="detalle">Productos Disponibles: {availableCount === null ? '...' : availableCount}</p>
        </div>

        <div className="lateral">
          <p><strong>Vendido por:</strong> {producto?.vendedor_id || 'Vendedor'}</p>
          <p><strong>Envío:</strong> COP$5,327.72</p>
          <p><strong>Entrega:</strong> 12 de JUN.</p>
          <p>✔ Política de devoluciones y reembolsos</p>
          <p>✔ Seguridad & Privacidad</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <label htmlFor="cantidad-detalle" style={{ margin: 0 }}>Cantidad:</label>
            <input id="cantidad-detalle" type="number" min={1} max={availableCount ?? undefined} value={cantidad} onChange={e => setCantidad(Number(e.target.value || 1))} style={{ width: "60px", padding: "4px" }} disabled={availableCount === 0} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <button className="comprar-btn" onClick={handleAddToCart} disabled={availableCount === 0}>{availableCount === 0 ? 'Agotado' : 'Agregar al carrito'}</button>
          </div>
        </div>
      </div>

      <ResenasProducto id_producto={productoId} />

      <div className="carousel">
        <div className="carousel-inner" ref={innerRef}>
          {items.map((imgSrc, idx) => (
            <div key={idx} className={`carousel-item ${idx === currentIndex ? 'active' : ''}`}>
              <img src={imgSrc} alt={`Slide ${idx + 1}`} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" onClick={() => goToSlide(currentIndex - 1)}>&lt;</button>
        <button className="carousel-control-next" onClick={() => goToSlide(currentIndex + 1)}>&gt;</button>
      </div>

      {showVideos && (
        <div id="videosContainer" className="videos-container">
          <video controls>
            <source src="/src/assets/videos/index/bolso/video1.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
        </div>
      )}
    </div>
  );
};

export default ProductoDetalle;
