from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from db import Base


class Usuario(Base):
    __tablename__ = "usuarios"
    id_usuario = Column(Integer, primary_key=True)
    nombre = Column(String(100))
    correo = Column(String(100))
    contraseña = Column(String(255))
    rol_id = Column(Integer, ForeignKey("roles.id_rol"))
    estado = Column(Boolean)
    tipo_documento = Column(String(50), nullable=True)
    numero_documento = Column(String(100), nullable=True)
    fecha_nacimiento = Column(String(20), nullable=True)
    seguridad_pregunta = Column(String(255), nullable=True)
    seguridad_respuesta = Column(String(255), nullable=True)  # hashed

    rol = relationship("Rol", back_populates="usuarios")
    pagos = relationship("Pago", back_populates="usuario")
    foto_perfil = relationship("Video", back_populates="usuario", foreign_keys="Video.usuario_id")