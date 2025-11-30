import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import "../../assets/css/categorias.css";
import { useToast } from "../../contexts/useToastContext";

type ProductoCard = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number | null;
  image: string | null;
};

const Mascota: React.FC = () => {
  const [productos, setProductos] = useState<ProductoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await fetch(
          "http://localhost:8000/productos/categoria/mascota/rich"
        );
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setProductos(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((p: any) => {
            let imgUrl: string | null = null;
            if (p.image) {
              const v = String(p.image).trim();
              if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('//')) {
                imgUrl = v;
              } else {
                imgUrl = `http://localhost:8000${v}`;
              }
            }
            return {
              id: p.id,
              nombre: p.nombre,
              descripcion: p.descripcion || "",
              precio: p.precio ?? 0,
              image: imgUrl,
            };
          })
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  function addToCart(product: ProductoCard) {
    // Verificar si el usuario está logueado
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Debes iniciar sesión para comprar. Serás redirigido al login.", "warning");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }

    try {
      const raw = localStorage.getItem("carrito") || "[]";
      const carrito = JSON.parse(raw);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const idx = carrito.findIndex((p: any) => Number(p.id) === Number(product.id));
      if (idx >= 0) {
        carrito[idx].cantidad = Number(carrito[idx].cantidad || 1) + 1;
      } else {
        carrito.push({
          id: product.id,
          nombre: product.nombre,
          precio: product.precio || 0,
          imagen: product.image || "",
          cantidad: 1,
        });
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      showToast(`${product.nombre} agregado al carrito`, "success");
    } catch (e) {
      console.error(e);
      showToast("No se pudo agregar al carrito", "error");
    }
  }

  return (
    <div>
      <NavBar />
      <div style={{ maxWidth: 1200, margin: "36px auto", padding: 20 }}>
        <div style={{ background: "#fda792", borderRadius: 20, padding: 24 }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>Mascota</h1>
        </div>

        <div className="contenedor" style={{ marginTop: 20 }}>
          <div className="menu-lateral" style={{ minWidth: 200 }}>
            <ul>
              <li style={{ fontWeight: 600, color: "#56b47b" }}>Mascota</li>
            </ul>
          </div>

          <div className="contenido" style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {loading && <div>Cargando productos...</div>}
            {!loading && productos.length === 0 && <div>No hay productos en esta categoría.</div>}
            {productos.map((p) => (
              <div key={p.id} style={{ background: "#fff", borderRadius: 8, padding: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                  <img
                    src={p.image || "/src/assets/IMG/index/no-image.png"}
                    alt={p.nombre}
                    style={{ maxHeight: 140, maxWidth: "100%", objectFit: "cover", borderRadius: 6 }}
                    onError={e => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = "/src/assets/IMG/index/no-image.png";
                    }}
                  />
                </div>
                <h3 style={{ margin: "6px 0" }}>{p.nombre}</h3>
                <p style={{ margin: "6px 0", color: "#444" }}>{p.descripcion}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <strong style={{ color: "#111" }}>S/ {p.precio?.toFixed(2)}</strong>
                  <button onClick={() => addToCart(p)} style={{ background: "#56b47b", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mascota;