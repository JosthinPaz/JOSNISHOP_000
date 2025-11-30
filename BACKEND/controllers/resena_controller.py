from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from db.session import SessionLocal
from dtos.resena_dto import ResenaCreate, ResenaOut
from models.resenas import Reseña
from models.detallepedido import DetallePedido
from models.producto import Producto
from controllers.notificacion_controller import crear_notificacion
from datetime import datetime
from pydantic import BaseModel
from utils.email_utils import enviar_alerta_resena
from utils.email_utils import enviar_respuesta_resena
from models.usuarios import Usuario

router = APIRouter(prefix="/resenas", tags=["reseñas"])

class ResenaCreate(BaseModel):
    producto_id: int
    cliente_id: int
    calificación: int
    comentario: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def usuario_ha_comprado_producto(db, cliente_id, producto_id):
    from models.detallepedido import DetallePedido
    from models.pedido import Pedido
    return db.query(DetallePedido).join(Pedido, DetallePedido.pedido_id == Pedido.id_pedido)\
        .filter(Pedido.cliente_id == cliente_id, DetallePedido.producto_id == producto_id).count() > 0

def es_comentario_apropiado(comentario: str) -> bool:
    palabras_prohibidas = ["sapo", "hijodeputa", "Malparido"]
    return not any(p in comentario.lower() for p in palabras_prohibidas)

@router.post("/", response_model=ResenaOut)
def crear_resena(resena: ResenaCreate, db: Session = Depends(get_db)):
    if not usuario_ha_comprado_producto(db, resena.cliente_id, resena.producto_id):
        raise HTTPException(status_code=403, detail="Solo puedes reseñar productos que compraste.")
    if db.query(Reseña).filter_by(cliente_id=resena.cliente_id, producto_id=resena.producto_id).first():
        raise HTTPException(status_code=400, detail="Ya has reseñado este producto.")
    if len(resena.comentario) < 10:
        raise HTTPException(status_code=400, detail="El comentario debe tener al menos 10 caracteres.")
    palabras_ofensivas = ["tonto", "idiota", "estúpido"]
    if any(palabra in resena.comentario.lower() for palabra in palabras_ofensivas):
        raise HTTPException(status_code=400, detail="El comentario contiene palabras inapropiadas.")
    if not es_comentario_apropiado(resena.comentario):
        raise HTTPException(status_code=400, detail="Comentario inapropiado.")

    nueva_resena = Reseña(
        cliente_id=resena.cliente_id,
        producto_id=resena.producto_id,
        calificación=resena.calificación,
        comentario=resena.comentario,
        fecha=datetime.now()
    )
    db.add(nueva_resena)
    db.commit()
    db.refresh(nueva_resena)

    # --- SOLUCIÓN: Obtén el producto antes de enviar el correo ---
    producto = db.query(Producto).filter_by(id=resena.producto_id).first()

    enviar_alerta_resena(
        destinatario="josthinpaz2@gmail.com",
        producto=producto.nombre if producto else "Producto",
        comentario=resena.comentario,
        calificacion=resena.calificación
    )

    return {
        "id": nueva_resena.id_reseña,
        "producto_id": nueva_resena.producto_id,
        "cliente_id": nueva_resena.cliente_id,
        "calificacion": nueva_resena.calificación,  # sin tilde para el response
        "comentario": nueva_resena.comentario,
        "fecha": nueva_resena.fecha.isoformat() if nueva_resena.fecha else None,
        "respuesta_vendedor": nueva_resena.respuesta_vendedor
    }

@router.put("/{resena_id}/respuesta")
def responder_resena(resena_id: int, data: dict, db: Session = Depends(get_db)):
    resena = db.query(Reseña).filter_by(id_reseña=resena_id).first()
    if not resena:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    resena.respuesta_vendedor = data.get("respuesta")
    db.commit()
    db.refresh(resena)
    
    # Enviar correo al cliente que dejó la reseña notificando la respuesta del vendedor
    try:
        cliente = db.query(Usuario).filter_by(id_usuario=resena.cliente_id).first()
        producto = db.query(Producto).filter_by(id=resena.producto_id).first()
        if cliente and cliente.correo:
            enviar_respuesta_resena(destinatario=cliente.correo,
                                    producto=producto.nombre if producto else 'Producto',
                                    respuesta_vendedor=resena.respuesta_vendedor)
            # crear una notificación interna también
            try:
                crear_notificacion(db, cliente.id_usuario, f"Tu reseña en {producto.nombre if producto else 'un producto'} ha recibido una respuesta.")
            except Exception:
                pass
    except Exception:
        # No bloquear la respuesta si falla el envío de correo
        pass

    return {"msg": "Respuesta guardada", "respuesta_vendedor": resena.respuesta_vendedor}
    return {"msg": "Respuesta guardada", "respuesta_vendedor": resena.respuesta_vendedor}

@router.get("/producto/{producto_id}", response_model=list[ResenaOut])
def get_resenas_producto(producto_id: int, db: Session = Depends(get_db)):
    resenas = db.query(Reseña).filter_by(producto_id=producto_id).all()
    resenas_out = []
    for r in resenas:
        resenas_out.append({
            "id": r.id_reseña,  # mapea id_reseña a id
            "producto_id": r.producto_id,
            "cliente_id": r.cliente_id,
            "calificacion": r.calificación,  # mapea calificación a calificacion
            "comentario": r.comentario,
            "fecha": r.fecha.isoformat() if r.fecha else "",
            "respuesta_vendedor": r.respuesta_vendedor
        })
    return resenas_out

@router.get("/")
def obtener_resenas(producto_id: int = Query(...), db: Session = Depends(get_db)):
    """
    Devuelve todas las reseñas de un producto.
    """
    resenas = db.query(Reseña).filter(Reseña.producto_id == producto_id).all()
    return [
        {
            "id": r.id_reseña,
            "usuario_id": r.usuario_id,
            "producto_id": r.producto_id,
            "calificacion": r.calificacion,
            "comentario": r.comentario,
            "respuesta_vendedor": r.respuesta_vendedor,
            # Si tienes relación con usuario, puedes agregar el nombre aquí
        }
        for r in resenas
    ]

@router.get("/puede-resenar")
def puede_resenar(producto_id: int, cliente_id: int, db: Session = Depends(get_db)):
    from models.pedido import Pedido
    from models.detallepedido import DetallePedido
    from models.resenas import Reseña

    # ¿El cliente compró este producto?
    compra = (
        db.query(DetallePedido)
        .join(Pedido, Pedido.id_pedido == DetallePedido.pedido_id)
        .filter(Pedido.cliente_id == cliente_id, DetallePedido.producto_id == producto_id)
        .first()
    )
    if not compra:
        return {"puede": False}
    # ¿Ya dejó reseña?
    ya_reseno = db.query(Reseña).filter_by(cliente_id=cliente_id, producto_id=producto_id).first()
    return {"puede": not bool(ya_reseno)}

from models.detallepedido import DetallePedido
from models.pedido import Pedido
from models.producto import Producto

@router.get("/comprados/{cliente_id}")
def productos_comprados(cliente_id: int, db: Session = Depends(get_db)):
    """
    Devuelve los productos que el cliente ha comprado.
    """
    productos = (
        db.query(Producto.id, Producto.nombre)
        .join(DetallePedido, DetallePedido.producto_id == Producto.id)
        .join(Pedido, Pedido.id_pedido == DetallePedido.pedido_id)
        .filter(Pedido.cliente_id == cliente_id)
        .distinct()
        .all()
    )
    return [{"id": p[0], "nombre": p[1]} for p in productos]

@router.put("/{resena_id}")
def editar_resena(resena_id: int, calificacion: int = Body(...), comentario: str = Body(...), db: Session = Depends(get_db)):
    resena = db.query(Reseña).filter_by(id_reseña=resena_id).first()
    if not resena:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    # Filtro de palabras ofensivas al editar
    palabras_ofensivas = ["tonto", "idiota", "estúpido"]
    if any(palabra in comentario.lower() for palabra in palabras_ofensivas):
        raise HTTPException(status_code=400, detail="El comentario contiene palabras inapropiadas.")
    if not es_comentario_apropiado(comentario):
        raise HTTPException(status_code=400, detail="Comentario inapropiado.")
    resena.calificacion = calificacion
    resena.comentario = comentario
    db.commit()
    db.refresh(resena)
    return resena

@router.get("/vendedor/{vendedor_id}")
def obtener_resenas_vendedor(vendedor_id: int, db: Session = Depends(get_db)):
    productos = db.query(Producto).filter(Producto.vendedor_id == vendedor_id).all()
    producto_ids = [p.id for p in productos]
    resenas = db.query(Reseña).filter(Reseña.producto_id.in_(producto_ids)).all()
    return [
        {
            "id": r.id_reseña,
            "producto_id": r.producto_id,
            "cliente_id": r.cliente_id,
            "calificacion": getattr(r, "calificacion", getattr(r, "calificación", None)),
            "comentario": r.comentario,
            "respuesta_vendedor": r.respuesta_vendedor,
            "fecha": r.fecha.isoformat() if r.fecha else ""
        }
        for r in resenas
    ]

@router.get("/cliente/{cliente_id}")
def resenas_de_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """
    Devuelve todas las reseñas hechas por un cliente.
    """
    resenas = db.query(Reseña).filter(Reseña.cliente_id == cliente_id).all()
    return [
        {
            "id": r.id_reseña,
            "producto_id": r.producto_id,
            "calificacion": getattr(r, "calificacion", getattr(r, "calificación", None)),
            "comentario": r.comentario,
            "respuesta_vendedor": r.respuesta_vendedor,
            "fecha": r.fecha
        }
        for r in resenas
    ]

@router.delete("/{resena_id}")
def eliminar_resena(resena_id: int, db: Session = Depends(get_db)):
    resena = db.query(Reseña).filter_by(id_reseña=resena_id).first()
    if not resena:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    db.delete(resena)
    db.commit()
    return {"msg": "Reseña eliminada"}

@router.get("/todas", response_model=list[ResenaOut])
def obtener_todas_resenas(db: Session = Depends(get_db)):
    resenas = db.query(Reseña).all()
    return [
        {
            "id": r.id_reseña,
            "producto_id": r.producto_id,
            "cliente_id": r.cliente_id,
            "calificacion": getattr(r, "calificacion", getattr(r, "calificación", None)),
            "comentario": r.comentario,
            "respuesta_vendedor": r.respuesta_vendedor,
            "fecha": r.fecha.isoformat() if r.fecha else ""
        }
        for r in resenas
    ]
