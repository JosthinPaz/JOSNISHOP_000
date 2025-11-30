from sqlalchemy import Boolean, Column, Date, Integer, String
from sqlalchemy.orm import relationship

from db import Base


class Categoria(Base):
    __tablename__ = "categorias"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(60))
    estado = Column(Boolean)
    fecha_creacion = Column(Date)

    productos = relationship("Producto", back_populates="categoria")
