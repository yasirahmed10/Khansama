from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models import RestaurantSettings, WebsiteSettings
from backend.auth.jwt import get_current_admin

router = APIRouter()

@router.get("/restaurant")
def get_restaurant_settings(db: Session = Depends(get_db)):
    s = db.query(RestaurantSettings).first()
    if not s: return {}
    return {"name": s.name, "tagline": s.tagline, "logo_url": s.logo_url, "favicon_url": s.favicon_url,
            "address": s.address, "phone": s.phone, "phone2": s.phone2, "email": s.email,
            "google_maps_url": s.google_maps_url, "google_maps_embed": s.google_maps_embed,
            "opening_hours": s.opening_hours, "social_links": s.social_links,
            "upi_id": s.upi_id, "upi_qr_url": s.upi_qr_url, "gst_number": s.gst_number,
            "delivery_charge": s.delivery_charge, "min_order_amount": s.min_order_amount,
            "free_delivery_above": s.free_delivery_above, "estimated_delivery_mins": s.estimated_delivery_mins}

@router.put("/admin/restaurant")
def update_restaurant_settings(data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    s = db.query(RestaurantSettings).first()
    if not s:
        s = RestaurantSettings()
        db.add(s)
    for k, v in data.items():
        if hasattr(s, k): setattr(s, k, v)
    db.commit()
    return {"message": "Restaurant settings updated"}

@router.get("/website")
def get_website_settings(db: Session = Depends(get_db)):
    s = db.query(WebsiteSettings).first()
    if not s: return {}
    return {"meta_title": s.meta_title, "meta_description": s.meta_description,
            "meta_keywords": s.meta_keywords, "primary_color": s.primary_color,
            "secondary_color": s.secondary_color, "google_analytics_id": s.google_analytics_id,
            "whatsapp_number": s.whatsapp_number}

@router.put("/admin/website")
def update_website_settings(data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    s = db.query(WebsiteSettings).first()
    if not s:
        s = WebsiteSettings()
        db.add(s)
    for k, v in data.items():
        if hasattr(s, k): setattr(s, k, v)
    db.commit()
    return {"message": "Website settings updated"}
