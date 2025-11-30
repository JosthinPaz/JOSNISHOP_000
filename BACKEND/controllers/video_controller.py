from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.session import SessionLocal
from dtos.resena_dto import ResenaCreate, ResenaOut, ResenaUpdate
from BACKEND.models.resenas import Reseña

router = APIRouter(prefix="/resenas", tags=["resenas"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ResenaOut)
def crear_resena(resena: ResenaCreate, db: Session = Depends(get_db)):
    db_resena = Reseña(**resena.dict())
    db.add(db_resena)
    db.commit()
    db.refresh(db_resena)
    return db_resena


@router.get("/", response_model=list[ResenaOut])
def listar_resenas(db: Session = Depends(get_db)):
    return db.query(Reseña).all()


@router.get("/{resena_id}", response_model=ResenaOut)
def obtener_resena(resena_id: int, db: Session = Depends(get_db)):
    resena = db.get(Reseña, resena_id)
    if not resena:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    return resena


@router.put("/{resena_id}", response_model=ResenaOut)
def actualizar_resena(
    resena_id: int, datos: ResenaUpdate, db: Session = Depends(get_db)
):
    resena = db.get(Reseña, resena_id)
    if not resena:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(resena, key, value)
    db.commit()
    db.refresh(resena)
    return resena


@router.delete("/{resena_id}")
def eliminar_resena(resena_id: int, db: Session = Depends(get_db)):
    resena = db.get(Reseña, resena_id)
    if not resena:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    db.delete(resena)
    db.commit()
    return {"ok": True}
