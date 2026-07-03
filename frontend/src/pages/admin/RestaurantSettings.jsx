import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';

const RestaurantSettings = () => {
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    address: '',
    phone: '',
    email: '',
    delivery_charge: 30,
    min_order_amount: 100,
    free_delivery_above: 300,
    estimated_delivery_mins: 45
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi.restaurant().then(({ data }) => {
      setForm(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingsApi.updateRestaurant(form);
      toast.success('Restaurant settings saved!');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-dark flex items-center justify-center">
        <span className="text-gold font-display text-sm tracking-widest animate-pulse uppercase">Syncing settings database...</span>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 pl-68 pr-8 pt-28 pb-20">
        
        <div className="mb-8">
          <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Storefront Properties</span>
          <h1 className="font-display text-white text-2xl sm:text-3xl font-black uppercase mt-1">Restaurant Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card border border-gold/15 p-8 rounded-2xl max-w-2xl shadow-xl space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase font-semibold">Restaurant Name</label>
            <input type="text" name="name" required value={form.name} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase font-semibold">Tagline / Slogan</label>
            <input type="text" name="tagline" value={form.tagline} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase font-semibold">Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase font-semibold">Support Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase font-semibold">Street Address</label>
            <textarea name="address" rows={2} value={form.address} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition resize-none" />
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-gold/10 pt-5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase font-semibold">Delivery Charge (₹)</label>
              <input type="number" name="delivery_charge" value={form.delivery_charge} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase font-semibold">Min Order Limit (₹)</label>
              <input type="number" name="min_order_amount" value={form.min_order_amount} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase font-semibold">Est Delivery Time (mins)</label>
              <input type="number" name="estimated_delivery_mins" value={form.estimated_delivery_mins} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-gold hover:bg-gold-light text-dark font-bold py-3.5 rounded-xl transition mt-4 uppercase text-xs tracking-wider">
            Save Storefront Settings
          </button>
        </form>

      </div>
    </div>
  );
};

export default RestaurantSettings;
