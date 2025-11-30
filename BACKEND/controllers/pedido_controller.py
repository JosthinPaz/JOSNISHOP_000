# Importamos las herramientas principales de FastAPI, SQLAlchemy y otras utilidades.
# APIRouter: Para crear rutas modulares.
# Depends: Para manejar las dependencias, como la sesión de la base de datos.
# HTTPException: Para lanzar errores HTTP (ej., 404 Not Found).
from fastapi import APIRouter, Depends, HTTPException
# Session: Tipo para la variable de sesión de la base de datos.
from sqlalchemy.orm import Session
# datetime: Para trabajar con fechas y horas.
from datetime import datetime

# Importamos la función para crear la sesión de la base de datos.
from db.session import SessionLocal
# Importamos los modelos de Pydantic que definen la estructura de los datos.
from dtos.pedido_dto import PedidoCreate, PedidoOut, PedidoUpdate
# Importamos el modelo de SQLAlchemy que se mapea a la tabla de 'pedidos'.
from models.pedido import Pedido
from utils.email_utils import enviar_cambio_estado_pedido
from models.usuarios import Usuario

# Creamos un enrutador de FastAPI.
# `prefix="/pedidos"`: Todas las rutas de este archivo comenzarán con "/pedidos".
# `tags=["pedidos"]`: Agrupa estos endpoints en la documentación de la API.
router = APIRouter(prefix="/pedidos", tags=["pedidos"])


# --- Dependencia de la base de datos ---

# Esta función es una dependencia que gestiona la sesión de la base de datos
# de forma segura. Se inyectará automáticamente en los endpoints que la necesiten.
def get_db():
    # Creamos una nueva sesión de base de datos.
    db = SessionLocal()
    try:
        # `yield` entrega la sesión a la función de la ruta.
        # El código en el bloque `finally` se ejecutará al final.
        yield db
    finally:
        # Esto garantiza que la conexión a la base de datos se cierre siempre,
        # liberando recursos.
        db.close()


# --- Función de utilidad (no es un endpoint) ---

# Esta función auxiliar convierte un objeto 'Pedido' a un diccionario.
# Se usa para el ejemplo, aunque con Pydantic y SQLAlchemy, no es estrictamente necesaria
# para los `response_model` que ya se encargan de la serialización.
def pedido_to_dict(pedido):
    return {
        "id_pedido": pedido.id_pedido,
        "cliente_id": pedido.cliente_id,
        "fecha_pedido": pedido.fecha_pedido or datetime.now(),  # Usa la fecha si existe, si no, la actual.
        "estado": pedido.estado,
        "total": pedido.total
    }


# =========================
# CRUD de pedidos
# =========================


# --- 1. Crear un nuevo pedido (POST) ---
# Endpoint para crear un recurso 'Pedido'.
# `response_model` asegura que la respuesta tenga el formato del modelo `PedidoOut`.
@router.post("/", response_model=PedidoOut)
def crear_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    data = pedido.dict()
    data["vendedor_id"] = 1  # Forzar siempre el vendedor 1
    db_pedido = Pedido(**data)
    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)
    return db_pedido


# --- 2. Listar todos los pedidos (GET) ---
# Endpoint para obtener una lista de todos los pedidos.
@router.get("/", response_model=list[PedidoOut])
def listar_pedidos(db: Session = Depends(get_db)):
    # Ejecutamos una consulta para obtener todos los registros de la tabla `Pedido`.
    return db.query(Pedido).all()  # Retorna TODOS los pedidos.


# --- 3. Listar pedidos por usuario (GET) ---
# Endpoint para obtener todos los pedidos de un usuario específico.
# Nota: La ruta `/usuario/{usuario_id}` es redundante si `cliente_id` es lo mismo.
@router.get("/usuario/{usuario_id}", response_model=list[PedidoOut])
def listar_pedidos_por_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """Listar pedidos de un usuario (rol cliente)."""
    # Filtramos la consulta por el `usuario_id` del modelo.
    # Nota: Este código asume que el modelo tiene un atributo `usuario_id`,
    # pero el modelo `Pedido` en el `post` usa `cliente_id`. Es importante
    # que los nombres de los atributos de la base de datos coincidan.
    return db.query(Pedido).filter(Pedido.usuario_id == usuario_id).all()
    

# --- 4. Listar pedidos por cliente (GET) ---
# Endpoint para obtener todos los pedidos de un cliente específico.
@router.get("/cliente/{cliente_id}", response_model=list[PedidoOut])
def listar_pedidos_por_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """Listar pedidos de un cliente (rol cliente)."""
    # Filtramos la consulta por el `cliente_id`.
    return db.query(Pedido).filter(Pedido.cliente_id == cliente_id).all()


# --- 5. Obtener un pedido por ID (GET) ---
# El `{pedido_id}` en la ruta indica un parámetro de ruta.
@router.get("/{pedido_id}", response_model=PedidoOut)
def obtener_pedido(pedido_id: int, db: Session = Depends(get_db)):
    # Buscamos el pedido por su ID de manera eficiente.
    pedido = db.get(Pedido, pedido_id)
    # Si no se encuentra, lanzamos un error HTTP 404 (Not Found).
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    # Devolvemos el pedido encontrado.
    return pedido


# --- 6. Actualizar un pedido (PUT) ---
# Este endpoint permite actualizar un recurso existente usando su ID.
@router.put("/{pedido_id}", response_model=PedidoOut)
def actualizar_pedido(
    pedido_id: int, datos: PedidoUpdate, db: Session = Depends(get_db)
):
    # Buscamos el pedido que se quiere actualizar.
    pedido = db.get(Pedido, pedido_id)
    # Si no existe, lanzamos un error 404.
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    # Guardar estado anterior para detectar cambios
    estado_anterior = pedido.estado

    # Iteramos sobre los datos recibidos en la petición.
    # `datos.dict(exclude_unset=True)` solo incluye los campos que el cliente envió.
    for key, value in datos.dict(exclude_unset=True).items():
        # Usamos `setattr` para actualizar dinámicamente cada atributo del objeto.
        setattr(pedido, key, value)

    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para asegurarnos de que el cliente obtenga la versión más reciente.
    db.refresh(pedido)

    # Si el estado cambió, enviar correo al cliente notificando el cambio
    try:
        nuevo_estado = pedido.estado
        if nuevo_estado != estado_anterior:
            # obtener correo del cliente
            cliente = db.query(Usuario).filter_by(id_usuario=pedido.cliente_id).first()
            if cliente and cliente.correo:
                enviar_cambio_estado_pedido(cliente.correo, pedido.id_pedido, nuevo_estado)
    except Exception as e:
        # No bloquear la actualización por fallo en el envío de correo
        print('Error enviando notificación de estado de pedido:', e)

    # Devolvemos el objeto actualizado.
    return pedido


# --- 7. Eliminar un pedido (DELETE) ---
# Este endpoint se usa para borrar un recurso.
@router.delete("/{pedido_id}")
def eliminar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    # Buscamos el pedido a eliminar.
    pedido = db.get(Pedido, pedido_id)
    # Si no existe, lanzamos un error 404.
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    # Eliminamos el objeto de la sesión.
    db.delete(pedido)
    # Confirmamos la eliminación en la base de datos.
    db.commit()
    
    # Devolvemos una respuesta de éxito simple.
    return {"ok": True}