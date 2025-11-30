from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.pagos import Pago
from dtos.pago_dto import PagoCreate, PagoOut
from utils.crypto_utils import encrypt_data, decrypt_data

router = APIRouter()

@router.post("/pagos", response_model=PagoOut)
def crear_pago(pago: PagoCreate, db: Session = Depends(get_db)):
    # Si el cliente solicita reemplazar el método existente, buscamos el más reciente y lo actualizamos
    if getattr(pago, "replace_existing", True):
        existente = db.query(Pago).filter(Pago.id_usuario == pago.id_usuario).order_by(Pago.id_pago.desc()).first()
        if existente:
            existente.nombre_tarjeta = encrypt_data(pago.nombre_tarjeta)
            existente.numero_tarjeta = encrypt_data(pago.numero_tarjeta)
            existente.fecha_expiracion = encrypt_data(pago.fecha_expiracion)
            existente.cvv = encrypt_data(pago.cvv)
            existente.tipo_pago = pago.tipo_pago or existente.tipo_pago or "tarjeta_credito"
            existente.tipo_tarjeta = pago.tipo_tarjeta or existente.tipo_tarjeta
            existente.referencia_pago = pago.referencia_pago or existente.referencia_pago
            existente.banco = pago.banco or existente.banco
            existente.monto = pago.monto if pago.monto is not None else existente.monto
            existente.estado = pago.estado or existente.estado

            db.add(existente)
            db.commit()
            db.refresh(existente)

            return PagoOut(
                id_pago=existente.id_pago,
                id_usuario=existente.id_usuario,
                nombre_tarjeta=decrypt_data(existente.nombre_tarjeta),
                numero_tarjeta="*" * 12 + decrypt_data(existente.numero_tarjeta)[-4:],
                fecha_expiracion=decrypt_data(existente.fecha_expiracion),
                tipo_pago=existente.tipo_pago,
                tipo_tarjeta=existente.tipo_tarjeta,
                monto=existente.monto,
            )

    # Si no hay existente (o replace_existing es False), creamos uno nuevo
    nuevo_pago = Pago(
        id_usuario=pago.id_usuario,
        nombre_tarjeta=encrypt_data(pago.nombre_tarjeta),
        numero_tarjeta=encrypt_data(pago.numero_tarjeta),
        fecha_expiracion=encrypt_data(pago.fecha_expiracion),
        cvv=encrypt_data(pago.cvv),
        tipo_pago=pago.tipo_pago or "tarjeta_credito",
        tipo_tarjeta=pago.tipo_tarjeta or None,
        referencia_pago=pago.referencia_pago or None,
        banco=pago.banco or None,
        monto=pago.monto if pago.monto is not None else 0,
        estado=pago.estado or "completado",
    )

    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)

    # Desciframos los datos para la respuesta
    return PagoOut(
        id_pago=nuevo_pago.id_pago,
        id_usuario=nuevo_pago.id_usuario,
        nombre_tarjeta=decrypt_data(nuevo_pago.nombre_tarjeta),
        numero_tarjeta="*" * 12 + decrypt_data(nuevo_pago.numero_tarjeta)[-4:],  # Solo últimos 4
        fecha_expiracion=decrypt_data(nuevo_pago.fecha_expiracion),
        tipo_pago=nuevo_pago.tipo_pago,
        tipo_tarjeta=nuevo_pago.tipo_tarjeta,
        monto=nuevo_pago.monto,
    )

@router.get("/usuarios/{usuario_id}/metodo-pago", response_model=PagoOut)
def obtener_metodo_pago(usuario_id: int, db: Session = Depends(get_db)):
    # Buscamos el método de pago más reciente para un usuario.
    # `.filter(Pago.id_usuario == usuario_id)`: Filtra por el ID del usuario.
    # `.order_by(Pago.id_pago.desc())`: Ordena por el ID de pago en orden descendente
    # para obtener el más reciente.
    # `.first()`: Obtiene solo el primer resultado de la consulta.
    pago = db.query(Pago).filter(Pago.id_usuario == usuario_id).order_by(Pago.id_pago.desc()).first()
    
    # Si no se encuentra ningún pago, lanzamos un error 404.
    if not pago:
        raise HTTPException(status_code=404, detail="No hay método de pago guardado")
        
    # Devolvemos la información del pago con los campos requeridos
    return PagoOut(
        id_pago=pago.id_pago,
        id_usuario=pago.id_usuario,
        nombre_tarjeta=decrypt_data(pago.nombre_tarjeta),
        numero_tarjeta="*" * 12 + decrypt_data(pago.numero_tarjeta)[-4:],  # Solo mostramos los últimos 4 dígitos
        fecha_expiracion=decrypt_data(pago.fecha_expiracion),
        cvv="***"  # Nunca mostramos el CVV completo
    )
    # En un entorno real, solo se debería devolver información parcial (ej. los últimos 4 dígitos)
    # o un token de pago.
    return {
        "nombre_tarjeta": pago.nombre_tarjeta,
        "numero_tarjeta": pago.numero_tarjeta,
        "fecha_expiracion": pago.fecha_expiracion,
        "cvv": pago.cvv
    }