import sys, os
import urllib.parse
sys.path.insert(0, os.getcwd())

from backend.database.connection import SessionLocal
from backend.models import Food, FoodImage

db = SessionLocal()
try:
    foods = db.query(Food).all()
    
    # Clear existing images
    db.query(FoodImage).delete()
    
    for food in foods:
        # Create a search keyword based on the category
        cat_name = food.category.name if food.category else "food"
        # We use lock={food.id} to ensure it stays the same unique image per food
        cat_kw = urllib.parse.quote(cat_name.lower().replace(" ", ","))
        img_url = f"https://loremflickr.com/800/600/{cat_kw},food/all?lock={food.id}"
        
        fi = FoodImage(food_id=food.id, image_url=img_url, is_primary=True, display_order=1)
        db.add(fi)
        
    db.commit()
    print(f"Assigned unique loremflickr images to {len(foods)} dishes.")
except Exception as e:
    db.rollback()
    print("Error:", e)
finally:
    db.close()
