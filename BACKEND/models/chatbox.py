from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Text,
)
from sqlalchemy.orm import relationship

from db import Base


class Chat(Base):
    __tablename__ = "chat"
    id = Column(Integer, primary_key=True)
    usuario_origen = Column(Integer, ForeignKey("usuarios.id_usuario"))
    usuario_destino = Column(Integer, ForeignKey("usuarios.id_usuario"))
    mensaje = Column(Text)
    fecha_envio = Column(DateTime)

    origen = relationship("Usuario", foreign_keys=[usuario_origen])
    destino = relationship("Usuario", foreign_keys=[usuario_destino])
