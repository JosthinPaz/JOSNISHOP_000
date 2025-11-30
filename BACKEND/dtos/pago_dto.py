from pydantic import BaseModel
from typing import Optional


class PagoCreate(BaseModel):
    id_usuario: int
    nombre_tarjeta: str
    numero_tarjeta: str
    fecha_expiracion: str
    cvv: str
    tipo_pago: Optional[str] = None
    tipo_tarjeta: Optional[str] = None
    referencia_pago: Optional[str] = None
    banco: Optional[str] = None
    monto: Optional[int] = None
    estado: Optional[str] = None
    # Si se envía True, el endpoint intentará actualizar el método existente en lugar de insertar uno nuevo
    replace_existing: Optional[bool] = True


class PagoOut(BaseModel):
    id_pago: int
    id_usuario: int
    nombre_tarjeta: str
    numero_tarjeta: str
    fecha_expiracion: str
    tipo_pago: Optional[str] = None
    tipo_tarjeta: Optional[str] = None
    monto: Optional[int] = None

    class Config:
        orm_mode = True