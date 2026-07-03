import uuid, shutil
from pathlib import Path
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models import MediaFile, Banner
from backend.auth.jwt import get_current_admin
from backend.config.settings import settings

router = APIRouter()

UPLOAD = Path(settings.UPLOAD_DIR)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), folder: str = "general",
                      db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    allowed = settings.ALLOWED_IMAGE_TYPES + ["video/mp4", "application/pdf"]
    if file.content_type not in allowed:
        raise HTTPException(400, f"File type {file.content_type} not allowed")
    dest = UPLOAD / folder
    dest.mkdir(parents=True, exist_ok=True)
    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    path = dest / filename
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    url = f"/uploads/{folder}/{filename}"
    size = path.stat().st_size
    media = MediaFile(filename=filename, file_url=url, file_type=file.content_type, file_size=size, folder=folder)
    db.add(media); db.commit()
    return {"url": url, "filename": filename, "id": media.id}

@router.get("/library")
def get_library(folder: str = None, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    q = db.query(MediaFile)
    if folder: q = q.filter(MediaFile.folder == folder)
    items = q.order_by(MediaFile.created_at.desc()).limit(100).all()
    return [{"id": i.id, "url": i.file_url, "filename": i.filename, "type": i.file_type,
             "size": i.file_size, "folder": i.folder} for i in items]

@router.delete("/{media_id}")
def delete_media(media_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    m = db.query(MediaFile).filter(MediaFile.id == media_id).first()
    if not m: raise HTTPException(404, "Not found")
    file_path = Path(".") / m.file_url.lstrip("/")
    if file_path.exists(): file_path.unlink()
    db.delete(m); db.commit()
    return {"message": "Deleted"}
