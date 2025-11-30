import React, { useState } from 'react';
import '../../assets/css/pedido-timeline.css';
import { useToast } from '../../contexts/useToastContext';
import axios from 'axios';

interface PedidoTimelineProps {
  pedidoId: number;
  estado: string;
  fechaPedido: string;
  total: number;
  onStatusChange: (nuevoEstado: string) => void;
  canEditStatus: boolean;
}

const PedidoTimeline: React.FC<PedidoTimelineProps> = ({
  pedidoId,
  estado,
  fechaPedido,
  total,
  onStatusChange,
  canEditStatus,
}) => {
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Estados posibles en orden
  const estadosPosibles = [
    { id: 0, nombre: 'Procesando', icono: '⏳', color: 'procesando' },
    { id: 1, nombre: 'Enviado', icono: '📦', color: 'enviado' },
    { id: 2, nombre: 'En Tránsito', icono: '🚚', color: 'en-transito' },
    { id: 3, nombre: 'Entregado', icono: '✓', color: 'entregado' },
  ];

  // Encontrar el índice del estado actual
  const estadoActualIndex = estadosPosibles.findIndex(
    (e) => e.nombre.toLowerCase() === estado.toLowerCase()
  );

  // Función para cambiar al siguiente estado
  const cambiarAlSiguienteEstado = async () => {
    if (estadoActualIndex >= estadosPosibles.length - 1) {
      showToast('El pedido ya está en el estado final', 'info');
      return;
    }

    const nuevoEstado = estadosPosibles[estadoActualIndex + 1];
    await actualizarEstado(nuevoEstado.nombre);
  };

  // Función para cambiar a un estado específico
  const cambiarAEstado = async (nuevoEstado: string) => {
    await actualizarEstado(nuevoEstado);
  };

  // Actualizar estado en el backend
  const actualizarEstado = async (nuevoEstado: string) => {
    if (!canEditStatus) {
      showToast('No tienes permisos para cambiar el estado', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      await axios.put(`http://localhost:8000/pedidos/${pedidoId}`, {
        estado: nuevoEstado,
      });
      onStatusChange(nuevoEstado);
      showToast(`Pedido actualizado a: ${nuevoEstado}`, 'success');
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      showToast('Error al actualizar el estado del pedido', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="pedido-timeline-container">
      {/* Header con ID y estado actual */}
      <div className="timeline-header">
        <h3>🎯 Rastreo de Pedido #{pedidoId}</h3>
        <span className={`timeline-status-badge ${estadosPosibles[estadoActualIndex]?.color}`}>
          {estado}
        </span>
      </div>

      {/* Información del Pedido */}
      <div className="pedido-info">
        <div className="info-item">
          <span className="info-label">Fecha de Pedido</span>
          <span className="info-value">{formatFecha(fechaPedido)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Total</span>
          <span className="info-value">$ {total.toLocaleString('es-CO')}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Progreso</span>
          <span className="info-value">
            {estadoActualIndex + 1} de {estadosPosibles.length} pasos
          </span>
        </div>
      </div>

      {/* Timeline Visual */}
      <div className="timeline">
        {estadosPosibles.map((step, index) => (
          <div
            key={step.id}
            className={`timeline-item ${
              index <= estadoActualIndex ? 'active' : ''
            } ${index < estadoActualIndex ? 'completed' : 'pending'}`}
          >
            <div
              className={`timeline-dot ${
                index <= estadoActualIndex ? 'active' : 'pending'
              } ${index < estadoActualIndex ? 'completed' : ''}`}
            >
              {index <= estadoActualIndex ? step.icono : '•'}
            </div>
            <div className="timeline-label">{step.nombre}</div>
          </div>
        ))}
      </div>

      {/* Acciones del Pedido */}
      <div className="pedido-actions">
        {canEditStatus && estadoActualIndex < estadosPosibles.length - 1 && (
          <button
            className="action-button btn-next"
            onClick={cambiarAlSiguienteEstado}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <span className="loading-spinner"></span>
                Actualizando...
              </>
            ) : (
              <>
                ➜ Ir a: {estadosPosibles[estadoActualIndex + 1]?.nombre}
              </>
            )}
          </button>
        )}

        {canEditStatus && estadoActualIndex === estadosPosibles.length - 1 && (
          <div style={{
            flex: 1,
            textAlign: 'center',
            padding: '12px',
            background: '#d4edda',
            borderRadius: '6px',
            color: '#155724',
            fontWeight: '600',
          }}>
            ✓ Pedido Completado
          </div>
        )}

        {canEditStatus && (
          <>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
              {estadosPosibles.map((step) => (
                <button
                  key={step.id}
                  className="action-button btn-status-quick"
                  onClick={() => cambiarAEstado(step.nombre)}
                  disabled={isUpdating || step.nombre.toLowerCase() === estado.toLowerCase()}
                >
                  {step.icono} {step.nombre}
                </button>
              ))}
            </div>
          </>
        )}

        {!canEditStatus && (
          <div style={{
            flex: 1,
            textAlign: 'center',
            padding: '12px',
            background: '#e2e3e5',
            borderRadius: '6px',
            color: '#383d41',
            fontWeight: '600',
          }}>
            Rastreo en tiempo real
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidoTimeline;
