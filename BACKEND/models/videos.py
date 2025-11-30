from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from db import Base


class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=True)
    tipo = Column(String(50), default="video")  # 'video', 'perfil', 'galeria'
    url = Column(String(200))
    fecha_subida = Column(DateTime)

    producto = relationship("Producto", back_populates="videos")
    usuario = relationship("Usuario", back_populates="foto_perfil")
