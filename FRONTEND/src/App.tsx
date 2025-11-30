// Importaciones principales
import React, { useState } from "react";
import "./App.css";
import "font-awesome/css/font-awesome.min.css";
import { Link } from "react-router-dom";

// Componente principal de la página de videos y productos
const VideosPage: React.FC = () => {
  // Lista de videos a mostrar
  const videos = [
    "/src/assets/videos/app_intefaz/reloj_1.mp4",
    "/src/assets/videos/app_intefaz/cafetera.mp4",
    "/src/assets/videos/app_intefaz/bolso.mp4",
    "/src/assets/videos/app_intefaz/perro.mp4",
    "/src/assets/videos/app_intefaz/audifonos_1.mp4",
    "/src/assets/videos/app_intefaz/lienzo.mp4",
    "/src/assets/videos/app_intefaz/audifonos_2.mp4",
    "/src/assets/videos/app_intefaz/set.mp4",
  ];

  // Lista de productos destacados
  const productos = [
    {
      nombre: "Fitness Tracker, Reloj de Actividad",
      precio: "$69.990 COP",
      imagen: "/src/assets/IMG/Index/reloj.png",
      descripcion: "Reloj inteligente para monitorear actividad física.",
      cantidad: 1, 
    },
    {
      nombre: "Cafetera con molinillo 15 Bar",
      precio: "$57.990 COP",
      imagen: "/src/assets/IMG/Index/cafetera.png",
      descripcion: "Cafetera profesional con molinillo integrado.",
      cantidad: 1,
    },
    {
      nombre: "Bolso de hombro para mujer",
      precio: "$102.639 COP",
      imagen: "/src/assets/IMG/Index/bolso.png",
      descripcion: "Bolso elegante y espacioso para mujer.",
      cantidad: 1,
    },
    {
      nombre: "Chubasquero impermeable para perro",
      precio: "$19.779 COP",
      imagen: "/src/assets/IMG/Index/perro.png",
      descripcion: "Impermeable para perros, ideal para días lluviosos.",
      cantidad: 1,
    },
    {
      nombre: "Auriculares inalámbricos E6S",
      precio: "$19.699 COP",
      imagen: "/src/assets/IMG/Index/audifonos.png",
      descripcion: "Auriculares Bluetooth con estuche de carga.",
      cantidad: 1,
    },
    // Puedes mantener los productos anteriores si lo deseas
    {
      nombre: "Lienzo Bastidor 12 X 18 Cm En Caballete En Madera 280g/m2",
      precio: "$17.990 COP",
      imagen: "/src/assets/IMG/Index/lienzo.jpg",
      descripcion: "Lienzo Bastidor 12 X 18 Cm En Caballete En Madera 280g/m2",
      cantidad: 1,
    },
    {
      nombre: "Audífonos Bluetooth Deportivos",
      precio: "$49.900 COP",
      imagen: "/src/assets/IMG/Index/audifonos_deportivos.jpg",
      descripcion:
        "Audífonos inalámbricos con cancelación de ruido y batería de larga duración.",
      cantidad: 1,
    },
    {
      nombre: "Set de Pintura Acrílica 24 Colores",
      precio: "$29.990 COP",
      imagen: "/src/assets/IMG/Index/set.jpg",
      descripcion:
        "Set de pintura acrílica profesional, ideal para artistas y principiantes.",
      cantidad: 1,
    },
  ];

  // Comentarios asociados a cada video
  const comentariosPorVideo = [
    // Fitness Tracker, Reloj de Actividad
    [
      { usuario: "LauraFit", texto: "¡Me encanta este reloj, súper útil para el gym!" },
      { usuario: "CarlosRunner", texto: "¿La batería dura todo el día?" },
      { usuario: "AnaSalud", texto: "¿Es resistente al agua?" },
      { usuario: "JaviTech", texto: "El mejor para monitorear pasos, lo recomiendo." },
    ],
    // Cafetera con molinillo 15 Bar
    [
      { usuario: "BaristaPro", texto: "¡Hace un café delicioso y el molinillo es genial!" },
      { usuario: "SofiCoffee", texto: "¿Es fácil de limpiar?" },
      { usuario: "JuanitoLatte", texto: "¿Viene con accesorios?" },
      { usuario: "CataCafé", texto: "Me llegó rápido, excelente producto." },
    ],
    // Bolso de hombro para mujer
    [
      { usuario: "MarceStyle", texto: "¡Hermoso bolso, combina con todo!" },
      { usuario: "LuisaFashion", texto: "¿Es espacioso por dentro?" },
      { usuario: "DaniChic", texto: "Me encantan los detalles, muy elegante." },
      { usuario: "ValeBags", texto: "¿El material es resistente?" },
    ],
    // Chubasquero impermeable para perro
    [
      { usuario: "PetLover", texto: "¡Mi perrito ya no se moja en los paseos!" },
      { usuario: "DogMom", texto: "¿Hay tallas para perros grandes?" },
      { usuario: "LucasDog", texto: "Muy fácil de poner y quitar." },
      { usuario: "SofiMascotas", texto: "El color es súper bonito." },
    ],
    // Auriculares inalámbricos E6S
    [
      { usuario: "MusicFan", texto: "¡Sonido nítido y buen alcance Bluetooth!" },
      { usuario: "AndresBeats", texto: "¿Cuánto dura la batería?" },
      { usuario: "CamiTune", texto: "¿Se conectan fácil al celular?" },
      { usuario: "PabloBass", texto: "El estuche es muy práctico." },
    ],
    // Lienzo Bastidor 12 X 18 Cm En Caballete En Madera 280g/m2
    [
      { usuario: "ArtistaMajo", texto: "¡Perfecto para pintar en casa!" },
      { usuario: "LeoArte", texto: "¿El caballete viene incluido?" },
      { usuario: "SantiColors", texto: "La calidad del lienzo es excelente." },
      { usuario: "VanePinta", texto: "¿Sirve para óleo y acrílico?" },
    ],
    // Audífonos Bluetooth Deportivos
    [
      { usuario: "RunnerMax", texto: "¡No se caen al correr, súper cómodos!" },
      { usuario: "GabySport", texto: "¿Tienen cancelación de ruido?" },
      { usuario: "FerGym", texto: "La batería dura bastante." },
      { usuario: "LinaFit", texto: "¿Son resistentes al sudor?" },
    ],
    // Set de Pintura Acrílica 24 Colores
    [
      { usuario: "Colorista", texto: "¡Colores vibrantes y buena cobertura!" },
      { usuario: "MeliArt", texto: "¿Incluye pinceles?" },
      { usuario: "TomasArte", texto: "Ideal para principiantes." },
      { usuario: "SofiCreativa", texto: "Me encantó la variedad de tonos." },
    ],
  ];

  // Estados para navegación y modales
  const [current, setCurrent] = useState(0); // Índice del video/producto actual
  const [showCarrito, setShowCarrito] = useState(false); // Modal de carrito
  const [showComentarios, setShowComentarios] = useState(false); // Modal de comentarios
  const [comentarios, setComentarios] = useState(comentariosPorVideo[0]); // Comentarios actuales
  const [liked, setLiked] = useState(false);
  const [userActive, setUserActive] = useState(false);
  const [commentActive, setCommentActive] = useState(false);
  const [saved, setSaved] = useState(false);

  // Navega al video/producto anterior
  const handlePrev = () => {
    const nuevo = (current - 1 + videos.length) % videos.length;
    setCurrent(nuevo);
    setComentarios(comentariosPorVideo[nuevo]);
  };

  // Navega al video/producto siguiente
  const handleNext = () => {
    const nuevo = (current + 1) % videos.length;
    setCurrent(nuevo);
    setComentarios(comentariosPorVideo[nuevo]);
  };

  // Agrega un nuevo comentario al listado
  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.currentTarget.elements.namedItem(
      "nuevoComentario"
    ) as HTMLInputElement);
    if (input.value.trim()) {
      setComentarios([...comentarios, { usuario: "Tú", texto: input.value }]);
      input.value = "";
    }
  };

  // Agrega rutas específicas para cada producto
  const rutasVerMas = [
    "/productoreloj",
    "/ProductoCafeteria",
    "/productobolso",
    "/ProductoPerro",
    "/ProductoAudifonosE6S",
    "/ProductoLienzo",
    "/ProductoAuricularesPro",
    "/ProductoSet",
  ];

  const rutasCarrito = [
    "/login",
    "/login",
    "/login",
    "/login",
    "/login",
    "/login",
    "/login",
    "/login",
  ];

  // Renderizado principal
  return (
    <div className="container">
      {/* Sidebar izquierda con logo y buscador */}
      <aside className="sidebar">
        <img src="/logo.png" alt="Logo" className="logo" />
        <div className="search-box">
          <input type="text" placeholder="Buscar" />
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="main-contents">
        <div className="video-wrappers">
          {/* Controles de navegación de videos y carrito */}
          <div className="video-controls">
            <button className="nav-btn up" onClick={handlePrev}>
              <i className="fa fa-chevron-up"></i>
            </button>
            <button className="nav-btn down" onClick={handleNext}>
              <i className="fa fa-chevron-down"></i>
            </button>
            <button
              className="nav-btn cart"
              onClick={() => setShowCarrito(true)}
            >
              {/* icono de información del producto (reemplaza carrito) */}
              <i className="fa fa-info-circle" aria-hidden="true"></i>
            </button>
          </div>

          {/* Video principal */}
          <video
            key={current}
            controls
            poster=""
            src={videos[current]}
          >
            Tu navegador no soporta el video.
          </video>

{/* Barra lateral derecha con login y otros iconos */}
<nav className="right-bar">
  <div className="login-top">
    {(() => {
      const userName = localStorage.getItem("userName");
      const userId = localStorage.getItem("userId");
      if (userId) {
        return (
          <Link to="/panel" className="user-session" style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1b3a2b', fontSize: 18 }}>
            <i className="fa fa-user" style={{ fontSize: 22, marginRight: 8 }}></i>
            <span>{userName ? `Hola, ${userName}` : 'Mi cuenta'}</span>
          </Link>
        );
      } else {
        return (
          <Link to="/login" className={`login-link${userActive ? " anim" : ""}`} onClick={() => {
            setUserActive(true);
            setTimeout(() => setUserActive(false), 600);
          }}>
            <i className="fa fa-user"></i> Iniciar Sesión
          </Link>
        );
      }
    })()}
  </div>
  <div className="icon-list">
    <div className="icon-group top-group">
      <Link to="/"><i className="fa fa-home"></i></Link>
      <a href="/inicio"><i className="fa fa-briefcase"></i></a>
      <a href="/carrito"><i className="fa fa-shopping-cart"></i></a>
    </div>
    <div className="icon-group bottom-group">
      {/* usuario removido, solo iconos sociales abajo */}
      {/* <a href="#" className={userActive ? "anim" : ""} onClick={e => {
        e.preventDefault();
        setUserActive(true);
        setTimeout(() => setUserActive(false), 600);
      }}>
        <i className="fa fa-user"></i>
      </a> */}
      <a href="#" className={liked ? "anim liked" : ""} onClick={e => {
        e.preventDefault();
        setLiked(!liked);
      }}>
        <i className="fa fa-heart"></i>
      </a>
      <a href="#" className={commentActive ? "anim" : ""} onClick={e => {
        e.preventDefault();
        setCommentActive(true);
        setShowComentarios(true);
        setTimeout(() => setCommentActive(false), 600);
      }}>
        <i className="fa fa-comment"></i>
      </a>
      <a href="#" className={saved ? "anim saved" : ""} onClick={e => {
        e.preventDefault();
        setSaved(!saved);
      }}>
        <i className="fa fa-bookmark"></i>
      </a>
    </div>
  </div>
</nav>
  {/* Chat integrado en la página de inicio - se usa en /inicio */}
        </div>
      </main>

      {/* Modal del carrito de compras */}
      {showCarrito && (
        <div
          id="modalCarrito"
          style={{
            position: "fixed",
            top: "25em",
            left: "2em",
            background: "#fff",
            border: "2px solid #222",
            zIndex: 999,
            padding: "1.5em",
            borderRadius: "14px",
            boxShadow: "0 2px 14px rgba(244, 114, 114, 0.18)",
            width: "360px",
          }}
        >
          {/* Botón para cerrar el modal */}
          <button
            onClick={() => setShowCarrito(false)}
            style={{
              position: "absolute",
              top: "5px",
              right: "8px",
              background: "none",
              border: "none",
              fontSize: "1.2em",
              cursor: "pointer",
            }}
            className="modal-close-button"
          >
            &times;
          </button>
          {/* Imagen y detalles del producto */}
          <img
            src={productos[current].imagen}
            alt="Producto"
            style={{
              width: "80px",
              float: "left",
              marginRight: "10px",
              borderRadius: "8px",
            }}
          />
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontWeight: "bold", fontSize: "1em" }}>
              {productos[current].nombre}
            </div>
            <div style={{ color: "#888", fontSize: "0.9em" }}>
              {productos[current].descripcion}
            </div>
            <div style={{ color: "#e53935", fontWeight: "bold", fontSize: "1.2em", margin: "0.5em 0" }}>
              {productos[current].precio}
            </div>
            <div style={{ fontSize: "0.9em" }}>Cantidad {productos[current].cantidad}</div>
            <div style={{ marginTop: "1em", display: "flex", gap: "1em" }}>
              <button style={{
                background: "#43a047",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.5em 1.2em",
                cursor: "pointer"
              }} onClick={() => window.location.href = rutasVerMas[current]}>
                Ver más +
              </button>
              <button style={{
                background: "#8bc34a",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.5em 1.2em",
                cursor: "pointer"
              }}
                onClick={() => window.location.href = rutasCarrito[current]}
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de comentarios */}
      {showComentarios && (
        <div
          id="modalComentarios"
          style={{
            position: "fixed",
            top: "10em",
            right: "2em",
            background: "#fff",
            border: "2px solid #222",
            zIndex: 999,
            padding: "2em",
            borderRadius: "18px",
            boxShadow: "0 2px 18px rgba(0,0,0,0.18)",
            width: "420px",
            minHeight: "420px",
          }}
        >
          {/* Botón para cerrar el modal */}
          <button
            className="modal-close-btn"
            onClick={() => setShowComentarios(false)}
          >
            &times;
          </button>
          <div style={{ fontWeight: "bold", fontSize: "1.2em", marginBottom: "0.7em" }}>
            Comentarios
          </div>
          <div id="comentariosLista">
            {comentarios.map((comentario, idx) => (
              <div key={idx} style={{ marginBottom: "0.7em" }}>
                <span style={{ fontWeight: "bold" }}>
                  <i className="fa fa-user"></i> {comentario.usuario}
                </span>
                <div style={{ marginLeft: "1.5em" }}>{comentario.texto}</div>
              </div>
            ))}
          </div>
          {/* Formulario para agregar comentario */}
          <form onSubmit={handleAddComment} style={{ marginTop: "1em" }}>
            <input
              type="text"
              name="nuevoComentario"
              placeholder="Escribe tu comentario..."
              style={{
                width: "100%",
                padding: "0.5em",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "0.5em"
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#43a047",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.5em",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Comentar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// Componente principal de la app, renderiza la página de videos
const App: React.FC = () => {
  return (
    <div>
      <VideosPage />
    </div>
  );
};

export default App;

