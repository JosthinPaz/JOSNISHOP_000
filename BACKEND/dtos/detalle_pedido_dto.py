from pydantic import BaseModel


class DetallePedidoBase(BaseModel):
    pedido_id: int
    producto_id: int
    cantidad: int
    subtotal: float


class DetallePedidoCreate(DetallePedidoBase):
    pass


class DetallePedidoUpdate(DetallePedidoBase):
    pass


class DetallePedidoOut(DetallePedidoBase):
    id_detalle: int

    class Config:
        from_attributes = True
