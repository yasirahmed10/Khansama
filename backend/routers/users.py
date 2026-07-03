from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models import User
from backend.auth.jwt import get_current_admin

router = APIRouter()

@router.get("/admin/all")
def list_users(page: int = 1, per_page: int = 20, search: str = None, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    q = db.query(User)
    if search: q = q.filter(User.name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%"))
    total = q.count()
    users = q.order_by(User.created_at.desc()).offset((page-1)*per_page).limit(per_page).all()
    return {"total": total, "items": [{"id": u.id, "name": u.name, "email": u.email, "phone": u.phone,
            "is_active": u.is_active, "created_at": u.created_at.isoformat() if u.created_at else None} for u in users]}

@router.put("/admin/{user_id}/toggle")
def toggle_user(user_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(404, "Not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'activated' if user.is_active else 'deactivated'}"}

@router.delete("/admin/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(404, "Not found")
    db.delete(user); db.commit()
    return {"message": "Deleted"}
