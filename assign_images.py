import sys, os
sys.path.insert(0, os.getcwd())

from backend.database.connection import SessionLocal
from backend.models import Food, FoodImage

db = SessionLocal()
try:
    foods = db.query(Food).all()
    
    # Image mapping per category name
    image_map = {
        "Shawarma": "/uploads/gallery/shawarma.png",
        "Steamed": "/uploads/gallery/steamed.png",
        "Main Course": "/uploads/gallery/butter_chicken.png",
        "Tawa Chatkhara": "/uploads/gallery/tawa_rice.png",
        "Sandwiches": "/uploads/gallery/hero.png",
        "Grilled": "/uploads/gallery/steamed.png",
        "Breads": "/uploads/gallery/hero.png",
        "Non Fried Chinese": "/uploads/gallery/tawa_rice.png",
        "Combos": "/uploads/gallery/biryani.png"
    }

    # Clear existing images if any
    db.query(FoodImage).delete()
    
    for food in foods:
        cat_name = food.category.name if food.category else "Main Course"
        img_url = image_map.get(cat_name, "/uploads/gallery/butter_chicken.png")
        
        fi = FoodImage(food_id=food.id, image_url=img_url, is_primary=True, display_order=1)
        db.add(fi)
        
    db.commit()
    print(f"Successfully assigned images to {len(foods)} dishes.")
except Exception as e:
    db.rollback()
    print("Error:", e)
finally:
    db.close()
