from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ResenaBase(BaseModel):
    producto_id: int
    cliente_id: int
    calificación: int
    comentario: Optional[str] = None
    fecha: Optional[datetime] = None


class ResenaCreate(ResenaBase):
    pass


class ResenaUpdate(ResenaBase):
    pass


class ResenaOut(ResenaBase):
    id_reseña: int

    class Config:
        from_attributes = True
