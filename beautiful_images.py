import sys, os
sys.path.insert(0, os.getcwd())

from backend.database.connection import SessionLocal
from backend.models import Food, FoodImage

# Handpicked, high-quality Unsplash image URLs for Indian/Asian food
shawarma_imgs = [
    "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1626200419189-32c0d8d46101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544025162-81111421d6e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1561651823-34feb02250e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "/uploads/gallery/shawarma.png"
]

curry_imgs = [
    "https://images.unsplash.com/photo-1626779816240-fc2b988f4b5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1626779816281-22904c602a63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "/uploads/gallery/butter_chicken.png"
]

rice_imgs = [
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "/uploads/gallery/tawa_rice.png",
    "/uploads/gallery/biryani.png"
]

steamed_imgs = [
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "/uploads/gallery/steamed.png"
]

sandwich_imgs = [
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1481070555726-e2fe83477d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "/uploads/gallery/sandwich.png"
]

bread_imgs = [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "/uploads/gallery/bread.png"
]

chinese_imgs = [
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1645696301019-35adcb18fc58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
]

db = SessionLocal()
try:
    foods = db.query(Food).all()
    
    # Clear existing images
    db.query(FoodImage).delete()
    
    # Track usage to loop through arrays
    counters = {
        "Shawarma": 0, "Main Course": 0, "Tawa Chatkhara": 0,
        "Steamed": 0, "Sandwiches": 0, "Breads": 0, "Non Fried Chinese": 0,
        "Combos": 0, "Grilled": 0
    }
    
    for food in foods:
        cat = food.category.name if food.category else "Main Course"
        
        if cat == "Shawarma":
            img = shawarma_imgs[counters[cat] % len(shawarma_imgs)]
        elif cat == "Main Course":
            img = curry_imgs[counters[cat] % len(curry_imgs)]
        elif cat in ["Tawa Chatkhara", "Combos"]:
            img = rice_imgs[counters[cat] % len(rice_imgs)]
        elif cat == "Steamed":
            img = steamed_imgs[counters[cat] % len(steamed_imgs)]
        elif cat == "Sandwiches":
            img = sandwich_imgs[counters[cat] % len(sandwich_imgs)]
        elif cat == "Breads":
            img = bread_imgs[counters[cat] % len(bread_imgs)]
        elif cat == "Non Fried Chinese":
            img = chinese_imgs[counters[cat] % len(chinese_imgs)]
        elif cat == "Grilled":
            img = curry_imgs[counters[cat] % len(curry_imgs)]
        else:
            img = curry_imgs[0]
            
        counters[cat] += 1
        
        fi = FoodImage(food_id=food.id, image_url=img, is_primary=True, display_order=1)
        db.add(fi)
        
    db.commit()
    print(f"Assigned beautiful unsplash images to {len(foods)} dishes.")
except Exception as e:
    db.rollback()
    print("Error:", e)
finally:
    db.close()
