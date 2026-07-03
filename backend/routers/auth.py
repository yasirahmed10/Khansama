from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from backend.database.connection import get_db
from backend.models import User, Admin
from backend.auth.jwt import hash_password, verify_password, create_access_token, create_refresh_token, get_current_user, get_current_admin, decode_token

router = APIRouter()

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class TokenRefresh(BaseModel):
    refresh_token: str

@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(name=data.name, email=data.email, phone=data.phone, hashed_password=hash_password(data.password))
    db.add(user); db.commit(); db.refresh(user)
    access = create_access_token({"sub": str(user.id), "role": "user"})
    refresh = create_refresh_token({"sub": str(user.id), "role": "user"})
    return {"access_token": access, "refresh_token": refresh, "user": {"id": user.id, "name": user.name, "email": user.email}}

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email, User.is_active == True).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    access = create_access_token({"sub": str(user.id), "role": "user"})
    refresh = create_refresh_token({"sub": str(user.id), "role": "user"})
    return {"access_token": access, "refresh_token": refresh, "user": {"id": user.id, "name": user.name, "email": user.email}}

@router.post("/admin/login")
def admin_login(data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == data.email, Admin.is_active == True).first()
    if not admin or not verify_password(data.password, admin.hashed_password):
        raise HTTPException(401, "Invalid admin credentials")
    access = create_access_token({"sub": str(admin.id), "role": "admin"})
    refresh = create_refresh_token({"sub": str(admin.id), "role": "admin"})
    return {"access_token": access, "refresh_token": refresh, "admin": {"id": admin.id, "name": admin.name, "email": admin.email}}

@router.post("/refresh")
def refresh(data: TokenRefresh):
    payload = decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(400, "Invalid refresh token")
    sub = payload.get("sub"); role = payload.get("role", "user")
    access = create_access_token({"sub": sub, "role": role})
    return {"access_token": access}

@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "name": user.name, "email": user.email, "phone": user.phone}

@router.put("/me")
def update_me(data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for k, v in data.items():
        if k in ("name", "phone") and v:
            setattr(user, k, v)
    if "password" in data and data["password"]:
        user.hashed_password = hash_password(data["password"])
    db.commit()
    return {"message": "Profile updated"}
