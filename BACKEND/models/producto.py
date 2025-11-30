from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from db import Base


class Producto(Base):
    __tablename__ = "productos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(60))
    descripcion = Column(String(200))
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    vendedor_id = Column(Integer, ForeignKey("usuarios.id_usuario"))  # <-- CORREGIDO

    categoria = relationship("Categoria", back_populates="productos")
    items = relationship("Item", back_populates="producto")
    videos = relationship("Video", back_populates="producto")
