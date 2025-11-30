from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from db import Base


class Notificacion(Base):
    __tablename__ = "notificaciones"
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id_usuario"))
    tipo = Column(String(50))
    mensaje = Column(Text)
    fecha_envio = Column(DateTime)
    estado = Column(Boolean)

    usuario = relationship("Usuario")
