from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from db.session import SessionLocal
from models.bot_response import BotResponse

router = APIRouter(prefix="/bot/responses", tags=["bot_responses"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def list_responses(db: Session = Depends(get_db)):
    return db.query(BotResponse).order_by(BotResponse.prioridad.desc()).all()


@router.post("/")
def create_response(payload: dict, db: Session = Depends(get_db)):
    # payload expected: { clave, respuesta, prioridad?, enabled? }
    clave = payload.get("clave")
    respuesta = payload.get("respuesta")
    if not clave or not respuesta:
        raise HTTPException(status_code=400, detail="Faltan campos clave/respuesta")
    br = BotResponse(clave=clave, respuesta=respuesta, prioridad=payload.get("prioridad", 0), enabled=payload.get("enabled", True))
    db.add(br)
    db.commit()
    db.refresh(br)
    return br


@router.put("/{resp_id}")
def update_response(resp_id: int, payload: dict, db: Session = Depends(get_db)):
    br = db.get(BotResponse, resp_id)
    if not br:
        raise HTTPException(status_code=404, detail="Respuesta no encontrada")
    for k in ["clave", "respuesta", "prioridad", "enabled"]:
        if k in payload:
            setattr(br, k, payload[k])
    db.commit()
    db.refresh(br)
    return br


@router.delete("/{resp_id}")
def delete_response(resp_id: int, db: Session = Depends(get_db)):
    br = db.get(BotResponse, resp_id)
    if not br:
        raise HTTPException(status_code=404, detail="Respuesta no encontrada")
    db.delete(br)
    db.commit()
    return {"ok": True}
