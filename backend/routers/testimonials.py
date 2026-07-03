from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models import Testimonial
from backend.auth.jwt import get_current_admin

router = APIRouter()

@router.get("")
def list_testimonials(db: Session = Depends(get_db)):
    items = db.query(Testimonial).filter(Testimonial.is_approved == True).order_by(Testimonial.is_featured.desc()).limit(20).all()
    return [{"id": t.id, "name": t.name, "review": t.review, "rating": t.rating,
             "photo_url": t.photo_url, "is_featured": t.is_featured,
             "created_at": t.created_at.isoformat() if t.created_at else None} for t in items]

@router.post("")
def submit_testimonial(data: dict, db: Session = Depends(get_db)):
    if not 1 <= data.get("rating", 0) <= 5:
        raise HTTPException(400, "Rating must be between 1 and 5")
    t = Testimonial(name=data["name"], email=data.get("email"), review=data["review"],
                    rating=data["rating"], photo_url=data.get("photo_url"))
    db.add(t); db.commit()
    return {"message": "Review submitted for approval. Thank you!"}

@router.get("/admin/all")
def admin_testimonials(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    items = db.query(Testimonial).order_by(Testimonial.created_at.desc()).all()
    return [{"id": t.id, "name": t.name, "review": t.review, "rating": t.rating,
             "is_approved": t.is_approved, "is_featured": t.is_featured,
             "created_at": t.created_at.isoformat() if t.created_at else None} for t in items]

@router.put("/admin/{t_id}")
def update_testimonial(t_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    t = db.query(Testimonial).filter(Testimonial.id == t_id).first()
    if not t: raise HTTPException(404, "Not found")
    for k, v in data.items():
        if hasattr(t, k): setattr(t, k, v)
    db.commit()
    return {"message": "Updated"}

@router.delete("/admin/{t_id}")
def delete_testimonial(t_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    t = db.query(Testimonial).filter(Testimonial.id == t_id).first()
    if not t: raise HTTPException(404, "Not found")
    db.delete(t); db.commit()
    return {"message": "Deleted"}
