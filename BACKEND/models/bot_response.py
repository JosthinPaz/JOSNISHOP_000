from sqlalchemy import Column, Integer, String, Text, Boolean
from db import Base


class BotResponse(Base):
    __tablename__ = "bot_responses"
    id = Column(Integer, primary_key=True)
    clave = Column(String(200), nullable=False, index=True)
    respuesta = Column(Text, nullable=False)
    prioridad = Column(Integer, default=0)
    enabled = Column(Boolean, default=True)
