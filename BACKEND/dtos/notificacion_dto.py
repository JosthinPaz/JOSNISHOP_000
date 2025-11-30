from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class NotificacionBase(BaseModel):
    usuario_id: int
    tipo: str
    mensaje: str
    fecha_envio: Optional[datetime] = None
    estado: Optional[bool] = None


class NotificacionCreate(NotificacionBase):
    pass


class NotificacionUpdate(NotificacionBase):
    pass


class NotificacionOut(NotificacionBase):
    id: int

    class Config:
        from_attributes = True
