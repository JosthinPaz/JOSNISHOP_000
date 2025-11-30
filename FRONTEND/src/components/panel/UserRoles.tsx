import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "../../contexts/useToastContext";

type Usuario = {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol_id: number;
  estado: number;
};

const getRoleName = (roleId: number | undefined): string => {
  switch (roleId) {
    case 1:
      return 'Vendedor';
    case 2:
      return 'Cliente';
    default:
      return 'Sin rol';
  }
};

const getRoleBadgeClass = (roleId: number | undefined): string => {
  switch (roleId) {
    case 1:
      return 'vendedor';
    case 2:
      return 'cliente';
    default:
      return 'no-role';
  }
};

const UserRoles: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
  const { showToast } = useToast();

  // Estados para los filtros
  const [filterNombre, setFilterNombre] = useState("");
  const [filterCorreo, setFilterCorreo] = useState("");
  const [filterRoles, setFilterRoles] = useState<number[]>([]);
  const [filterEstados, setFilterEstados] = useState<number[]>([]);

  const load = useCallback(async () => {
    try {
      const u = await axios.get<Usuario[]>("http://localhost:8000/usuarios");
      const usersWithFixedState = u.data.map(user => ({
        ...user,
        estado: user.estado
      }));
      setUsers(usersWithFixedState);
      setFilteredUsers(usersWithFixedState);
    } catch (err) {
      console.error(err);
      showToast("Error cargando usuarios", "error");
    }
  }, [showToast]);

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    let filtered = users;

    if (filterNombre) {
      filtered = filtered.filter(u =>
        u.nombre.toLowerCase().includes(filterNombre.toLowerCase())
      );
    }

    if (filterCorreo) {
      filtered = filtered.filter(u =>
        u.correo.toLowerCase().includes(filterCorreo.toLowerCase())
      );
    }

    if (filterRoles.length > 0) {
      filtered = filtered.filter(u => filterRoles.includes(u.rol_id));
    }

    if (filterEstados.length > 0) {
      filtered = filtered.filter(u => filterEstados.includes(u.estado));
    }

    setFilteredUsers(filtered);
  }, [users, filterNombre, filterCorreo, filterRoles, filterEstados]);

  // Cargar datos inicialmente
  useEffect(() => {
    load();
  }, [load]);

  // Ejecutar filtros cuando cambie alguno
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleChangeRole = async (userId: number, rolId: number) => {
    setPendingChange({ userId, rolId });
  };

  const [pendingChange, setPendingChange] = useState<{ userId: number; rolId: number } | null>(null);

  const confirmChange = async () => {
    if (!pendingChange) return;
      try {
      await axios.put(`http://localhost:8000/usuarios/${pendingChange.userId}`, {
        rol_id: pendingChange.rolId
      });
      setPendingChange(null);
      load();
    } catch (err) {
      console.error(err);
      showToast('Error actualizando rol', 'error');
    }
  };

  const cancelChange = () => setPendingChange(null);

  // Toggle para seleccionar múltiples roles
  const toggleRoleFilter = (rolId: number) => {
    setFilterRoles(prev =>
      prev.includes(rolId) ? prev.filter(r => r !== rolId) : [...prev, rolId]
    );
  };

  // Toggle para seleccionar múltiples estados
  const toggleEstadoFilter = (estado: number) => {
    setFilterEstados(prev =>
      prev.includes(estado) ? prev.filter(e => e !== estado) : [...prev, estado]
    );
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilterNombre("");
    setFilterCorreo("");
    setFilterRoles([]);
    setFilterEstados([]);
  };

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const generatedAt = new Date();
    const generatedAtStr = generatedAt.toLocaleString();
    const title = 'Reporte de Usuarios';
    const mensaje = `Estimado administrador:\n\nAdjunto encontrará la lista de usuarios registrados en JosniShop con sus roles y estado actual. Use este reporte para tareas de auditoría, control y gestión de usuarios.\n\nGracias por mantener la plataforma segura y organizada.`;

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
      if (filteredUsers.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay usuarios para mostrar.', 40, startY);
      } else {
        const headers = [["ID", "Nombre", "Correo", "Rol", "Estado"]];
        const rows = filteredUsers.map(u => [u.id_usuario, u.nombre, u.correo, getRoleName(u.rol_id), u.estado ? 'Activo' : 'Inactivo']);
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

      doc.save('reporte_usuarios.pdf');
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
      {/* Título centrado como Categorías */}
      <div style={{ background: '#fafad2', padding: '32px 0 16px 0', marginBottom: 24, borderRadius: 16, textAlign: 'center' }}>
        <h1 style={{ color: '#054d25', fontWeight: 700, fontSize: 40, margin: 0 }}>Usuarios</h1>
      </div>
      <div className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Lista de usuarios</h2>
            <p style={{ margin: '6px 0 0 0', color: '#666' }}>Solo vendedores pueden ver y cambiar roles</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
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
            {/* Filtro por Nombre */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                Nombre
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={filterNombre}
                onChange={(e) => setFilterNombre(e.target.value)}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Filtro por Correo */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333' }}>
                Correo
              </label>
              <input
                type="text"
                placeholder="Buscar por correo..."
                value={filterCorreo}
                onChange={(e) => setFilterCorreo(e.target.value)}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Filtro por Rol */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Rol
              </label>
              <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterRoles.includes(1)}
                    onChange={() => toggleRoleFilter(1)}
                  />
                  <span>Vendedor</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterRoles.includes(2)}
                    onChange={() => toggleRoleFilter(2)}
                  />
                  <span>Cliente</span>
                </label>
              </div>
            </div>

            {/* Filtro por Estado */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Estado
              </label>
              <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterEstados.includes(1)}
                    onChange={() => toggleEstadoFilter(1)}
                  />
                  <span>Activo</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterEstados.includes(0)}
                    onChange={() => toggleEstadoFilter(0)}
                  />
                  <span>Inactivo</span>
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
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </p>
        </div>

        <div className="table-container">
          <div style={{ padding: 8 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id_usuario}>
                    <td>{u.id_usuario}</td>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(u.rol_id)}`}>
                        {getRoleName(u.rol_id)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.estado === 1 ? 'active' : 'inactive'}`}>
                        {u.estado === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="form-input" 
                        value={u.rol_id || ''} 
                        onChange={e => handleChangeRole(u.id_usuario, Number(e.target.value))}
                        style={{ minWidth: '120px' }}
                      >
                        <option value="">Seleccionar rol</option>
                        <option value="1">Vendedor</option>
                        <option value="2">Cliente</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {pendingChange && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirmar cambio de rol</h2>
            <p>¿Deseas cambiar el rol de este usuario?</p>
            <div className="modal-buttons">
              <button className="btn-save" onClick={confirmChange}>Confirmar</button>
              <button className="btn-delete" onClick={cancelChange}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoles;
