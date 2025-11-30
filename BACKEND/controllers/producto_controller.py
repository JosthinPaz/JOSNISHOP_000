from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from db.session import SessionLocal
from dtos.producto_dto import ProductoCreate, ProductoOut, ProductoUpdate
from models.detallepedido import DetallePedido
from models.producto import Producto
from models.item import Item
from models.inventario import Inventario
from models.videos import Video
from models.categoria import Categoria
from sqlalchemy import func
import os
import uuid
import datetime
import re

router = APIRouter(prefix="/productos", tags=["productos"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ProductoOut)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto


@router.get("/", response_model=list[ProductoOut])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()


@router.get("/rich")
def listar_productos_rich(db: Session = Depends(get_db)):
    """Return the latest products with thumbnail and price for frontend cards, ordered by creation date descending."""
    productos = db.query(Producto).order_by(Producto.id.desc()).all()
    out = []
    for p in productos:
        img = None
        price = None
        if getattr(p, 'videos', None):
            if len(p.videos) > 0:
                img = p.videos[0].url
        if getattr(p, 'items', None):
            if len(p.items) > 0:
                try:
                    price = float(p.items[0].precio)
                except Exception:
                    price = None
        out.append({
            "id": p.id,
            "nombre": p.nombre,
            "descripcion": p.descripcion or "",
            "precio": price,
            "image": img,
            "categoria": p.categoria_id
        })
    return out


@router.get("/categoria/{categoria_name}/rich")
def listar_productos_por_categoria_rich(categoria_name: str, db: Session = Depends(get_db)):
    """Return products for a given category name with thumbnail and price for frontend cards."""
    # case-insensitive match on category name
    productos = (
        db.query(Producto)
        .join(Categoria)
        .filter(func.lower(Categoria.nombre) == categoria_name.lower())
        .all()
    )
    out = []
    for p in productos:
        img = None
        price = None
        if getattr(p, 'videos', None):
            if len(p.videos) > 0:
                img = p.videos[0].url
        if getattr(p, 'items', None):
            if len(p.items) > 0:
                try:
                    price = float(p.items[0].precio)
                except Exception:
                    price = None
        out.append({
            "id": p.id,
            "nombre": p.nombre,
            "descripcion": p.descripcion or "",
            "precio": price,
            "image": img,
        })
    return out


@router.get("/{producto_id}", response_model=ProductoOut)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@router.put("/{producto_id}", response_model=ProductoOut)
def actualizar_producto(
    producto_id: int, datos: ProductoUpdate, db: Session = Depends(get_db)
):
    producto = db.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(producto, key, value)
    db.commit()
    db.refresh(producto)
    return producto


@router.delete("/{producto_id}")
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto)
    db.commit()
    return {"ok": True}


@router.get("/comprados/{cliente_id}")
def productos_comprados(cliente_id: int, db: Session = Depends(get_db)):
    productos_ids = (
        db.query(DetallePedido.producto_id)
        .filter_by(cliente_id=cliente_id)
        .distinct()
        .all()
    )
    productos = db.query(Producto).filter(
        Producto.id.in_([p.producto_id for p in productos_ids])
    ).all()
    return [{"id": p.id, "nombre": p.nombre} for p in productos]


@router.post("/full")
async def crear_producto_completo(
    nombre: str = Form(...),
    categoria_id: int = Form(...),
    descripcion: str | None = Form(None),
    precio: float = Form(...),
    cantidad: int = Form(...),
    stock_minimo: int = Form(1),
    disponible: bool = Form(True),
    vendedor_id: int | None = Form(None),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    # Crear producto
    db_producto = Producto(nombre=nombre, descripcion=descripcion or "", categoria_id=categoria_id, vendedor_id=vendedor_id)
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)

    # Crear item (precio y disponibilidad)
    fecha_ingreso = datetime.date.today()
    # Generar serial automático: buscar el mayor sufijo numérico de seriales que empiecen con 'SN'
    try:
        serials = [s[0] for s in db.query(Item.serial).filter(Item.serial.like('SN%')).all() if s[0]]
        max_num = 0
        for s in serials:
            # extraer la parte numérica después de 'SN'
            num_part = s[2:]
            try:
                n = int(num_part)
                if n > max_num:
                    max_num = n
            except Exception:
                continue
        next_num = max_num + 1
        serial_str = f"SN{next_num:04d}"
    except Exception:
        # fallback simple si algo falla
        serial_str = f"SN{int(datetime.datetime.utcnow().timestamp())}"

    # Asignar fecha de salida automáticamente (hoy)
    fecha_salida = datetime.date.today()

    db_item = Item(serial=serial_str, fecha_ingreso=fecha_ingreso, fecha_salida=fecha_salida, estado=bool(disponible), precio=precio, productos_id=db_producto.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    # Crear inventario
    fecha_actualizacion = datetime.datetime.utcnow()
    db_inventario = Inventario(producto_id=db_producto.id, cantidad=cantidad, stock_minimo=stock_minimo, fecha_actualizacion=fecha_actualizacion)
    db.add(db_inventario)
    db.commit()
    db.refresh(db_inventario)

    # Guardar archivo (imagen/video) si viene
    video_id = None
    if file is not None:
        # directorio de guardado: <project>/static/uploads
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        uploads_dir = os.path.join(base_dir, 'static', 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)
        # sanitize filename to avoid invalid characters on Windows filesystems (e.g. ':' )
        def _sanitize_filename(name: str) -> str:
            # remove path separators and replace characters that Windows forbids: <>:"/\\|?*
            name = name.replace('\\', '_').replace('/', '_')
            name = re.sub(r'[<>:\\"/\\|?*]', '_', name)
            # collapse whitespace to single underscore
            name = re.sub(r'\s+', '_', name).strip('_')
            return name

        safe_name = _sanitize_filename(file.filename or 'upload')
        filename = f"{uuid.uuid4().hex}__{safe_name}"
        save_path = os.path.join(uploads_dir, filename)
        contents = await file.read()
        with open(save_path, 'wb') as f:
            f.write(contents)
        url = f"/static/uploads/{filename}"
        db_video = Video(producto_id=db_producto.id, url=url, fecha_subida=datetime.datetime.utcnow())
        db.add(db_video)
        db.commit()
        db.refresh(db_video)
        video_id = db_video.id

    return {
        "producto_id": db_producto.id,
        "item_id": db_item.id,
        "inventario_id": db_inventario.id,
        "video_id": video_id,
        "serial": db_item.serial,
        "fecha_salida": db_item.fecha_salida.isoformat() if db_item.fecha_salida else None,
    }
