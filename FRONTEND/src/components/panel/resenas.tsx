import React, { useEffect, useState, useCallback } from "react";
import ModalResena from "./ModalResena";
import { useToast } from "../../contexts/useToastContext";
import ConfirmModal from "../ConfirmModal";

interface Resena {
  id: number;
  cliente_id: number;
  producto_id: number;
  calificacion: number;
  comentario: string;
  respuesta_vendedor?: string;
}

interface Props {
  esVendedor: boolean;
  vendedorId?: number;
  productoId?: number;
  onResenaEnviada?: () => void;
}

const ResenasPanel: React.FC<Props> = ({ esVendedor, vendedorId, productoId, onResenaEnviada }) => {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [filteredResenas, setFilteredResenas] = useState<Resena[]>([]);
  const [respuesta, setRespuesta] = useState("");
  const [editandoResena, setEditandoResena] = useState<Resena | null>(null);
  const [selectedRespuestaResena, setSelectedRespuestaResena] = useState<Resena | null>(null);
  const [error, setError] = useState("");
  const [puedeResenar, setPuedeResenar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalModoEdicion, setModalModoEdicion] = useState(false);
  const [deleteConfirmRespuesta, setDeleteConfirmRespuesta] = useState<number | null>(null);
  const [deleteConfirmResena, setDeleteConfirmResena] = useState<number | null>(null);
  const { showToast } = useToast();

  // Estados para los filtros
  const [filterCalificacion, setFilterCalificacion] = useState<number | "">("");
  const [filterClienteId, setFilterClienteId] = useState<number | "">("");
  const [filterProductoId, setFilterProductoId] = useState<number | "">("");
  const [filterTieneRespuesta, setFilterTieneRespuesta] = useState<boolean | "">("");

  const userId = Number(localStorage.getItem("userId"));

  // Cargar reseñas según el rol
  useEffect(() => {
    if (esVendedor && vendedorId) {
      fetch(`/api/resenas/vendedor/${vendedorId}`)
        .then(res => res.json())
        .then(data => {
          setResenas(data);
          setFilteredResenas(data);
        });
    } else if (!esVendedor && productoId) {
      fetch(`/api/resenas/producto/${productoId}`)
        .then(res => res.json())
        .then(data => {
          setResenas(data);
          setFilteredResenas(data);
        });
    }
  }, [esVendedor, vendedorId, productoId, showModal, modalModoEdicion]);

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    let filtered = resenas;

    if (filterCalificacion !== "") {
      filtered = filtered.filter(r => r.calificacion === filterCalificacion);
    }

    if (filterClienteId !== "") {
      filtered = filtered.filter(r => r.cliente_id === filterClienteId);
    }

    if (filterProductoId !== "") {
      filtered = filtered.filter(r => r.producto_id === filterProductoId);
    }

    if (filterTieneRespuesta !== "") {
      const tieneRespuesta = filterTieneRespuesta === true;
      if (tieneRespuesta) {
        filtered = filtered.filter(r => r.respuesta_vendedor && r.respuesta_vendedor.trim() !== "");
      } else {
        filtered = filtered.filter(r => !r.respuesta_vendedor || r.respuesta_vendedor.trim() === "");
      }
    }

    setFilteredResenas(filtered);
  }, [resenas, filterCalificacion, filterClienteId, filterProductoId, filterTieneRespuesta]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Limpiar filtros
  const clearFilters = () => {
    setFilterCalificacion("");
    setFilterClienteId("");
    setFilterProductoId("");
    setFilterTieneRespuesta("");
  };

  // Solo para cliente: verificar si puede dejar reseña
  useEffect(() => {
    if (!esVendedor && productoId) {
      fetch(`/api/resenas/puede-resenar?producto_id=${productoId}&cliente_id=${userId}`)
        .then(res => res.json())
        .then(data => setPuedeResenar(data));
    }
  }, [productoId, esVendedor, showModal, modalModoEdicion, userId]);

  // Vendedor responde o edita respuesta
  const handleRespuesta = async (e: React.FormEvent, resenaId: number) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/resenas/${resenaId}/respuesta`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuesta }),
      });
      if (!res.ok) {
        setError("Error al guardar respuesta.");
        return;
      }
      setRespuesta("");
      setSelectedRespuestaResena(null);
      if (esVendedor && vendedorId) {
        fetch(`/api/resenas/vendedor/${vendedorId}`)
          .then(res => res.json())
          .then(data => setResenas(data));
      }
    } catch {
      setError("Error de red.");
    }
  };

  const handleEliminarRespuesta = async (resenaId: number) => {
    setDeleteConfirmRespuesta(resenaId);
  };

  const confirmDeleteRespuesta = async () => {
    if (deleteConfirmRespuesta === null) return;
    try {
      const res = await fetch(`/api/resenas/${deleteConfirmRespuesta}/respuesta`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Error al eliminar respuesta.", "error");
        return;
      }
      showToast("Respuesta eliminada correctamente", "success");
      if (esVendedor && vendedorId) {
        fetch(`/api/resenas/vendedor/${vendedorId}`)
          .then(res => res.json())
          .then(data => setResenas(data));
      }
    } catch {
      showToast("Error de red.", "error");
    }
    setDeleteConfirmRespuesta(null);
  };

  // Cliente edita su reseña
  const handleEditarResena = (resena: Resena) => {
    setEditandoResena(resena);
    setModalModoEdicion(true);
    setShowModal(true);
  };

  // Cliente elimina su reseña
  const handleEliminarResena = async (resenaId: number) => {
    setDeleteConfirmResena(resenaId);
  };

  const confirmDeleteResena = async () => {
    if (deleteConfirmResena === null) return;
    try {
      const res = await fetch(`/api/resenas/${deleteConfirmResena}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Error al eliminar reseña.", "error");
        return;
      }
      showToast("Reseña eliminada correctamente", "success");
      if (productoId) {
        fetch(`/api/resenas/producto/${productoId}`)
          .then(res => res.json())
          .then(data => setResenas(data));
        setPuedeResenar(true);
      }
    } catch {
      showToast("Error de red.", "error");
    }
    setDeleteConfirmResena(null);
  };

  // Cuando el cliente envía una reseña, recarga la lista
  const handleResenaEnviada = () => {
    if (productoId) {
      fetch(`/api/resenas/producto/${productoId}`)
        .then(res => res.json())
        .then(data => setResenas(data));
      setPuedeResenar(false);
    }
    setShowModal(false);
    setEditandoResena(null);
    setModalModoEdicion(false);
    if (typeof onResenaEnviada === "function") onResenaEnviada();
  };

  return (
    <div>
      <div className="panel-card">
        {/* Sección de Filtros */}
        <div style={{
          background: '#f5f5f5',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ddd'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#054d25', fontSize: '16px' }}>Filtros</h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            {/* Filtro por Calificación */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                Calificación
              </label>
              <select
                value={filterCalificacion}
                onChange={(e) => setFilterCalificacion(e.target.value === "" ? "" : Number(e.target.value))}
                className="form-input"
                style={{ width: '100%' }}
              >
                <option value="">Todas</option>
                <option value="1">⭐ 1 estrella</option>
                <option value="2">⭐⭐ 2 estrellas</option>
                <option value="3">⭐⭐⭐ 3 estrellas</option>
                <option value="4">⭐⭐⭐⭐ 4 estrellas</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 estrellas</option>
              </select>
            </div>

            {/* Filtro por Cliente ID */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                Cliente ID
              </label>
              <input
                type="number"
                placeholder="Buscar por ID de cliente..."
                value={filterClienteId}
                onChange={(e) => setFilterClienteId(e.target.value === "" ? "" : Number(e.target.value))}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Filtro por Producto ID */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                Producto ID
              </label>
              <input
                type="number"
                placeholder="Buscar por ID de producto..."
                value={filterProductoId}
                onChange={(e) => setFilterProductoId(e.target.value === "" ? "" : Number(e.target.value))}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Filtro por Respuesta */}
            {esVendedor && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  Estado de Respuesta
                </label>
                <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="respuesta"
                      checked={filterTieneRespuesta === ""}
                      onChange={() => setFilterTieneRespuesta("")}
                    />
                    <span>Todas</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="respuesta"
                      checked={filterTieneRespuesta === true}
                      onChange={() => setFilterTieneRespuesta(true)}
                    />
                    <span>Con respuesta</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="respuesta"
                      checked={filterTieneRespuesta === false}
                      onChange={() => setFilterTieneRespuesta(false)}
                    />
                    <span>Sin respuesta</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={clearFilters}
            className="btn-delete"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Limpiar filtros
          </button>

          <p style={{ margin: '12px 0 0 0', color: '#666', fontSize: '14px' }}>
            Mostrando {filteredResenas.length} de {resenas.length} reseñas
          </p>
        </div>

        <div className="table-container">
          <div style={{ padding: 12 }}>
            {filteredResenas.length === 0 && <p>No hay reseñas que coincidan con los filtros.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {filteredResenas.map(resena => (
                <div key={resena.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', padding: '16px', position: 'relative', borderLeft: '6px solid #006633' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontWeight: 600, color: "#006633" }}>
                  Cliente {resena.cliente_id}
                </span>
                <span style={{ marginLeft: 12, color: "#ffb400", fontWeight: 700 }}>
                  {Array(resena.calificacion).fill("⭐").join("")}
                </span>
              </div>
              {/* Opciones de editar/eliminar solo para el cliente dueño */}
              {!esVendedor && resena.cliente_id === userId && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      background: "#e0e0e0",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 10px",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "background 0.2s",
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = "#bdbdbd")}
                    onMouseOut={e => (e.currentTarget.style.background = "#e0e0e0")}
                    onClick={() => handleEditarResena(resena)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    style={{
                      background: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 10px",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "background 0.2s",
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = "#d32f2f")}
                    onMouseOut={e => (e.currentTarget.style.background = "#ff4d4f")}
                    onClick={() => handleEliminarResena(resena.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
            <div style={{ marginTop: "0.7rem", fontSize: "1.1rem" }}>
              {resena.comentario}
            </div>
            {/* Vendedor responde o edita respuesta */}
            {esVendedor && (
              resena.respuesta_vendedor ? (
                <div style={{ marginTop: "1rem", background: "#f6fff6", borderRadius: 6, padding: "0.7rem" }}>
                  <span style={{ color: "#006633", fontWeight: 600 }}>Respuesta:</span> {resena.respuesta_vendedor}
                  <div style={{ marginTop: 6 }}>
                    <button
                      style={{
                        background: "#e0e0e0",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 10px",
                        cursor: "pointer",
                        fontWeight: 500,
                        marginRight: 8,
                        transition: "background 0.2s",
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = "#bdbdbd")}
                      onMouseOut={e => (e.currentTarget.style.background = "#e0e0e0")}
                      onClick={() => {
                        // Abrir modal para editar la respuesta
                        setSelectedRespuestaResena(resena);
                        setRespuesta(resena.respuesta_vendedor || "");
                      }}
                    >
                      Editar
                    </button>
                    <button
                      style={{
                        background: "#ff4d4f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 10px",
                        cursor: "pointer",
                        fontWeight: 500,
                        transition: "background 0.2s",
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = "#d32f2f")}
                      onMouseOut={e => (e.currentTarget.style.background = "#ff4d4f")}
                      onClick={() => handleEliminarRespuesta(resena.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                  {/* edición de respuesta ahora en modal */}
                </div>
              ) : (
                // abrir un modal para responder/editar
                <button
                  style={{
                    background: "#006633",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "2px 10px",
                    cursor: "pointer",
                    fontWeight: 500,
                    marginTop: 10,
                    transition: "background 0.2s",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "#004d2c")}
                  onMouseOut={e => (e.currentTarget.style.background = "#006633")}
                  onClick={() => {
                    setSelectedRespuestaResena(resena);
                    setRespuesta("");
                  }}
                >
                  Responder
                </button>
              )
            )}
            {/* Si eres cliente, muestra la respuesta del vendedor si existe */}
            {!esVendedor && resena.respuesta_vendedor && (
              <div style={{ marginTop: "1rem", background: "#f6fff6", borderRadius: 6, padding: "0.7rem", color: "#006633" }}>
                <strong>Respuesta del vendedor:</strong> {resena.respuesta_vendedor}
              </div>
            )}
                </div>
              ))}
            </div>
            {selectedRespuestaResena && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1200
              }}>
                <div style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '1.6rem',
                  width: 'min(720px, 92%)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.18)'
                }}>
                  <h3 style={{ margin: 0, marginBottom: 8, color: '#17633a' }}>Editar respuesta</h3>
                  <p style={{ marginTop: 0, marginBottom: 12, color: '#444' }}>
                    <strong>Cliente:</strong> {selectedRespuestaResena.cliente_id} &nbsp; • &nbsp; <strong>Producto:</strong> {selectedRespuestaResena.producto_id}
                  </p>
                  <form onSubmit={e => handleRespuesta(e, selectedRespuestaResena.id)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <textarea
                      value={respuesta}
                      onChange={e => setRespuesta(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      style={{
                        width: '100%',
                        minHeight: 120,
                        borderRadius: 10,
                        border: '2px solid #27ae60',
                        padding: 12,
                        fontSize: '1rem',
                        background: '#f9f9f9',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button type="button" onClick={() => { setSelectedRespuestaResena(null); setRespuesta(''); }} style={{ background: '#e0e0e0', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer' }}>Cancelar</button>
                      <button type="submit" style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer' }}>Guardar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
          </div>
        </div>
      {/* Solo cliente puede dejar reseña */}
      {!esVendedor && puedeResenar && (
        <>
          <button
            onClick={() => {
              setShowModal(true);
              setModalModoEdicion(false);
              setEditandoResena(null);
            }}
            style={{
              marginTop: "1.5rem",
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
              transition: "background 0.2s, transform 0.2s",
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
            <span role="img" aria-label="reseña" style={{ marginRight: 8 }}>📝</span>
            Dejar reseña
          </button>
        </>
      )}
      {/* Modal para crear o editar reseña */}
      {showModal && productoId && (
        <ModalResena
          productoId={productoId}
          onClose={() => {
            setShowModal(false);
            setEditandoResena(null);
            setModalModoEdicion(false);
          }}
          onResenaEnviada={handleResenaEnviada}
          resenaAEditar={
            modalModoEdicion && editandoResena
              ? {
                  id: editandoResena.id,
                  comentario: editandoResena.comentario,
                  calificacion: editandoResena.calificacion,
                }
              : undefined
          }
        />
      )}
      <ConfirmModal
        isOpen={deleteConfirmRespuesta !== null}
        title="Eliminar respuesta"
        message="¿Seguro que deseas eliminar esta respuesta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={confirmDeleteRespuesta}
        onCancel={() => setDeleteConfirmRespuesta(null)}
      />
      <ConfirmModal
        isOpen={deleteConfirmResena !== null}
        title="Eliminar reseña"
        message="¿Seguro que deseas eliminar tu reseña? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={confirmDeleteResena}
        onCancel={() => setDeleteConfirmResena(null)}
      />
      </div>
    </div>
  );
};

export default ResenasPanel;