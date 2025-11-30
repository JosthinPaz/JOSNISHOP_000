# 🛍️ JOSNISHOP Frontend Documentation

## 📋 Descripción General
JOSNISHOP es una plataforma de e-commerce moderna y completa, desarrollada con las últimas tecnologías web. Esta aplicación ofrece una experiencia de compra intuitiva y segura, con un diseño responsive que se adapta a cualquier dispositivo.

### 🎯 Objetivos del Proyecto
- Proporcionar una experiencia de compra fluida y agradable
- Ofrecer una gestión completa de productos y ventas
- Garantizar la seguridad en las transacciones
- Facilitar la administración del inventario
- Proporcionar análisis detallados de ventas

### 🌟 Características Destacadas
1. **Interfaz Moderna y Responsive**
   - Diseño adaptativo para móviles, tablets y escritorio
   - Animaciones suaves y transiciones elegantes
   - Tiempo de carga optimizado

2. **Sistema de Usuarios**
   - Registro y autenticación seguros
   - Perfiles personalizados
   - Historial de compras
   - Gestión de direcciones de envío

3. **Gestión de Productos**
   - Categorización inteligente
   - Búsqueda avanzada
   - Filtros dinámicos
   - Sistema de valoraciones

4. **Panel Administrativo**
   - Dashboard interactivo
   - Reportes en tiempo real
   - Gestión de inventario
   - Control de pedidos

## 🛠️ Stack Tecnológico

### Core Technologies
- **React 18**
  - Hooks personalizados para lógica reutilizable
  - Context API para gestión de estado global
  - Componentes funcionales con TypeScript
  - Lazy loading para optimización

- **TypeScript**
  - Tipos estrictos para prevención de errores
  - Interfaces bien definidas
  - Generics para componentes reutilizables
  - Utilidades de tipo avanzadas

- **Vite**
  - Desarrollo rápido con HMR (Hot Module Replacement)
  - Construcción optimizada para producción
  - Gestión eficiente de assets
  - Plugins configurados para optimización

### UI/UX
- **CSS Modules**
  - Estilos modulares y scoped
  - Variables CSS personalizadas
  - Diseño responsive con Flexbox y Grid
  - Animaciones optimizadas

- **Framer Motion**
  - Animaciones fluidas y profesionales
  - Gestos móviles
  - Transiciones entre páginas
  - Efectos de scroll

### State Management & Data Fetching
- **React Query**
  - Caché optimizada
  - Revalidación automática
  - Gestión de estado del servidor
  - Manejo de errores integrado

- **Axios**
  - Interceptores configurados
  - Retry en fallos
  - Timeout personalizado
  - Transformación de respuestas

### Reportes y Documentos
- **ExcelJS**
  - Reportes detallados
  - Estilos personalizados
  - Fórmulas automáticas
  - Múltiples hojas de cálculo

- **jsPDF**
  - Documentos PDF personalizados
  - Tablas formateadas
  - Gráficos integrados
  - Headers y footers automáticos

### Utilidades y Herramientas
- **Date-fns**
  - Manipulación de fechas
  - Formateo internacional
  - Zonas horarias
  - Cálculos de tiempo

- **React-Icons**
  - Iconos vectoriales
  - Múltiples librerías
  - Personalización de tamaño y color
  - Optimización de carga

## 📁 Arquitectura y Estructura

### Patrones de Diseño Implementados
1. **Container/Presentational Pattern**
   - Separación de lógica y presentación
   - Componentes reutilizables
   - Mejor testeabilidad
   - Mantenimiento simplificado

2. **Custom Hooks Pattern**
   - Lógica reutilizable
   - Separación de preocupaciones
   - Testing simplificado
   - Código más limpio

3. **Context + Reducer Pattern**
   - Gestión de estado global
   - Acciones tipadas
   - Reducers puros
   - Estado predecible

### 🗂️ Estructura del Proyecto

```
src/
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
│
├── public/
│   └── logo.png
│
└── src/
    ├── App.css
    ├── App.tsx
    ├── main.tsx
    ├── vite-env.d.ts
    │
    ├── assets/
    │   ├── css/
    │   │   ├── carrito.css
    │   │   ├── categorias.css
    │   │   ├── contactanos.css
    │   │   ├── inicio.css
    │   │   ├── login.css
    │   │   ├── nosotros.css
    │   │   ├── noticias.css
    │   │   ├── panel.css
    │   │   ├── pedido.css
    │   │   ├── Perfil.css
    │   │   ├── recuperar.css
    │   │   ├── register.css
    │   │   ├── reseña.css
    │   │   └── categorias/
    │   └── IMG/
    │       ├── inicio_video.mp4
    │       ├── logo.png
    │       ├── nosotros.png
    │       ├── noticias1.png
    │       ├── noticias2.png
    │       ├── noticias3.png
    │       └── categorias/
    │
    ├── components/
    │   ├── Categorias/
    │   ├── hamburguesa/
    │   │   ├── contactanos.tsx
    │   │   ├── nosotros.tsx
    │   │   └── noticias.tsx
    │   ├── panel/
    │   │   ├── Categorias.tsx
    │   │   ├── detalle.tsx
    │   │   ├── Inventario.tsx
    │   │   ├── ModalResena.tsx
    │   │   ├── Pedidos.tsx
    │   │   ├── Perfil.tsx
    │   │   ├── Producto.tsx
    │   │   └── resenas.tsx
    │   └── Productos_index/
    │       ├── producto_audifonosE6S.tsx
    │       ├── producto_AuricularesPro.tsx
    │       ├── producto_bolso.tsx
    │       ├── producto_cafeteria.tsx
    │       ├── producto_cocina.tsx
    │       ├── producto_lienzo.tsx
    │       ├── producto_perro.tsx
    │       ├── producto_play.tsx
    │       ├── producto_reloj.tsx
    │       ├── producto_set.tsx
    │       ├── producto_sofa.tsx
    │       └── producto_zapatillas.tsx
    │
    ├── pages/
    │   ├── carrito.tsx
    │   ├── categorias.tsx
    │   ├── inicio.tsx
    │   ├── login.tsx
    │   ├── Panel.tsx
    │   ├── recuperar_contrasena.tsx
    │   └── register.tsx
    │
    └── services/
        └── (servicios y utilidades)
```

---

## Principales Archivos y Carpetas

- **index.html**  
  Archivo HTML principal donde se monta la aplicación React.

- **vite.config.ts**  
  Configuración de Vite para el proyecto.

- **public/**  
  Archivos estáticos accesibles desde la raíz del sitio (por ejemplo, favicon/logo).

- **src/App.tsx**  
  Componente principal de la aplicación.

- **src/main.tsx**  
  Punto de entrada de React, configuración de rutas con React Router.

- **src/App.css**  
  Estilos globales de la aplicación.

- **src/assets/**  
  Recursos multimedia y CSS adicionales.

- **src/pages/login.tsx**  
  Página de inicio de sesión.

- **src/components/**  
  Componentes reutilizables (puedes agregar aquí tus propios componentes).

- **src/services/**  
  Servicios y utilidades para la app.

---

## Instalación y Uso

1. **Instala las dependencias:**
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abre en tu navegador:**  
   [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite).

---

## Funcionalidades Destacadas

- **Sistema de reseñas:**  
  Los usuarios pueden dejar, editar y eliminar reseñas de productos.  
  El modal de reseñas tiene fondo borroso y diseño moderno.

- **Panel de administración:**  
  Visualización y gestión de productos, inventario, pedidos y reseñas.

- **Notificaciones:**  
  El backend envía alertas por correo al vendedor cada vez que se publica una nueva reseña.

- **Filtrado de comentarios:**  
  Los comentarios ofensivos o inapropiados son detectados y bloqueados antes de publicar o editar una reseña.

- **Diseño responsivo:**  
  Adaptado para dispositivos móviles y escritorio.

---

## Tecnologías Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/)
- [Font Awesome](https://fontawesome.com/) (íconos)
- [CSS moderno](https://developer.mozilla.org/es/docs/Web/CSS) (panel.css, reseña.css, etc.)

---

## Notas

- Los archivos multimedia y el logo deben estar en la carpeta `public` o en `src/assets/IMG/` según su uso.
- Para agregar nuevas páginas, crea archivos en `src/pages/` y añade la ruta en `main.tsx`.
- Los estilos globales están en `src/App.css`, pero puedes agregar más en `src/assets/css/`.
- El modal de reseñas utiliza `reseña.css` para el fondo borroso y tarjeta centrada.
- El sistema de reseñas está conectado con el backend para notificar al vendedor por correo y filtrar comentarios ofensivos.

---

## 🧩 Componentes del Sistema

### 📊 Panel Administrativo (`/components/panel/`)

#### 1. Dashboard Principal (`Panel.tsx`)
```typescript
// Ejemplo de uso del dashboard
const Dashboard: React.FC = () => {
  const { data: ventas } = useVentas();
  const { data: metricas } = useMetricas();
  // ... lógica del componente
}
```
- Métricas en tiempo real
- Gráficos interactivos
- KPIs principales
- Notificaciones

#### 2. Gestión de Productos (`Producto.tsx`)
- Sistema CRUD completo
- Upload de imágenes
- Variantes de productos
- Control de stock
- SEO optimization

#### 3. Sistema de Ventas (`SalesReportModal.tsx`)
```typescript
// Ejemplo de generación de reportes
const generateExcelReport = async (data: SalesData) => {
  const workbook = new ExcelJS.Workbook();
  // ... configuración del reporte
}
```
- Reportes personalizables
- Múltiples formatos de exportación
- Filtros avanzados
- Gráficos de tendencias

#### 4. Gestión de Inventario (`Inventario.tsx`)
- Control de stock en tiempo real
- Alertas de bajo stock
- Historial de movimientos
- Proyecciones de inventario

### 🛍️ Catálogo de Productos (`/components/Productos_index/`)

#### 1. Vista de Producto (`ProductoDetalle.tsx`)
```typescript
// Ejemplo de implementación de zoom
const ProductZoom: React.FC<ProductZoomProps> = ({ image }) => {
  const [zoom, setZoom] = useState(1);
  // ... lógica de zoom
}
```
- Zoom de imágenes
- Galería interactiva
- Variantes de producto
- Información detallada

#### 2. Sistema de Reseñas (`ResenasProducto.tsx`)
- Valoraciones con estrellas
- Filtrado de reseñas
- Moderación automática
- Fotos de usuarios

### 🤖 ChatBot (`/components/ChatBot/`)

#### Asistente Virtual (`ChatBot.tsx`)
```typescript
// Ejemplo de procesamiento de mensajes
const processMessage = async (message: string) => {
  const response = await AI.process(message);
  // ... lógica de respuesta
}
```
- IA para respuestas
- Sugerencias contextuales
- Historial de conversación
- Integración con servicio al cliente

### Sistema de Productos (`/components/Productos_index/`)
- **ProductoDetalle.tsx**: Vista detallada de productos
- **ResenasProducto.tsx**: Sistema de reseñas y calificaciones
- Componentes individuales para cada producto destacado

## 🔒 Seguridad y Optimización

### Seguridad Implementada

#### 1. Autenticación y Autorización
```typescript
// Ejemplo de hook de autenticación
const useAuth = () => {
  const [token] = useLocalStorage('auth_token');
  const isAuthenticated = useCallback(() => {
    return verifyToken(token);
  }, [token]);
  // ... más lógica de autenticación
}
```
- JWT con rotación de tokens
- Refresh tokens automáticos
- Sesiones seguras
- Protección de rutas

#### 2. Protección contra Ataques
- **XSS Prevention**
  - Sanitización de inputs
  - Content Security Policy
  - HttpOnly cookies
  - Escape de datos dinámicos

- **CSRF Protection**
  - Tokens CSRF
  - SameSite cookies
  - Validación de origen

#### 3. Seguridad de Datos
- Encriptación en tránsito
- Sanitización de uploads
- Validación de tipos MIME
- Límites de tamaño de archivo

### 🚀 Optimización de Rendimiento

#### 1. Carga Optimizada
```typescript
// Ejemplo de lazy loading
const ProductDetail = lazy(() => import('./ProductDetail'));
const LazyComponent: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <ProductDetail />
  </Suspense>
);
```
- Lazy loading de componentes
- Code splitting automático
- Preload de recursos críticos
- Optimización de imágenes

#### 2. Caché y Estado
- React Query para caché
- Memorización selectiva
- Estado persistente
- Revalidación inteligente

#### 3. Optimización de Bundle
- Tree shaking
- Minificación avanzada
- Splitting de CSS
- Compresión Gzip/Brotli

#### 4. Monitoreo y Análisis
- Lighthouse scores
- Web Vitals tracking
- Error boundaries
- Performance monitoring

### Mejores Prácticas Implementadas
1. **Arquitectura**
   - Componentes modulares
   - Separación de responsabilidades
   - Reutilización de código

2. **Performance**
   - Lazy loading de componentes
   - Optimización de imágenes
   - Minimización de re-renders

3. **Mantenibilidad**
   - Código comentado
   - Nombres descriptivos
   - Estructura clara de archivos

## 🛠️ Desarrollo y Despliegue

### Configuración del Entorno

#### 1. Variables de Entorno
```bash
# .env.development
VITE_API_URL=http://localhost:8000
VITE_STORAGE_URL=http://localhost:8000/storage
VITE_CHAT_WS=ws://localhost:8000/ws

# .env.production
VITE_API_URL=https://api.josnishop.com
VITE_STORAGE_URL=https://storage.josnishop.com
VITE_CHAT_WS=wss://api.josnishop.com/ws
```

#### 2. Scripts Disponibles
```bash
# Desarrollo
npm run dev         # Inicia el servidor de desarrollo
npm run test       # Ejecuta tests unitarios
npm run test:e2e   # Ejecuta tests end-to-end
npm run lint       # Verifica el código
npm run lint:fix   # Corrige problemas de linting

# Construcción
npm run build      # Construye para producción
npm run build:analyze  # Analiza el bundle
npm run preview    # Vista previa de producción

# Utilidades
npm run type-check # Verifica tipos TS
npm run format     # Formatea el código
```

### 🚀 Proceso de Desarrollo

#### 1. Configuración Inicial
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/josnishop-frontend.git

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env.local
```

#### 2. Flujo de Trabajo
1. Crear rama de feature
2. Desarrollar con hot reload
3. Ejecutar tests unitarios
4. Verificar tipos y linting
5. Crear Pull Request

#### 3. Build y Deploy
```bash
# Build de producción
npm run build

# Análisis de bundle
npm run build:analyze

# Preview local
npm run preview
```

### 📊 Monitoreo y Mantenimiento

#### 1. Performance Monitoring
- Lighthouse CI
- Web Vitals tracking
- Error tracking
- User analytics

#### 2. Mantenimiento
- Updates semanales
- Auditorías de seguridad
- Optimización continua
- Backups automáticos

#### 3. CI/CD Pipeline
```yaml
# Ejemplo de GitHub Actions
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install
        run: npm ci
      - name: Test
        run: npm test
      - name: Build
        run: npm run build
```

## Contribución
Para contribuir al proyecto:
1. Fork del repositorio
2. Crear rama para features
3. Seguir guías de estilo
4. Documentar cambios
5. Crear Pull Request

## Autor

JOSNISHOP - Compra sin límites

---
