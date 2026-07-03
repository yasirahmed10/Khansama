from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from backend.database.connection import get_db
from backend.models import Order, Reservation, Food, User, Testimonial, GalleryItem
from backend.auth.jwt import get_current_admin

router = APIRouter()

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    today = datetime.utcnow().date()
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    today_orders = db.query(func.count(Order.id)).filter(func.date(Order.created_at) == today).scalar() or 0
    revenue = db.query(func.sum(Order.total)).filter(Order.payment_status == "paid").scalar() or 0
    pending_reservations = db.query(func.count(Reservation.id)).filter(Reservation.status == "pending").scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0
    pending_reviews = db.query(func.count(Testimonial.id)).filter(Testimonial.is_approved == False).scalar() or 0
    total_foods = db.query(func.count(Food.id)).scalar() or 0

    # Monthly revenue (last 6 months)
    monthly = []
    for i in range(5, -1, -1):
        d = datetime.utcnow().replace(day=1) - timedelta(days=i*30)
        m_start = d.replace(day=1, hour=0, minute=0, second=0)
        m_end = (m_start + timedelta(days=32)).replace(day=1)
        rev = db.query(func.sum(Order.total)).filter(
            Order.created_at >= m_start, Order.created_at < m_end,
            Order.payment_status == "paid").scalar() or 0
        monthly.append({"month": m_start.strftime("%b %Y"), "revenue": float(rev)})

    # Daily orders (last 7 days)
    daily = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        cnt = db.query(func.count(Order.id)).filter(func.date(Order.created_at) == d).scalar() or 0
        daily.append({"date": d.isoformat(), "orders": cnt})

    # Top foods
    from backend.models import OrderItem
    top_foods = db.query(
        OrderItem.food_name,
        func.sum(OrderItem.quantity).label("total_qty")
    ).group_by(OrderItem.food_name).order_by(func.sum(OrderItem.quantity).desc()).limit(5).all()

    return {
        "stats": {
            "total_orders": total_orders, "today_orders": today_orders,
            "revenue": float(revenue), "pending_reservations": pending_reservations,
            "total_users": total_users, "pending_reviews": pending_reviews, "total_foods": total_foods
        },
        "charts": {
            "monthly_revenue": monthly,
            "daily_orders": daily,
            "top_foods": [{"name": f.food_name, "qty": int(f.total_qty)} for f in top_foods]
        }
    }
