import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/pedido.css";
import { useToast } from "../../contexts/useToastContext";
import ConfirmModal from "../ConfirmModal";
import generateInvoicePDF from "../../utils/generateInvoice";

interface DetallePedido {
  id_detalle: number;
  id_pedido: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

interface Props {
  pedidoId: number;
  onBack: () => void; // <-- NUEVO
}

const Detalle: React.FC<Props> = ({ pedidoId, onBack }) => {
  const [detalles, setDetalles] = useState<DetallePedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DetallePedido>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [pedidoInfo, setPedidoInfo] = useState<any | null>(null);
  const { showToast } = useToast();

  // Obtener el rol del usuario
  const userId = localStorage.getItem("userId"); // ← obtiene el id del usuario

  // Solo el vendedor con id 1 puede editar/crear/eliminar
  const isVendedor = userId === "1";

  useEffect(() => {
    setLoading(true);
    axios
      .get<DetallePedido[]>(`http://localhost:8000/detalles_pedido/pedido/${pedidoId}`)
      .then((res) => {
        setDetalles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar detalles: " + (err?.message || ""));
        setLoading(false);
      });
    // fetch basic pedido info (fecha, total, cliente)
    axios.get(`http://localhost:8000/pedidos/${pedidoId}`)
      .then(r => setPedidoInfo(r.data))
      .catch(() => setPedidoInfo(null));
  }, [pedidoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/detalles_pedido/${editId}`, form);
      } else {
        await axios.post(`http://localhost:8000/detalles_pedido/`, { ...form, id_pedido: pedidoId });
      }
      // Refresca la lista
      const res = await axios.get<DetallePedido[]>(`http://localhost:8000/detalles_pedido/pedido/${pedidoId}`);
      setDetalles(res.data);
      setForm({});
      setEditId(null);
    } catch {
      setError("Error al guardar detalle");
    }
  };

  const handleEdit = (detalle: DetallePedido) => {
    setEditId(detalle.id_detalle);
    setForm(detalle);
  };

  const handleDelete = async (id: number) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirm === null) return;
    try {
      await axios.delete(`http://localhost:8000/detalles_pedido/${deleteConfirm}`);
      setDetalles(detalles.filter((d) => d.id_detalle !== deleteConfirm));
      showToast("Detalle eliminado correctamente", "success");
    } catch {
      showToast("Error al eliminar detalle", "error");
    }
    setDeleteConfirm(null);
  };
  

  return (
    <div className="detalle-container">
      <h2>Detalle del pedido #{pedidoId}</h2>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="detalle-table">
              <thead>
                <tr>
                  <th>ID Detalle</th>
                  <th>ID Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  {isVendedor && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle) => (
                  <tr key={detalle.id_detalle}>
                    <td>{detalle.id_detalle}</td>
                    <td>{detalle.producto_id}</td>
                    <td>{detalle.cantidad}</td>
                    <td>{detalle.precio_unitario}</td>
                    {isVendedor && (
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(detalle)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(detalle.id_detalle)}>Eliminar</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Solo el vendedor puede crear/editar detalles */}
          {isVendedor && (
            <form onSubmit={handleSubmit} className="detalle-form">
              <input
                name="producto_id"
                value={form.producto_id || ""}
                onChange={handleChange}
                placeholder="ID Producto"
                required
              />
              <input
                name="cantidad"
                type="number"
                value={form.cantidad || ""}
                onChange={handleChange}
                placeholder="Cantidad"
                required
              />
              <input
                name="precio_unitario"
                type="number"
                value={form.precio_unitario || ""}
                onChange={handleChange}
                placeholder="Precio Unitario"
                required
              />
              <button className="btn-save" type="submit">{editId ? "Actualizar" : "Crear"}</button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({});
                  }}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
              )}
            </form>
          )}
        </>
      )}
      <div className="actions-bottom">
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-back" onClick={onBack}>
              ← Volver a pedidos
            </button>

            <button
              className="btn-save"
              onClick={async () => {
                // prepare simple structures
                const pedido = pedidoInfo || { id_pedido: pedidoId, fecha_pedido: undefined, total: undefined, cliente: {} };
                const detallesSimple = detalles.map(d => ({
                  producto_id: (d as any).producto_id,
                  descripcion: (d as any).descripcion || (d as any).nombre || (d as any).producto_nombre || (d as any).title || `Producto #${(d as any).producto_id || ''}`,
                  cantidad: d.cantidad,
                  precio_unitario: d.precio_unitario
                }));

                // try to fetch logo from public root and convert to base64
                let logoBase64: string | undefined = undefined;
                try {
                  const resp = await fetch('/logo.png');
                  if (resp.ok) {
                    const blob = await resp.blob();
                    logoBase64 = await new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const result = reader.result as string;
                        resolve(result);
                      };
                      reader.onerror = reject;
                      reader.readAsDataURL(blob);
                    });
                  }
                } catch (e) {
                  console.warn('No se pudo cargar logo para la factura:', e);
                }

                generateInvoicePDF(pedido, detallesSimple, { nombre: 'JOSNISHOP', nit: '901414566-2', direccion: 'Calle 33 #28-73', telefono: '6455858', logoBase64 });
              }}
            >
              Descargar factura
            </button>
          </div>
      </div>
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Eliminar detalle"
        message="¿Seguro que deseas eliminar este detalle del pedido? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};

export default Detalle;