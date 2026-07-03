from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models import Category
from backend.auth.jwt import get_current_admin
import re

router = APIRouter()

def slugify(t): return re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')

def cat_dict(c):
    return {"id": c.id, "name": c.name, "slug": c.slug, "description": c.description,
            "image_url": c.image_url, "display_order": c.display_order, "is_active": c.is_active}

@router.get("")
def list_categories(db: Session = Depends(get_db)):
    cats = db.query(Category).filter(Category.is_active == True).order_by(Category.display_order).all()
    return [cat_dict(c) for c in cats]

@router.get("/admin/all")
def admin_list(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    cats = db.query(Category).order_by(Category.display_order).all()
    return [cat_dict(c) for c in cats]

@router.post("/admin")
def create_category(data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    cat = Category(name=data["name"], slug=slugify(data["name"]), description=data.get("description"),
                   image_url=data.get("image_url"), display_order=data.get("display_order", 0))
    db.add(cat); db.commit(); db.refresh(cat)
    return cat_dict(cat)

@router.put("/admin/{cat_id}")
def update_category(cat_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat: raise HTTPException(404, "Category not found")
    for k, v in data.items():
        if hasattr(cat, k): setattr(cat, k, v)
    db.commit()
    return cat_dict(cat)

@router.delete("/admin/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat: raise HTTPException(404, "Category not found")
    db.delete(cat); db.commit()
    return {"message": "Deleted"}
