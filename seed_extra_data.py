import sys, os
sys.path.insert(0, os.getcwd())

from backend.database.connection import SessionLocal
from backend.models import Category, GalleryItem, Testimonial

db = SessionLocal()
try:
    # 1. Update Category Images
    category_image_map = {
        "Shawarma": "/uploads/gallery/shawarma.png",
        "Steamed": "/uploads/gallery/steamed.png",
        "Main Course": "/uploads/gallery/butter_chicken.png",
        "Tawa Chatkhara": "/uploads/gallery/tawa_rice.png",
        "Sandwiches": "/uploads/gallery/sandwich.png",
        "Grilled": "/uploads/gallery/steamed.png",
        "Breads": "/uploads/gallery/bread.png",
        "Non Fried Chinese": "/uploads/gallery/tawa_rice.png",
        "Combos": "/uploads/gallery/biryani.png"
    }

    categories = db.query(Category).all()
    for cat in categories:
        if cat.name in category_image_map:
            cat.image_url = category_image_map[cat.name]
            print(f"Updated category {cat.name} with image {cat.image_url}")

    # 2. Seed Gallery Data
    # Clear existing gallery first
    db.query(GalleryItem).delete()
    
    gallery_data = [
        {"title": "Signature Shawarma", "file_url": "/uploads/gallery/shawarma.png", "media_type": "image", "album": "Signature"},
        {"title": "Delicious Butter Chicken", "file_url": "/uploads/gallery/butter_chicken.png", "media_type": "image", "album": "Main Course"},
        {"title": "Spicy Biryani", "file_url": "/uploads/gallery/biryani.png", "media_type": "image", "album": "Main Course"},
        {"title": "Steamed Chicken Feast", "file_url": "/uploads/gallery/steamed.png", "media_type": "image", "album": "Healthy"},
        {"title": "Fresh Grilled Sandwich", "file_url": "/uploads/gallery/sandwich.png", "media_type": "image", "album": "Snacks"}
    ]
    
    for g in gallery_data:
        item = GalleryItem(**g)
        db.add(item)
    print(f"Seeded {len(gallery_data)} gallery items.")

    # 3. Seed Testimonials (Reviews)
    # Clear existing testimonials first
    db.query(Testimonial).delete()
    
    testimonials_data = [
        {
            "name": "Aarav Mehta",
            "email": "aarav@mehta.com",
            "review": "The Khansama Special Butter Chicken is absolutely heavenly! Best Indian food I've had in a long time.",
            "rating": 5,
            "is_approved": True,
            "is_featured": True
        },
        {
            "name": "Priya Sharma",
            "email": "priya@sharma.com",
            "review": "Amazing ambience and even better food. Their Shawarma wrap is incredibly juicy. Will definitely visit again!",
            "rating": 5,
            "is_approved": True,
            "is_featured": True
        },
        {
            "name": "Kabir Khan",
            "email": "kabir@khan.com",
            "review": "Very authentic flavors! The Tawa Chicken Rice was spicy and delicious. Highly recommended.",
            "rating": 4,
            "is_approved": True,
            "is_featured": True
        }
    ]
    
    for t in testimonials_data:
        item = Testimonial(**t)
        db.add(item)
    print(f"Seeded {len(testimonials_data)} reviews.")

    db.commit()
    print("Extra data seeded successfully!")
except Exception as e:
    db.rollback()
    print("Error:", e)
finally:
    db.close()
