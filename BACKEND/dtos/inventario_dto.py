from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InventarioBase(BaseModel):
    producto_id: int
    cantidad: int
    stock_minimo: int
    # fecha_actualizacion puede ser opcional en respuestas si la BD no la tiene
    fecha_actualizacion: Optional[datetime] = None


class InventarioCreate(InventarioBase):
    pass


class InventarioUpdate(BaseModel):
    producto_id: int | None = None
    cantidad: int | None = None
    stock_minimo: int | None = None
    fecha_actualizacion: Optional[datetime] = None


class InventarioOut(InventarioBase):
    id: int

    class Config:
        orm_mode = True
