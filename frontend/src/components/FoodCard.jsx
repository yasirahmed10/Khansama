import React from 'react';
import { ShoppingCart, Flame, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isDiscount = food.discount_percent > 0;
  const discountedPrice = isDiscount ? food.price * (1 - food.discount_percent / 100) : food.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(food);
    toast.success(`${food.name} added to cart!`);
  };

  const handleOrderNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(food);
    navigate('/cart');
  };

  return (
    <div className="card overflow-hidden group flex flex-col h-full bg-dark-card border border-gold/15 hover:border-gold/45 rounded-2xl transition duration-300">
      
      {/* Food Image Container */}
      <div className="relative h-48 overflow-hidden bg-dark flex items-center justify-center">
        <img 
          src={food.primary_image || '/uploads/gallery/butter_chicken.png'} 
          alt={food.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {food.is_veg ? (
            <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Veg</span>
          ) : (
            <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Non-Veg</span>
          )}
          {food.is_bestseller && (
            <span className="bg-gold text-dark text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Bestseller</span>
          )}
        </div>

        {/* Discount Tag */}
        {isDiscount && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {food.discount_percent}% OFF
          </div>
        )}

        {/* Spice Level Indicator */}
        <div className="absolute bottom-3 left-3 flex gap-0.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
          {Array.from({ length: food.spice_level === 'mild' ? 1 : food.spice_level === 'medium' ? 2 : 3 }).map((_, idx) => (
            <Flame key={idx} className="w-3.5 h-3.5 text-orange-500 fill-current" />
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">{food.category?.name}</span>
            {food.rating > 0 && (
              <span className="text-xs text-gold font-semibold">★ {food.rating.toFixed(1)}</span>
            )}
          </div>
          
          <Link to={`/food/${food.slug}`}>
            <h3 className="font-semibold text-base text-white group-hover:text-gold transition line-clamp-1 mb-1">{food.name}</h3>
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">{food.description}</p>
        </div>

        <div>
          {/* Price display */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display text-gold text-xl font-bold">₹{discountedPrice}</span>
            {isDiscount && (
              <span className="text-xs text-gray-500 line-through">₹{food.price}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 bg-dark border border-gold/45 hover:bg-gold/15 text-gold text-xs font-bold py-2 rounded-xl transition uppercase tracking-wider"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Add
            </button>
            <button 
              onClick={handleOrderNow}
              className="flex-1 bg-gold hover:bg-gold-light text-dark text-xs font-bold py-2 rounded-xl transition uppercase tracking-wider text-center"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
