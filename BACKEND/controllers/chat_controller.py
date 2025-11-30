from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.session import SessionLocal
from dtos.chat_dto import ChatCreate, ChatOut, ChatUpdate
from models.chatbox import Chat

router = APIRouter(prefix="/chats", tags=["chats"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ChatOut)
def crear_chat(chat: ChatCreate, db: Session = Depends(get_db)):
    db_chat = Chat(**chat.dict())
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat


@router.get("/", response_model=list[ChatOut])
def listar_chats(db: Session = Depends(get_db)):
    return db.query(Chat).all()


@router.get("/{chat_id}", response_model=ChatOut)
def obtener_chat(chat_id: int, db: Session = Depends(get_db)):
    chat = db.get(Chat, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat no encontrado")
    return chat


@router.put("/{chat_id}", response_model=ChatOut)
def actualizar_chat(chat_id: int, datos: ChatUpdate, db: Session = Depends(get_db)):
    chat = db.get(Chat, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat no encontrado")
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(chat, key, value)
    db.commit()
    db.refresh(chat)
    return chat


@router.delete("/{chat_id}")
def eliminar_chat(chat_id: int, db: Session = Depends(get_db)):
    chat = db.get(Chat, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat no encontrado")
    db.delete(chat)
    db.commit()
    return {"ok": True}
