# Importamos las herramientas clave de FastAPI y SQLAlchemy.
# APIRouter: para organizar las rutas de manera modular.
# Depends: para manejar la inyección de dependencias, como la sesión de la base de datos.
# HTTPException: para lanzar errores HTTP (por ejemplo, 404 si un recurso no existe).
from fastapi import APIRouter, Depends, HTTPException, Query
# Session: para definir el tipo de la variable de sesión de la base de datos.
from sqlalchemy.orm import Session
from typing import Optional, List

# Importamos la función que crea la sesión de la base de datos.
from db.session import SessionLocal
# Importamos los modelos de Pydantic que definen la estructura de los datos para la API.
from dtos.detalle_pedido_dto import (
    DetallePedidoCreate,  # Modelo para crear un nuevo detalle de pedido.
    DetallePedidoOut,     # Modelo para la respuesta de la API.
    DetallePedidoUpdate,  # Modelo para actualizar un detalle existente.
)
# Importamos el modelo de SQLAlchemy que se mapea a la tabla de la base de datos.
from models.detallepedido import DetallePedido

# Creamos el enrutador de FastAPI.
# El `prefix` establece la URL base para todas las rutas en este archivo (ej., /detalles_pedido/).
# Las `tags` ayudan a agrupar los endpoints en la documentación interactiva (Swagger UI).
router = APIRouter(prefix="/detalles_pedido", tags=["detalles_pedido"])


# Esta función de "dependencia" es la manera recomendada en FastAPI para gestionar
# las sesiones de la base de datos.
def get_db():
    # Creamos una nueva sesión de base de datos.
    db = SessionLocal()
    try:
        # El `yield` es clave. Retorna la sesión a la función de la ruta que la llamó.
        # El código después del `yield` (en el `finally`) se ejecuta después de que la ruta
        # ha terminado de procesar la solicitud.
        yield db
    finally:
        # Esto garantiza que la conexión a la base de datos se cierre siempre,
        # liberando recursos, sin importar si la operación fue exitosa o falló.
        db.close()


# --- Puntos de entrada de la API para operaciones CRUD (Crear, Leer, Actualizar, Eliminar) ---


# --- 1. Crear un nuevo detalle de pedido (POST) ---
# Define un endpoint que responde a peticiones POST.
# `response_model` valida y da formato a la respuesta para que coincida con `DetallePedidoOut`.
@router.post("/", response_model=DetallePedidoOut)
def crear_detalle_pedido(detalle: DetallePedidoCreate, db: Session = Depends(get_db)):
    # Creamos una instancia del modelo de la base de datos a partir de los datos de la petición.
    # El `**detalle.dict()` "desempaqueta" los datos del DTO directamente en el constructor.
    db_detalle = DetallePedido(**detalle.dict())
    # Agregamos el nuevo objeto a la sesión.
    db.add(db_detalle)
    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para obtener el ID que la base de datos acaba de generar.
    db.refresh(db_detalle)
    # Retornamos el objeto recién creado, que FastAPI serializará.
    return db_detalle


# --- 2. Listar todos los detalles de pedido (GET) ---
# Endpoint para obtener una lista de todos los detalles de pedido.
@router.get("/", response_model=list[DetallePedidoOut])
def listar_detalles_pedido(db: Session = Depends(get_db)):
    # Ejecutamos una consulta para obtener todos los registros de la tabla `DetallePedido`.
    return db.query(DetallePedido).all()


# --- 3. Obtener un detalle de pedido específico por ID (GET) ---
# El `{detalle_id}` en la ruta indica que este es un parámetro de la URL.
@router.get("/{detalle_id}", response_model=DetallePedidoOut)
def obtener_detalle_pedido(detalle_id: int, db: Session = Depends(get_db)):
    # Buscamos un detalle de pedido por su ID usando `db.get()`, que es muy eficiente.
    detalle = db.get(DetallePedido, detalle_id)
    # Si no se encuentra el detalle, lanzamos un error 404.
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle de pedido no encontrado")
    # Devolvemos el detalle de pedido encontrado.
    return detalle


# --- 4. Actualizar un detalle de pedido existente (PUT) ---
# Endpoint para actualizar un recurso existente usando su ID.
@router.put("/{detalle_id}", response_model=DetallePedidoOut)
def actualizar_detalle_pedido(
    detalle_id: int, datos: DetallePedidoUpdate, db: Session = Depends(get_db)
):
    # Buscamos el detalle de pedido que se quiere actualizar.
    detalle = db.get(DetallePedido, detalle_id)
    # Si no existe, lanzamos un error 404.
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle de pedido no encontrado")
    
    # Iteramos sobre los datos recibidos en la petición.
    # `datos.dict(exclude_unset=True)` asegura que solo actualicemos los campos
    # que realmente fueron enviados por el cliente.
    for key, value in datos.dict(exclude_unset=True).items():
        # Usamos `setattr` para actualizar dinámicamente cada atributo del objeto.
        setattr(detalle, key, value)
        
    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para obtener su estado actualizado desde la base de datos.
    db.refresh(detalle)
    # Devolvemos el objeto actualizado al cliente.
    return detalle


# --- 5. Eliminar un detalle de pedido (DELETE) ---
# Endpoint para eliminar un recurso de la base de datos.
@router.delete("/{detalle_id}")
def eliminar_detalle_pedido(detalle_id: int, db: Session = Depends(get_db)):
    # Buscamos el detalle de pedido a eliminar.
    detalle = db.get(DetallePedido, detalle_id)
    # Si no se encuentra, lanzamos un error 404.
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle de pedido no encontrado")
    
    # Eliminamos el objeto de la sesión.
    db.delete(detalle)
    # Confirmamos la eliminación en la base de datos.
    db.commit()
    
    # Retornamos una respuesta simple de éxito.
    return {"ok": True}


# --- 6. Listar detalles de pedido por el ID de un pedido (GET) ---
# Este es un endpoint adicional para listar todos los detalles asociados a un pedido específico.
@router.get("/pedido/{pedido_id}", response_model=list[DetallePedidoOut])
def listar_detalles_por_pedido(pedido_id: int, db: Session = Depends(get_db)):
    """Listar detalles de un pedido específico."""
    # Hacemos una consulta filtrando los detalles por el ID del pedido.
    return db.query(DetallePedido).filter(DetallePedido.pedido_id == pedido_id).all()


# --- Endpoint de Reportes Parametrizados para Detalle de Pedidos ---
@router.get("/reportes", response_model=List[DetallePedidoOut])
def reportes_parametrizados_detalle_pedido(
    pedido_id: Optional[int] = Query(None),
    producto_id: Optional[int] = Query(None),
    cantidad_min: Optional[int] = Query(None),
    cantidad_max: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(DetallePedido)
    if pedido_id:
        query = query.filter(DetallePedido.pedido_id == pedido_id)
    if producto_id:
        query = query.filter(DetallePedido.producto_id == producto_id)
    if cantidad_min is not None:
        query = query.filter(DetallePedido.cantidad >= cantidad_min)
    if cantidad_max is not None:
        query = query.filter(DetallePedido.cantidad <= cantidad_max)
    return query.all()
# Comentario: Endpoint de reportes parametrizados para detalle de pedidos.

# --- Endpoint de Carga Masiva de Detalle de Pedidos ---
@router.post("/bulk", response_model=List[DetallePedidoOut])
def carga_masiva_detalle_pedido(
    detalles: List[DetallePedidoCreate],
    db: Session = Depends(get_db)
):
    nuevos_detalles = [DetallePedido(**d.dict()) for d in detalles]
    db.add_all(nuevos_detalles)
    db.commit()
    for d in nuevos_detalles:
        db.refresh(d)
    return nuevos_detalles
# Comentario: Endpoint para carga masiva de detalle de pedidos.