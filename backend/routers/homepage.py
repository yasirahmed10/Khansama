from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models import HomepageSection, HeroSlide
from backend.auth.jwt import get_current_admin

router = APIRouter()

@router.get("/sections")
def get_sections(db: Session = Depends(get_db)):
    sections = db.query(HomepageSection).filter(HomepageSection.is_active == True).order_by(HomepageSection.display_order).all()
    result = {}
    for s in sections:
        result[s.section_key] = {"title": s.title, "subtitle": s.subtitle, "content": s.content}
    return result

@router.get("/hero-slides")
def get_slides(db: Session = Depends(get_db)):
    slides = db.query(HeroSlide).filter(HeroSlide.is_active == True).order_by(HeroSlide.display_order).all()
    return [{"id": s.id, "title": s.title, "subtitle": s.subtitle, "image_url": s.image_url,
             "cta_text": s.cta_text, "cta_url": s.cta_url} for s in slides]

@router.get("/admin/slides")
def admin_slides(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    slides = db.query(HeroSlide).order_by(HeroSlide.display_order).all()
    return [{"id": s.id, "title": s.title, "image_url": s.image_url, "is_active": s.is_active,
             "display_order": s.display_order} for s in slides]

@router.post("/admin/slides")
def create_slide(data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    slide = HeroSlide(title=data.get("title"), subtitle=data.get("subtitle"),
                      image_url=data["image_url"], cta_text=data.get("cta_text"),
                      cta_url=data.get("cta_url"), display_order=data.get("display_order", 0))
    db.add(slide); db.commit()
    return {"message": "Slide created", "id": slide.id}

@router.put("/admin/slides/{slide_id}")
def update_slide(slide_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide: raise HTTPException(404, "Not found")
    for k, v in data.items():
        if hasattr(slide, k): setattr(slide, k, v)
    db.commit()
    return {"message": "Updated"}

@router.delete("/admin/slides/{slide_id}")
def delete_slide(slide_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide: raise HTTPException(404, "Not found")
    db.delete(slide); db.commit()
    return {"message": "Deleted"}

@router.put("/admin/sections/{section_key}")
def update_section(section_key: str, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    section = db.query(HomepageSection).filter(HomepageSection.section_key == section_key).first()
    if not section:
        section = HomepageSection(section_key=section_key)
        db.add(section)
    for k, v in data.items():
        if hasattr(section, k): setattr(section, k, v)
    db.commit()
    return {"message": "Section updated"}
