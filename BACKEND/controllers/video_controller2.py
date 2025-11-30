from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from db.session import SessionLocal
from models.videos import Video
from utils.image_utils import validate_and_process_image_url

router = APIRouter(prefix="/videos", tags=["videos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class VideoCreate(BaseModel):
    producto_id: int
    url: str

class VideoOut(BaseModel):
    id: int
    producto_id: int
    url: str
    fecha_subida: datetime

    class Config:
        orm_mode = True

@router.post("/", response_model=VideoOut)
def create_video(video: VideoCreate, db: Session = Depends(get_db)):
    # Validate and process the URL
    processed_url = validate_and_process_image_url(video.url)
    
    # Create new video entry
    db_video = Video(
        producto_id=video.producto_id,
        url=processed_url,
        fecha_subida=datetime.now()
    )
    
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

@router.get("/{producto_id}", response_model=List[VideoOut])
def get_videos(producto_id: int, db: Session = Depends(get_db)):
    videos = db.query(Video).filter(Video.producto_id == producto_id).all()
    if not videos:
        raise HTTPException(status_code=404, detail="No se encontraron videos para este producto")
    return videos

@router.delete("/{video_id}")
def delete_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    
    db.delete(video)
    db.commit()
    return {"message": "Video eliminado exitosamente"}