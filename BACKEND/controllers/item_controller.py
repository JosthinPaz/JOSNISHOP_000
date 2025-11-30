# Importamos las herramientas principales de FastAPI y SQLAlchemy que necesitamos.
# - APIRouter: Para agrupar y organizar las rutas de la API de manera modular.
# - Depends: Es un sistema de inyección de dependencias de FastAPI que usaremos
#   para manejar la sesión de la base de datos de forma segura.
# - HTTPException: Nos permite lanzar errores HTTP, como un 404 (No encontrado).
from fastapi import APIRouter, Depends, HTTPException
# - Session: Se usa para el tipado de la variable de sesión de la base de datos.
from sqlalchemy.orm import Session

# Importamos las configuraciones y los modelos que necesitamos.
# - SessionLocal: La clase que crea nuestra sesión de base de datos.
from db.session import SessionLocal
# - ItemCreate, ItemOut, ItemUpdate: Son modelos de Pydantic (DTOs) que definen
#   la estructura de los datos para crear, ver y actualizar un ítem.
from dtos.item_dto import ItemCreate, ItemOut, ItemUpdate
# - Item: Es el modelo de SQLAlchemy que se mapea a la tabla de 'ítems' en nuestra base de datos.
from models.item import Item

# Creamos una instancia de APIRouter.
# - `prefix="/items"`: Define la ruta base para todos los endpoints en este archivo.
#   Por ejemplo, el endpoint para crear un ítem será "/items/".
# - `tags=["items"]`: Agrupa estos endpoints bajo la categoría "items" en la documentación
#   automática que genera FastAPI (Swagger UI).
router = APIRouter(prefix="/items", tags=["items"])


# --- Sistema de Dependencias para la Base de Datos ---

# Esta función es una "dependencia" que gestiona la sesión de la base de datos.
# FastAPI la llamará automáticamente para cada solicitud que necesite una conexión a la DB.
def get_db():
    # Creamos una nueva sesión de base de datos.
    db = SessionLocal()
    try:
        # La palabra clave `yield` entrega la sesión a la función de la ruta.
        # El código después de `yield` se ejecutará cuando la ruta haya terminado de responder.
        yield db
    finally:
        # El bloque `finally` garantiza que la sesión de la base de datos se cierre siempre,
        # liberando la conexión sin importar si hubo un error o no.
        db.close()


# --- Endpoints de la API para las operaciones CRUD ---

## 1. Crear un ítem (POST)

# `@router.post("/")`: Define un endpoint para crear un recurso (ítem).
# `response_model=ItemOut`: Valida que la respuesta de esta función coincida
# con la estructura de `ItemOut` antes de enviarla al cliente.
@router.post("/", response_model=ItemOut)
def crear_item(item: ItemCreate, db: Session = Depends(get_db)):
    # Creamos una instancia del modelo de base de datos `Item` a partir de los datos
    # recibidos en la petición (`item: ItemCreate`).
    # `**item.dict()` desempaqueta los atributos del DTO en los argumentos del constructor.
    db_item = Item(**item.dict())
    
    # Agregamos el nuevo objeto a la sesión. Esto lo prepara para ser guardado.
    db.add(db_item)
    
    # Guardamos el objeto en la base de datos.
    db.commit()
    
    # Recargamos el objeto para obtener su ID, que la base de datos le asignó automáticamente.
    db.refresh(db_item)
    
    # Devolvemos el ítem creado. FastAPI lo serializará a JSON.
    return db_item


## 2. Listar todos los ítems (GET)

# `@router.get("/")`: Define un endpoint para obtener una lista de recursos.
@router.get("/", response_model=list[ItemOut])
def listar_items(db: Session = Depends(get_db)):
    # Hacemos una consulta a la base de datos para obtener todos los ítems.
    return db.query(Item).all()


## 3. Obtener un ítem por ID (GET)

# `@router.get("/{item_id}")`: Define un endpoint que acepta un parámetro de ruta, `item_id`.
@router.get("/{item_id}", response_model=ItemOut)
def obtener_item(item_id: int, db: Session = Depends(get_db)):
    # Usamos `db.get()` para buscar el ítem por su ID. Es una forma eficiente de buscar
    # por la clave primaria.
    item = db.get(Item, item_id)
    
    # Si `item` es `None` (no se encontró), lanzamos un error HTTP 404 (No encontrado).
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
        
    # Devolvemos el ítem encontrado.
    return item


## 4. Actualizar un ítem (PUT)

# `@router.put("/{item_id}")`: Define un endpoint para actualizar un recurso existente.
@router.put("/{item_id}", response_model=ItemOut)
def actualizar_item(item_id: int, datos: ItemUpdate, db: Session = Depends(get_db)):
    # Buscamos el ítem que se quiere actualizar.
    item = db.get(Item, item_id)
    
    # Si no se encuentra, lanzamos un error 404.
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
        
    # Recorremos los datos que el cliente envió.
    # `datos.dict(exclude_unset=True)` solo incluye los campos que el cliente
    # realmente proporcionó, ignorando los no definidos.
    for key, value in datos.dict(exclude_unset=True).items():
        # `setattr()` nos permite actualizar dinámicamente cada atributo del objeto.
        setattr(item, key, value)
        
    # Guardamos los cambios en la base de datos.
    db.commit()
    
    # Recargamos el objeto para asegurarnos de que el cliente obtenga la versión más reciente.
    db.refresh(item)
    
    # Devolvemos el ítem actualizado.
    return item


## 5. Eliminar un ítem (DELETE)

# `@router.delete("/{item_id}")`: Define un endpoint para eliminar un recurso.
@router.delete("/{item_id}")
def eliminar_item(item_id: int, db: Session = Depends(get_db)):
    # Buscamos el ítem a eliminar.
    item = db.get(Item, item_id)
    
    # Si no existe, lanzamos un error 404.
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
        
    # Eliminamos el objeto de la sesión.
    db.delete(item)
    
    # Confirmamos la eliminación en la base de datos.
    db.commit()
    
    # Devolvemos una respuesta de éxito simple.
    return {"ok": True}