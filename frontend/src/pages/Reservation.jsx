import React, { useState } from 'react';
import { reservationsApi } from '../services/api';
import { Calendar, Clock, Users, Sofa, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const ReservationPage = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '18:00',
    guests: 2,
    seating: 'indoor',
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await reservationsApi.create(form);
      toast.success(data.message);
      setSuccessMsg(data.message);
      setForm({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '18:00',
        guests: 2,
        seating: 'indoor',
        special_requests: ''
      });
    } catch (err) {
      toast.error('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="pt-28 pb-20 bg-dark min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <p className="section-eyebrow">Dine In Style</p>
          <h1 className="font-display text-gold text-3xl sm:text-5xl font-black uppercase mt-2 tracking-wider">Table Reservation</h1>
          <p className="text-xs text-gray-400 max-w-md mx-auto mt-2">Book a spot at our night lounge in Kohefiza. Open nightly from 6 PM to 2 AM.</p>
        </div>

        <div className="bg-dark-card border border-gold/15 rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-5">
          {/* Side Info Panel */}
          <div className="md:col-span-2 bg-gradient-to-br from-maroon-dark to-dark p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gold/15">
            <div className="space-y-6">
              <h3 className="font-display text-gold text-base font-bold uppercase tracking-wider">Dining Policies</h3>
              <div className="space-y-4 text-xs text-gray-300">
                <p>• Reserved tables are held for a maximum of 20 minutes past the booking time.</p>
                <p>• For parties larger than 8 guests, please contact our restaurant management directly via phone.</p>
                <p>• Outdoor seating configurations are subject to weather conditions.</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gold/10 text-xs text-gray-400 space-y-2">
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold" /> 6:00 PM - 2:00 AM</p>
              <p className="flex items-center gap-2"><Info className="w-4 h-4 text-gold" /> Kohefiza, Bhopal</p>
            </div>
          </div>

          {/* Form Panel */}
          <div className="md:col-span-3 p-8">
            {successMsg ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl">✓</div>
                <h3 className="text-lg font-bold text-white">Booking Request Confirmed!</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs">{successMsg}</p>
                <button onClick={() => setSuccessMsg('')} className="btn-outline text-xs py-2 px-6 mt-2">Book Another Table</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Your Name *</label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="Arjun Sharma" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Phone *</label>
                    <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="07828998497" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="arjun@email.com" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold" /> Date *</label>
                    <input type="date" name="date" required value={form.date} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold transition" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold" /> Time *</label>
                    <input type="time" name="time" required value={form.time} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold transition" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gold" /> Guests *</label>
                    <input type="number" name="guests" min={1} max={8} required value={form.guests} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold transition" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1"><Sofa className="w-3.5 h-3.5 text-gold" /> Seating Preference</label>
                  <select name="seating" value={form.seating} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-gray-300 focus:outline-none focus:border-gold transition">
                    <option value="indoor">Indoor Lounge</option>
                    <option value="outdoor">Outdoor Street Side</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Special Requests</label>
                  <textarea name="special_requests" rows={2} value={form.special_requests} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition resize-none" placeholder="Allergies, birthday celebrations, preferred tables..." />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-light disabled:opacity-50 text-dark font-bold py-3 rounded-xl transition mt-2 uppercase text-xs tracking-wider"
                >
                  {loading ? 'Submitting Request...' : 'Submit Reservation Request'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReservationPage;
