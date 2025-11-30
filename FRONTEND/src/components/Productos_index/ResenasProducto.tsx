import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/producto_sele/Producto_selec.css";

const ResenasProducto: React.FC<{ id_producto: number }> = ({ id_producto }) => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/resenas/producto/${id_producto}`)
      .then((res) => setResenas(res.data))
      .catch(() => setResenas([]))
      .finally(() => setLoading(false));
  }, [id_producto]);

  return (
    <div style={{ marginTop: "24px" }}>
      <h3 style={{ color: "#0a5c34", marginBottom: 10 }}>Reseñas</h3>
      {loading && <p>Cargando reseñas...</p>}
      {!loading && resenas.length === 0 && (
        <p style={{ color: "#888" }}>No hay reseñas para este producto.</p>
      )}
      {resenas.map((resena) => (
        <div key={resena.id_resena} className="resena-card">
          <strong>{resena.usuario_nombre || "Usuario"}</strong>
          <span>⭐ {resena.calificacion}</span>
          <p>{resena.comentario}</p>
          <small>{new Date(resena.fecha).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};

export default ResenasProducto;