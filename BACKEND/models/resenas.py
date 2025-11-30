from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from db import Base


class Reseña(Base):
    __tablename__ = "reseñas"
    id_reseña = Column(Integer, primary_key=True)
    producto_id = Column(Integer, ForeignKey("productos.id"))  # <-- usa "productos.id"
    cliente_id = Column(Integer, ForeignKey("usuarios.id_usuario"))
    calificación = Column(Integer)
    comentario = Column(String(500))
    respuesta_vendedor = Column(String(500), default=None)
    fecha = Column(DateTime)

    producto = relationship("Producto")
    cliente = relationship("Usuario")
