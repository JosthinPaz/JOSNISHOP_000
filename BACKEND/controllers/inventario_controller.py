# Importamos las herramientas principales de FastAPI y SQLAlchemy.
# APIRouter: para crear y organizar las rutas de manera modular.
# Depends: para la inyección de dependencias, como la sesión de la base de datos.
# HTTPException: para lanzar errores HTTP con mensajes específicos.
from fastapi import APIRouter, Depends, HTTPException, Query
# Session: para el tipado de la variable de sesión de la base de datos.
from sqlalchemy.orm import Session
from typing import Optional, List
from sqlalchemy import text

# Importamos las clases y funciones que necesitamos de otros archivos.
from db.session import SessionLocal
# Estos son modelos de Pydantic que definen la estructura de los datos para la API.
from dtos.inventario_dto import InventarioCreate, InventarioOut, InventarioUpdate
# Este es el modelo de SQLAlchemy que se mapea a la tabla 'inventario' en la base de datos.
from models.inventario import Inventario
# Importamos la función para enviar correos de alerta de stock.
from utils.email_utils import enviar_alerta_stock
# Importamos el modelo de Producto para poder obtener su nombre.
from models.producto import Producto

# Creamos un enrutador de FastAPI.
# El `prefix` establece la URL base para todas las rutas de este archivo (ej. /inventarios/).
# Las `tags` sirven para agrupar los endpoints en la documentación (Swagger UI).
router = APIRouter(prefix="/inventarios", tags=["inventarios"])



## Dependencia de la Base de Datos

# Esta función es un "generador" que crea una sesión de base de datos.
# FastAPI la usará automáticamente para cada solicitud a un endpoint que la necesite.
def get_db():
    # Creamos una nueva sesión de base de datos.
    db = SessionLocal()
    try:
        # `yield` entrega la sesión a la función de la ruta.
        # El código después del `yield` se ejecutará al final.
        yield db
    finally:
        # Aseguramos que la sesión de la base de datos se cierre siempre,
        # liberando la conexión para otros procesos.
        db.close()



## Endpoints de la API (CRUD)

### 1. Crear un nuevo registro de inventario (POST)

# Define un endpoint que responde a peticiones POST en la ruta base ("/").
# `response_model` valida y formatea la respuesta.
@router.post("/", response_model=InventarioOut)
def crear_inventario(inventario: InventarioCreate, db: Session = Depends(get_db)):
    # Creamos un objeto de modelo de base de datos a partir de los datos de entrada.
    db_inventario = Inventario(**inventario.dict())
    # Agregamos el nuevo objeto a la sesión.
    db.add(db_inventario)
    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para obtener el ID asignado por la base de datos.
    db.refresh(db_inventario)

    # Lógica para enviar una ALERTA DE STOCK BAJO.
    # Comprobamos si la cantidad actual es menor o igual a 20.
    if db_inventario.cantidad <= 20:
        # Buscamos el nombre del producto para incluirlo en la alerta.
        producto = db.query(Producto).get(db_inventario.producto_id)
        # Llamamos a la función de utilidad para enviar el correo.
        enviar_alerta_stock(
            destinatario="destinatario@email.com",
            producto=producto.nombre if producto else "Desconocido",
            cantidad=db_inventario.cantidad,
        )

    # Retornamos el objeto recién creado.
    return db_inventario



### 2. Listar todos los registros de inventario (GET)

# Este endpoint obtiene y devuelve una lista de todos los registros de inventario.
@router.get("/", response_model=list[InventarioOut])
def listar_inventarios(db: Session = Depends(get_db)):
    # Ejecutamos una consulta para obtener todos los registros de la tabla `Inventario`.
    return db.query(Inventario).all()


# --- Endpoint de Reportes Parametrizados para Inventario ---
@router.get("/reportes", response_model=List[InventarioOut])
def reportes_parametrizados_inventario(
    producto_id: Optional[int] = Query(None),
    cantidad_min: Optional[int] = Query(None),
    cantidad_max: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Inventario)
    if producto_id:
        query = query.filter(Inventario.producto_id == producto_id)
    if cantidad_min is not None:
        query = query.filter(Inventario.cantidad >= cantidad_min)
    if cantidad_max is not None:
        query = query.filter(Inventario.cantidad <= cantidad_max)
    return query.all()



### 3. Obtener un registro de inventario por ID (GET)

# El `{inventario_id}` en la URL es un parámetro que se pasa a la función.
@router.get("/{inventario_id}", response_model=InventarioOut)
def obtener_inventario(inventario_id: int, db: Session = Depends(get_db)):
    # Buscamos el registro de inventario por su ID.
    inventario = db.get(Inventario, inventario_id)
    # Si no se encuentra, lanzamos un error 404.
    if not inventario:
        raise HTTPException(status_code=404, detail="Inventario no encontrado")
    # Devolvemos el registro encontrado.
    return inventario



### 4. Actualizar un registro de inventario (PUT)

# Este endpoint permite actualizar un registro existente.
@router.put("/{inventario_id}", response_model=InventarioOut)
def actualizar_inventario(
    inventario_id: int, datos: InventarioUpdate, db: Session = Depends(get_db)
):
    # Buscamos el registro de inventario a actualizar.
    inventario = db.get(Inventario, inventario_id)
    # Si no existe, lanzamos un error 404.
    if not inventario:
        raise HTTPException(status_code=404, detail="Inventario no encontrado")
    
    # Iteramos sobre los datos recibidos del cliente.
    # `exclude_unset=True` asegura que solo actualizamos los campos que el cliente envió.
    for key, value in datos.dict(exclude_unset=True).items():
        # Usamos `setattr` para actualizar dinámicamente cada atributo del objeto.
        setattr(inventario, key, value)
        
    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para obtener su estado actualizado.
    db.refresh(inventario)

    # Lógica para ALERTA DE STOCK BAJO (se repite aquí también para las actualizaciones).
    if inventario.cantidad <= 20:
        producto = db.query(Producto).get(inventario.producto_id)
        enviar_alerta_stock(
            destinatario="josthinpaz2@gmail.com",
            producto=producto.nombre if producto else "Desconocido",
            cantidad=inventario.cantidad,
        )

    # Devolvemos el objeto actualizado.
    return inventario



### 5. Eliminar un registro de inventario (DELETE)

# Este endpoint se usa para borrar un registro.
@router.delete("/{inventario_id}")
def eliminar_inventario(inventario_id: int, db: Session = Depends(get_db)):
    # Buscamos el registro a eliminar.
    inventario = db.get(Inventario, inventario_id)
    # Si no existe, lanzamos un error 404.
    if not inventario:
        raise HTTPException(status_code=404, detail="Inventario no encontrado")
    
    # Eliminamos el objeto de la sesión.
    db.delete(inventario)
    # Confirmamos la eliminación en la base de datos.
    db.commit()
    
    # Devolvemos una respuesta de éxito simple.
    return {"ok": True}



## Endpoints Adicionales

# --- Endpoint de Carga Masiva de Inventario ---
@router.post("/bulk", response_model=List[InventarioOut])
def carga_masiva_inventario(
    items: List[InventarioCreate],
    db: Session = Depends(get_db)
):
    nuevos_items = [Inventario(**i.dict()) for i in items]
    db.add_all(nuevos_items)
    db.commit()
    for item in nuevos_items:
        db.refresh(item)
    return nuevos_items
# Comentario: Endpoint para carga masiva de inventario.

# --- Endpoint de Búsqueda de Inventario por Nombre ---
@router.get("/buscar")
def buscar_inventario_por_nombre(nombre: str = Query(...), db: Session = Depends(get_db)):
    # Use a parameterized text() to avoid SQL injection from `nombre`.
    stmt = text("CALL SP_BuscarInventarioPorNombre(:nombre)")
    result = db.execute(stmt, {"nombre": nombre})
    inventarios = []
    for row in result:
        inventarios.append({
            "id": row[0],
            "producto_id": row[1],
            "cantidad": row[2],
            "stock_minimo": row[3],
            "fecha_actualizacion": row[4],
            "nombre_producto": row[5]  # Si tu SP retorna el nombre del producto
        })
    return inventarios
# Comentario: Endpoint para buscar inventario por nombre utilizando un Stored Procedure.