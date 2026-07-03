import os, uuid, shutil
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from backend.config.settings import settings
from backend.database.connection import Base, engine
from backend.models import *  # noqa - import all models so Base knows them

# ── Rate Limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static Files (uploads) ────────────────────────────────────────────────────
upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")

# ── Routers ───────────────────────────────────────────────────────────────────
from backend.routers import (
    auth, foods, categories, orders, reservations,
    offers, gallery, testimonials, homepage, banners,
    settings as settings_router, media, analytics,
    users, contact, newsletter
)

app.include_router(auth.router,          prefix="/api/auth",         tags=["Auth"])
app.include_router(foods.router,         prefix="/api/foods",        tags=["Foods"])
app.include_router(categories.router,    prefix="/api/categories",   tags=["Categories"])
app.include_router(orders.router,        prefix="/api/orders",       tags=["Orders"])
app.include_router(reservations.router,  prefix="/api/reservations", tags=["Reservations"])
app.include_router(offers.router,        prefix="/api/offers",       tags=["Offers"])
app.include_router(gallery.router,       prefix="/api/gallery",      tags=["Gallery"])
app.include_router(testimonials.router,  prefix="/api/testimonials", tags=["Testimonials"])
app.include_router(homepage.router,      prefix="/api/homepage",     tags=["Homepage"])
app.include_router(banners.router,       prefix="/api/banners",      tags=["Banners"])
app.include_router(settings_router.router, prefix="/api/settings",  tags=["Settings"])
app.include_router(media.router,         prefix="/api/media",        tags=["Media"])
app.include_router(analytics.router,     prefix="/api/analytics",    tags=["Analytics"])
app.include_router(users.router,         prefix="/api/users",        tags=["Users"])
app.include_router(contact.router,       prefix="/api/contact",      tags=["Contact"])
app.include_router(newsletter.router,    prefix="/api/newsletter",   tags=["Newsletter"])

# ── DB Init ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    await seed_defaults()

async def seed_defaults():
    from backend.database.connection import SessionLocal
    from backend.auth.jwt import hash_password
    db = SessionLocal()
    try:
        # Seed admin
        if not db.query(Admin).first():
            db.add(Admin(
                name="Khansama Admin",
                email=settings.ADMIN_EMAIL,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
            ))

        # Seed restaurant settings
        if not db.query(RestaurantSettings).first():
            db.add(RestaurantSettings(
                name="Khansama of Bhopal",
                tagline="Where Royal Mughal Flavours Meet Modern Cravings",
                address="Ahmedabad Palace Rd, Kohefiza, Bhopal, MP 462001",
                phone="078289 98497",
                email="khansama@bhopal.com",
                opening_hours={"everyday": "6:00 PM - 2:00 AM"},
                social_links={},
                delivery_charge=30.0,
                min_order_amount=100.0,
                free_delivery_above=300.0,
                estimated_delivery_mins=45,
            ))

        # Seed website settings
        if not db.query(WebsiteSettings).first():
            db.add(WebsiteSettings(
                meta_title="Khansama of Bhopal | Authentic Mughal Fast Food",
                meta_description="Khansama of Bhopal — Authentic Mughal-inspired fast food in Kohefiza, Bhopal. Open 6 PM – 2 AM.",
                primary_color="#c9a84c",
                secondary_color="#6b1a1a",
                whatsapp_number="917828998497",
            ))

        db.commit()
    finally:
        db.close()

@app.get("/api/health")
def health():
    return {"status": "ok", "app": settings.APP_NAME}
