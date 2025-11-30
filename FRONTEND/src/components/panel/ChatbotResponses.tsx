import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "../../contexts/useToastContext";

type Resp = {
  id: number;
  clave: string;
  respuesta: string;
  prioridad: number;
  enabled: boolean;
};

const ChatbotResponses: React.FC = () => {
  const [items, setItems] = useState<Resp[]>([]);
  const [filteredItems, setFilteredItems] = useState<Resp[]>([]);
  const [form, setForm] = useState({ clave: "", respuesta: "", prioridad: 0, enabled: true });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const { showToast } = useToast();

  // Estados para los filtros
  const [filterClave, setFilterClave] = useState("");
  const [filterRespuesta, setFilterRespuesta] = useState("");
  const [filterPrioridad, setFilterPrioridad] = useState<number | "">("");
  const [filterEnabled, setFilterEnabled] = useState<boolean | "">("");

  const load = useCallback(async () => {
    try {
      const res = await axios.get<Resp[]>("http://localhost:8000/bot/responses/");
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (e) {
      console.error(e);
      showToast("Error cargando respuestas (revisa backend)", "error");
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);
  const applyFilters = useCallback(() => {
    let filtered = items;

    if (filterClave) {
      filtered = filtered.filter(r =>
        r.clave.toLowerCase().includes(filterClave.toLowerCase())
      );
    }

    if (filterRespuesta) {
      filtered = filtered.filter(r =>
        r.respuesta.toLowerCase().includes(filterRespuesta.toLowerCase())
      );
    }

    if (filterPrioridad !== "") {
      filtered = filtered.filter(r => r.prioridad === filterPrioridad);
    }

    if (filterEnabled !== "") {
      filtered = filtered.filter(r => r.enabled === filterEnabled);
    }

    setFilteredItems(filtered);
  }, [items, filterClave, filterRespuesta, filterPrioridad, filterEnabled]);

  useEffect(() => { load(); }, [showToast]);

  // Ejecutar filtros cuando cambie alguno
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/bot/responses/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:8000/bot/responses/", form);
      }
      setForm({ clave: "", respuesta: "", prioridad: 0, enabled: true });
      load();
    } catch (err) {
      console.error(err);
      showToast("Error al guardar", "error");
    }
  };

  const handleEdit = (it: Resp) => {
    setEditingId(it.id);
    setForm({ clave: it.clave, respuesta: it.respuesta, prioridad: it.prioridad || 0, enabled: !!it.enabled });
  };

  const confirmDelete = (id: number) => {
    setDeleteTarget(id);
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`http://localhost:8000/bot/responses/${deleteTarget}`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar', 'error');
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ clave: "", respuesta: "", prioridad: 0, enabled: true });
    setShowModal(true);
  };

  const openEdit = (it: Resp) => {
    handleEdit(it);
    setShowModal(true);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilterClave("");
    setFilterRespuesta("");
    setFilterPrioridad("");
    setFilterEnabled("");
  };

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const generatedAt = new Date();
    const generatedAtStr = generatedAt.toLocaleString();
    const title = 'Reporte de Respuestas del Chatbot';
    const mensaje = `Estimado administrador:\n\nAdjunto se encuentra el listado de respuestas automáticas configuradas en JosniShop. Este documento facilita la revisión y gestión de las respuestas del bot para mejorar la experiencia del usuario.`;

    const render = () => {
      doc.setFontSize(20);
      doc.setTextColor('#1f618d');
      doc.text(title, 140, 50);
      doc.setFontSize(10);
      doc.setTextColor('#555');
      doc.text(`Generado: ${generatedAtStr}`, 140, 68);

      const mensajeLines = doc.splitTextToSize(mensaje, pageWidth - 80);
      doc.setFontSize(11);
      doc.setTextColor('#222');
      doc.text(mensajeLines, 40, 100);

      const startY = 120 + mensajeLines.length * 12;
      if (filteredItems.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay respuestas para mostrar.', 40, startY);
      } else {
        const headers = [["Clave", "Respuesta", "Prioridad", "Enabled"]];
        const rows = filteredItems.map(i => [i.clave, i.respuesta, String(i.prioridad), i.enabled ? 'Sí' : 'No']);
        autoTable(doc, {
          head: headers,
          body: rows,
          startY,
          styles: { fontSize: 10 },
          headStyles: { fillColor: '#27ae60', textColor: '#fff' },
          margin: { left: 40, right: 40 }
        });
      }

      doc.setFontSize(9);
      doc.setTextColor('#777');
      doc.text(`Última vista: ${generatedAtStr}`, 40, doc.internal.pageSize.getHeight() - 30);

      doc.save('respuestas_chatbot.pdf');
    };

    const img = new Image();
    img.src = '/logo.png';
    img.onload = () => {
      const imgWidth = 80;
      const imgHeight = (img.height / img.width) * imgWidth;
      try { doc.addImage(img, 'PNG', 40, 30, imgWidth, imgHeight); } catch (err) { console.warn('Logo add failed', err); }
      render();
    };
    img.onerror = () => { render(); };
  };

  return (
    <div>
      {/* Título grande y centrado */}
      <div style={{ background: '#fafad2', padding: '32px 0 16px 0', marginBottom: 24, borderRadius: 16, textAlign: 'center' }}>
        <h1 style={{ color: '#054d25', fontWeight: 700, fontSize: 40, margin: 0 }}>Respuestas del chatbot</h1>
      </div>
      <div className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Respuestas del chatbot</h2>
            <p style={{ margin: '6px 0 0 0', color: '#666' }}>Gestiona las respuestas automáticas del bot</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-add" onClick={openCreate}>Agregar respuesta</button>
            <button className="btn-save" onClick={downloadPdf}>Descargar PDF</button>
          </div>
        </div>

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
            {/* Filtro por Clave */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                Clave
              </label>
              <input
                type="text"
                placeholder="Buscar por clave..."
                value={filterClave}
                onChange={(e) => setFilterClave(e.target.value)}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Filtro por Respuesta */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                Respuesta
              </label>
              <input
                type="text"
                placeholder="Buscar por respuesta..."
                value={filterRespuesta}
                onChange={(e) => setFilterRespuesta(e.target.value)}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Filtro por Prioridad */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                Prioridad
              </label>
              <select
                value={filterPrioridad}
                onChange={(e) => setFilterPrioridad(e.target.value === "" ? "" : Number(e.target.value))}
                className="form-input"
                style={{ width: '100%' }}
              >
                <option value="">Todas</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            {/* Filtro por Enabled */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Estado
              </label>
              <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="enabled"
                    checked={filterEnabled === ""}
                    onChange={() => setFilterEnabled("")}
                  />
                  <span>Todos</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="enabled"
                    checked={filterEnabled === true}
                    onChange={() => setFilterEnabled(true)}
                  />
                  <span>Habilitado</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="enabled"
                    checked={filterEnabled === false}
                    onChange={() => setFilterEnabled(false)}
                  />
                  <span>Deshabilitado</span>
                </label>
              </div>
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
            Mostrando {filteredItems.length} de {items.length} respuestas
          </p>
        </div>

        <div className="table-container">
          <div style={{ padding: 8 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Clave</th>
                  <th>Respuesta</th>
                  <th>Prioridad</th>
                  <th>Enabled</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(it => (
                  <tr key={it.id}>
                    <td>{it.clave}</td>
                    <td style={{ whiteSpace: 'pre-wrap' }}>{it.respuesta}</td>
                    <td>{it.prioridad}</td>
                    <td>{it.enabled ? 'Sí' : 'No'}</td>
                    <td className="table-actions">
                      <button className="btn-edit" onClick={() => openEdit(it)}>Editar</button>
                      <button className="btn-delete" onClick={() => confirmDelete(it.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal create/edit */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{editingId ? 'Editar respuesta' : 'Crear respuesta'}</h2>
              <form onSubmit={async (e) => { e.preventDefault(); await handleSubmit(); setShowModal(false); }}>
                <label>Clave (palabra clave)</label>
                <input value={form.clave} onChange={e => setForm({ ...form, clave: e.target.value })} required style={{ marginBottom: 8 }} />

                <label>Respuesta</label>
                <textarea value={form.respuesta} onChange={e => setForm({ ...form, respuesta: e.target.value })} required
                  style={{ minHeight: 60, resize: 'vertical', width: '100%', borderRadius: 8, border: '1px solid #ccc', padding: 8, marginBottom: 8, fontFamily: 'inherit', fontSize: 16 }}
                />

                <label>Prioridad</label>
                <input type="number" value={form.prioridad} onChange={e => setForm({ ...form, prioridad: Number(e.target.value) })} style={{ marginBottom: 8 }} />

                <label style={{ marginTop: 8, marginBottom: 8 }}>
                  <input type="checkbox" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} /> Enabled
                </label>

                <div className="modal-buttons" style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                  <button className="btn-save" type="submit" style={{ flex: 1, minWidth: 120, fontSize: 18, borderRadius: 24 }}>{editingId ? 'Actualizar' : 'Crear'}</button>
                  <button type="button" className="btn-delete" style={{ flex: 1, minWidth: 120, fontSize: 18, borderRadius: 24 }} onClick={() => setShowModal(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal confirm delete */}
        {deleteTarget && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirmar eliminación</h2>
              <p>¿Estás seguro de eliminar esta respuesta?</p>
              <div className="modal-buttons">
                <button className="btn-delete" onClick={doDelete}>Eliminar</button>
                <button className="btn-save" onClick={() => setDeleteTarget(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotResponses;
