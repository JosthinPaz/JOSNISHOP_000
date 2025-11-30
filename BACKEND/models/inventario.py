from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
)
from sqlalchemy.orm import relationship

from db import Base


class Inventario(Base):
    __tablename__ = "inventarios"
    id = Column(Integer, primary_key=True, autoincrement=True)
    producto_id = Column(Integer, ForeignKey("productos.id"))
    cantidad = Column(Integer)
    stock_minimo = Column(Integer)
    fecha_actualizacion = Column(DateTime)

    producto = relationship("Producto")
