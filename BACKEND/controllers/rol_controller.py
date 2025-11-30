# Importamos las herramientas principales de FastAPI y SQLAlchemy.
# APIRouter: Para agrupar los endpoints de manera organizada.
# Depends: Sistema de inyección de dependencias para manejar la sesión de la base de datos.
# HTTPException: Clase para lanzar errores HTTP con mensajes específicos.
from fastapi import APIRouter, Depends, HTTPException
# Session: Tipo para la variable de sesión de la base de datos.
from sqlalchemy.orm import Session

# Importamos la función para crear la sesión de la base de datos.
from db.session import SessionLocal
# Importamos los modelos de Pydantic que definen la estructura de los datos para la API.
from dtos.rol_dto import RolCreate, RolOut, RolUpdate
# Importamos el modelo de SQLAlchemy que se mapea a la tabla 'roles' de la base de datos.
from models.roles import Rol

# Creamos un enrutador de FastAPI.
# El `prefix` establece la URL base para todos los endpoints en este archivo (ej. /roles/).
# Las `tags` agrupan los endpoints en la documentación (Swagger UI).
router = APIRouter(prefix="/roles", tags=["roles"])


# --- Dependencia de la base de datos ---

# Esta función de "dependencia" se encarga de gestionar la conexión a la base de datos.
# FastAPI la usará automáticamente para cada solicitud que la necesite.
def get_db():
    # Creamos una nueva sesión de base de datos.
    db = SessionLocal()
    try:
        # `yield` le pasa la sesión a la función de la ruta. El código después
        # de `yield` se ejecutará al final.
        yield db
    finally:
        # El bloque `finally` garantiza que la conexión a la base de datos se cierre siempre,
        # liberando recursos.
        db.close()


# --- Endpoints de la API para las operaciones CRUD ---

### 1. Crear un nuevo rol (POST)
# Define un endpoint para crear un nuevo recurso.
# `response_model=RolOut` asegura que la respuesta tenga el formato correcto.
@router.post("/", response_model=RolOut)
def crear_rol(rol: RolCreate, db: Session = Depends(get_db)):
    # Creamos una instancia del modelo de base de datos a partir de los datos de la petición.
    # El `**rol.dict()` desempaqueta los datos del DTO en los argumentos del constructor.
    db_rol = Rol(**rol.dict())
    # Agregamos el nuevo objeto a la sesión.
    db.add(db_rol)
    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para obtener el ID que la base de datos ha asignado.
    db.refresh(db_rol)
    # Devolvemos el rol creado.
    return db_rol


### 2. Listar todos los roles (GET)
# Endpoint para obtener una lista de todos los recursos.
@router.get("/", response_model=list[RolOut])
def listar_roles(db: Session = Depends(get_db)):
    # Ejecutamos una consulta para obtener todos los registros de la tabla `Rol`.
    return db.query(Rol).all()


### 3. Obtener un rol por ID (GET)
# El `{rol_id}` es un parámetro de la URL.
@router.get("/{rol_id}", response_model=RolOut)
def obtener_rol(rol_id: int, db: Session = Depends(get_db)):
    # Buscamos el rol por su ID de manera eficiente.
    rol = db.get(Rol, rol_id)
    # Si el rol no existe, lanzamos un error 404.
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    # Devolvemos el rol encontrado.
    return rol


### 4. Actualizar un rol (PUT)
# Endpoint para actualizar un recurso existente.
@router.put("/{rol_id}", response_model=RolOut)
def actualizar_rol(rol_id: int, datos: RolUpdate, db: Session = Depends(get_db)):
    # Buscamos el rol que se quiere actualizar.
    rol = db.get(Rol, rol_id)
    # Si no existe, lanzamos un error 404.
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    # Iteramos sobre los datos recibidos en la petición.
    # `datos.dict(exclude_unset=True)` solo incluye los campos que el cliente proporcionó.
    for key, value in datos.dict(exclude_unset=True).items():
        # Usamos `setattr` para actualizar dinámicamente cada atributo del objeto.
        setattr(rol, key, value)
        
    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para obtener su estado actualizado desde la base de datos.
    db.refresh(rol)
    # Devolvemos el objeto actualizado.
    return rol


### 5. Eliminar un rol (DELETE)
# Endpoint para eliminar un recurso.
@router.delete("/{rol_id}")
def eliminar_rol(rol_id: int, db: Session = Depends(get_db)):
    # Buscamos el rol a eliminar.
    rol = db.get(Rol, rol_id)
    # Si no existe, lanzamos un error 404.
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    # Eliminamos el objeto de la sesión.
    db.delete(rol)
    # Confirmamos la eliminación en la base de datos.
    db.commit()
    
    # Devolvemos una respuesta de éxito simple.
    return {"ok": True}