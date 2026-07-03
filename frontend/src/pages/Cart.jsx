import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal, cartCount } = useCart();
  const navigate = useNavigate();

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [validatedCoupon, setValidatedCoupon] = useState('');
  const [validating, setValidating] = useState(false);

  // Delivery Form
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    city: 'Bhopal',
    pincode: '462001',
    delivery_notes: '',
    payment_method: 'cod'
  });

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setValidating(true);
    try {
      const { data } = await ordersApi.validateCoupon({ code: couponCode, amount: cartSubtotal });
      setDiscount(data.discount);
      setValidatedCoupon(data.coupon.code);
      toast.success(`Coupon ${data.coupon.code} applied! Discount: ₹${data.discount}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid coupon code');
      setDiscount(0);
      setValidatedCoupon('');
    }
    setValidating(false);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    const payload = {
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email || null,
      delivery_address: form.address,
      landmark: form.landmark || null,
      city: form.city,
      pincode: form.pincode,
      delivery_notes: form.delivery_notes || null,
      payment_method: form.payment_method,
      coupon_code: validatedCoupon || null,
      items: cart.map(i => ({ food_id: i.id, quantity: i.quantity }))
    };

    try {
      const { data } = await ordersApi.create(payload);
      toast.success(data.message);
      clearCart();
      navigate(`/order-track/${data.order_number}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-dark flex flex-col items-center justify-center text-center gap-4">
        <ShoppingBag className="w-16 h-16 text-gray-600 stroke-1" />
        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
        <p className="text-sm text-gray-400">Add some delicious Mughal dishes before checking out.</p>
        <button onClick={() => navigate('/menu')} className="btn-primary mt-2">Explore Menu</button>
      </div>
    );
  }

  // Cost configs (static fallback matching server defaults)
  const deliveryCharge = cartSubtotal >= 300 ? 0 : 30;
  const total = Math.max(cartSubtotal + deliveryCharge - discount, 0);

  return (
    <div className="pt-28 pb-20 bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Side: Items list & Coupon */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl shadow-xl">
            <h2 className="font-display text-gold text-lg font-bold uppercase tracking-wider mb-6 pb-2 border-b border-gold/10">Order Items</h2>
            
            <div className="divide-y divide-gold/10 space-y-4">
              {cart.map((item) => {
                const isDiscount = item.discount_percent > 0;
                const price = isDiscount ? item.price * (1 - item.discount_percent / 100) : item.price;
                return (
                  <div key={item.id} className="flex gap-4 pt-4 first:pt-0 items-center justify-between">
                    <img src={item.primary_image || '/uploads/gallery/butter_chicken.png'} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{item.category?.name}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Quantity select */}
                      <div className="flex items-center border border-gold/20 rounded-lg bg-dark overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 px-2.5 text-gray-400 hover:text-gold"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 px-2.5 text-gray-400 hover:text-gold"><Plus className="w-3.5 h-3.5" /></button>
                      </div>

                      {/* Pricing */}
                      <div className="w-20 text-right">
                        <span className="font-display text-gold text-sm font-bold">₹{price * item.quantity}</span>
                      </div>

                      {/* Delete */}
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400 p-1.5 rounded-full hover:bg-red-500/10 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coupon Code Panel */}
          <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <h4 className="font-semibold text-sm text-white">Have a Coupon Code?</h4>
              <p className="text-xs text-gray-400 mt-0.5">Apply coupon to receive instant discount.</p>
            </div>
            <form onSubmit={handleApplyCoupon} className="flex gap-2 w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="PROMOCODE" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="bg-dark border border-gold/30 rounded-lg px-4 py-2 text-sm text-white uppercase placeholder-gray-500 focus:outline-none focus:border-gold w-full sm:w-36 transition"
              />
              <button 
                type="submit" 
                disabled={validating}
                className="bg-gold hover:bg-gold-light disabled:opacity-50 text-dark font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition"
              >
                Apply
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Shipping checkout form */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handlePlaceOrder} className="bg-dark-card border border-gold/15 p-6 rounded-2xl shadow-xl flex flex-col gap-4">
            <h2 className="font-display text-gold text-sm tracking-wider uppercase mb-2 pb-2 border-b border-gold/10">Checkout Details</h2>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Your Name *</label>
              <input type="text" name="name" required value={form.name} onChange={handleInputChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="Arjun Sharma" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Phone Number *</label>
              <input type="tel" name="phone" required value={form.phone} onChange={handleInputChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="07828998497" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Delivery Address *</label>
              <textarea name="address" required rows={2} value={form.address} onChange={handleInputChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition resize-none" placeholder="Flat No / House No, Street name, Area" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Landmark</label>
                <input type="text" name="landmark" value={form.landmark} onChange={handleInputChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="Near Temple" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Pincode</label>
                <input type="text" name="pincode" value={form.pincode} onChange={handleInputChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="462001" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Delivery Instructions</label>
              <input type="text" name="delivery_notes" value={form.delivery_notes} onChange={handleInputChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="Leave at gate, ring bell..." />
            </div>

            {/* Payment Method */}
            <div className="mt-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2 block">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`border rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer transition ${form.payment_method === 'cod' ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-gray-400 bg-dark'}`}>
                  <input type="radio" name="payment_method" value="cod" checked={form.payment_method === 'cod'} onChange={handleInputChange} className="sr-only" />
                  <span className="text-base">💵</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Cash on Delivery</span>
                </label>
                <label className={`border rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer transition ${form.payment_method === 'upi' ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-gray-400 bg-dark'}`}>
                  <input type="radio" name="payment_method" value="upi" checked={form.payment_method === 'upi'} onChange={handleInputChange} className="sr-only" />
                  <span className="text-base">📱</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">UPI / QR Scan</span>
                </label>
              </div>
            </div>

            {/* Summary details */}
            <div className="border-t border-gold/15 pt-4 space-y-2.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE'}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-400">
                  <span>Discount:</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white border-t border-gold/10 pt-2.5">
                <span>Total Amount:</span>
                <span className="font-display text-gold">₹{total}</span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gold hover:bg-gold-light text-dark font-bold py-3 rounded-xl transition mt-2 shadow-lg shadow-gold/5 flex items-center justify-center gap-1 uppercase text-xs tracking-wider"
            >
              Place Order <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
