from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func
from typing import Optional
from pydantic import BaseModel
from backend.database.connection import get_db
from backend.models import Food, FoodImage, Category
from backend.auth.jwt import get_current_admin

router = APIRouter()

def food_to_dict(f: Food):
    return {
        "id": f.id, "name": f.name, "slug": f.slug,
        "description": f.description,
        "category": {"id": f.category.id, "name": f.category.name} if f.category else None,
        "price": f.price, "discount_percent": f.discount_percent,
        "discounted_price": round(f.price * (1 - f.discount_percent / 100), 2) if f.discount_percent else f.price,
        "is_veg": f.is_veg, "spice_level": f.spice_level,
        "ingredients": f.ingredients, "allergens": f.allergens,
        "nutrition_info": f.nutrition_info, "preparation_time_mins": f.preparation_time_mins,
        "is_available": f.is_available, "is_featured": f.is_featured,
        "is_bestseller": f.is_bestseller, "is_new_arrival": f.is_new_arrival,
        "rating": f.rating, "rating_count": f.rating_count,
        "images": [{"id": i.id, "url": i.image_url, "is_primary": i.is_primary} for i in f.images],
        "primary_image": next((i.image_url for i in f.images if i.is_primary), f.images[0].image_url if f.images else None),
        "created_at": f.created_at.isoformat() if f.created_at else None,
    }

# ── Public endpoints ──────────────────────────────────────────────────────────

@router.get("")
def list_foods(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    is_veg: Optional[bool] = None,
    spice_level: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    is_featured: Optional[bool] = None,
    is_bestseller: Optional[bool] = None,
    is_new_arrival: Optional[bool] = None,
    sort_by: str = "display_order",
    order: str = "asc",
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db)
):
    q = db.query(Food).options(joinedload(Food.images), joinedload(Food.category)).filter(Food.is_available == True)
    if search:
        q = q.filter(or_(Food.name.ilike(f"%{search}%"), Food.description.ilike(f"%{search}%")))
    if category_id:
        q = q.filter(Food.category_id == category_id)
    if is_veg is not None:
        q = q.filter(Food.is_veg == is_veg)
    if spice_level:
        q = q.filter(Food.spice_level == spice_level)
    if min_price is not None:
        q = q.filter(Food.price >= min_price)
    if max_price is not None:
        q = q.filter(Food.price <= max_price)
    if is_featured is not None:
        q = q.filter(Food.is_featured == is_featured)
    if is_bestseller is not None:
        q = q.filter(Food.is_bestseller == is_bestseller)
    if is_new_arrival is not None:
        q = q.filter(Food.is_new_arrival == is_new_arrival)

    sort_col = getattr(Food, sort_by, Food.display_order)
    if order == "desc":
        q = q.order_by(sort_col.desc())
    else:
        q = q.order_by(sort_col.asc())

    total = q.count()
    foods = q.offset((page - 1) * per_page).limit(per_page).all()
    return {"total": total, "page": page, "per_page": per_page, "pages": -(-total // per_page), "items": [food_to_dict(f) for f in foods]}

@router.get("/featured")
def featured_foods(db: Session = Depends(get_db)):
    foods = db.query(Food).options(joinedload(Food.images), joinedload(Food.category)).filter(Food.is_featured == True, Food.is_available == True).limit(8).all()
    return [food_to_dict(f) for f in foods]

@router.get("/bestsellers")
def bestsellers(db: Session = Depends(get_db)):
    foods = db.query(Food).options(joinedload(Food.images), joinedload(Food.category)).filter(Food.is_bestseller == True, Food.is_available == True).limit(8).all()
    return [food_to_dict(f) for f in foods]

@router.get("/new-arrivals")
def new_arrivals(db: Session = Depends(get_db)):
    foods = db.query(Food).options(joinedload(Food.images), joinedload(Food.category)).filter(Food.is_new_arrival == True, Food.is_available == True).limit(8).all()
    return [food_to_dict(f) for f in foods]

@router.get("/{slug}")
def get_food(slug: str, db: Session = Depends(get_db)):
    food = db.query(Food).options(joinedload(Food.images), joinedload(Food.category)).filter(Food.slug == slug).first()
    if not food:
        raise HTTPException(404, "Food not found")
    return food_to_dict(food)

# ── Admin endpoints ───────────────────────────────────────────────────────────

class FoodCreate(BaseModel):
    name: str; description: str = None; category_id: int
    price: float; discount_percent: float = 0.0; is_veg: bool = False
    spice_level: str = "medium"; ingredients: str = None; allergens: str = None
    nutrition_info: dict = None; preparation_time_mins: int = 20
    is_available: bool = True; is_featured: bool = False
    is_bestseller: bool = False; is_new_arrival: bool = False
    display_order: int = 0

def slugify(text):
    import re
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

@router.get("/admin/all")
def admin_list_foods(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    foods = db.query(Food).options(joinedload(Food.images), joinedload(Food.category)).order_by(Food.display_order).all()
    return [food_to_dict(f) for f in foods]

@router.post("/admin")
def create_food(data: FoodCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    slug = slugify(data.name)
    if db.query(Food).filter(Food.slug == slug).first():
        slug = f"{slug}-{db.query(func.count(Food.id)).scalar()}"
    food = Food(**data.dict(), slug=slug)
    db.add(food); db.commit(); db.refresh(food)
    return food_to_dict(db.query(Food).options(joinedload(Food.images), joinedload(Food.category)).filter(Food.id == food.id).first())

@router.put("/admin/{food_id}")
def update_food(food_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food: raise HTTPException(404, "Food not found")
    for k, v in data.items():
        if hasattr(food, k): setattr(food, k, v)
    db.commit()
    return {"message": "Food updated"}

@router.delete("/admin/{food_id}")
def delete_food(food_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food: raise HTTPException(404, "Food not found")
    db.delete(food); db.commit()
    return {"message": "Food deleted"}

@router.post("/admin/{food_id}/images")
def add_food_image(food_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food: raise HTTPException(404, "Food not found")
    img = FoodImage(food_id=food_id, image_url=data["image_url"], is_primary=data.get("is_primary", False))
    db.add(img); db.commit()
    return {"message": "Image added", "id": img.id}

@router.delete("/admin/images/{image_id}")
def delete_food_image(image_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    img = db.query(FoodImage).filter(FoodImage.id == image_id).first()
    if not img: raise HTTPException(404, "Image not found")
    db.delete(img); db.commit()
    return {"message": "Image deleted"}
