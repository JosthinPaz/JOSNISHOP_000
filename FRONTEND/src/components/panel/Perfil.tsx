import React, { useEffect, useState } from "react";
import axios from "axios";
// Iconos de lucide-react
import { Edit2, Save, X, Eye, EyeOff, XCircle } from "lucide-react";
import '../../assets/css/Perfil.css';
import { useToast } from "../../contexts/useToastContext";
import ConfirmModal from "../ConfirmModal";

// Interfaz que representa el usuario que devuelve el backend
interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: {
    id_rol: number;
    nombre: string;
  };
  foto_perfil?: Array<{
    id: number;
    url: string;
    fecha_subida: string;
    tipo: string;
  }>;
}

const Perfil: React.FC = () => {
  // Estado del usuario
  const [user, setUser] = useState<Usuario | null>(null);
  // Estado de carga
  const [loading, setLoading] = useState(true);
  // Estado de edición (true = formulario editable)
  const [editMode, setEditMode] = useState(false);
  // Estado del formulario para actualizar datos
  const [form, setForm] = useState({ nombre: "", correo: "", contraseña: "" });
  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  // Toast
  const { showToast } = useToast();
  // Confirmación
  const [deactivateStep, setDeactivateStep] = useState<0 | 1 | 2>(0);
  // Estados para foto de perfil
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string | null>(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  // useEffect que carga los datos del usuario al montar el componente
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Se obtiene el ID guardado en localStorage (cuando hizo login)
    if (!userId) {
      console.error("No hay usuario logueado");
      setLoading(false);
      return;
    }

    // Petición al backend para obtener los datos del usuario
    axios
      .get<Usuario>(`http://localhost:8000/usuarios/${userId}`)
      .then((res) => {
        // Guardamos el usuario en el estado
        setUser(res.data);
        // Llenamos el formulario inicial con los datos recibidos
        setForm({
          nombre: res.data.nombre,
          correo: res.data.correo,
          contraseña: "", // La contraseña nunca se muestra
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener usuario:", err);
        setLoading(false);
      });
  }, []);

  // useEffect para cargar la foto de perfil desde el backend
  useEffect(() => {
    if (!user) return;
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .get<Usuario>(`http://localhost:8000/usuarios/${userId}`)
      .then((res) => {
        // Buscar si hay una foto de perfil en los videos
        if (res.data.foto_perfil && res.data.foto_perfil.length > 0) {
          const foto = res.data.foto_perfil[res.data.foto_perfil.length - 1];
          setFotoPerfilUrl(foto.url);
        }
      })
      .catch((err) => {
        console.error("Error al cargar foto de perfil:", err);
      });
  }, [user]);

  // Maneja cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja la selección de imagen de perfil
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona una imagen válida', 'error');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen no puede superar 5MB', 'error');
      return;
    }

    setProfileImageFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Sube la imagen de perfil al servidor
  const handleUploadProfileImage = async () => {
    if (!profileImageFile || !user) {
      showToast('Por favor selecciona una imagen', 'error');
      return;
    }

    setUploadingProfile(true);
    try {
      const formData = new FormData();
      formData.append('file', profileImageFile);

      const response = await axios.post<{ success: boolean; message: string; url: string }>(
        `http://localhost:8000/usuarios/${user.id_usuario}/upload-perfil`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Normalize to absolute URL (backend serves at http://localhost:8000)
      const rawUrl = response.data.url || '';
      const fullUrl = rawUrl.startsWith('http') ? rawUrl : `http://localhost:8000${rawUrl}`;
      setFotoPerfilUrl(fullUrl);
      // persist avatar URL so other parts of the app can use it
      try {
        localStorage.setItem('userAvatar', fullUrl);
      } catch (e) {
        // ignore
      }
      // notify other components (Panel) that avatar changed
      try {
        window.dispatchEvent(new CustomEvent('avatarChanged', { detail: { url: fullUrl } }));
      } catch (e) {
        // ignore
      }
      setProfileImageFile(null);
      setProfileImagePreview(null);
      showToast('✅ Foto de perfil actualizada correctamente', 'success');
    } catch (err) {
      console.error('Error al subir foto de perfil:', err);
      showToast('Error al subir la foto de perfil', 'error');
    } finally {
      setUploadingProfile(false);
    }
  };

  // Cancela la subida de imagen
  const handleCancelProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
  };

  // Maneja la actualización del perfil
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene recarga
    // Validación de contraseña: si se ingresó una nueva, debe cumplir requisitos
    const validatePassword = (pwd: string) => {
      const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'".,<>\/\\?\\|`~]).{8,}$/;
      return re.test(pwd);
    };
    if (form.contraseña && !validatePassword(form.contraseña)) {
      showToast('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.', 'error');
      return;
    }
    try {
      // PUT al backend con los datos actualizados
      await axios.put(`http://localhost:8000/usuarios/${user?.id_usuario}`, form);

      // Salimos de modo edición
      setEditMode(false);
      // Mostramos alerta de éxito
      showToast('Perfil actualizado correctamente.', 'success');

      // Refrescamos los datos del usuario para mostrar lo más nuevo
      const res = await axios.get<Usuario>(`http://localhost:8000/usuarios/${user?.id_usuario}`);
      setUser(res.data);
    } catch {
      // Mostramos alerta de error si falla la actualización
      showToast('Error al actualizar usuario.', 'error');
    }
  };

  // Maneja la desactivación de la cuenta
  const handleDeactivateAccount = async () => {
    if (!user) return;
    setDeactivateStep(1);
  };

  const confirmDeactivate = async () => {
    if (!user) return;
    setDeactivateStep(2);
  };

  const finalizeDeactivate = async () => {
    if (!user) return;
    try {
      await axios.put(`http://localhost:8000/usuarios/${user.id_usuario}/desactivar`);
      localStorage.clear();
      showToast('Cuenta desactivada correctamente. ¡Esperamos verte pronto de vuelta!', 'success');
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch {
      showToast('Error al desactivar la cuenta.', 'error');
      setDeactivateStep(0);
    }
  };

  // Vista
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading ? (
        // Caso cargando
        <div className="perfil-card perfil-loading">
          <div className="perfil-spinner"></div>
          <span>Cargando perfil...</span>
        </div>
      ) : !user ? (
        // Caso no hay usuario
        <div className="perfil-card perfil-error">
          <XCircle color="#e53e3e" size={32} />
          <span>No se encontró información del usuario</span>
        </div>
      ) : (
        // Caso mostrar perfil
        <div className="perfil-card animate-fadein">
          {/* Bienvenida */}
          <h2 className="perfil-title" style={{textAlign:'center', marginBottom: '0.5rem'}}>
            ¡Bienvenido, <span style={{color:'#645853ff'}}>{user.nombre.split(' ')[0]}</span>!
          </h2>
          <p style={{textAlign:'center', color:'#888', marginBottom:'1.5rem', fontSize:'1.1rem'}}>
            Gestiona y personaliza tu información de usuario
          </p>

          {/* Modo vista */}
          {!editMode ? (
            <div className="perfil-info" style={{alignItems:'center'}}>
              {/* Avatar con foto de perfil o iniciales */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div className="perfil-avatar perfil-avatar-xl" style={{
                  backgroundImage: fotoPerfilUrl ? `url(${fotoPerfilUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: fotoPerfilUrl ? 'block' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!fotoPerfilUrl && user.nombre && (
                    <span>
                      {user.nombre
                        .split(" ")
                        .map(n => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                {/* Botón para cambiar foto (ícono de cámara) */}
                <label style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '40px',
                  height: '40px',
                  background: '#27ae60',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '3px solid white',
                  transition: 'background 0.2s'
                }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#219150')}
                  onMouseOut={(e) => (e.currentTarget.style.background = '#27ae60')}
                  title="Cambiar foto de perfil"
                >
                  <span style={{ fontSize: '20px' }}>📷</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Preview y controles de foto si se seleccionó una */}
              {profileImagePreview && (
                <div style={{
                  marginBottom: '16px',
                  padding: '12px',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                  textAlign: 'center',
                  borderLeft: '4px solid #27ae60'
                }}>
                  <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '14px' }}>
                    Preview de nueva foto:
                  </p>
                  <img src={profileImagePreview} alt="Preview" style={{
                    maxWidth: '150px',
                    maxHeight: '150px',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }} />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={handleUploadProfileImage}
                      disabled={uploadingProfile}
                      style={{
                        background: '#27ae60',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontWeight: 'bold',
                        cursor: uploadingProfile ? 'not-allowed' : 'pointer',
                        opacity: uploadingProfile ? 0.6 : 1
                      }}
                    >
                      {uploadingProfile ? '⏳ Subiendo...' : '✅ Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelProfileImage}
                      disabled={uploadingProfile}
                      style={{
                        background: '#e0e0e0',
                        color: '#333',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontWeight: 'bold',
                        cursor: uploadingProfile ? 'not-allowed' : 'pointer',
                        opacity: uploadingProfile ? 0.6 : 1
                      }}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Datos */}
              <div className="perfil-datos perfil-datos-center">
                <p><span className="perfil-label">Nombre:</span> {user.nombre}</p>
                <p><span className="perfil-label">Correo:</span> {user.correo}</p>
              </div>
              {/* Botón editar */}
              <button className="perfil-btn-edit perfil-action-btn" onClick={() => setEditMode(true)}>
                <Edit2 size={18} /> Editar
              </button>
            </div>
          ) : (
            // Modo edición (formulario)
            <form className="perfil-form animate-fadein" onSubmit={handleUpdate}>
              <label>
                Nombre
                <input name="nombre" value={form.nombre} onChange={handleChange} required autoFocus />
              </label>
              <label>
                Correo
                <input name="correo" value={form.correo} onChange={handleChange} type="email" required />
              </label>
              <label className="perfil-label-password">
                Nueva contraseña
                <div className="perfil-password-wrapper">
                  <input
                    name="contraseña"
                    value={form.contraseña}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Nueva contraseña"
                    className="perfil-input-password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="perfil-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={0}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </label>
              {/* Botones de acción */}
              <div className="perfil-form-actions">
                <button className="perfil-btn-save perfil-action-btn" type="submit">
                  <Save size={18} /> Guardar
                </button>
                <button className="perfil-btn-cancel perfil-action-btn" type="button" onClick={() => setEditMode(false)}>
                  <X size={18} /> Cancelar
                </button>
              </div>
            </form>
          )}
          {/* Botón eliminar cuenta */}
          <div className="perfil-delete-account">
            <button
              className="perfil-btn-delete perfil-action-btn"
              onClick={handleDeactivateAccount}
            >
              Desactivar cuenta
            </button>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={deactivateStep === 1}
        title="Desactivar tu cuenta"
        message="¿Estás seguro de que deseas desactivar tu cuenta? No podrás iniciar sesión hasta reactivarla."
        confirmText="Sí, continuar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={confirmDeactivate}
        onCancel={() => setDeactivateStep(0)}
      />
      <ConfirmModal
        isOpen={deactivateStep === 2}
        title="Confirmar desactivación"
        message="¡Atención! Desactivar tu cuenta la dejará inactiva, pero tus datos y pedidos se conservarán. ¿Realmente deseas continuar?"
        confirmText="Desactivar cuenta"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={finalizeDeactivate}
        onCancel={() => setDeactivateStep(0)}
      />
    </div>
  );
};

export default Perfil;
