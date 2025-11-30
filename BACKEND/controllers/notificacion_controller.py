# Importamos las clases y funciones necesarias de FastAPI y SQLAlchemy.
# APIRouter: Para agrupar los endpoints de manera organizada.
# Depends: Sistema de inyección de dependencias para manejar la sesión de la base de datos.
# HTTPException: Clase para lanzar errores HTTP personalizados (ej. 404).
from fastapi import APIRouter, Depends, HTTPException
# Session: Tipo para la variable de sesión de la base de datos.
from sqlalchemy.orm import Session

# Importamos nuestra configuración de sesión de la base de datos y los modelos de datos.
from db.session import SessionLocal
# Estos son los modelos de Pydantic que definen la estructura de los datos para la API.
from dtos.notificacion_dto import (
    NotificacionCreate,  # Define los datos para crear una notificación.
    NotificacionOut,     # Define la estructura de la respuesta de una notificación.
    NotificacionUpdate,  # Define los datos para actualizar una notificación.
)
# Este es el modelo de SQLAlchemy que se mapea a la tabla de la base de datos.
from models.notificaciones import Notificacion

# Creamos un enrutador de FastAPI.
# El `prefix` establece la URL base para todos los endpoints en este archivo.
# Las `tags` agrupan los endpoints en la documentación (Swagger UI).
router = APIRouter(prefix="/notificaciones", tags=["notificaciones"])


# Esta función de "dependencia" se encarga de gestionar la conexión a la base de datos.
def get_db():
    # Creamos una nueva sesión de base de datos.
    db = SessionLocal()
    try:
        # `yield` le pasa la sesión a la función que lo solicita.
        # El código en el bloque `finally` se ejecutará después.
        yield db
    finally:
        # Esto garantiza que la conexión a la base de datos se cierre siempre,
        # liberando recursos.
        db.close()


# --- Endpoints de la API para las operaciones CRUD ---

### 1. Crear una nueva notificación (POST)
# Define un endpoint para crear un nuevo recurso.
# `response_model=NotificacionOut` asegura que la respuesta tenga el formato correcto.
@router.post("/", response_model=NotificacionOut)
def crear_notificacion(notificacion: NotificacionCreate, db: Session = Depends(get_db)):
    # Creamos una instancia del modelo de base de datos a partir de los datos de la petición.
    db_notificacion = Notificacion(**notificacion.dict())
    # Agregamos el nuevo objeto a la sesión.
    db.add(db_notificacion)
    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para obtener el ID que la base de datos ha asignado.
    db.refresh(db_notificacion)
    # Devolvemos la notificación creada.
    return db_notificacion


### 2. Listar todas las notificaciones (GET)
# Endpoint para obtener una lista de todos los recursos.
@router.get("/", response_model=list[NotificacionOut])
def listar_notificaciones(db: Session = Depends(get_db)):
    # Ejecutamos una consulta para obtener todos los registros de la tabla `Notificacion`.
    return db.query(Notificacion).all()


### 3. Obtener una notificación por ID (GET)
# El `{notificacion_id}` es un parámetro de la URL.
@router.get("/{notificacion_id}", response_model=NotificacionOut)
def obtener_notificacion(notificacion_id: int, db: Session = Depends(get_db)):
    # Buscamos la notificación por su ID.
    notificacion = db.get(Notificacion, notificacion_id)
    # Si la notificación no existe, lanzamos un error 404.
    if not notificacion:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    # Devolvemos la notificación encontrada.
    return notificacion


### 4. Actualizar una notificación (PUT)
# Endpoint para actualizar un recurso existente.
@router.put("/{notificacion_id}", response_model=NotificacionOut)
def actualizar_notificacion(
    notificacion_id: int, datos: NotificacionUpdate, db: Session = Depends(get_db)
):
    # Buscamos la notificación que se quiere actualizar.
    notificacion = db.get(Notificacion, notificacion_id)
    # Si no existe, lanzamos un error 404.
    if not notificacion:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    # Iteramos sobre los datos recibidos en la petición.
    # `datos.dict(exclude_unset=True)` solo incluye los campos que el cliente proporcionó.
    for key, value in datos.dict(exclude_unset=True).items():
        # Usamos `setattr` para actualizar dinámicamente cada atributo del objeto.
        setattr(notificacion, key, value)
        
    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para obtener su estado actualizado desde la base de datos.
    db.refresh(notificacion)
    # Devolvemos el objeto actualizado.
    return notificacion


### 5. Eliminar una notificación (DELETE)
# Endpoint para eliminar un recurso.
@router.delete("/{notificacion_id}")
def eliminar_notificacion(notificacion_id: int, db: Session = Depends(get_db)):
    # Buscamos la notificación a eliminar.
    notificacion = db.get(Notificacion, notificacion_id)
    # Si no existe, lanzamos un error 404.
    if not notificacion:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    # Eliminamos el objeto de la sesión.
    db.delete(notificacion)
    # Confirmamos la eliminación en la base de datos.
    db.commit()
    
    # Devolvemos una respuesta de éxito simple.
    return {"ok": True}