import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi, settingsApi } from '../services/api';
import { Clock, CheckCircle2, ShieldCheck, MapPin, Truck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderStatus = () => {
  const { number } = useParams();
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const { data } = await ordersApi.track(number);
      setOrder(data);
    } catch (err) {
      toast.error('Failed to update order tracking details');
    }
  };

  useEffect(() => {
    fetchStatus().then(() => setLoading(false));
    settingsApi.restaurant().then(({ data }) => setRestaurant(data)).catch(err => console.error(err));

    // Poll status updates every 15 seconds
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [number]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-dark flex items-center justify-center">
        <span className="text-gold font-display text-sm tracking-widest animate-pulse uppercase">Syncing Order Status...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-dark text-center flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-white">Order not found</h2>
        <p className="text-xs text-gray-400">Please double check the order number or check your email receipt.</p>
        <Link to="/menu" className="btn-outline text-xs">Back to Menu</Link>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Order Received', desc: 'Awaiting restaurant approval' },
    { key: 'accepted', label: 'Order Approved', desc: 'Approved by kitchen management' },
    { key: 'preparing', label: 'In the Kitchen', desc: 'Chef is preparing your Mughal delicacies' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Our rider is on the way' },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your royal meal!' }
  ];

  // Find active step index
  const activeIdx = steps.findIndex(s => s.key === order.order_status);

  return (
    <div className="pt-28 pb-20 bg-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Status Card */}
        <div className="bg-dark-card border border-gold/15 rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gold/10">
            <div>
              <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Active Order Tracking</span>
              <h1 className="font-display text-white text-xl sm:text-2xl font-bold uppercase mt-1">Order #{order.order_number}</h1>
            </div>
            
            <button 
              onClick={() => { setLoading(true); fetchStatus().then(() => setLoading(false)); }}
              className="flex items-center gap-1 text-xs text-gold border border-gold/30 hover:bg-gold/10 px-3 py-1.5 rounded-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
            </button>
          </div>

          {/* Stepper Progress bar */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative z-10 mb-10">
            {steps.map((step, idx) => {
              const completed = idx <= activeIdx;
              const current = idx === activeIdx;
              return (
                <div key={step.key} className="flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs transition ${completed ? 'bg-gold border-transparent text-dark shadow-[0_0_12px_rgba(201,168,76,0.4)]' : 'border-gold/20 text-gray-500 bg-dark'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${current ? 'text-gold' : completed ? 'text-white' : 'text-gray-500'}`}>{step.label}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gold/10 pt-8 text-xs text-gray-400">
            <div className="flex gap-2.5 items-start">
              <Clock className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-0.5">Est. Delivery Time</h4>
                <p>{restaurant?.estimated_delivery_mins || 45} Minutes</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-0.5">Payment Details</h4>
                <p className="uppercase">{order.payment_method} ({order.payment_status})</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-0.5">Delivery Address</h4>
                <p className="line-clamp-2">{order.delivery_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Summary Table */}
        <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl shadow-xl">
          <h3 className="font-display text-gold text-sm tracking-wider uppercase mb-6 pb-2 border-b border-gold/10">Order Summary</h3>
          <div className="space-y-3.5">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs text-gray-300">
                <span>{item.food_name} <strong>x {item.qty}</strong></span>
                <span>₹{item.subtotal}</span>
              </div>
            ))}
            
            <div className="border-t border-gold/10 pt-4 space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{order.delivery_charge > 0 ? `₹${order.delivery_charge}` : 'FREE'}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-red-400">
                  <span>Promo Discount:</span>
                  <span>- ₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white border-t border-gold/10 pt-2.5">
                <span>Total Amount paid:</span>
                <span className="text-gold">₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderStatus;
