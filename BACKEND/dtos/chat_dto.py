from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ChatBase(BaseModel):
    usuario_origen: int
    usuario_destino: int
    mensaje: str
    fecha_envio: Optional[datetime] = None


class ChatCreate(ChatBase):
    pass


class ChatUpdate(ChatBase):
    pass


class ChatOut(ChatBase):
    id: int

    class Config:
        from_attributes = True
