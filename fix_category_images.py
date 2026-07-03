import sys, os
sys.path.insert(0, os.getcwd())

from backend.database.connection import SessionLocal
from backend.models import Food, FoodImage

db = SessionLocal()
try:
    foods = db.query(Food).all()
    db.query(FoodImage).delete()
    
    image_map = {
        "Shawarma": "/uploads/gallery/shawarma.png",
        "Steamed": "/uploads/gallery/steamed.png",
        "Main Course": "/uploads/gallery/butter_chicken.png",
        "Tawa Chatkhara": "/uploads/gallery/tawa_rice.png",
        "Sandwiches": "/uploads/gallery/sandwich.png",
        "Grilled": "/uploads/gallery/steamed.png",  # fallback
        "Breads": "/uploads/gallery/bread.png",
        "Non Fried Chinese": "/uploads/gallery/tawa_rice.png", # fallback
        "Combos": "/uploads/gallery/biryani.png"
    }
    
    for food in foods:
        cat = food.category.name if food.category else "Main Course"
        img_url = image_map.get(cat, "/uploads/gallery/butter_chicken.png")
        fi = FoodImage(food_id=food.id, image_url=img_url, is_primary=True, display_order=1)
        db.add(fi)
        
    db.commit()
    print("Fixed images to use the perfect local category assets.")
except Exception as e:
    db.rollback()
    print("Error:", e)
finally:
    db.close()
