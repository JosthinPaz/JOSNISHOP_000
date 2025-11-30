# Importamos las herramientas principales de FastAPI y SQLAlchemy.
# APIRouter: para crear y organizar rutas de forma modular.
# Depends: para inyectar dependencias (como la sesión de la base de datos).
# HTTPException: para lanzar errores HTTP al cliente (ej. 404 No encontrado).
from fastapi import APIRouter, Depends, HTTPException
# Session: para tipar la variable de sesión de la base de datos.
from sqlalchemy.orm import Session

# Importamos nuestra configuración de sesión de la base de datos y los modelos de datos.
from db.session import SessionLocal
# Estos son modelos de Pydantic para validar los datos que entran y salen de la API.
from dtos.categoria_dto import CategoriaCreate, CategoriaOut, CategoriaUpdate
# Este es el modelo de SQLAlchemy que representa la tabla 'categorias' en la base de datos.
from models.categoria import Categoria

# Creamos un enrutador. El `prefix` se añade a todas las rutas de este archivo (ej. /categorias/).
# Las `tags` sirven para agrupar los endpoints en la documentación automática (Swagger UI/Redoc).
router = APIRouter(prefix="/categorias", tags=["categorias"])


# Esta es una función de "dependencia" de FastAPI.
# Su propósito es crear y gestionar una sesión de base de datos de manera segura.
def get_db():
    # Creamos una nueva sesión local.
    db = SessionLocal()
    try:
        # `yield` le dice a FastAPI que devuelva la sesión y la use en las funciones de ruta.
        # El código después de `yield` se ejecutará al final, incluso si hay un error.
        yield db
    finally:
        # Esto asegura que la sesión de la base de datos siempre se cierre, liberando recursos.
        db.close()


# --- Punto de entrada para la API de gestión de categorías ---


# --- 1. Crear una nueva categoría (POST) ---
# Este decorador define un endpoint para crear recursos.
# `response_model=CategoriaOut` le dice a FastAPI que valide la respuesta y la formatee
# según el modelo CategoriaOut antes de enviarla al cliente.
@router.post("/", response_model=CategoriaOut)
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    # Creamos una instancia del modelo de base de datos Categoria usando los datos del DTO.
    db_categoria = Categoria(**categoria.dict())
    # Agregamos el nuevo objeto a la sesión.
    db.add(db_categoria)
    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para obtener su ID, que la base de datos genera automáticamente.
    db.refresh(db_categoria)
    # Devolvemos el objeto creado al cliente.
    return db_categoria


# --- 2. Listar todas las categorías (GET) ---
# Este decorador crea un endpoint para obtener una lista de recursos.
@router.get("/", response_model=list[CategoriaOut])
def listar_categorias(db: Session = Depends(get_db)):
    # Hacemos una consulta a la base de datos para obtener todas las categorías.
    return db.query(Categoria).all()


# --- 3. Obtener una categoría por ID (GET) ---
# El `{categoria_id}` en la ruta indica un "parámetro de ruta".
@router.get("/{categoria_id}", response_model=CategoriaOut)
def obtener_categoria(categoria_id: int, db: Session = Depends(get_db)):
    # Usamos el método `db.get()` de SQLAlchemy para buscar una categoría por su clave primaria.
    # Es más directo y eficiente que usar `query().filter_by().first()`.
    categoria = db.get(Categoria, categoria_id)
    # Si la categoría no se encuentra, lanzamos una excepción HTTP 404.
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    # Devolvemos la categoría encontrada.
    return categoria


# --- 4. Actualizar una categoría (PUT) ---
# Este endpoint permite actualizar un recurso existente usando su ID.
@router.put("/{categoria_id}", response_model=CategoriaOut)
def actualizar_categoria(
    categoria_id: int, datos: CategoriaUpdate, db: Session = Depends(get_db)
):
    # Primero, buscamos la categoría que se quiere actualizar.
    categoria = db.get(Categoria, categoria_id)
    # Si no se encuentra, lanzamos un error 404.
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Recorremos los datos que el cliente envió.
    # `exclude_unset=True` es crucial aquí: Pydantic solo incluirá los campos
    # que realmente se enviaron en la petición, ignorando los que no se tocaron.
    for key, value in datos.dict(exclude_unset=True).items():
        # Usamos `setattr` para actualizar dinámicamente cada atributo del objeto.
        setattr(categoria, key, value)
        
    # Guardamos los cambios en la base de datos.
    db.commit()
    # Recargamos el objeto para asegurarnos de que el cliente obtenga la versión más reciente.
    db.refresh(categoria)
    # Devolvemos el objeto actualizado.
    return categoria


# --- 5. Eliminar una categoría (DELETE) ---
# Este endpoint se usa para borrar un recurso.
@router.delete("/{categoria_id}")
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    # Buscamos la categoría a eliminar.
    categoria = db.get(Categoria, categoria_id)
    # Si no existe, lanzamos un error 404.
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Eliminamos el objeto de la sesión.
    db.delete(categoria)
    # Confirmamos la eliminación en la base de datos.
    db.commit()
    
    # Devolvemos una respuesta de éxito simple.
    return {"ok": True}