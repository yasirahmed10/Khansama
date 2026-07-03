import sys, os
sys.path.insert(0, os.getcwd())

from backend.database.connection import SessionLocal
from backend.models import Food, FoodImage

db = SessionLocal()
try:
    # Update sandwiches
    sandwiches = db.query(Food).filter(Food.category.has(name="Sandwiches")).all()
    for s in sandwiches:
        for img in s.images:
            img.image_url = "/uploads/gallery/sandwich.png"
            
    # Update breads
    breads = db.query(Food).filter(Food.category.has(name="Breads")).all()
    for b in breads:
        for img in b.images:
            img.image_url = "/uploads/gallery/bread.png"
            
    db.commit()
    print("Fixed sandwich and bread images.")
except Exception as e:
    db.rollback()
    print("Error:", e)
finally:
    db.close()
