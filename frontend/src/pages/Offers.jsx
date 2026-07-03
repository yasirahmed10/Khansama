import React, { useState, useEffect } from 'react';
import { offersApi } from '../services/api';
import { Sparkles, Calendar, Receipt, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data: oData } = await offersApi.list();
        setOffers(oData);
        
        // Load active coupons if admin list endpoint or similar exists publically (fallback to static coupons for customers)
        setCoupons([
          { code: "KHANSAMA50", description: "Get 10% OFF on orders above ₹200", discount: "10% OFF", minOrder: "₹200" },
          { code: "LATEBREAK", description: "Get ₹50 flat OFF on all orders above ₹400", discount: "₹50 OFF", minOrder: "₹400" },
          { code: "FREEFEAST", description: "Get free delivery on orders above ₹300", discount: "Free Delivery", minOrder: "₹300" }
        ]);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchOffers();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
  };

  return (
    <div className="pt-28 pb-20 bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <p className="section-eyebrow">Secret Deals</p>
          <h1 className="font-display text-gold text-3xl sm:text-5xl font-black uppercase mt-2 tracking-wider">Current Offers</h1>
          <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">Browse active promo codes and deals. Copy coupon codes at checkout to save.</p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {loading ? (
            <div className="col-span-2 text-center py-6">
              <span className="text-gold font-display text-xs tracking-widest animate-pulse uppercase">Loading offers...</span>
            </div>
          ) : offers.length === 0 ? (
            <div className="col-span-2 bg-dark-card border border-gold/15 p-8 rounded-2xl text-center text-gray-400 text-sm">
              No special banners or promotional deals posted at this time. Keep checking!
            </div>
          ) : (
            offers.map(off => (
              <div key={off.id} className="bg-dark-card border border-gold/15 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xl">
                <div className="h-44 md:h-auto md:w-2/5 relative">
                  <img src={off.banner_url || '/uploads/gallery/butter_chicken.png'} alt={off.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <span className="bg-gold/10 border border-gold/30 text-gold text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">{off.offer_type}</span>
                    <h3 className="font-display text-white text-lg font-bold uppercase mt-2 mb-2">{off.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{off.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4 border-t border-gold/10 pt-4 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold" /> Expires: {off.valid_to ? new Date(off.valid_to).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Coupons List */}
        <div>
          <h2 className="font-display text-gold text-lg font-bold uppercase tracking-widest mb-8 pb-3 border-b border-gold/10 flex items-center gap-2"><Sparkles className="w-5 h-5 text-gold" /> Active Coupon Codes</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {coupons.map((coupon, idx) => (
              <div key={idx} className="bg-dark-card border border-dashed border-gold/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-48 shadow-xl">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{coupon.discount}</span>
                    <Gift className="w-4 h-4 text-gold" />
                  </div>
                  <h4 className="font-bold text-white text-base leading-tight">{coupon.code}</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{coupon.description}</p>
                </div>
                
                <div className="flex justify-between items-center border-t border-gold/10 pt-4 mt-2">
                  <span className="text-[10px] text-gray-500">Min Order: {coupon.minOrder}</span>
                  <button 
                    onClick={() => handleCopyCode(coupon.code)}
                    className="text-xs text-gold font-bold hover:underline"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OffersPage;
