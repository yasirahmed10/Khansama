import React, { useState, useEffect } from 'react';
import { contactApi, settingsApi } from '../services/api';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsApi.restaurant().then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await contactApi.send(form);
      toast.success(data.message);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error('Failed to submit message. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="pt-28 pb-20 bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <p className="section-eyebrow">Get in Touch</p>
          <h1 className="font-display text-gold text-3xl sm:text-5xl font-black uppercase mt-2 tracking-wider">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Info Panels */}
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-gold text-lg font-bold uppercase tracking-widest pb-2 border-b border-gold/10">Location Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl">
                <MapPin className="w-6 h-6 text-gold mb-3" />
                <h4 className="font-semibold text-sm text-white mb-1">Our Address</h4>
                <p className="text-xs text-gray-400 leading-relaxed">Ahmedabad Palace Rd, Kohefiza, Bhopal, MP 462001</p>
              </div>
              <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl">
                <Phone className="w-6 h-6 text-gold mb-3" />
                <h4 className="font-semibold text-sm text-white mb-1">Phone Number</h4>
                <p className="text-xs text-gray-400 leading-relaxed">078289 98497<br />(6 PM - 2 AM)</p>
              </div>
              <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl">
                <Mail className="w-6 h-6 text-gold mb-3" />
                <h4 className="font-semibold text-sm text-white mb-1">Email Address</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{settings?.email || 'orders@khansama.com'}</p>
              </div>
              <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl">
                <Clock className="w-6 h-6 text-gold mb-3" />
                <h4 className="font-semibold text-sm text-white mb-1">Working Hours</h4>
                <p className="text-xs text-gray-400 leading-relaxed">Monday - Sunday<br />6:00 PM - 2:00 AM</p>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="bg-dark-card border border-gold/15 p-8 rounded-2xl shadow-xl">
            <h2 className="font-display text-gold text-sm tracking-wider uppercase mb-6 pb-2 border-b border-gold/10">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Your Name *</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="Arjun Sharma" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Email Address *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="arjun@email.com" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="07828998497" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Your Message *</label>
                <textarea name="message" required rows={4} value={form.message} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition resize-none" placeholder="Write your comments or inquiries here..." />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gold hover:bg-gold-light disabled:opacity-50 text-dark font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5 uppercase text-xs tracking-wider"
              >
                <Send className="w-4 h-4" /> {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Embedded Map */}
        <div className="h-[400px] rounded-2xl overflow-hidden border border-gold/20 shadow-xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.8!2d77.3748362!3d23.262112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c425e72000001%3A0x1234!2sKhansama+of+Bhopal!5e0!3m2!1sen!2sin!4v1234567890" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(0.7) invert(0.9) hue-rotate(180deg)' }} 
            allowFullScreen="" 
            loading="lazy" 
            title="Khansama Map Location"
          />
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
