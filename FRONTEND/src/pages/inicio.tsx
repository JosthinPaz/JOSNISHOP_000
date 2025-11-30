import React, { useEffect, useRef, useState } from "react";
import "../assets/css/inicio.css";
import "font-awesome/css/font-awesome.min.css";
import { FaBars } from "react-icons/fa";
import { useToast } from "../contexts/useToastContext";

const Inicio: React.FC = () => {
  const innerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState(""); // Nuevo estado
  const { showToast } = useToast();
  // Configuración del chat box (ajústala según necesites)
  const chatConfig = {
    welcomeMessage: '¡Hola! ¿En qué podemos ayudarte hoy?',
    maxLength: 250,
    responseDelay: 900, // milisegundos
    autoOpen: true
  };

  // Chat types, state y refs
  type ChatMessage = { from: 'bot' | 'user'; text: string };
  const [chatOpen, setChatOpen] = useState<boolean>(chatConfig.autoOpen);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { from: "bot", text: chatConfig.welcomeMessage }
  ]);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  // Enviar mensaje (usado en el form) -> ahora llama al backend /bot/respond
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [waPhone, setWaPhone] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  // Determina si el usuario es vendedor (rol id === "1")
  const isSeller = (localStorage.getItem("role") || "") === "1";
  const [showAddModal, setShowAddModal] = useState(false);
  const [formNombre, setFormNombre] = useState("");
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formPrecio, setFormPrecio] = useState("");
  const [formCantidad, setFormCantidad] = useState(1);
  const [formStockMinimo, setFormStockMinimo] = useState(1);
  const [formCategoriaId, setFormCategoriaId] = useState(1);
  const [formDisponible, setFormDisponible] = useState(true);
  const [formFile, setFormFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Array<{id:number,name:string}>>([]);
  // Handlers para el modal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFormFile(f);
  };

  useEffect(() => {
    // cargar categorias desde backend para el select
    (async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/categorias/');
        if (!res.ok) return;
        const data = await res.json();
        // data debería ser array de categorias con {id, nombre}
        setCategories(data.map((c:any) => ({ id: c.id, name: c.nombre || c.name || String(c.id) })));
      } catch (err) {
        console.error('No se pudieron cargar categorías', err);
      }
    })();
  }, []);

  const handleSubmitAddProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const vendedorId = Number(localStorage.getItem('userId')) || null;
      const formData = new FormData();
      formData.append('nombre', formNombre);
      formData.append('categoria_id', String(formCategoriaId));
      formData.append('descripcion', formDescripcion);
      formData.append('precio', String(parseFloat(formPrecio || '0')));
      formData.append('cantidad', String(formCantidad));
      formData.append('stock_minimo', String(formStockMinimo));
      formData.append('disponible', String(formDisponible));
      if (vendedorId) formData.append('vendedor_id', String(vendedorId));
      if (formFile) formData.append('file', formFile);

      const res = await fetch('http://127.0.0.1:8000/productos/full', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const txt = await res.text();
        showToast('Error al crear producto: ' + txt, 'error');
        return;
      }
      const data = await res.json();
      // éxito
      showToast('Producto creado. ID: ' + data.producto_id, 'success');
      // limpiar y cerrar modal
      setFormNombre('');
      setFormDescripcion('');
      setFormPrecio('');
      setFormCantidad(1);
      setFormStockMinimo(1);
      setFormFile(null);
      setShowAddModal(false);
      // Recargar productos sin recargar la página
      try {
        const res2 = await fetch('http://127.0.0.1:8000/productos/rich');
        if (res2.ok) {
          const data2 = await res2.json();
          const mapped = data2.map((p: any) => {
            let imgUrl: string | null = null;
            if (p.image) {
              const v = String(p.image).trim();
              if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('//')) {
                imgUrl = v;
              } else {
                imgUrl = `http://127.0.0.1:8000${v}`;
              }
            }
            return {
              id: p.id,
              nombre: p.nombre,
              descripcion: p.descripcion,
              precio: p.precio ? `$${Number(p.precio).toLocaleString('es-CO')} COP` : null,
              img: imgUrl,
              link: `/producto/${p.id}`,
              categoria: '',
            };
          });
          setProductos(mapped);
        }
      } catch (err) {
        console.error('Error recargando productos', err);
      }
    } catch (err) {
      console.error(err);
      showToast('Error al crear producto', 'error');
    }
  };
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
  // prepare history for AI context (include the new user message)
  const recent = chatMessages.slice(-5)
  const history = [...recent, { from: 'user', text }]
  // mostrar mensaje del usuario
  setChatMessages(prev => [...prev, { from: 'user', text }]);
  setLastUserMessage(text);
    setChatInput("");
    setWhatsappUrl(null);

    try {
      const userId = Number(localStorage.getItem('userId')) || null;
      const res = await fetch('http://127.0.0.1:8000/bot/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_origen: userId, mensaje: text, history })
      });
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      // respuesta del bot
      setTimeout(() => {
        setChatMessages(prev => [...prev, { from: 'bot', text: data.texto || 'No hubo respuesta.' }]);
        if (data.fallback && data.whatsapp_url) setWhatsappUrl(data.whatsapp_url);
      }, chatConfig.responseDelay);
    } catch {
      // fallback local si falla la conexión
      setTimeout(() => {
        setChatMessages(prev => [...prev, { from: 'bot', text: '¡Gracias por tu mensaje! Pronto te responderemos.' }]);
      }, chatConfig.responseDelay);
    }
  };

  // fetch whatsapp phone/url from backend so the page can build wa links when needed
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/bot/wa');
        if (!res.ok) return;
        const d = await res.json();
        if (!mounted) return;
        if (d.whatsapp_url) setWhatsappUrl(d.whatsapp_url);
        if (d.phone) setWaPhone(d.phone);
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleCloseChat = () => {
    setClosing(true);
    setTimeout(() => {
      setChatOpen(false);
      setClosing(false);
      setChatInput("");
      setChatMessages([{ from: 'bot', text: chatConfig.welcomeMessage }]);
    }, 320);
  };

  const getItemWidth = () => {
    return itemsRef.current[0]?.offsetWidth || 0;
  };

  const goToSlide = (index: number) => {
    const totalItems = itemsRef.current.length;
    if (!innerRef.current) return;

    if (index < 0) index = totalItems - 1;
    else if (index >= totalItems) index = 0;

    setCurrentIndex(index);

    const translateX = -index * getItemWidth();
    innerRef.current.style.transform = `translateX(${translateX}px)`;
  };

  useEffect(() => {
    // inline translation to avoid dependency on goToSlide
    if (!innerRef.current) return;
    const translateX = -currentIndex * (itemsRef.current[0]?.offsetWidth || 0);
    innerRef.current.style.transform = `translateX(${translateX}px)`;
  }, [currentIndex]);

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);
  // Productos cargados desde el backend (persistentes)
  const [productos, setProductos] = useState<Array<any>>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/productos/rich');
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        // map backend shape to front shape
        const mapped = data.map((p: any) => {
          // backend returns p.image which can be either a relative path (e.g. "/static/uploads/xxx")
          // or an absolute external URL (https://...). If it's absolute we must use it as-is,
          // otherwise prefix with our backend host so the browser can fetch the image.
          let imgUrl: string | null = null;
          if (p.image) {
            const v = String(p.image).trim();
            if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('//')) {
              imgUrl = v;
            } else {
              imgUrl = `http://127.0.0.1:8000${v}`;
            }
          }
          return {
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio ? `$${Number(p.precio).toLocaleString('es-CO')} COP` : null,
            img: imgUrl,
            link: `/producto/${p.id}`,
            categoria: '',
          };
        });
        setProductos(mapped);
      } catch (err) {
        console.error('Error cargando productos', err);
      }
    })();
    return () => { mounted = false };
  }, [showMore]);

  // Estado para el tipo de filtro
  const [tipoFiltro, setTipoFiltro] = useState("nombre");

  // Filtrado según el tipo seleccionado
  const productosFiltrados = productos.filter(producto => {
    if (!busquedaActiva) return true;
    const valor = busquedaActiva.toLowerCase();
    if (tipoFiltro === "nombre") {
      return producto.nombre.toLowerCase().includes(valor);
    } else if (tipoFiltro === "precio") {
      return (producto.precio ? String(producto.precio).toLowerCase() : '').includes(valor);
    } else if (tipoFiltro === "categoria") {
      return producto.categoria && producto.categoria.toLowerCase().includes(valor);
    }
    return false;
  });

  return (
    <div className="inicio-scroll">
      {/* MENÚ SUPERIOR (Navbar principal) */}
      <header>
        <div className="navbar">
          <button className="hamburger-btn" onClick={handleMenuOpen}>
            <FaBars />
          </button>
          <a href="/">
            <img src="/public/logo.png" alt="Logo JOSNISHOP" className="logo" />
          </a>
          <a href="/categorias" className="titulo">
            Categorías
          </a>
          <div className="buscador-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)} style={{ height: '32px', borderRadius: '4px' }}>
              <option value="nombre">Nombre</option>
              <option value="precio">Precio</option>
              <option value="categoria">Categoría</option>
            </select>
            <input
              type="text"
              placeholder={`Buscar producto por ${tipoFiltro}...`}
              className="buscador"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") setBusquedaActiva(busqueda);
              }}
            />
            <span
              className="icono-lupa" 
              style={{ cursor: "pointer" }}
              onClick={() => setBusquedaActiva(busqueda)}
              title="Buscar"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
          <div className="iconos">
            <a href="/">
              <i className="fa-solid fa-house"></i>
            </a>
            <a href="/inicio">
              <i className="fa-solid fa-bag-shopping"></i>
            </a>
            <a href="/carrito">
              <i className="fa-solid fa-cart-shopping"></i>
            </a>
            {(() => {
              const userName = localStorage.getItem("userName");
              const userId = localStorage.getItem("userId");
              if (userId) {
                return (
                  <a href="/panel" className="user-session" style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1b3a2b', marginLeft: 8 }}>
                    <i className="fa-solid fa-user" style={{ fontSize: 22, marginRight: 6 }}></i>
                    <span style={{ fontSize: 16 }}>{userName ? `Hola, ${userName}` : 'Mi cuenta'}</span>
                  </a>
                );
              } else {
                return (
                  <a href="/login" className="iniciar-sesion">
                    <i className="fa-solid fa-user" style={{ marginRight: 6 }}></i>
                    Iniciar Sesión
                  </a>
                );
              }
            })()}
          </div>
        </div>
      </header>

      {/* Menú hamburguesa lateral */}
      <nav className={`hamburger-menu${menuOpen ? " active" : ""}`}>
        <button className="close-btn" onClick={handleMenuClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Contenido visible solo en móvil */}
        <div className="menu-header-logo menu-mobile-only">
          <img src="/public/logo.png" alt="Logo JOSNISHOP" className="logo" />
          <span className="titulo-menu">JOSNISHOP</span>
        </div>
        <div className="menu-search-container menu-mobile-only" style={{ position: 'relative' }}>
          <input type="text" placeholder="Buscar..." className="buscador-lateral" />
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

      {/* CARRUSEL */}
      <div className="carousel">
        <div className="carousel-inner" ref={innerRef}>
          {["/src/assets/IMG/index/carrusel1.png", "/src/assets/IMG/index/carrusel2.png", "/src/assets/IMG/index/carrusel3.png"].map((src, i) => (
            <div
              key={i}
              className={`carousel-item ${i === 0 ? "active" : ""}`}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
            >
              <img src={src} alt={`Carrusel ${i + 1}`} />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          onClick={() => goToSlide(currentIndex - 1)}
        >
          <span>&lt;</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          onClick={() => goToSlide(currentIndex + 1)}
        >
          <span>&gt;</span>
        </button>
      </div>

      {/* PRODUCTOS */}
      <section className="productos">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(producto => (
            <div className="inicio-producto" key={producto.id}>
              <a href={producto.link} className="btn">
                {producto.img ? (
                  <img
                    src={producto.img}
                    alt={producto.nombre}
                    onError={e => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = "/src/assets/IMG/index/no-image.png";
                    }}
                  />
                ) : (
                  <img
                    src={"/src/assets/IMG/index/no-image.png"}
                    alt="Sin imagen"
                  />
                )}
              </a>
              <h3 className="nombre-producto">{producto.nombre}</h3>
              <p className="precio">{producto.precio || ''}</p>
              <p>{producto.descripcion}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
        {showMore && productosFiltrados.length > 0 && (
          <div style={{ width: "650%", marginTop: "20px", display: "flex", justifyContent: "center" }}>
            <button className="btn-cerrar-extra" onClick={() => setShowMore(false)}>
              Cerrar productos extra
            </button>
          </div>
        )}
      </section>

      {/* Botón Ver más productos */}
      <div className="ver-mas-container">
        {!showMore && (
          <a href="#" className="btn" onClick={(e) => { e.preventDefault(); setShowMore(true); }}>
            <button className="btn-vermas">Ver más productos</button>
          </a>
        )}
      </div>

      {/* Botón flotante del chat */}
      {/* Modal para agregar producto (solo vendedor) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Agregar nuevo producto</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmitAddProduct}>
              <label>Nombre</label>
              <input className="modal-input" value={formNombre} onChange={e => setFormNombre(e.target.value)} required />

              <label>Descripción</label>
              <textarea value={formDescripcion} onChange={e => setFormDescripcion(e.target.value)} />

              <label>Precio</label>
              <input className="modal-input" value={formPrecio} onChange={e => setFormPrecio(e.target.value)} required />

              <div className="row-small">
                <div>
                  <label style={{textAlign:'center', display:'block'}}>Cantidad</label>
                  <input className="modal-input-small" type="number" value={formCantidad} onChange={e => setFormCantidad(Number(e.target.value))} min={0} />
                </div>
                <div>
                  <label style={{textAlign:'center', display:'block'}}>Stock mínimo</label>
                  <input className="modal-input-small" type="number" value={formStockMinimo} onChange={e => setFormStockMinimo(Number(e.target.value))} min={0} />
                </div>
              </div>

              <label>Categoría</label>
              <select value={formCategoriaId} onChange={e => setFormCategoriaId(Number(e.target.value))}>
                {categories.length === 0 && <option value={1}>Sin categorías</option>}
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <label style={{marginTop:8}}>
                <input type="checkbox" checked={formDisponible} onChange={e => setFormDisponible(e.target.checked)} /> Disponible
              </label>

              <label style={{marginTop:6}}>Imagen / Video</label>
              <input type="file" accept="image/*,video/*" onChange={handleFileChange} />

              {formFile && formFile.type.startsWith('image/') && (
                <div style={{marginTop:8}}>
                  <strong>Previsualización:</strong>
                  <div style={{marginTop:6}}>
                    <img src={URL.createObjectURL(formFile)} alt="preview" style={{maxWidth:'100%', borderRadius:8}} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 16, marginTop: 20, justifyContent:'center' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Crear producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!chatOpen && (
        <>
          {isSeller && (
            <button className="up-btn" onClick={() => setShowAddModal(true)} aria-label="Agregar producto">
              <i className="fa-solid fa-plus"></i>
            </button>
          )}
          <button className="chat-btn" onClick={() => setChatOpen(true)} aria-label="Abrir chat">
            <i className="fa-solid fa-comment"></i>
          </button>
        </>
      )}

      {chatOpen && (
        <div className={`chatbox-float ${closing ? 'chatbox-float-closing' : ''}`}>
          <div className="chatbox-header">
            <span>Soporte JOSNISHOP</span>
            <button className="chatbox-close" onClick={handleCloseChat} aria-label="Cerrar chat">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="chatbox-body" ref={chatBodyRef}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chatbox-message chatbox-message-${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form className="chatbox-footer" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={chatInput}
              onChange={e => { setChatInput(e.target.value); setLastUserMessage(e.target.value); }}
              autoFocus
              maxLength={chatConfig.maxLength}
            />
            <button
              className="chatbox-send"
              type="submit"
              disabled={chatInput.trim() === ""}
              aria-label="Enviar mensaje"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
          {/* Contactanos por WhatsApp button under the chat form */}
          <div style={{ padding: '10px 12px' }}>
            {(whatsappUrl || waPhone) && (
              <a href={whatsappUrl || (`https://wa.me/${waPhone}?text=${encodeURIComponent(lastUserMessage || 'Hola, necesito ayuda')}`)} target="_blank" rel="noreferrer">
                <button style={{ width: '100%', background: '#25D366', color: '#fff', padding: '12px 16px', borderRadius: 24, fontSize: 16 }}>Contáctanos por WhatsApp</button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;