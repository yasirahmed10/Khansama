from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models import Reservation
from backend.auth.jwt import get_current_admin
from typing import Optional

router = APIRouter()

def res_dict(r):
    return {"id": r.id, "name": r.name, "phone": r.phone, "email": r.email,
            "date": r.date, "time": r.time, "guests": r.guests, "seating": r.seating,
            "special_requests": r.special_requests, "table_number": r.table_number,
            "status": r.status, "admin_note": r.admin_note,
            "created_at": r.created_at.isoformat() if r.created_at else None}

@router.post("")
def create_reservation(data: dict, db: Session = Depends(get_db)):
    res = Reservation(name=data["name"], phone=data["phone"], email=data.get("email"),
                      date=data["date"], time=data["time"], guests=data["guests"],
                      seating=data.get("seating", "indoor"), special_requests=data.get("special_requests"))
    db.add(res); db.commit(); db.refresh(res)
    return {"message": "Reservation request submitted! We'll confirm soon.", "id": res.id}

@router.get("/admin/all")
def admin_reservations(page: int = 1, per_page: int = 20, status: Optional[str] = None,
                       date: Optional[str] = None, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    q = db.query(Reservation)
    if status: q = q.filter(Reservation.status == status)
    if date: q = q.filter(Reservation.date == date)
    q = q.order_by(Reservation.created_at.desc())
    total = q.count()
    items = q.offset((page-1)*per_page).limit(per_page).all()
    return {"total": total, "items": [res_dict(r) for r in items]}

@router.put("/admin/{res_id}")
def update_reservation(res_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    res = db.query(Reservation).filter(Reservation.id == res_id).first()
    if not res: raise HTTPException(404, "Reservation not found")
    for k, v in data.items():
        if hasattr(res, k): setattr(res, k, v)
    db.commit()
    return {"message": "Updated", "reservation": res_dict(res)}

@router.delete("/admin/{res_id}")
def delete_reservation(res_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    res = db.query(Reservation).filter(Reservation.id == res_id).first()
    if not res: raise HTTPException(404, "Not found")
    db.delete(res); db.commit()
    return {"message": "Deleted"}
