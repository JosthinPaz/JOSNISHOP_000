import React, { useEffect, useState } from "react";
import "../assets/css/carrito.css";
import NavBar from "../components/NavBar";
import "font-awesome/css/font-awesome.min.css";
import CryptoJS from "crypto-js";
import { useToast } from "../contexts/useToastContext";
import ConfirmModal from "../components/ConfirmModal";

type ProductoCarrito = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

type MetodoPago = {
  nombre_tarjeta: string;
  numero_tarjeta: string;
  fecha_expiracion: string;
  cvv: string;
};

const SECRET_KEY = "Josnishop el mejor";

const Carrito: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editCantidad, setEditCantidad] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [correo, setCorreo] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    nombre: "",
    numero: "",
    fecha: "",
    cvv: "",
  });
  const [cardBrand, setCardBrand] = useState<string>("");
  const [saveMethod, setSaveMethod] = useState<boolean>(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState<boolean>(false);
  const [cardError, setCardError] = useState("");
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [showResumen, setShowResumen] = useState(false);
  const [usarGuardada, setUsarGuardada] = useState(false);
  const [tarjetaGuardada, setTarjetaGuardada] = useState<{
    nombre: string;
    numero: string;
    fecha: string;
    cvv: string;
  } | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [seguridadPregunta, setSeguridadPregunta] = useState<string>("");
  const [seguridadRespuesta, setSeguridadRespuesta] = useState<string>("");
  const usuarioId = localStorage.getItem("userId");
  const { showToast, showLoading, hideLoading } = useToast();

  useEffect(() => {
    let carritoGuardado: ProductoCarrito[] = JSON.parse(
      localStorage.getItem("carrito") || "[]"
    );
    const nombreToId: Record<string, number> = {
      "Auriculares E6S": 61,
      "Auriculares Pro": 62,
      "Bolso de hombro para mujer": 63,
      "Cafetera": 64,
      "Lienzo Bastidor 12 X 18 Cm": 65,
      "Reloj inteligente": 66,
      "Set de cocina": 67,
      "Sofá moderno": 68,
      "Zapatillas deportivas": 69,
      "Consola de videojuegos": 70,
      "Perro de peluche": 71,
      "Cocina eléctrica": 72,
    };

    function getProductoId(p: ProductoCarrito) {
      if (typeof p.id === "number" && p.id > 0) return p.id;
      if (typeof p.id === "string" && nombreToId[p.nombre])
        return nombreToId[p.nombre];
      if (nombreToId[p.nombre]) return nombreToId[p.nombre];
      return 0;
    }

    carritoGuardado = carritoGuardado
      .map((p: ProductoCarrito) => ({
        ...p,
        id: getProductoId(p),
      }))
      .filter((p) => p.id > 0);

    setCarrito(carritoGuardado);
    localStorage.setItem("carrito", JSON.stringify(carritoGuardado));
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "";
    const encrypted = localStorage.getItem(`tarjeta_${userId}`);
    if (encrypted) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setTarjetaGuardada(decrypted);
      } catch {
        setTarjetaGuardada(null);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchMetodoPago() {
      if (!usuarioId) return;
      const res = await fetch(
        `http://localhost:8000/usuarios/${usuarioId}/metodo-pago`
      );
      if (res.ok) {
        const metodo = await res.json();
        setMetodoPago(metodo);
      }
    }
    fetchMetodoPago();
    // Fetch user profile to obtain security question (si está disponible)
    async function fetchUsuario() {
      if (!usuarioId) return;
      try {
        const r = await fetch(`http://localhost:8000/usuarios/${usuarioId}`);
        if (!r.ok) return;
        const usuario = await r.json();
        if (usuario && usuario.seguridad_pregunta) {
          setSeguridadPregunta(usuario.seguridad_pregunta);
        }
      } catch (err) {
        // fail silently
      }
    }
    fetchUsuario();
  }, [usuarioId]);

  // Detecta la marca de la tarjeta a partir del número (sin espacios)
  function detectCardBrand(number: string) {
    if (!number) return "";
    // American Express
    if (/^3[47]/.test(number)) return "American Express";
    // Mastercard (51-55) o (2221-2720)
    if (/^(5[1-5])/.test(number) || /^(22[2-9]|2[3-6]\d|27[01]|2720)/.test(number)) return "Mastercard";
    // Visa
    if (/^4/.test(number)) return "Visa";
    return "Unknown";
  }

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  const handleEdit = (idx: number, cantidad: number) => {
    setEditIndex(idx);
    setEditCantidad(cantidad);
  };

  const handleSave = (idx: number) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[idx].cantidad = editCantidad;
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setEditIndex(null);
  };

  const handleDelete = (id: number) => {
    const nuevoCarrito = carrito.filter((p) => p.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setEditIndex(null);
  };

  const handleComprar = async () => {
    const cliente_id = Number(localStorage.getItem("userId"));
    if (!cliente_id || !correo || carrito.length === 0) {
      showToast("Completa todos los datos y agrega productos al carrito.", "warning");
      return;
    }
    const detalles = carrito.map((p) => ({
      producto_id: p.id,
      cantidad: p.cantidad,
      subtotal: p.precio * p.cantidad,
    }));
    const total = detalles.reduce((sum, d) => sum + d.subtotal, 0);

    // Verificar respuesta de seguridad si el usuario tiene una pregunta configurada
    if (seguridadPregunta) {
      if (!seguridadRespuesta) {
        showToast("Por favor responde la pregunta de seguridad.", "warning");
        return;
      }
      try {
        const vr = await fetch(`http://localhost:8000/usuarios/${cliente_id}/verificar-seguridad`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Enviar la respuesta en texto plano (sin cifrar) para que el backend la compare con el hash bcrypt
          body: JSON.stringify({ respuesta: seguridadRespuesta.trim() }),
        });
        if (!vr.ok) {
          showToast("Error al verificar la respuesta de seguridad.", "error");
          return;
        }
        const json = await vr.json();
        // El backend devuelve { msg: "Verificación exitosa" } en caso correcto; soportamos formatos alternativos
        const valid = json.valid || json.success || json.ok || json.correct || (json.msg && typeof json.msg === 'string' && json.msg.toLowerCase().includes('verific'));
        if (!valid) {
          showToast("Respuesta de seguridad incorrecta.", "error");
          return;
        }
      } catch {
        showToast("Error al verificar la respuesta de seguridad.", "error");
        return;
      }
    }

    // Si no existe un método guardado en el backend, no usamos la tarjeta local (por seguridad)
    if (!metodoPago && tarjetaGuardada) {
      showToast("Ingresa CVV o completa los datos de la tarjeta para continuar.", "warning");
      setShowCardForm(true);
      return;
    }

    const pago = {
      id_usuario: cliente_id,
      nombre_tarjeta: metodoPago?.nombre_tarjeta || tarjetaGuardada?.nombre,
      numero_tarjeta: metodoPago?.numero_tarjeta || tarjetaGuardada?.numero,
      fecha_expiracion: metodoPago?.fecha_expiracion || tarjetaGuardada?.fecha,
      cvv: metodoPago?.cvv || tarjetaGuardada?.cvv,
    };

    let loadingId: string = "";
    try {
      loadingId = showLoading("Procesando compra...");
      await fetch("http://localhost:8000/pagos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pago,
          tipo_pago: "tarjeta_credito",
          tipo_tarjeta: metodoPago?.nombre_tarjeta || tarjetaGuardada?.nombre || cardBrand || "unknown",
          monto: Math.round(total * 100),
          estado: "completado",
        }),
      });

      const res = await fetch("http://localhost:8000/compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id,
          detalles,
          total,
          correo,
        }),
      });
      if (!res.ok) throw new Error("Error en la compra");
  hideLoading(loadingId, "Compra realizada con éxito", "success");
      showToast("Compra realizada con éxito", "success");
      setCarrito([]);
      localStorage.removeItem("carrito");
    } catch (err) {
      console.error(err);
      hideLoading(loadingId, "Error al realizar la compra", "error");
      showToast("Error al realizar la compra", "error");
    }
  };

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    // Manejo especial para la fecha de expiración
    if (name === 'fecha') {
      // Eliminar cualquier caracter que no sea número
      value = value.replace(/\D/g, '');
      // Agregar el slash después de MM
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      // Limitar a 5 caracteres (MM/YY)
      value = value.slice(0, 5);
    }

    // Manejo especial para CVV
    if (name === 'cvv') {
      // Solo permitir números y limitar a 3 dígitos
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    // Manejo especial para número de tarjeta
    if (name === 'numero') {
      // Eliminar espacios y caracteres no numéricos
      value = value.replace(/\D/g, '');
      // Agregar espacios cada 4 dígitos
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      // Limitar a 19 caracteres (16 números + 3 espacios)
      value = value.slice(0, 19);
      // Detectar marca según el número (sin espacios)
      const raw = value.replace(/\s/g, '');
      const brand = detectCardBrand(raw);
      setCardBrand(brand);
      // Guardamos la marca en el campo nombre (para enviar como nombre_tarjeta)
      // No se muestra como input al usuario.
      setCardData({ ...cardData, nombre: brand, [name]: value });
      return;
    }

    setCardData({ ...cardData, [name]: value });
  };

  const validateCardData = () => {
    const { numero, fecha, cvv } = cardData;
    if (numero.replace(/\s/g, '').length !== 16) return "Número de tarjeta inválido";
    if (!/^\d{2}\/\d{2}$/.test(fecha)) return "Fecha de expiración inválida";
    if (cvv.length !== 3) return "CVV inválido";
    return "";
  };

  // Función que finaliza el proceso de envío de tarjeta: guarda localmente y opcionalmente la envía al backend
  const finish = async (sendToBackend: boolean) => {
    const userId = localStorage.getItem("userId") || "";
    const rawNumber = cardData.numero.replace(/\s/g, '');

    // Guardar localmente cifrado (solo datos no sensibles: máscara del número y expiración)
    const masked = `**** **** **** ${rawNumber.slice(-4)}`;
    const localSave = { nombre: cardBrand || cardData.nombre, numero_masked: masked, fecha: cardData.fecha };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(localSave), SECRET_KEY).toString();
    localStorage.setItem(`tarjeta_${userId}`, encrypted);
    setTarjetaGuardada({ nombre: localSave.nombre, numero: localSave.numero_masked, fecha: localSave.fecha, cvv: "" });

    // Si el usuario marcó guardar y se indicó enviar al backend, lo hacemos
    if (sendToBackend && userId) {
      try {
        await fetch("http://localhost:8000/pagos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: Number(userId),
            nombre_tarjeta: cardBrand || cardData.nombre,
            numero_tarjeta: rawNumber,
            fecha_expiracion: cardData.fecha,
            cvv: cardData.cvv, // CVV se envía solo al backend para tokenización, no se guarda localmente
            tipo_pago: "tarjeta_credito",
            tipo_tarjeta: (cardBrand || "unknown").toLowerCase(),
            monto: Math.round((carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0) || 0) * 100),
            estado: "completado",
            replace_existing: true,
          }),
        });
        // Refrescar método guardado desde backend
        const res = await fetch(`http://localhost:8000/usuarios/${userId}/metodo-pago`);
        if (res.ok) {
          const metodo = await res.json();
          setMetodoPago(metodo);
        }
      } catch (err) {
        console.error("Error guardando método en backend:", err);
        showToast("No se pudo guardar el método en el servidor", "warning");
      }
    }

    setShowCardForm(false);
    setUsarGuardada(true);
    setShowResumen(true);
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { numero, fecha, cvv } = cardData;
    if (!numero || !fecha || !cvv) {
      setCardError("Por favor completa todos los campos.");
      return;
    }
    const validation = validateCardData();
    if (validation) {
      setCardError(validation);
      return;
    }
    setCardError("");

  // Si el usuario decidió guardar el método, pedir confirmación



    if (saveMethod) {
      // Abrimos el modal de confirmación; si el usuario confirma, finish(true) será llamado.
      setShowSaveConfirm(true);
      return;
    }

    // Si no pidió guardar, simplemente finalizamos sin enviar al backend
    await finish(false);
  };
  const handleCambiarMetodo = () => {
    setShowResumen(false);
    setShowCardForm(true);
    setUsarGuardada(false);
  };

  const pagar = async () => {
    const cliente_id = Number(localStorage.getItem("userId"));
    if (carrito.length === 0 || !correo) {
      showToast("Completa todos los datos y agrega productos al carrito.", "warning");
      return;
    }
    const detalles = carrito.map((p) => ({
      producto_id: p.id,
      cantidad: p.cantidad,
      subtotal: p.precio * p.cantidad,
    }));
    const total = detalles.reduce((sum, d) => sum + d.subtotal, 0);
    let loadingId: string = "";
    // Verificar respuesta de seguridad si corresponde
    if (seguridadPregunta) {
      if (!seguridadRespuesta) {
        showToast("Por favor responde la pregunta de seguridad.", "warning");
        return;
      }
      try {
        const vr = await fetch(`http://localhost:8000/usuarios/${cliente_id}/verificar-seguridad`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Enviar la respuesta en texto plano (sin cifrar)
          body: JSON.stringify({ respuesta: seguridadRespuesta.trim() }),
        });
        if (!vr.ok) {
          showToast("Error al verificar la respuesta de seguridad.", "error");
          return;
        }
        const json = await vr.json();
        const valid = json.valid || json.success || json.ok || json.correct || (json.msg && typeof json.msg === 'string' && json.msg.toLowerCase().includes('verific'));
        if (!valid) {
          showToast("Respuesta de seguridad incorrecta.", "error");
          return;
        }
      } catch {
        showToast("Error al verificar la respuesta de seguridad.", "error");
        return;
      }
    }
    try {
      loadingId = showLoading("Procesando compra...");
      // Si existe un método guardado en el backend, usamos 1-clic y no volvemos a enviar datos sensibles
      if (metodoPago) {
        const res = await fetch("http://localhost:8000/compra", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_id,
            detalles,
            total,
            correo,
          }),
        });
        if (!res.ok) throw new Error("Error en la compra");
      } else if (tarjetaGuardada) {
        // Si no hay método en backend pero hay tarjeta guardada localmente, necesitamos que el usuario
        // reingrese CVV o datos completos para poder enviar el pago. Abrimos el formulario de tarjeta.
        showToast("Ingresa CVV o completa los datos de la tarjeta para continuar.", "warning");
        setShowCardForm(true);
        return;
        // Alternativamente, si la tarjeta guardada tuviera datos completos (no recomendado), podríamos enviarla.
        // Pero por seguridad no almacenamos CVV localmente.
        // Si el backend tiene método (metodoPago) se usa 1-clic sin CVV.
      
      } else {
        throw new Error("No hay método de pago disponible");
      }

      hideLoading(loadingId, "Compra realizada con éxito", "success");
      showToast("Compra realizada con éxito", "success");
      setCarrito([]);
      localStorage.removeItem("carrito");
    } catch (err) {
      console.error(err);
      hideLoading(loadingId, "Error al realizar la compra", "error");
      showToast("Error al realizar la compra", "error");
    }
  };

  return (
    <div>
      <NavBar onOpenMenu={handleMenuOpen} />

      <ConfirmModal
        isOpen={showSaveConfirm}
        title="Guardar método de pago"
        message="¿Confirmas guardar este método de pago para futuras compras?"
        confirmText="Aceptar"
        cancelText="Cancelar"
        onConfirm={async () => {
          setShowSaveConfirm(false);
          await finish(true);
        }}
        onCancel={async () => {
          setShowSaveConfirm(false);
          await finish(false);
        }}
      />

      {/* Menú hamburguesa lateral */}
      <nav className={`hamburger-menu${menuOpen ? " active" : ""}`}>
        <button className="close-btn" onClick={handleMenuClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Contenido visible solo en móvil */}
        <div className="menu-header-logo menu-mobile-only">
          <img src="/logo.png" alt="Logo JOSNISHOP" className="logo" />
          <span className="titulo-menu">JOSNISHOP</span>
        </div>
        <div
          className="menu-search-container menu-mobile-only"
          style={{ position: "relative" }}
        >
          <input
            type="text"
            placeholder="Buscar..."
            className="buscador-lateral"
          />
          <span className="icono-lupa-lateral">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>
        
        {/* Lista de enlaces */}
        <ul className="menu-list">
          <li>
            <a href="/" className="menu-link menu-inicio">
              <i className="fa-solid fa-home"></i> Inicio
            </a>
          </li>
          <li>
            <a href="/nosotros" className="menu-link">
              <i className="fa-solid fa-users"></i> ¿Quiénes somos?
            </a>
          </li>
          <li>
            <a href="/noticias" className="menu-link">
              <i className="fa-solid fa-newspaper"></i> Noticias
            </a>
          </li>
          <li>
            <a href="/contactanos" className="menu-link">
              <i className="fa-solid fa-envelope"></i> Contáctanos
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/inicio" className="menu-link">
              <i className="fa-solid fa-bag-shopping"></i> Mis pedidos
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/carrito" className="menu-link">
              <i className="fa-solid fa-cart-shopping"></i> Carrito
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/panel" className="menu-link">
              <i className="fa-solid fa-user"></i> Mi cuenta
            </a>
          </li>
          <li className="menu-mobile-only">
            <a href="/login" className="menu-link">
              <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
            </a>
          </li>
        </ul>

        {/* Footer del menú lateral (solo para móvil) */}
        <footer className="menu-footer">
          <div className="footer-columns">
            <div>
              <span className="footer-title">Atención al cliente</span>
              <ul>
                <li>Atención al cliente</li>
                <li>Encuesta de satisfacción</li>
              </ul>
            </div>
            <div>
              <span className="footer-title">Guía de Compra</span>
              <ul>
                <li>Crear una cuenta</li>
                <li>Pago</li>
                <li>Envío</li>
                <li>Protección del comprador</li>
              </ul>
            </div>
            <div>
              <span className="footer-title">Ayuda</span>
              <ul>
                <li>Centro de ayuda y preguntas frecuentes</li>
                <li>Centro de seguridad</li>
                <li>Protección de compras</li>
                <li>Adócate</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>©2025</span>
            <ul>
              <li>Términos de uso</li>
              <li>Política de privacidad</li>
              <li>Tus preferencias de privacidad</li>
              <li>Gestión de anuncios</li>
            </ul>
          </div>
        </footer>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="container">
        <div className="carrito">
          <h2>Carrito de Compras</h2>
          {carrito.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            carrito.map((producto, idx) => (
              <div className="carrito-producto" key={producto.id}>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  style={{ width: "100px" }}
                />
                <div className="carrito-info">
                  <h3>{producto.nombre}</h3>
                  <p className="carrito-precio">
                    $ {producto.precio.toLocaleString()} COP
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <label>Cantidad:</label>
                    {editIndex === idx ? (
                      <>
                        <input
                          type="number"
                          min={1}
                          value={editCantidad}
                          onChange={(e) =>
                            setEditCantidad(parseInt(e.target.value) || 1)
                          }
                          style={{ width: "50px" }}
                        />
                        <button
                          className="btn-guardar"
                          onClick={() => handleSave(idx)}
                          style={{ marginLeft: "300px" }}
                        >
                          Guardar
                        </button>
                        <button
                          className="btn-cancelar"
                          onClick={() => setEditIndex(null)}
                          style={{ marginLeft: "35px" }}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{producto.cantidad}</span>
                        <button
                          className="btn-editar"
                          onClick={() => handleEdit(idx, producto.cantidad)}
                          style={{ marginLeft: "300px" }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => handleDelete(producto.id)}
                          style={{ marginLeft: "10px" }}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="resumen">
          <h3>Resumen</h3>
          <p>
            Total parcial:{" "}
            <span>
              ${" "}
              {carrito
                .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
                .toLocaleString()}{" "}
              COP
            </span>
          </p>
          <p>
            Gastos de envío: <span>$0</span>
          </p>
          <p className="total">
            Total:{" "}
            <span>
              ${" "}
              {carrito
                .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
                .toLocaleString()}{" "}
              COP
            </span>
          </p>
          {usarGuardada && tarjetaGuardada && (
            <div style={{ marginBottom: 8, color: "#2ecc40", fontWeight: "bold" }}>
              Usando método guardado: **** **** ****{" "}
              {tarjetaGuardada.numero?.slice(-4)}
            </div>
          )}
          {metodoPago ? (
            <>
              <div style={{ marginBottom: 8, color: "#2ecc40", fontWeight: "bold" }}>
                Usando método guardado: **** **** ****{" "}
                {metodoPago.numero_tarjeta?.slice(-4)}
              </div>
              <button
                className="btn-pagar"
                onClick={() => setShowModal(true)}
              >
                Comprar con 1 clic ({carrito.reduce((acc, p) => acc + p.cantidad, 0)})
              </button>
              <button
                className="btn-pagar"
                onClick={() => setShowCardForm(true)}
                style={{ marginLeft: 8 }}
              >
                Usar otro método
              </button>
            </>
          ) : (
            <button className="btn-pagar" onClick={() => setShowCardForm(true)}>
              Pagar ({carrito.reduce((acc, p) => acc + p.cantidad, 0)})
            </button>
          )}
          <div className="metodos">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
              alt="Visa"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
            />
          </div>
          <p className="extra">
            ✅ Obtenga un reembolso completo si el artículo no es como se describe o no se entrega
          </p>
          <div className="banner">
            Sigue observando sin límites
            <a href="/" className="btn-videos">
              Videos
            </a>
          </div>
        </div>
      </div>

      {showCardForm && (
        <div className="modal-overlay">
          <div className="tarjeta-modal">
            <h2>Datos de la tarjeta</h2>
            <form className="tarjeta-form" onSubmit={handleCardSubmit}>
              <div className="tarjeta-field tarjeta-numero-field" style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <label className="tarjeta-label" style={{minWidth: 140}}>Número de tarjeta</label>
                {cardBrand && (
                  <img
                    src={
                      cardBrand === 'Visa'
                        ? 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png'
                        : cardBrand === 'Mastercard'
                        ? 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png'
                        : cardBrand === 'American Express'
                        ? 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg'
                        : 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Credit_card_font_awesome.svg'
                    }
                    alt={cardBrand}
                    style={{width: 36, height: 24}}
                  />
                )}
                <input
                  type="text"
                  name="numero"
                  className="tarjeta-input"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.numero}
                  onChange={handleCardInput}
                  required
                  maxLength={19}
                  style={{flex: 1}}
                />
              </div>

              <div className="tarjeta-inline-group">
                <div className="tarjeta-field">
                  <label className="tarjeta-label">Fecha de expiración</label>
                  <input
                    type="text"
                    name="fecha"
                    className="tarjeta-input fecha"
                    placeholder="MM/AA"
                    value={cardData.fecha}
                    onChange={handleCardInput}
                    required
                    maxLength={5}
                  />
                </div>

                <div className="tarjeta-field">
                  <label className="tarjeta-label">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    className="tarjeta-input cvv"
                    placeholder="CVV"
                    value={cardData.cvv}
                    onChange={handleCardInput}
                    required
                    maxLength={3}
                  />
                </div>
              </div>

              {cardError && <span className="tarjeta-error">{cardError}</span>}
              <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 8}}>
                <label style={{display: 'flex', alignItems: 'flex-start', gap: 8}}>
                  <input type="checkbox" checked={saveMethod} onChange={(e) => setSaveMethod(e.target.checked)} />
                  <div style={{fontSize: 13}}>
                    <div><b>Guardar la tarjeta para futuras compras.</b></div>
                    <div style={{color: '#888'}}>Esto no afectará la forma en la que pagas por las suscripciones existentes y lo puedes administrar en tu cuenta.</div>
                  </div>
                </label>
              </div>

              <div className="tarjeta-buttons">
                <button type="submit" className="tarjeta-continuar">
                  Continuar
                </button>
                <button
                  type="button"
                  className="tarjeta-cancelar"
                  onClick={() => setShowCardForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>

            <div className="tarjeta-brand-icons">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                alt="Visa"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                alt="Mastercard"
              />
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {compraExitosa ? (
              <>
                <h3>¡Compra realizada con éxito!</h3>
                <p>Revisa tu correo para ver el número de pedido y detalles.</p>
                <button onClick={() => setCompraExitosa(false)}>Cerrar</button>
              </>
            ) : (
              <>
                <h3>Ingresa tu correo para confirmar la compra</h3>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                />
                {seguridadPregunta && (
                  <div className="security-question-group">
                    <label className="security-label">
                      <i className="fa-solid fa-lock" style={{ marginRight: 8, color: '#00b86b' }}></i>
                      {seguridadPregunta}
                    </label>
                    <input
                      type="text"
                      placeholder="Escribe tu respuesta"
                      value={seguridadRespuesta}
                      onChange={(e) => setSeguridadRespuesta(e.target.value)}
                      className="security-input"
                    />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={pagar} className="btn-confirmar">Confirmar compra</button>
                  <button onClick={() => setShowModal(false)} className="btn-cancelar">Cancelar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showResumen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Resumen final de compra</h3>
            <p>
              <b>Total:</b> ${" "}
              {carrito
                .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
                .toLocaleString()}{" "}
              COP
            </p>
            <p>
              <b>Método de pago:</b>{" "}
              {tarjetaGuardada
                ? `**** **** **** ${tarjetaGuardada.numero?.slice(-4)} (${
                    tarjetaGuardada.nombre
                  })`
                : "-"}
            </p>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
            {seguridadPregunta && (
              <div className="security-question-group">
                <label className="security-label">
                  <i className="fa-solid fa-lock" style={{ marginRight: 8, color: '#00b86b' }}></i>
                  {seguridadPregunta}
                </label>
                <input
                  type="text"
                  placeholder="Escribe tu respuesta"
                  value={seguridadRespuesta}
                  onChange={(e) => setSeguridadRespuesta(e.target.value)}
                  className="security-input"
                />
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleComprar} className="btn-confirmar">
                Finalizar compra
              </button>
              <button onClick={handleCambiarMetodo} className="btn-cancelar">
                Cambiar método
              </button>
              <button
                onClick={() => {
                  setShowResumen(false);
                  setUsarGuardada(false);
                }}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;