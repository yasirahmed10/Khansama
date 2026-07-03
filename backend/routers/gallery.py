import os, uuid, shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models import GalleryItem, MediaFile
from backend.auth.jwt import get_current_admin
from backend.config.settings import settings
from pathlib import Path

router = APIRouter()

UPLOAD = Path(settings.UPLOAD_DIR)

def save_upload(file: UploadFile, folder: str) -> str:
    dest = UPLOAD / folder
    dest.mkdir(parents=True, exist_ok=True)
    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    path = dest / filename
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return f"/uploads/{folder}/{filename}"

@router.get("")
def list_gallery(album: str = None, db: Session = Depends(get_db)):
    q = db.query(GalleryItem)
    if album: q = q.filter(GalleryItem.album == album)
    items = q.order_by(GalleryItem.display_order).all()
    return [{"id": i.id, "title": i.title, "file_url": i.file_url, "thumbnail_url": i.thumbnail_url,
             "media_type": i.media_type, "album": i.album, "is_featured": i.is_featured} for i in items]

@router.get("/albums")
def list_albums(db: Session = Depends(get_db)):
    from sqlalchemy import distinct
    albums = db.query(distinct(GalleryItem.album)).all()
    return [a[0] for a in albums if a[0]]

@router.post("/admin/upload")
async def upload_gallery(file: UploadFile = File(...), album: str = "General",
                         title: str = None, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    if file.content_type not in settings.ALLOWED_IMAGE_TYPES + ["video/mp4", "video/webm"]:
        raise HTTPException(400, "Invalid file type")
    url = save_upload(file, "gallery")
    media_type = "video" if file.content_type.startswith("video") else "image"
    item = GalleryItem(title=title, file_url=url, media_type=media_type, album=album)
    db.add(item); db.commit()
    return {"message": "Uploaded", "id": item.id, "url": url}

@router.put("/admin/{item_id}")
def update_gallery(item_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item: raise HTTPException(404, "Not found")
    for k, v in data.items():
        if hasattr(item, k): setattr(item, k, v)
    db.commit()
    return {"message": "Updated"}

@router.delete("/admin/{item_id}")
def delete_gallery(item_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(GalleryItem).filter(GalleryItem.id == item_id).first()
    if not item: raise HTTPException(404, "Not found")
    db.delete(item); db.commit()
    return {"message": "Deleted"}
