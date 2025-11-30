from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from db import Base


class Pedido(Base):
    __tablename__ = "pedidos"
    id_pedido = Column(Integer, primary_key=True)
    cliente_id = Column(Integer, ForeignKey("usuarios.id_usuario"))
    vendedor_id = Column(Integer, ForeignKey("usuarios.id_usuario"))  # <-- Nuevo campo
    fecha_pedido = Column(DateTime)
    estado = Column(String(50))
    total = Column(Float) 

    cliente = relationship("Usuario", foreign_keys=[cliente_id])
    vendedor = relationship("Usuario", foreign_keys=[vendedor_id])
    detalles = relationship("DetallePedido", back_populates="pedido")
