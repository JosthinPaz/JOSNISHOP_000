import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import '../../assets/css/pedido.css';
import '../../assets/css/pedido-timeline.css';
import { useToast } from "../../contexts/useToastContext";
import ConfirmModal from "../ConfirmModal";
import PedidoTimeline from "./PedidoTimeline";

interface Pedido {
  id_pedido: number;
  fecha_pedido: string;
  estado: string;
  total: number;
  cliente_id?: number;
}

function getPedidosUrl(userId: string | null) {
  // Solo el usuario con id 1 es vendedor y ve todos los pedidos
  if (userId === "1") {
    return "http://localhost:8000/pedidos/";
  }
  // Todos los demás (clientes) solo ven sus propios pedidos
  return `http://localhost:8000/pedidos/cliente/${userId}`;
}

interface PedidosProps {
  setSelectedPedidoId: (id: number | null) => void;
}

const Pedidos: React.FC<PedidosProps> = ({ setSelectedPedidoId }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { showToast } = useToast();

  // Estados para los filtros
  const [filterEstado, setFilterEstado] = useState("");
  const [filterClienteId, setFilterClienteId] = useState<number | "">("");
  const [filterFechaDesde, setFilterFechaDesde] = useState("");
  const [filterFechaHasta, setFilterFechaHasta] = useState("");
  const [filterTotalMin, setFilterTotalMin] = useState<number | "">("");
  const [filterTotalMax, setFilterTotalMax] = useState<number | "">("");

  const userId = localStorage.getItem("userId");
  const isVendedor = userId === "1";

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("No hay usuario en sesión");
      return;
    }

    setLoading(true);

    const url = getPedidosUrl(userId);

    axios
      .get<Pedido[]>(url)
      .then((res) => {
        setPedidos(res.data);
        setFilteredPedidos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar pedidos:", err);
        setError("Error al cargar pedidos. Inténtalo de nuevo más tarde.");
        setLoading(false);
      });
  }, [userId]);

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    let filtered = pedidos;

    if (filterEstado) {
      filtered = filtered.filter(p =>
        p.estado.toLowerCase().includes(filterEstado.toLowerCase())
      );
    }

    if (filterClienteId !== "") {
      filtered = filtered.filter(p => p.cliente_id === filterClienteId);
    }

    if (filterFechaDesde) {
      const fechaDesde = new Date(filterFechaDesde);
      filtered = filtered.filter(p => new Date(p.fecha_pedido) >= fechaDesde);
    }

    if (filterFechaHasta) {
      const fechaHasta = new Date(filterFechaHasta);
      fechaHasta.setHours(23, 59, 59, 999);
      filtered = filtered.filter(p => new Date(p.fecha_pedido) <= fechaHasta);
    }

    if (filterTotalMin !== "") {
      filtered = filtered.filter(p => p.total >= filterTotalMin);
    }

    if (filterTotalMax !== "") {
      filtered = filtered.filter(p => p.total <= filterTotalMax);
    }

    setFilteredPedidos(filtered);
  }, [pedidos, filterEstado, filterClienteId, filterFechaDesde, filterFechaHasta, filterTotalMin, filterTotalMax]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Limpiar filtros
  const clearFilters = () => {
    setFilterEstado("");
    setFilterClienteId("");
    setFilterFechaDesde("");
    setFilterFechaHasta("");
    setFilterTotalMin("");
    setFilterTotalMax("");
  };

  const handleDelete = async (id: number) => {
    if (!isVendedor) return;
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirm === null) return;
    try {
      await axios.delete(`http://localhost:8000/pedidos/${deleteConfirm}`);
      setPedidos(pedidos.filter((p) => p.id_pedido !== deleteConfirm));
      showToast("Pedido eliminado correctamente", "success");
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
      showToast("Error al eliminar pedido. Inténtalo de nuevo.", "error");
    }
    setDeleteConfirm(null);
  };

  const handleStatusChange = (pedidoId: number, nuevoEstado: string) => {
    setPedidos(prev =>
      prev.map(p =>
        p.id_pedido === pedidoId ? { ...p, estado: nuevoEstado } : p
      )
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ background: '#fafad2', padding: '32px 0 16px 0', marginBottom: 24, borderRadius: 16, textAlign: 'center' }}>
        <h1 style={{ color: '#054d25', fontWeight: 700, fontSize: 40, margin: 0 }}>Pedidos</h1>
      </div>

      {error && (
        <div style={{
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳ Cargando pedidos...</div>
        </div>
      ) : pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>📦 No tienes pedidos yet</div>
        </div>
      ) : (
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
              {/* Filtro por Estado */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                  Estado
                </label>
                <input
                  type="text"
                  placeholder="Buscar por estado..."
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Filtro por Cliente ID (solo para vendedores) */}
              {isVendedor && (
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
              )}

              {/* Filtro por Fecha Desde */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={filterFechaDesde}
                  onChange={(e) => setFilterFechaDesde(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Filtro por Fecha Hasta */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={filterFechaHasta}
                  onChange={(e) => setFilterFechaHasta(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Filtro por Total Mínimo */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                  Total Mínimo
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Mínimo..."
                  value={filterTotalMin}
                  onChange={(e) => setFilterTotalMin(e.target.value === "" ? "" : Number(e.target.value))}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Filtro por Total Máximo */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                  Total Máximo
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Máximo..."
                  value={filterTotalMax}
                  onChange={(e) => setFilterTotalMax(e.target.value === "" ? "" : Number(e.target.value))}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="btn-delete"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              Limpiar filtros
            </button>

            <p style={{ margin: '12px 0 0 0', color: '#666', fontSize: '14px' }}>
              Mostrando {filteredPedidos.length} de {pedidos.length} pedidos
            </p>
          </div>

          <div className="panel-scroll">
            {filteredPedidos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No hay pedidos que coincidan con los filtros
              </div>
            ) : (
              <>
          {filteredPedidos.map((pedido) => (
            <motion.div
              key={pedido.id_pedido}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`pedido-card ${pedido.estado.toLowerCase().replace(' ', '-')}`}
              style={{ marginBottom: '20px' }}
            >
              <PedidoTimeline
                pedidoId={pedido.id_pedido}
                estado={pedido.estado}
                fechaPedido={pedido.fecha_pedido}
                total={pedido.total}
                onStatusChange={(nuevoEstado) =>
                  handleStatusChange(pedido.id_pedido, nuevoEstado)
                }
                canEditStatus={isVendedor}
              />

              {/* Acciones adicionales */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #ddd',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
              }}>
                <button
                  className="action-button btn-status-quick"
                  onClick={() => setSelectedPedidoId(pedido.id_pedido)}
                  style={{
                    background: '#3498db',
                    color: 'white',
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  👁️ Ver Detalles
                </button>

                {isVendedor && (
                  <button
                    className="action-button btn-delete"
                    onClick={() => handleDelete(pedido.id_pedido)}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      padding: '10px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            </motion.div>
          ))}
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Eliminar pedido"
        message="¿Seguro que deseas eliminar este pedido? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </motion.div>
  );
}

export default Pedidos;