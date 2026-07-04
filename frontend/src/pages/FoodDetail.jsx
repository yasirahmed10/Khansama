import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { foodsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Flame, ArrowLeft, Clock, ShieldCheck, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const FoodDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setLoading(true);
    foodsApi.get(slug).then(({ data }) => {
      setFood(data);
      // Fetch related foods in category
      if (data.category?.id) {
        foodsApi.list({ category_id: data.category.id, per_page: 4 }).then(({ data: rData }) => {
          setRelated(rData.items.filter(item => item.id !== data.id));
        }).catch(err => console.error(err));
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-dark flex items-center justify-center">
        <span className="text-gold font-display text-sm tracking-widest animate-pulse uppercase">Loading Dish Details...</span>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-dark text-center flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-white">Dish not found</h2>
        <Link to="/menu" className="text-gold underline text-sm">Back to Menu</Link>
      </div>
    );
  }

  const isDiscount = food.discount_percent > 0;
  const discountedPrice = isDiscount ? food.price * (1 - food.discount_percent / 100) : food.price;

  const handleAddToCart = () => {
    addToCart(food, quantity);
    toast.success(`${quantity} x ${food.name} added to cart!`);
  };

  return (
    <div className="pt-28 pb-20 bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/menu" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Menu
        </Link>

        {/* Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          {/* Images */}
          <div className="bg-dark-card border border-gold/15 rounded-2xl overflow-hidden shadow-xl">
            <div className="h-[400px] w-full relative">
              <img 
                src={food.primary_image || '/assets/gallery/butter_chicken.png'} 
                alt={food.name} 
                className="w-full h-full object-cover" 
              />
              {isDiscount && (
                <div className="absolute top-4 right-4 bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg">
                  {food.discount_percent}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-gold/10 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">{food.category?.name}</span>
                {food.is_veg ? (
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Veg</span>
                ) : (
                  <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Non-Veg</span>
                )}
              </div>
              <h1 className="font-display text-white text-3xl sm:text-4xl font-extrabold uppercase tracking-wide mt-2">{food.name}</h1>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-gold text-3xl font-bold">₹{discountedPrice}</span>
              {isDiscount && (
                <span className="text-gray-500 line-through text-lg">₹{food.price}</span>
              )}
            </div>

            {/* Basic specs */}
            <div className="grid grid-cols-2 gap-4 border-y border-gold/10 py-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-gold" />
                <span>Prep: <strong>{food.preparation_time_mins} mins</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4.5 h-4.5 text-orange-500" />
                <span>Spice: <strong className="capitalize">{food.spice_level}</strong></span>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">{food.description}</p>

            {food.ingredients && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-2">Ingredients</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{food.ingredients}</p>
              </div>
            )}

            {food.allergens && (
              <div className="bg-amber-950/15 border border-amber-900/35 p-4 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">⚠️ Allergen Info</h4>
                <p className="text-xs text-amber-300/80 leading-relaxed">{food.allergens}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              {/* Quantity Select */}
              <div className="flex items-center border border-gold/30 rounded-xl bg-dark overflow-hidden w-full sm:w-auto">
                <button onClick={() => setQuantity(prev => Math.max(prev - 1, 1))} className="p-3 px-5 text-gray-400 hover:text-gold text-lg">-</button>
                <span className="px-5 text-sm font-bold text-white w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(prev => prev + 1)} className="p-3 px-5 text-gray-400 hover:text-gold text-lg">+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="btn-primary w-full sm:w-auto py-3.5 px-8 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Order
              </button>
            </div>
          </div>
        </div>

        {/* Related Section */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-gold text-lg font-bold uppercase tracking-widest mb-8 pb-3 border-b border-gold/10">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map(item => (
                <div key={item.id} className="bg-dark-card border border-gold/10 rounded-xl overflow-hidden group">
                  <div className="h-40 overflow-hidden relative">
                    <img src={item.primary_image || '/assets/gallery/butter_chicken.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="p-4 flex flex-col justify-between h-32">
                    <h4 className="font-semibold text-sm text-white group-hover:text-gold transition line-clamp-1">{item.name}</h4>
                    <div className="flex justify-between items-baseline mt-2">
                      <span className="font-display text-gold text-sm font-bold">₹{item.price}</span>
                      <Link to={`/food/${item.slug}`} className="text-xs text-gray-500 hover:underline">View details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FoodDetail;
