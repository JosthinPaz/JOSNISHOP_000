import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import App from './App.tsx'
import Registro from './pages/register'
import RecuperarContrasena from './pages/recuperar_contrasena';
import "font-awesome/css/font-awesome.min.css";
import "./assets/css/animations.css";
import "./assets/css/component-animations.css";
import Panel from "./pages/Panel";
import Inicio from "./pages/inicio";
import Categorias from "./pages/categorias";
import ProtectedRoute from "./components/ProtectedRoute";
import Hogar from "./components/Categorias/Hogar";
import Accesorios from "./components/Categorias/Accesorios";
import Bisuteria from "./components/Categorias/Bisuteria";
import ModaMujer from "./components/Categorias/ModaMujer";
import Electricidad from "./components/Categorias/Electricidad";
import Deporte from "./components/Categorias/Deporte";
import ModaHombre from "./components/Categorias/ModaHombre";
import Muebles from "./components/Categorias/Muebles";
import Mascota from "./components/Categorias/Mascota";
import Seguridad from "./components/Categorias/Seguridad";
import Juguetes from "./components/Categorias/Juguetes";
import Noticias from "./components/hamburguesa/noticias";
import Nosotros from "./components/hamburguesa/nosotros";
import Contactanos from "./components/hamburguesa/contactanos";
import ProductoBolso from "./components/Productos_index/producto_bolso";
import Productoreloj from "./components/Productos_index/producto_reloj";
import ProductoCafeteria from "./components/Productos_index/producto_cafeteria.tsx";
import ProductoPerro from "./components/Productos_index/producto_perro";
import ProductoAudifonosE6S from "./components/Productos_index/producto_audifonosE6S";
import ProductoAuricularesPro from "./components/Productos_index/producto_AuricularesPro";
import ProductoSet from "./components/Productos_index/producto_set";
import ProductoCocina from "./components/Productos_index/producto_cocina";
import ProductoPlay from "./components/Productos_index/producto_play";
import ProductoSofa from "./components/Productos_index/producto_sofa";
import ProductoZapatillas from "./components/Productos_index/producto_zapatillas";
import ProductoLienzo from "./components/Productos_index/producto_lienzo";
import ProductoDetalle from "./components/Productos_index/ProductoDetalle";
import Carrito from './pages/carrito.tsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ResenasPanel from "./components/panel/resenas.tsx";
import Ventas from "./components/panel/Ventas";
import { ToastProvider } from "./contexts/ToastContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter basename="/JOSNISHOP_000">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/recuperar_contrasena" element={<RecuperarContrasena />} />
        <Route path="/panel" element={<ProtectedRoute element={<Panel />} />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/categorias" element={<Categorias />} />
  <Route path="/categoria/hogar" element={<Hogar />} />
        <Route path="/categoria/accesorios" element={<Accesorios />} />
        <Route path="/categoria/bisuteria" element={<Bisuteria />} />
        <Route path="/categoria/moda-mujer" element={<ModaMujer />} />
        <Route path="/categoria/electricidad" element={<Electricidad />} />
        <Route path="/categoria/deporte" element={<Deporte />} />
        <Route path="/categoria/moda-hombre" element={<ModaHombre />} />
        <Route path="/categoria/muebles" element={<Muebles />} />
        <Route path="/categoria/mascota" element={<Mascota />} />
        <Route path="/categoria/seguridad" element={<Seguridad />} />
        <Route path="/categoria/juguetes" element={<Juguetes />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/productobolso" element={<ProductoBolso />} />
        <Route path="/productoreloj" element={<Productoreloj />} />
        <Route path="/ProductoCafeteria" element={<ProductoCafeteria />} />
        <Route path="/ProductoPerro" element={<ProductoPerro />} />
        <Route path="/ProductoAudifonosE6S" element={<ProductoAudifonosE6S />} />
        <Route path="/ProductoAuricularesPro" element={<ProductoAuricularesPro />} />
        <Route path="/ProductoSet" element={<ProductoSet />} />
        <Route path="/ProductoCocina" element={<ProductoCocina />} />
        <Route path="/ProductoPlay" element={<ProductoPlay />} />
        <Route path="/ProductoSofa" element={<ProductoSofa />} />
        <Route path="/ProductoZapatillas" element={<ProductoZapatillas />} />
        <Route path="/ProductoLienzo" element={<ProductoLienzo />} />
  <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/reseñas/:productoId" element={<ResenasPanel productoId={0} esVendedor={false} />} />
        <Route path="/ventas" element={<Ventas />} />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
)
