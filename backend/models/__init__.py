import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, Enum, JSON, ARRAY
from sqlalchemy.orm import relationship
from backend.database.connection import Base

# ─── Enums ──────────────────────────────────────────────────────────────────

class OrderStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    preparing = "preparing"
    out_for_delivery = "out_for_delivery"
    delivered = "delivered"
    cancelled = "cancelled"

class PaymentMethod(str, enum.Enum):
    cod = "cod"
    upi = "upi"
    card = "card"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"

class ReservationStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    cancelled = "cancelled"
    completed = "completed"

class SeatingType(str, enum.Enum):
    indoor = "indoor"
    outdoor = "outdoor"

class SpiceLevel(str, enum.Enum):
    mild = "mild"
    medium = "medium"
    hot = "hot"
    extra_hot = "extra_hot"

class GalleryType(str, enum.Enum):
    image = "image"
    video = "video"

class BannerType(str, enum.Enum):
    homepage = "homepage"
    offer = "offer"
    popup = "popup"
    seasonal = "seasonal"

# ─── Admin ───────────────────────────────────────────────────────────────────

class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ─── User ────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20))
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    orders = relationship("Order", back_populates="user")
    reservations = relationship("Reservation", back_populates="user")
    testimonials = relationship("Testimonial", back_populates="user")

# ─── Category ────────────────────────────────────────────────────────────────

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, index=True)
    description = Column(Text)
    image_url = Column(String(500))
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    foods = relationship("Food", back_populates="category")

# ─── Food ────────────────────────────────────────────────────────────────────

class Food(Base):
    __tablename__ = "foods"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(220), unique=True, index=True)
    description = Column(Text)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    price = Column(Float, nullable=False)
    discount_percent = Column(Float, default=0.0)
    is_veg = Column(Boolean, default=False)
    spice_level = Column(Enum(SpiceLevel), default=SpiceLevel.medium)
    ingredients = Column(Text)
    allergens = Column(Text)
    nutrition_info = Column(JSON)
    preparation_time_mins = Column(Integer, default=20)
    is_available = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)
    is_new_arrival = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    category = relationship("Category", back_populates="foods")
    images = relationship("FoodImage", back_populates="food", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="food")

class FoodImage(Base):
    __tablename__ = "food_images"
    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("foods.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    is_primary = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    food = relationship("Food", back_populates="images")

# ─── Order ───────────────────────────────────────────────────────────────────

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_email = Column(String(255))
    delivery_address = Column(Text, nullable=False)
    landmark = Column(String(200))
    city = Column(String(100))
    pincode = Column(String(10))
    delivery_notes = Column(Text)
    subtotal = Column(Float, nullable=False)
    delivery_charge = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    total = Column(Float, nullable=False)
    payment_method = Column(Enum(PaymentMethod), default=PaymentMethod.cod)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    order_status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    coupon_code = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    food_id = Column(Integer, ForeignKey("foods.id"), nullable=False)
    food_name = Column(String(200), nullable=False)
    food_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    subtotal = Column(Float, nullable=False)
    order = relationship("Order", back_populates="items")
    food = relationship("Food", back_populates="order_items")

# ─── Reservation ─────────────────────────────────────────────────────────────

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255))
    date = Column(String(20), nullable=False)
    time = Column(String(10), nullable=False)
    guests = Column(Integer, nullable=False)
    seating = Column(Enum(SeatingType), default=SeatingType.indoor)
    special_requests = Column(Text)
    table_number = Column(String(20))
    status = Column(Enum(ReservationStatus), default=ReservationStatus.pending)
    admin_note = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship("User", back_populates="reservations")

# ─── Offer / Coupon ──────────────────────────────────────────────────────────

class Offer(Base):
    __tablename__ = "offers"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    banner_url = Column(String(500))
    discount_percent = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    offer_type = Column(String(50), default="seasonal")  # seasonal, festival, today
    valid_from = Column(DateTime)
    valid_to = Column(DateTime)
    is_active = Column(Boolean, default=True)
    priority = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Coupon(Base):
    __tablename__ = "coupons"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(Text)
    discount_percent = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    min_order_amount = Column(Float, default=0.0)
    max_discount = Column(Float)
    usage_limit = Column(Integer)
    used_count = Column(Integer, default=0)
    valid_from = Column(DateTime)
    valid_to = Column(DateTime)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# ─── Testimonial ─────────────────────────────────────────────────────────────

class Testimonial(Base):
    __tablename__ = "testimonials"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255))
    review = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False)
    photo_url = Column(String(500))
    is_approved = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="testimonials")

# ─── Gallery ─────────────────────────────────────────────────────────────────

class GalleryItem(Base):
    __tablename__ = "gallery"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    file_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))
    media_type = Column(Enum(GalleryType), default=GalleryType.image)
    album = Column(String(100), default="General")
    is_featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

# ─── Homepage Sections ───────────────────────────────────────────────────────

class HomepageSection(Base):
    __tablename__ = "homepage_sections"
    id = Column(Integer, primary_key=True, index=True)
    section_key = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200))
    subtitle = Column(Text)
    content = Column(JSON)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class HeroSlide(Base):
    __tablename__ = "hero_slides"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    subtitle = Column(Text)
    image_url = Column(String(500), nullable=False)
    cta_text = Column(String(100))
    cta_url = Column(String(500))
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# ─── Banner ──────────────────────────────────────────────────────────────────

class Banner(Base):
    __tablename__ = "banners"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    image_url = Column(String(500), nullable=False)
    link_url = Column(String(500))
    banner_type = Column(Enum(BannerType), default=BannerType.homepage)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

# ─── Settings ────────────────────────────────────────────────────────────────

class RestaurantSettings(Base):
    __tablename__ = "restaurant_settings"
    id = Column(Integer, primary_key=True, default=1)
    name = Column(String(200), default="Khansama of Bhopal")
    tagline = Column(String(300))
    logo_url = Column(String(500))
    favicon_url = Column(String(500))
    address = Column(Text)
    phone = Column(String(20))
    phone2 = Column(String(20))
    email = Column(String(255))
    google_maps_url = Column(String(1000))
    google_maps_embed = Column(Text)
    opening_hours = Column(JSON)
    social_links = Column(JSON)
    upi_id = Column(String(100))
    upi_qr_url = Column(String(500))
    gst_number = Column(String(50))
    delivery_charge = Column(Float, default=30.0)
    min_order_amount = Column(Float, default=100.0)
    free_delivery_above = Column(Float, default=300.0)
    estimated_delivery_mins = Column(Integer, default=45)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class WebsiteSettings(Base):
    __tablename__ = "website_settings"
    id = Column(Integer, primary_key=True, default=1)
    meta_title = Column(String(300))
    meta_description = Column(Text)
    meta_keywords = Column(Text)
    primary_color = Column(String(20), default="#c9a84c")
    secondary_color = Column(String(20), default="#6b1a1a")
    google_analytics_id = Column(String(50))
    google_search_console = Column(String(200))
    whatsapp_number = Column(String(20))
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ─── Media ───────────────────────────────────────────────────────────────────

class MediaFile(Base):
    __tablename__ = "media_files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(300), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(50))
    file_size = Column(Integer)
    folder = Column(String(100), default="general")
    created_at = Column(DateTime, default=datetime.utcnow)

# ─── Newsletter ──────────────────────────────────────────────────────────────

class Newsletter(Base):
    __tablename__ = "newsletter"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    subscribed_at = Column(DateTime, default=datetime.utcnow)
