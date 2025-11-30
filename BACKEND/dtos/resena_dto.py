from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ResenaBase(BaseModel):
    producto_id: int
    cliente_id: int
    calificación: int
    comentario: Optional[str] = None
    fecha: Optional[datetime] = None


class ResenaCreate(BaseModel):
    producto_id: int
    cliente_id: int
    calificacion: int  # <-- sin tilde
    comentario: str


class ResenaUpdate(ResenaBase):
    pass


class ResenaOut(BaseModel):
    id: int
    producto_id: int
    cliente_id: int
    calificacion: int
    comentario: str
    fecha: str  # <-- debe ser str, no datetime
    respuesta_vendedor: str | None = None

    class Config:
        orm_mode = True


class ResenaDTO(BaseModel):
    id: int
    usuario_id: int
    producto_id: int
    calificacion: int
    comentario: str
    respuesta_vendedor: Optional[str] = None
