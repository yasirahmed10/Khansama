from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models import Banner
from backend.auth.jwt import get_current_admin

router = APIRouter()

@router.get("")
def list_banners(banner_type: str = None, db: Session = Depends(get_db)):
    q = db.query(Banner).filter(Banner.is_active == True)
    if banner_type: q = q.filter(Banner.banner_type == banner_type)
    banners = q.order_by(Banner.display_order).all()
    return [{"id": b.id, "title": b.title, "image_url": b.image_url, "link_url": b.link_url,
             "banner_type": b.banner_type} for b in banners]

@router.post("/admin")
def create_banner(data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    b = Banner(title=data.get("title"), image_url=data["image_url"], link_url=data.get("link_url"),
               banner_type=data.get("banner_type", "homepage"), display_order=data.get("display_order", 0))
    db.add(b); db.commit()
    return {"message": "Banner created", "id": b.id}

@router.put("/admin/{b_id}")
def update_banner(b_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    b = db.query(Banner).filter(Banner.id == b_id).first()
    if not b: raise HTTPException(404, "Not found")
    for k, v in data.items():
        if hasattr(b, k): setattr(b, k, v)
    db.commit()
    return {"message": "Updated"}

@router.delete("/admin/{b_id}")
def delete_banner(b_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    b = db.query(Banner).filter(Banner.id == b_id).first()
    if not b: raise HTTPException(404, "Not found")
    db.delete(b); db.commit()
    return {"message": "Deleted"}
