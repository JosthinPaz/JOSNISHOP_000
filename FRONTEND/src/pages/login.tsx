import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";
import { useToast } from "../contexts/useToastContext";
import ConfirmModal from "../components/ConfirmModal";

interface ReactivateData {
  id_usuario: number;
  [key: string]: string | number | boolean;
}

const Login: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [reactivateConfirm, setReactivateConfirm] = useState<{ show: boolean; data: ReactivateData | null }>({ show: false, data: null });
  const MAX_INTENTOS = 5;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleReactivate = async () => {
    if (!reactivateConfirm.data) return;
    
    try {
      const { API } = await import('../config/api');
      const reactiva = await fetch(`${API}/usuarios/${reactivateConfirm.data.id_usuario}/activar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      
      if (reactiva.ok) {
        const res2 = await fetch(`${API}/usuarios/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, contraseña }), 
        });
        const data2 = await res2.json();
        
        if (res2.ok) {
          showToast("¡Cuenta reactivada! Ingresando...", "success");
          if (data2.id_usuario) {
            localStorage.setItem("userId", data2.id_usuario.toString());
          }
          if (data2.nombre) {
            localStorage.setItem("userName", data2.nombre);
          }
          if (data2.correo) {
            localStorage.setItem("userEmail", data2.correo);
          }
          if (data2.rol) {
            let rol = data2.rol.toLowerCase();
            if (rol.includes("vend")) rol = "vendedor";
            if (rol.includes("clien")) rol = "cliente";
            localStorage.setItem("userRole", rol);
          } else {
            localStorage.removeItem("userRole");
          }
          localStorage.setItem("role", String(data2.rol_id));
          localStorage.setItem("token", data2.access_token ? data2.access_token : "logueado");
          setTimeout(() => navigate("/panel"), 1500);
        } else {
          showToast(data2.detail || "Error al iniciar sesión tras reactivar.", "error");
        }
      } else {
        showToast("No se pudo reactivar la cuenta. Contacta soporte.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error al reactivar la cuenta", "error");
    }
    
    setReactivateConfirm({ show: false, data: null });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (intentosFallidos >= MAX_INTENTOS) {
      showToast("Cuenta temporalmente bloqueada. Intenta más tarde.", "error");
      return;
    }
    try {
      const { API } = await import('../config/api');
      const res = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }), 
      });

      const data = await res.json();
      console.log("Respuesta completa:", data);

      if (data.estado === 0 || data.estado === false) {
        setReactivateConfirm({ show: true, data });
        return;
      }

      if (res.ok) {
        showToast("¡Inicio de sesión exitoso!", "success");
        setIntentosFallidos(0);
        if (data.id_usuario) {
          localStorage.setItem("userId", data.id_usuario.toString());
        }
        if (data.nombre) {
          localStorage.setItem("userName", data.nombre);
        }
        if (data.correo) {
          localStorage.setItem("userEmail", data.correo);
        }
        if (data.rol) {
          let rol = data.rol.toLowerCase();
          if (rol.includes("vend")) rol = "vendedor";
          if (rol.includes("clien")) rol = "cliente";
          localStorage.setItem("userRole", rol);
        } else {
          localStorage.removeItem("userRole");
        }
        localStorage.setItem("role", String(data.rol_id));
        localStorage.setItem("token", data.access_token ? data.access_token : "logueado");
        setTimeout(() => navigate("/panel"), 1500);
      } else {
        const intentosRestantes = MAX_INTENTOS - (intentosFallidos + 1);
        setIntentosFallidos(intentosFallidos + 1);
        if (intentosRestantes > 0) {
          showToast((data.detail || "Error al iniciar sesión") + `. Te quedan ${intentosRestantes} intento(s).`, "warning");
        } else {
          showToast("Cuenta temporalmente bloqueada. Intenta más tarde.", "error");
        }
      }
    } catch (error) {
      console.error("Error en login:", error);
      showToast("Error de conexión con el servidor", "error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="gallery">
          <video
            src="/JOSNISHOP_000/assets/IMG/inicio_video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="login-video"
          />
        </div>
      </div>

      <div className="login-right">
        <div className="login-logo">
          <img src="/logo.png" />
        </div>
        <br />
        <h1>Inicia Sesión</h1>
        <br />
        <form id="loginForm" onSubmit={handleLogin}>
          <label htmlFor="correo">
            Correo electrónico <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            id="correo"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <label htmlFor="contraseña">
            Contraseña <span style={{ color: "red" }}>*</span>
          </label>
          <div className="login-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="contraseña"
              placeholder="Tu contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={0}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit">Continuar</button>
        </form>
        <br />
        <p className="register-link">
          ¿Se te olvidó tu contraseña?{" "}
          <a href="/recuperar_contrasena">Recupérala aquí.</a>
        </p>
        <p className="register-link">
          No estás registrado? <a href="/register">Regístrate.</a>
        </p>
        <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
          <div style={{ background: '#fff9b1', padding: '8px 12px', borderRadius: '6px', display: 'inline-block' }}>
            <span style={{ color: '#222', fontSize: '1.08rem' }}>
              <a
                href="/inicio"
                style={{ color: '#1ebc7c', textDecoration: 'underline', fontWeight: 500 }}
              >
                ← Volver al inicio
              </a>
            </span>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={reactivateConfirm.show}
        title="Cuenta desactivada"
        message="Tu cuenta está desactivada. ¿Quieres reactivarla y volver a iniciar sesión? Al reactivarla, podrás acceder nuevamente a tu cuenta y a todos tus datos."
        confirmText="Sí, reactivar"
        cancelText="Cancelar"
        isDangerous={false}
        onConfirm={handleReactivate}
        onCancel={() => setReactivateConfirm({ show: false, data: null })}
      />
    </div>
  );
};

export default Login;
