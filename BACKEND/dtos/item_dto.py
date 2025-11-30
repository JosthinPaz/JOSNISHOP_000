from datetime import date
from typing import Optional

from pydantic import BaseModel


class ItemBase(BaseModel):
    serial: str
    fecha_ingreso: Optional[date] = None
    fecha_salida: Optional[date] = None
    estado: Optional[bool] = True
    precio: Optional[float] = None
    productos_id: int


class ItemCreate(ItemBase):
    pass


class ItemUpdate(ItemBase):
    pass


class ItemOut(ItemBase):
    id: int

    class Config:
        from_attributes = True
