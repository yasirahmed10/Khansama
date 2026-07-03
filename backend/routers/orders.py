import uuid, random, string
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel, EmailStr
from typing import Optional
from backend.database.connection import get_db
from backend.models import Order, OrderItem, Food, Coupon, RestaurantSettings
from backend.auth.jwt import get_current_user, get_current_admin

router = APIRouter()

def gen_order_number():
    return "KHN-" + "".join(random.choices(string.digits, k=6))

class OrderItemIn(BaseModel):
    food_id: int; quantity: int

class CheckoutData(BaseModel):
    customer_name: str; customer_phone: str; customer_email: Optional[str] = None
    delivery_address: str; landmark: Optional[str] = None
    city: Optional[str] = None; pincode: Optional[str] = None
    delivery_notes: Optional[str] = None
    payment_method: str = "cod"
    coupon_code: Optional[str] = None
    items: list[OrderItemIn]

def order_to_dict(o: Order):
    return {
        "id": o.id, "order_number": o.order_number,
        "customer_name": o.customer_name, "customer_phone": o.customer_phone,
        "customer_email": o.customer_email,
        "delivery_address": o.delivery_address, "landmark": o.landmark,
        "city": o.city, "pincode": o.pincode, "delivery_notes": o.delivery_notes,
        "subtotal": o.subtotal, "delivery_charge": o.delivery_charge,
        "discount": o.discount, "total": o.total,
        "payment_method": o.payment_method, "payment_status": o.payment_status,
        "order_status": o.order_status, "coupon_code": o.coupon_code,
        "items": [{"food_name": i.food_name, "price": i.food_price, "qty": i.quantity, "subtotal": i.subtotal} for i in o.items],
        "created_at": o.created_at.isoformat() if o.created_at else None,
    }

@router.post("")
def create_order(data: CheckoutData, db: Session = Depends(get_db), user=Depends(lambda: None)):
    settings = db.query(RestaurantSettings).first()
    delivery_charge = settings.delivery_charge if settings else 30.0
    min_order = settings.min_order_amount if settings else 100.0
    free_above = settings.free_delivery_above if settings else 300.0

    items_out = []
    subtotal = 0.0
    for item in data.items:
        food = db.query(Food).filter(Food.id == item.food_id, Food.is_available == True).first()
        if not food: raise HTTPException(400, f"Food {item.food_id} not available")
        price = round(food.price * (1 - food.discount_percent / 100), 2) if food.discount_percent else food.price
        line_total = price * item.quantity
        subtotal += line_total
        items_out.append({"food": food, "qty": item.quantity, "price": price, "subtotal": line_total})

    if subtotal < min_order:
        raise HTTPException(400, f"Minimum order amount is ₹{min_order}")

    dc = 0.0 if subtotal >= free_above else delivery_charge
    discount = 0.0
    coupon = None
    if data.coupon_code:
        coupon = db.query(Coupon).filter(Coupon.code == data.coupon_code.upper(), Coupon.is_active == True).first()
        if coupon:
            now = datetime.utcnow()
            if coupon.valid_to and coupon.valid_to < now:
                raise HTTPException(400, "Coupon expired")
            if coupon.min_order_amount and subtotal < coupon.min_order_amount:
                raise HTTPException(400, f"Min order ₹{coupon.min_order_amount} required for this coupon")
            if coupon.discount_percent:
                discount = subtotal * coupon.discount_percent / 100
                if coupon.max_discount:
                    discount = min(discount, coupon.max_discount)
            elif coupon.discount_amount:
                discount = coupon.discount_amount
            coupon.used_count = (coupon.used_count or 0) + 1

    total = round(subtotal + dc - discount, 2)
    order = Order(
        order_number=gen_order_number(),
        customer_name=data.customer_name, customer_phone=data.customer_phone,
        customer_email=data.customer_email, delivery_address=data.delivery_address,
        landmark=data.landmark, city=data.city, pincode=data.pincode,
        delivery_notes=data.delivery_notes, subtotal=round(subtotal, 2),
        delivery_charge=dc, discount=discount, total=total,
        payment_method=data.payment_method, coupon_code=data.coupon_code,
    )
    db.add(order); db.flush()
    for i in items_out:
        db.add(OrderItem(order_id=order.id, food_id=i["food"].id, food_name=i["food"].name, food_price=i["price"], quantity=i["qty"], subtotal=i["subtotal"]))
    db.commit(); db.refresh(order)
    return {"message": "Order placed", "order_number": order.order_number, "total": order.total, "id": order.id}

@router.get("/track/{order_number}")
def track_order(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).options(joinedload(Order.items)).filter(Order.order_number == order_number).first()
    if not order: raise HTTPException(404, "Order not found")
    return order_to_dict(order)

@router.post("/validate-coupon")
def validate_coupon(data: dict, db: Session = Depends(get_db)):
    code = data.get("code", "").upper()
    amount = data.get("amount", 0)
    coupon = db.query(Coupon).filter(Coupon.code == code, Coupon.is_active == True).first()
    if not coupon: raise HTTPException(404, "Invalid coupon")
    now = datetime.utcnow()
    if coupon.valid_to and coupon.valid_to < now: raise HTTPException(400, "Coupon expired")
    if coupon.min_order_amount and amount < coupon.min_order_amount:
        raise HTTPException(400, f"Min order ₹{coupon.min_order_amount} required")
    disc = 0.0
    if coupon.discount_percent:
        disc = amount * coupon.discount_percent / 100
        if coupon.max_discount: disc = min(disc, coupon.max_discount)
    elif coupon.discount_amount:
        disc = coupon.discount_amount
    return {"valid": True, "discount": round(disc, 2), "coupon": {"code": coupon.code, "description": coupon.description}}

# ── Admin ─────────────────────────────────────────────────────────────────────

@router.get("/admin/all")
def admin_orders(page: int = 1, per_page: int = 20, status: Optional[str] = None, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    q = db.query(Order).options(joinedload(Order.items))
    if status: q = q.filter(Order.order_status == status)
    q = q.order_by(Order.created_at.desc())
    total = q.count()
    orders = q.offset((page - 1) * per_page).limit(per_page).all()
    return {"total": total, "items": [order_to_dict(o) for o in orders]}

@router.put("/admin/{order_id}/status")
def update_order_status(order_id: int, data: dict, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order: raise HTTPException(404, "Order not found")
    if "order_status" in data: order.order_status = data["order_status"]
    if "payment_status" in data: order.payment_status = data["payment_status"]
    db.commit()
    return {"message": "Status updated"}

@router.get("/admin/stats")
def order_stats(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    from sqlalchemy import func
    total = db.query(func.count(Order.id)).scalar()
    today = db.query(func.count(Order.id)).filter(func.date(Order.created_at) == datetime.utcnow().date()).scalar()
    revenue = db.query(func.sum(Order.total)).filter(Order.payment_status == "paid").scalar() or 0
    return {"total_orders": total, "today_orders": today, "revenue": revenue}
