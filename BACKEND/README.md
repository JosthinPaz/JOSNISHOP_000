# 🚀 JOSNISHOP - Backend Documentation

## 📋 Descripción General

JOSNISHOP Backend es una API RESTful robusta y escalable desarrollada con FastAPI, implementando una arquitectura moderna para e-commerce. Esta API proporciona todas las funcionalidades necesarias para gestionar una tienda en línea completa, desde la gestión de productos hasta el procesamiento de pagos.

### 🎯 Características Principales

#### 1. Arquitectura Modular
- Diseño basado en módulos independientes
- Separación clara de responsabilidades
- Fácil mantenimiento y escalabilidad
- Patrones de diseño modernos

#### 2. Seguridad Avanzada
- Autenticación JWT con refresh tokens
- Protección contra ataques CSRF/XSS
- Rate limiting y throttling
- Validación robusta de datos

#### 3. Rendimiento Optimizado
- Consultas SQL optimizadas
- Caché implementado
- Procesamiento asíncrono
- Paginación eficiente

#### 4. Integración Completa
- Procesamiento de pagos
- Sistema de notificaciones
- Gestión de archivos
- Análisis en tiempo real

---

## 📁 Estructura del Proyecto

```
BACKEND/
│
├── main.py                  # Punto de entrada de la aplicación FastAPI
├── requirements.txt         # Dependencias del proyecto
├── alembic.ini              # Configuración de migraciones Alembic
├── pyproject.toml           # Configuración de linters y formateadores
├── README.md                # Este archivo
│
├── controllers/             # Lógica de negocio y rutas por entidad
│   ├── categoria_controller.py
│   ├── producto_controller.py
│   ├── usuario_controller.py
│   ├── rol_controller.py
│   ├── inventario_controller.py
│   ├── item_controller.py
│   ├── pedido_controller.py
│   ├── chat_controller.py
│   ├── detalle_pedido_controller.py
│   ├── notificacion_controller.py
│   ├── resena_controller.py
│   ├── video_controller.py
│   └── ...
│
├── db/                      # Configuración de la base de datos y sesión
│   ├── __init__.py
│   ├── base.py
│   ├── database.py
│   └── session.py
│
├── dtos/                    # Esquemas Pydantic para validación y serialización
│   ├── categoria_dto.py
│   ├── producto_dto.py
│   ├── usuario_dto.py
│   ├── rol_dto.py
│   ├── inventario_dto.py
│   ├── item_dto.py
│   ├── pedido_dto.py
│   ├── chat_dto.py
│   ├── detalle_pedido_dto.py
│   ├── notificacion_dto.py
│   ├── resena_dto.py
│   └── video_dto.py
│
├── ENDPOINTS/               # Requests de prueba para Bruno
│   ├── Categoria/
│   ├── Productos/
│   ├── Usuarios/
│   ├── Roles/
│   ├── Inventario/
│   ├── Item/
│   ├── DetallePedido/
│   ├── Notificaciones/
│   ├── Resenas/
│   ├── Videos/
│   ├── Chats/
│   └── bruno.json
│
├── migraciones/             # Migraciones de base de datos (Alembic)
│   ├── env.py
│   ├── README
│   ├── script.py.mako
│   └── versions/
│
├── models/                  # Modelos ORM de SQLAlchemy
│   ├── __init__.py
│   ├── categoria.py
│   ├── producto.py
│   ├── usuarios.py
│   ├── roles.py
│   ├── inventario.py
│   ├── item.py
│   ├── pedido.py
│   ├── detallepedido.py
│   ├── videos.py
│   ├── notificaciones.py
│   ├── chatbox.py
│   └── resenas.py
│
├── utils/                   # Utilidades (correo, JWT, etc.)
│   ├── email_utils.py
│   ├── jwt_utils.py
│   └── ...
│
├── .gitignore
├── env.text
├── SQL_JOSNISHOP_final.sql  # Script SQL para crear la base de datos
├── test.db                  # Base de datos de pruebas (SQLite)
├── __pycache__/             # Archivos temporales de Python
├── .idea/                   # Configuración de proyecto para IDE (puedes ignorar)
└── .ruff_cache/             # Cache de linter Ruff
```

---

## �️ Stack Tecnológico

### Core Technologies

#### 1. Backend Framework
- **FastAPI v0.109.2**
  ```python
  from fastapi import FastAPI, Depends, HTTPException
  from fastapi.middleware.cors import CORSMiddleware
  ```
  - Framework asíncrono de alto rendimiento
  - Documentación automática con Swagger/ReDoc
  - Validación automática con Pydantic
  - Middleware y dependencias integradas

#### 2. Base de Datos
- **SQLAlchemy v2.0.25**
  ```python
  from sqlalchemy.ext.asyncio import AsyncSession
  from sqlalchemy.orm import declarative_base
  ```
  - ORM completo y flexible
  - Soporte para múltiples bases de datos
  - Query builder poderoso
  - Gestión de sesiones asíncronas

- **Alembic v1.13.1**
  ```python
  # alembic/env.py
  from alembic import context
  from sqlalchemy import engine_from_config
  ```
  - Migraciones automáticas
  - Versionado de base de datos
  - Rollbacks seguros
  - Scripts de migración

#### 3. Validación y Serialización
- **Pydantic v2.6.1**
  ```python
  from pydantic import BaseModel, Field, validator
  ```
  - Validación de datos en tiempo real
  - Serialización/deserialización automática
  - Integración con FastAPI
  - Documentación automática

### Herramientas de Desarrollo

#### 1. Code Quality
- **Black v24.1.1**: Formateador de código
  ```toml
  # pyproject.toml
  [tool.black]
  line-length = 88
  target-version = ['py39']
  ```

- **Ruff v0.2.1**: Linter ultrarrápido
  ```toml
  [tool.ruff]
  select = ["E", "F", "B", "I"]
  ```

- **isort v5.13.2**: Organizador de imports
  ```toml
  [tool.isort]
  profile = "black"
  multi_line_output = 3
  ```

#### 2. Testing y Documentación
- **Pytest v8.0.0**: Framework de testing
  ```python
  import pytest
  from fastapi.testclient import TestClient
  ```

- **Bruno**: Testing de API
  ```json
  // bruno.json
  {
    "version": "1",
    "name": "JOSNISHOP API Tests"
  }
  ```

### Base de Datos
- **MariaDB/MySQL**: Producción
  - Escalabilidad horizontal
  - Replicación y clustering
  - Backups automatizados
  - Optimización de queries

- **SQLite**: Desarrollo/Testing
  - Configuración sin servidor
  - Portabilidad completa
  - Ideal para pruebas
  - Rápido y ligero

### Utilidades y Extensiones
- **python-jose**: JWT authentication
- **passlib**: Hashing de contraseñas
- **python-multipart**: Manejo de archivos
- **fastapi-mail**: Envío de emails
- **python-dotenv**: Variables de entorno

---

## ⚙️ Guía de Instalación y Configuración

### 1. Preparación del Entorno

#### Requisitos Previos
- Python 3.9+
- MariaDB/MySQL
- Git
- Node.js (para Bruno)

#### Configuración Inicial
```bash
# Clonar el repositorio
git clone <url-del-repo>
cd JOSNISHOP-oficial/BACKEND

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
.\venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Configuración de la Base de Datos

#### Configuración de Variables de Entorno
```bash
# .env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/josnishop
SECRET_KEY=tu_clave_secreta_aqui
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_password_de_app
MAIL_FROM=noreply@josnishop.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
```

#### Configuración de la Base de Datos
```python
# db/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_async_engine(DATABASE_URL, echo=True)
```

#### Ejecución de Migraciones
```bash
# Generar migración
alembic revision --autogenerate -m "Initial migration"

# Aplicar migraciones
alembic upgrade head

# Revertir migración (si es necesario)
alembic downgrade -1
```

### 3. Configuración del Servidor

#### Development
```bash
# Iniciar servidor de desarrollo
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Con workers (producción)
uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000
```

#### Producción
```bash
# Configurar Gunicorn (Linux/Mac)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# O usar supervisor
[program:josnishop]
command=/path/to/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
directory=/path/to/JOSNISHOP-oficial/BACKEND
user=www-data
```

### 4. Verificación de la Instalación

1. **Comprobar API:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Verificar Documentación:**
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

3. **Test de Base de Datos:**
   ```bash
   pytest tests/test_db.py -v
   ```

### 5. Configuración Adicional

#### Caché Redis (Opcional)
```python
# utils/cache.py
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="josnishop-cache")
```

#### Logging
```python
# utils/logger.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

---

## 🛡️ Seguridad y Mejores Prácticas

### 1. Seguridad Implementada

#### Autenticación y Autorización
```python
# Middleware de autenticación
from fastapi import Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

@router.get("/protected")
async def protected_route(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    # Validación del token...
```

#### Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.get("/rate-limited")
@limiter.limit("5/minute")
async def rate_limited_route():
    return {"message": "Rate limited endpoint"}
```

#### Validación de Datos
```python
from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    nombre: str = Field(..., max_length=50)
```

#### Protección XSS
```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["josnishop.com"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://josnishop.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Calidad de Código

#### Code Formatting
```bash
# Formatear código
black .

# Ordenar imports
isort .

# Lint y fix
ruff check . --fix
```

#### Type Checking
```python
from typing import List, Optional

def get_user_orders(
    user_id: int,
    status: Optional[str] = None
) -> List[Order]:
    # Implementation...
```

#### Testing
```python
# tests/test_productos.py
import pytest
from fastapi.testclient import TestClient

def test_crear_producto():
    response = client.post(
        "/api/v1/productos",
        json={
            "nombre": "Test Producto",
            "precio": 100.00
        }
    )
    assert response.status_code == 201
```

### 3. Optimización de Rendimiento

#### Caché
```python
from fastapi_cache.decorator import cache

@router.get("/productos/{id}")
@cache(expire=300)  # Cache por 5 minutos
async def get_producto(id: int):
    return await find_producto(id)
```

#### Consultas Optimizadas
```python
# Eager Loading
query = select(Producto).options(
    joinedload(Producto.categoria),
    joinedload(Producto.resenas)
)
```

#### Paginación Eficiente
```python
from fastapi_pagination import Page, paginate

@router.get("/productos", response_model=Page[ProductoResponse])
async def list_productos(search: str = ""):
    productos = await get_productos_filtered(search)
    return paginate(productos)
```

### 4. Manejo de Errores

#### Error Handling Global
```python
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.detail
        }
    )
```

#### Validación de Modelos
```python
class ProductoCreate(BaseModel):
    nombre: str
    precio: float
    
    @validator('precio')
    def precio_valido(cls, v):
        if v <= 0:
            raise ValueError('El precio debe ser mayor a 0')
        return v
```

### 5. Logging y Monitoreo

#### Sistema de Logging
```python
import logging

logger = logging.getLogger(__name__)

@router.post("/productos")
async def create_producto(producto: ProductoCreate):
    logger.info(f"Creando producto: {producto.nombre}")
    try:
        # Implementación...
    except Exception as e:
        logger.error(f"Error al crear producto: {str(e)}")
        raise
```

#### Métricas y Monitoreo
```python
from prometheus_fastapi_instrumentator import Instrumentator

Instrumentator().instrument(app).expose(app)
```

---

## 📚 API Documentation

### 🔑 Autenticación

#### JWT Authentication
```python
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
```

### 📦 Endpoints Principales

#### 1. Gestión de Productos
```python
# Listar productos con filtros
GET /api/v1/productos?categoria={id}&precio_min={valor}&precio_max={valor}

# Crear nuevo producto
POST /api/v1/productos
{
    "nombre": "string",
    "descripcion": "string",
    "precio": float,
    "categoria_id": int,
    "stock": int
}

# Actualizar producto
PUT /api/v1/productos/{id}
```

#### 2. Sistema de Usuarios
```python
# Registro de usuario
POST /api/v1/usuarios/registro
{
    "nombre": "string",
    "email": "string",
    "password": "string",
    "rol_id": int
}

# Perfil de usuario
GET /api/v1/usuarios/perfil
Authorization: Bearer {token}
```

#### 3. Gestión de Pedidos
```python
# Crear pedido
POST /api/v1/pedidos
{
    "usuario_id": int,
    "items": [
        {
            "producto_id": int,
            "cantidad": int
        }
    ]
}

# Listar pedidos con filtros
GET /api/v1/pedidos?estado={estado}&fecha_inicio={date}&fecha_fin={date}
```

#### 4. Sistema de Reseñas
```python
# Añadir reseña
POST /api/v1/resenas
{
    "producto_id": int,
    "usuario_id": int,
    "calificacion": int,
    "comentario": "string"
}

# Listar reseñas por producto
GET /api/v1/resenas/producto/{id}
```

### 🔄 Respuestas Estandarizadas

#### Éxito
```json
{
    "status": "success",
    "data": {
        // datos solicitados
    },
    "message": "Operación exitosa"
}
```

#### Error
```json
{
    "status": "error",
    "error": {
        "code": "ERROR_CODE",
        "message": "Descripción del error"
    }
}
```

### 📝 Paginación Estándar
```python
@router.get("/productos")
async def list_productos(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=100),
    sort: str = Query("nombre"),
    order: str = Query("asc")
):
    productos = await get_productos(skip, limit, sort, order)
    return PaginatedResponse(
        data=productos,
        total=total,
        page=skip // limit + 1,
        per_page=limit
    )
```

### 🔍 Filtros y Búsqueda
```python
# Ejemplo de endpoint con filtros
GET /api/v1/productos?
    categoria=1&
    precio_min=100&
    precio_max=500&
    ordenar=precio&
    direccion=desc&
    buscar=zapatillas
```

### 📊 Endpoints de Análisis
```python
# Métricas de ventas
GET /api/v1/metricas/ventas?periodo=mensual

# Análisis de productos
GET /api/v1/metricas/productos/top-vendidos

# Estadísticas de usuarios
GET /api/v1/metricas/usuarios/actividad
```

Consulta la documentación interactiva completa en:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧪 Pruebas con Bruno

- En la carpeta `ENDPOINTS/` tienes subcarpetas con archivos `.bru` para probar todos los endpoints principales.
- Abre Bruno, importa la carpeta y ejecuta las requests para verificar el funcionamiento de la API.

---

## 📝 Notas y Funcionalidades Especiales

- **Organización:** Los modelos, controladores y esquemas están organizados por entidad para facilitar la escalabilidad y el mantenimiento.
- **Migraciones:** Todas las migraciones de base de datos se gestionan con Alembic en la carpeta `migraciones/`.
- **Validación:** Los esquemas de validación y serialización están en la carpeta `dtos/`.
- **Pruebas:** Requests de prueba para Bruno en la carpeta `ENDPOINTS/`.
- **Notificaciones:** El sistema envía alertas por correo al vendedor cada vez que se publica una nueva reseña (ver `utils/email_utils.py` y `controllers/resena_controller.py`).
- **Filtrado de comentarios:** Los comentarios ofensivos o inapropiados son detectados y bloqueados antes de publicar o editar una reseña.
- **Configuración de IDE:** La carpeta `.idea/` es solo para configuración de PyCharm/VSCode y puede ser ignorada.
- **Calidad de código:** Usa `black`, `isort` y `ruff` para mantener el código limpio y consistente.

---

## 🤝 Contribuciones

¿Quieres contribuir? ¡Eres bienvenido!  
Por favor, abre un issue o pull request para sugerencias, mejoras o reportar errores.

---

## 👤 Autor

Josthin Paz y Nicol Amaya

---

### 📦 ¿Cómo guardar todas tus dependencias actuales?

Para guardar todas las dependencias instaladas en tu entorno virtual en el archivo `requirements.txt`, ejecuta este comando en la terminal:

```sh
pip freeze > requirements.txt
```

Luego, sube el archivo `requirements.txt` a tu repositorio con tu gestor de versiones.

---

## 🛠️ Recomendaciones para Ingenieros en Sistemas

- Lee y entiende la estructura del proyecto antes de modificar o agregar nuevas funcionalidades.
- Usa entornos virtuales para evitar conflictos de dependencias.
- Mantén la base de datos y las migraciones actualizadas.
- Realiza pruebas de los endpoints con Bruno o la documentación interactiva de FastAPI.
- Sigue las convenciones de estilo y calidad de código (black, isort, ruff).
- Documenta cualquier cambio relevante en el código o en este README.