import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-dark-mid border-l border-gold/20 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gold/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="font-display text-gold text-lg font-bold uppercase tracking-wider">Your Order ({cartCount})</h2>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gold transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                <ShoppingBag className="w-16 h-16 text-gray-600 stroke-1" />
                <p className="text-gray-400 font-medium">Your cart is empty.</p>
                <button onClick={() => { onClose(); navigate('/menu'); }} className="text-sm text-gold hover:underline">Add some delicious dishes!</button>
              </div>
            ) : (
              cart.map((item) => {
                const isDiscount = item.discount_percent > 0;
                const price = isDiscount ? item.price * (1 - item.discount_percent / 100) : item.price;
                return (
                  <div key={item.id} className="flex gap-4 p-3 bg-dark-card border border-gold/10 rounded-xl relative group">
                    <img 
                      src={item.primary_image || '/uploads/gallery/butter_chicken.png'} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-lg object-cover" 
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-white group-hover:text-gold transition line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.category?.name}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Adjuster */}
                        <div className="flex items-center border border-gold/20 rounded-lg overflow-hidden bg-dark">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 px-2 text-gray-400 hover:text-gold"><Minus className="w-3 h-3" /></button>
                          <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 px-2 text-gray-400 hover:text-gold"><Plus className="w-3 h-3" /></button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {isDiscount && (
                            <span className="text-[10px] text-gray-500 line-through mr-1.5">₹{item.price}</span>
                          )}
                          <span className="font-display text-gold text-sm font-semibold">₹{price * item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {cart.length > 0 && (
            <div className="p-6 bg-dark border-t border-gold/15 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Subtotal:</span>
                <span className="font-display text-gold text-xl font-bold">₹{cartSubtotal}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-gold hover:bg-gold-light text-dark font-bold text-center py-3 rounded-full transition shadow-lg shadow-gold/10"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
