import sys, os, re
sys.path.insert(0, os.getcwd())

from backend.database.connection import SessionLocal, Base, engine
from backend.models import Category, Food

def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")

Base.metadata.create_all(bind=engine)
print("Tables ensured")

db = SessionLocal()
try:
    cat_data = [
        ("Shawarma", 1), ("Steamed", 2), ("Main Course", 3),
        ("Tawa Chatkhara", 4), ("Sandwiches", 5), ("Grilled", 6),
        ("Breads", 7), ("Non Fried Chinese", 8), ("Combos", 9),
    ]
    cat_map = {}
    for name, order in cat_data:
        ex = db.query(Category).filter(Category.slug == slugify(name)).first()
        if ex:
            cat_map[name] = ex.id
            print(f"  Skip cat: {name} (ID {ex.id})")
        else:
            c = Category(name=name, slug=slugify(name), display_order=order)
            db.add(c); db.flush()
            cat_map[name] = c.id
            print(f"  + Cat: {name} (ID {c.id})")
    db.commit()

    foods = [
        ("Authentic Shawarma","Shawarma",90,True,False,False,1),
        ("Open Shawarma","Shawarma",100,False,False,False,2),
        ("Butter Chicken Shawarma","Shawarma",100,False,False,False,3),
        ("Tandoori Shawarma","Shawarma",120,False,False,False,4),
        ("Khansama Special Shawarma","Shawarma",120,False,True,False,5),
        ("Steam Chicken with Saute Veggies","Steamed",140,False,False,False,1),
        ("Steam Fish with Saute Veggies","Steamed",170,False,False,False,2),
        ("Khansama Special Butter Chicken","Main Course",160,True,True,False,1),
        ("Chicken Hydrabadi Green Korma","Main Course",170,False,False,False,2),
        ("Creamy Pepper Chicken","Main Course",180,False,False,False,3),
        ("Tawa Fish Fry Gravy","Main Course",180,False,False,False,4),
        ("Tawa Chicken Rice","Tawa Chatkhara",120,True,False,False,1),
        ("Tawa Chicken and Egg Rice","Tawa Chatkhara",180,False,False,False,2),
        ("Tawa Fish Rice","Tawa Chatkhara",180,False,False,False,3),
        ("Tawa Chicken and Fish Rice","Tawa Chatkhara",180,False,False,False,4),
        ("Butter Chicken Rice","Tawa Chatkhara",200,False,True,False,5),
        ("Plain Rice","Tawa Chatkhara",70,False,False,False,6),
        ("Chicken Kulcha Sandwich","Sandwiches",140,False,False,False,1),
        ("Stuffed Chicken Garlic Bread","Sandwiches",200,False,False,True,2),
        ("Grilled Chicken with Saute Veggies","Grilled",150,False,False,False,1),
        ("Grilled Fish with Saute Veggies","Grilled",180,False,False,False,2),
        ("Kulcha","Breads",15,False,False,False,1),
        ("Tawa Roti","Breads",10,False,False,False,2),
        ("Butter Roti","Breads",15,False,False,False,3),
        ("Pita Bread","Breads",15,False,False,False,4),
        ("Garlic Bread","Breads",50,False,False,False,5),
        ("Chilli Chicken","Non Fried Chinese",180,True,False,False,1),
        ("Dragon Chicken","Non Fried Chinese",180,False,False,True,2),
        ("Creamy Pepper Chicken with Garlic Bread","Combos",230,False,True,False,1),
        ("Butter Chicken with Zeera Rice","Combos",220,True,False,False,2),
        ("Butter Chicken with Kulcha","Combos",220,False,False,False,3),
        ("Grilled Chicken with Rice","Combos",220,False,False,False,4),
        ("Grilled Fish with Rice","Combos",250,False,False,False,5),
    ]
    added = 0
    for name,cat,price,best,feat,newarr,order in foods:
        slug = slugify(name)
        if db.query(Food).filter(Food.slug == slug).first():
            print(f"  Skip: {name}"); continue
        f = Food(name=name,slug=slug,category_id=cat_map[cat],price=float(price),
                 is_available=True,is_bestseller=best,is_featured=feat,
                 is_new_arrival=newarr,display_order=order)
        db.add(f); added += 1
        print(f"  + {name} - Rs.{price}")
    db.commit()
    print(f"\nDone! {added} dishes added.")
except Exception as e:
    db.rollback(); print(f"Error: {e}"); raise
finally:
    db.close()
