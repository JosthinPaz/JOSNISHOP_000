import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // <-- Agrega esto
import "../assets/css/register.css";
import video from "../assets/IMG/inicio_video.mp4";
import { useToast } from "../contexts/useToastContext";

const Registro: React.FC = () => {
  const SECRET_KEY = "Josnishop el mejor";
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "",
    password: "",
    confirmPassword: "",
  });
  // Añadimos nuevos campos solicitados: tipo/numero de documento, fecha de nacimiento y pregunta de seguridad
  const [extra, setExtra] = useState({
    tipo_documento: "",
    numero_documento: "",
    fecha_nacimiento: "",
    seguridad_pregunta: "",
    seguridad_respuesta: "",
    customQuestion: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExtraChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setExtra({ ...extra, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Verificar campos obligatorios (todos deben completarse)
    if (!formData.nombre || !formData.email || !formData.rol || !formData.password || !formData.confirmPassword) {
      setError("Por favor completa todos los campos personales obligatorios.");
      return;
    }

    // Validación de campos adicionales
    if (!extra.tipo_documento || !extra.numero_documento || !extra.fecha_nacimiento) {
      setError("Por favor completa los datos adicionales de documento y fecha de nacimiento.");
      return;
    }

    if (!extra.seguridad_pregunta) {
      setError("Selecciona una pregunta de seguridad.");
      return;
    }
    if (extra.seguridad_pregunta === 'Otro' && !extra.customQuestion) {
      setError("Escribe tu pregunta de seguridad personalizada.");
      return;
    }
    if (!extra.seguridad_respuesta) {
      setError("Por favor ingresa la respuesta de seguridad.");
      return;
    }

    if (!acceptedTerms) {
      setError("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    // Validación de contraseña: mínimo 8 caracteres, una mayúscula, un número y un símbolo
    const validatePassword = (pwd: string) => {
      const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'".,<>\\/?\\|`~]).{8,}$/;
      return re.test(pwd);
    };
    if (!validatePassword(formData.password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un símbolo."
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Determinar el rol_id según la selección
    let rol_id = 1;
    if (formData.rol === "cliente") {
      rol_id = 2;
    }

    // Enviar la respuesta de seguridad en texto plano para que el backend la hashee con bcrypt
    try {
      const preguntaToSend = extra.seguridad_pregunta === 'Otro' ? extra.customQuestion : extra.seguridad_pregunta;
      const respuestaToSend = String(extra.seguridad_respuesta).trim();

      const res = await fetch("http://localhost:8000/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.email,
          contraseña: formData.password,
          rol_id: rol_id,
          tipo_documento: extra.tipo_documento,
          numero_documento: extra.numero_documento,
          fecha_nacimiento: extra.fecha_nacimiento,
          seguridad_pregunta: preguntaToSend,
          seguridad_respuesta: respuestaToSend,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Usuario registrado correctamente");
        setFormData({
          nombre: "",
          email: "",
          rol: "",
          password: "",
          confirmPassword: "",
        });
        setExtra({
          tipo_documento: "",
          numero_documento: "",
          fecha_nacimiento: "",
          seguridad_pregunta: "",
          seguridad_respuesta: "",
          customQuestion: "",
        });
        // Mostrar toast y luego redirigir
        showToast("¡Registro exitoso! Redirigiendo al login...", "success");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast(data.detail || "Error al registrar usuario", "error");
        setError(data.detail || "Error al registrar usuario");
      }
    } catch (err) {
      console.error(err);
      showToast("Error al registrar usuario", "error");
      setError("Error al registrar usuario");
    }
  };

  return (
    <div className="registro-container">
      {/* Sección derecha: formulario */}
      <div className="registro-right">
        <div className="registro-logo">
          <img src="/logo.png" alt="Logo JOSNISHOP" />
        </div>
        <h1>Regístrate</h1>

        <form id="registerForm" onSubmit={handleRegister}>
          <label htmlFor="nombre">
            Nombre <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Tu nombre completo"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="registro-input-field"
          />

          <label htmlFor="email">
            Correo Electrónico <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="ejemplo@correo.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="registro-input-field"
          />

          <label htmlFor="rol">
            Rol <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="rol"
            name="rol"
            required
            value={formData.rol}
            onChange={handleChange}
            className="registro-input-field"
          >
            <option value="" disabled>
              Selecciona tu rol
            </option>
            <option value="cliente">Cliente</option>
          </select>

          <label htmlFor="password">
            Contraseña <span style={{ color: "red" }}>*</span>
          </label>
          <div className="registro-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Crea una contraseña"
              required
              value={formData.password}
              onChange={handleChange}
              className="registro-input-field"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="registro-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={0}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <label htmlFor="confirmPassword">
            Confirmar contraseña <span style={{ color: "red" }}>*</span>
          </label>
          <div className="registro-password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repite la contraseña"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="registro-input-field"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="registro-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={0}
              aria-label={
                showConfirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>


          <h3>Datos adicionales</h3>
          <label htmlFor="tipo_documento">Tipo de documento <span style={{ color: 'red' }}>*</span></label>
          <select id="tipo_documento" name="tipo_documento" value={extra.tipo_documento} onChange={handleExtraChange} className="registro-input-field" required>
            <option value="">Selecciona</option>
            <option value="CC">Cédula de ciudadanía (CC)</option>
            <option value="TI">Tarjeta de identidad (TI)</option>
            <option value="CE">Cédula de extranjería (CE)</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="NIT">NIT</option>
          </select>

          <label htmlFor="numero_documento">Número de documento <span style={{ color: 'red' }}>*</span></label>
          <input id="numero_documento" name="numero_documento" value={extra.numero_documento} onChange={handleExtraChange} className="registro-input-field" required />

          <label htmlFor="fecha_nacimiento">Fecha de nacimiento <span style={{ color: 'red' }}>*</span></label>
          <input id="fecha_nacimiento" name="fecha_nacimiento" type="date" value={extra.fecha_nacimiento} onChange={handleExtraChange} className="registro-input-field" required />

          <label htmlFor="seguridad_pregunta">Pregunta de seguridad</label>
          <select id="seguridad_pregunta" name="seguridad_pregunta" value={extra.seguridad_pregunta} onChange={handleExtraChange} className="registro-input-field" required>
            <option value="">Selecciona una pregunta</option>
            <option value="Nombre de tu primera mascota">Nombre de tu primera mascota</option>
            <option value="Ciudad de nacimiento">Ciudad de nacimiento</option>
            <option value="Nombre de la escuela primaria">Nombre de la escuela primaria</option>
            <option value="Nombre de tu madre">Nombre de tu madre</option>
            <option value="Color favorito">Color favorito</option>
            <option value="Nombre del primer profesor">Nombre del primer profesor</option>
            <option value="Otro">Otro (escribe tu propia pregunta)</option>
          </select>

          {extra.seguridad_pregunta === 'Otro' && (
            <>
              <label htmlFor="customQuestion">Escribe tu pregunta</label>
              <input id="customQuestion" name="customQuestion" value={extra.customQuestion} onChange={handleExtraChange} className="registro-input-field" required />
            </>
          )}

          <label htmlFor="seguridad_respuesta">Respuesta de seguridad <span style={{ color: 'red' }}>*</span></label>
          <input id="seguridad_respuesta" name="seguridad_respuesta" value={extra.seguridad_respuesta} onChange={handleExtraChange} className="registro-input-field" required />

          <div className="registro-terms-container" style={{ marginTop: 12 }}>
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptedTerms}
              onChange={handleCheckboxChange}
              required
            />
            <label htmlFor="acceptTerms">
              <span style={{ color: "red" }}>*</span> Acepto los{" "}
              <a
                href="#"
                className="registro-link-link"
                style={{
                  color: "#1ebc7c",
                  textDecoration: "underline",
                  fontWeight: 500,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                Términos y Condiciones y Política de Privacidad
              </a>
            </label>
          </div>

          {error && <div className="registro-error-message">{error}</div>}
          {success && <div className="registro-success-message">{success}</div>}
          <br />
          <br />
          <p className="registro-link">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión.</Link>
          </p>

          <button type="submit" id="registerBtn">
            Continuar
          </button>
        </form>
      </div>

      {/* Sección izquierda: video */}
      <div className="registro-left">
        <div className="registro-gallery">
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="registro-video"
          ></video>
        </div>
      </div>

      {showModal && (
        <div className="registro-modal-overlay">
          <div className="registro-modal-content">
            <h2>Términos y Condiciones & Política de Privacidad</h2>
            <p>
              Bienvenido a JOSNISHOP. Al registrarte, aceptas que tus datos
              personales serán tratados conforme a la Ley de Protección de Datos
              Personales. Tus datos serán utilizados únicamente para gestionar tu
              cuenta, procesar pedidos y enviarte información relevante sobre
              nuestros productos y servicios.
            </p>
            <p>
              <strong>Política de privacidad:</strong> No compartiremos tu
              información con terceros sin tu consentimiento. Puedes solicitar la
              eliminación de tus datos en cualquier momento.
            </p>
            <p>
              <strong>Consentimiento informado:</strong> Al continuar, autorizas el
              tratamiento de tus datos para fines comerciales y administrativos de
              JOSNISHOP.
            </p>
            <button
              className="registro-close-modal"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registro;