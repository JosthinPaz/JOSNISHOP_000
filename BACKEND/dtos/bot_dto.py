from pydantic import BaseModel
from typing import Optional, List


class HistoryMessage(BaseModel):
    from_: str
    text: str


class BotRequest(BaseModel):
    # If the user is not logged in, this can be null/None
    usuario_origen: Optional[int] = None
    mensaje: str
    # Optional recent conversation history from frontend (helps AI be coherent)
    history: Optional[List[dict]] = None


class BotResponseOut(BaseModel):
    texto: str
    fallback: bool = False
    whatsapp_url: Optional[str] = None
    ai_generated: bool = False
