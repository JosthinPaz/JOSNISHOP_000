from sqlalchemy import (
    Column,
    Float,
    ForeignKey,
    Integer,
)
from sqlalchemy.orm import relationship

from db import Base


class DetallePedido(Base):
    __tablename__ = "detalle_pedido"
    id_detalle = Column(Integer, primary_key=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id_pedido"))
    producto_id = Column(Integer, ForeignKey("productos.id"))  # <-- usa "productos.id"
    cantidad = Column(Integer)
    subtotal = Column(Float)
 
    pedido = relationship("Pedido", back_populates="detalles")
    producto = relationship("Producto")
