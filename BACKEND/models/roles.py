from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from db import Base


class Rol(Base):
    __tablename__ = "roles"
    id_rol = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    estado = Column(Boolean)

    usuarios = relationship("Usuario", back_populates="rol")
