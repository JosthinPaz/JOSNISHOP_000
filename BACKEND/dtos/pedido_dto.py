from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PedidoBase(BaseModel):
    cliente_id: int
    vendedor_id: int = 1  # <-- Nuevo campo
    fecha_pedido: Optional[datetime] = None
    estado: Optional[str] = None
    total: Optional[float] = None


class PedidoCreate(BaseModel):
    cliente_id: int
    vendedor_id: int = 1  # <-- Nuevo campo
    fecha_pedido: str
    estado: str
    total: float


class PedidoUpdate(BaseModel):
    fecha_pedido: str | None = None
    estado: str | None = None
    total: float | None = None


class PedidoOut(BaseModel):
    id_pedido: int
    cliente_id: int
    vendedor_id: int  # <-- Nuevo campo
    fecha_pedido: datetime  # ← CAMBIO de str a datetime
    estado: str
    total: float

    class Config:
        orm_mode = True
