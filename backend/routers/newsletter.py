from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import EmailStr
from backend.database.connection import get_db
from backend.models import Newsletter

router = APIRouter()

@router.post("")
def subscribe(data: dict, db: Session = Depends(get_db)):
    email = data.get("email", "").strip().lower()
    if not email: raise HTTPException(400, "Email required")
    if db.query(Newsletter).filter(Newsletter.email == email).first():
        return {"message": "Already subscribed!"}
    sub = Newsletter(email=email)
    db.add(sub); db.commit()
    return {"message": "Subscribed successfully!"}

@router.delete("")
def unsubscribe(data: dict, db: Session = Depends(get_db)):
    email = data.get("email", "").strip().lower()
    sub = db.query(Newsletter).filter(Newsletter.email == email).first()
    if sub: db.delete(sub); db.commit()
    return {"message": "Unsubscribed"}
