from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.database.connection import get_db
from backend.models import Offer, Coupon
from backend.auth.jwt import get_current_admin

router = APIRouter()

@router.get("")
def list_offers(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    offers = db.query(Offer).filter(Offer.is_active == True).order_by(Offer.priority.desc()).all()
    return [{"id": o.id, "title": o.title, "description": o.description, "banner_url": o.banner_url,
             "discount_percent": o.discount_percent, "offer_type": o.offer_type,
             "valid_from": o.valid_from.isoformat() if o.valid_from else None,
             "valid_to": o.valid_to.isoformat() if o.valid_to else None} for o in offers]

@router.get("/admin/all")
def admin_offers(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    offers = db.query(Offer).order_by(Offer.priority.desc()).all()
    return [{"id": o.id, "title": o.title, "is_active": o.is_active, "offer_type": o.offer_type,
             "discount_percent": o.discount_percent, "valid_to": o.valid_to.isoformat() if o.valid_to else None} for o in offers]

@router.post("/admin")
def create_offer(data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    offer = Offer(title=data["title"], description=data.get("description"), banner_url=data.get("banner_url"),
                  discount_percent=data.get("discount_percent", 0), offer_type=data.get("offer_type", "seasonal"),
                  valid_from=datetime.fromisoformat(data["valid_from"]) if data.get("valid_from") else None,
                  valid_to=datetime.fromisoformat(data["valid_to"]) if data.get("valid_to") else None,
                  priority=data.get("priority", 0))
    db.add(offer); db.commit(); db.refresh(offer)
    return {"message": "Offer created", "id": offer.id}

@router.put("/admin/{offer_id}")
def update_offer(offer_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer: raise HTTPException(404, "Not found")
    for k, v in data.items():
        if hasattr(offer, k): setattr(offer, k, v)
    db.commit()
    return {"message": "Updated"}

@router.delete("/admin/{offer_id}")
def delete_offer(offer_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer: raise HTTPException(404, "Not found")
    db.delete(offer); db.commit()
    return {"message": "Deleted"}

# ── Coupons ───────────────────────────────────────────────────────────────────

@router.get("/admin/coupons")
def list_coupons(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    coupons = db.query(Coupon).all()
    return [{"id": c.id, "code": c.code, "description": c.description, "discount_percent": c.discount_percent,
             "discount_amount": c.discount_amount, "min_order_amount": c.min_order_amount,
             "usage_limit": c.usage_limit, "used_count": c.used_count, "is_active": c.is_active,
             "valid_to": c.valid_to.isoformat() if c.valid_to else None} for c in coupons]

@router.post("/admin/coupons")
def create_coupon(data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    if db.query(Coupon).filter(Coupon.code == data["code"].upper()).first():
        raise HTTPException(400, "Coupon code already exists")
    c = Coupon(code=data["code"].upper(), description=data.get("description"),
               discount_percent=data.get("discount_percent", 0), discount_amount=data.get("discount_amount", 0),
               min_order_amount=data.get("min_order_amount", 0), max_discount=data.get("max_discount"),
               usage_limit=data.get("usage_limit"), is_active=data.get("is_active", True),
               valid_from=datetime.fromisoformat(data["valid_from"]) if data.get("valid_from") else None,
               valid_to=datetime.fromisoformat(data["valid_to"]) if data.get("valid_to") else None)
    db.add(c); db.commit()
    return {"message": "Coupon created", "id": c.id}

@router.put("/admin/coupons/{coupon_id}")
def update_coupon(coupon_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    c = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not c: raise HTTPException(404, "Not found")
    for k, v in data.items():
        if hasattr(c, k): setattr(c, k, v)
    db.commit()
    return {"message": "Updated"}

@router.delete("/admin/coupons/{coupon_id}")
def delete_coupon(coupon_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    c = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not c: raise HTTPException(404, "Not found")
    db.delete(c); db.commit()
    return {"message": "Deleted"}
