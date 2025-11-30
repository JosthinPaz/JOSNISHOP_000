from sqlalchemy import (
    Boolean,
    Column,
    Date,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from db import Base


class Item(Base):
    __tablename__ = "item"
    id = Column(Integer, primary_key=True)
    serial = Column(String(60))
    fecha_ingreso = Column(Date)
    fecha_salida = Column(Date)
    estado = Column(Boolean)
    precio = Column(Float)
    productos_id = Column(Integer, ForeignKey("productos.id"))

    producto = relationship("Producto", back_populates="items")
