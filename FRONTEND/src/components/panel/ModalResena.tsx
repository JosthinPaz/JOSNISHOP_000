import React, { useState, useEffect } from "react";

interface ModalResenaProps {
  productoId: number;
  onClose: () => void;
  onResenaEnviada: () => void;
  resenaAEditar?: {
    id: number;
    comentario: string;
    calificacion: number;
  };
}

const ModalResena: React.FC<ModalResenaProps> = ({
  productoId,
  onClose,
  onResenaEnviada,
  resenaAEditar, // <-- ahora sí la usamos
}) => {
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");

  // Si estamos editando, inicializa los campos con los valores de la reseña
  useEffect(() => {
    if (resenaAEditar) {
      setComentario(resenaAEditar.comentario);
      setCalificacion(resenaAEditar.calificacion);
    } else {
      setComentario("");
      setCalificacion(5);
    }
  }, [resenaAEditar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (comentario.length < 10) {
      setError("El comentario debe tener al menos 10 caracteres.");
      return;
    }
    try {
      let res;
      if (resenaAEditar) {
        // Editar reseña existente
        res = await fetch(`/api/resenas/${resenaAEditar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            comentario,
            calificacion,
          }),
        });
      } else {
        // Crear nueva reseña
        res = await fetch("/api/resenas/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            producto_id: productoId,
            cliente_id: Number(userId),
            calificación: calificacion, // <-- con tilde, igual que backend
            comentario,
          }),
        });
      }
      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch {
          data = null;
        }
        if (data && typeof data.detail === "string") {
          setError(data.detail);
        } else if (data && typeof data.detail === "object") {
          setError(JSON.stringify(data.detail));
        } else if (typeof data === "string") {
          setError(data);
        } else {
          setError("Error al enviar reseña.");
        }
        return;
      }
      setComentario("");
      setCalificacion(5);
      onResenaEnviada();
      onClose();
    } catch {
      setError("Error de red.");
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.10)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 8px 32px #0002",
        padding: "2.5rem 2.5rem 2rem 2.5rem",
        minWidth: 340,
        maxWidth: 400,
        width: "100%",
        textAlign: "center",
        position: "relative"
      }}>
        <h3 style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#17633a",
          marginBottom: "1.5rem"
        }}>{resenaAEditar ? "Editar reseña" : "Deja tu reseña"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <label style={{ fontWeight: 600, fontSize: "1.1rem", color: "#17633a" }}>Calificación:</label>
            <select value={calificacion} onChange={e => setCalificacion(Number(e.target.value))} style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "2px solid #27ae60",
              fontSize: "1.1rem",
              background: "#f9f9f9",
              color: "#222",
              fontWeight: 500,
              outline: "none",
              minWidth: "80px"
            }}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
            <label style={{ fontWeight: 600, fontSize: "1.1rem", color: "#17633a" }}>Comentario:</label>
            <textarea
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              minLength={10}
              required
              style={{
                width: "100%",
                minHeight: 60,
                borderRadius: 8,
                border: "2px solid #27ae60",
                padding: "10px",
                fontSize: "1.1rem",
                background: "#f9f9f9",
                color: "#222",
                fontWeight: 500,
                outline: "none",
                resize: "vertical"
              }}
            />
          </div>
          <button type="submit" style={{
            background: "#27ae60",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "14px 40px",
            fontWeight: 700,
            fontSize: "1.2rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px #0001",
            letterSpacing: "1px",
            transition: "background 0.2s, transform 0.2s"
          }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#219150";
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "#27ae60";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {resenaAEditar ? "Guardar cambios" : "Enviar reseña"}
          </button>
          <button type="button" onClick={onClose} style={{
            background: "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 40px",
            fontWeight: 700,
            fontSize: "1.1rem",
            cursor: "pointer",
            marginTop: 0,
            boxShadow: "0 2px 8px #0001",
            transition: "background 0.2s, transform 0.2s"
          }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#d32f2f";
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "#ff4d4f";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Cancelar
          </button>
          {error && <p style={{ color: "red", marginTop: 12 }}>{String(error)}</p>}
        </form>
      </div>
    </div>
  );
};

export default ModalResena;