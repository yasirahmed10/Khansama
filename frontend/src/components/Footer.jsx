import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { settingsApi, newsletterApi } from '../services/api';
import toast from 'react-hot-toast';

const Footer = () => {
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    settingsApi.restaurant().then(({ data }) => setSettings(data)).catch(err => console.error(err));
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const { data } = await newsletterApi.subscribe(email);
      toast.success(data.message);
      setEmail('');
    } catch (err) {
      toast.error('Subscription failed');
    }
  };

  return (
    <footer className="bg-dark border-t border-gold/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold/40 overflow-hidden flex items-center justify-center bg-dark-card">
              <img src="/uploads/gallery/logo.png" alt="Khansama Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="font-display text-gold tracking-widest text-lg font-bold uppercase">Khansama</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {settings?.tagline || "Where Royal Mughal Flavours Meet Modern Cravings"}
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="p-2 bg-dark-card border border-gold/20 hover:border-gold text-gray-400 hover:text-gold rounded-full transition"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-dark-card border border-gold/20 hover:border-gold text-gray-400 hover:text-gold rounded-full transition"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-dark-card border border-gold/20 hover:border-gold text-gray-400 hover:text-gold rounded-full transition"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-gold text-sm tracking-wider uppercase mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/menu" className="hover:text-gold transition">Explore Our Menu</Link></li>
            <li><Link to="/offers" className="hover:text-gold transition">Current Deals & Coupons</Link></li>
            <li><Link to="/reservation" className="hover:text-gold transition">Table Reservations</Link></li>
            <li><Link to="/gallery" className="hover:text-gold transition">Restaurant Gallery</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-display text-gold text-sm tracking-wider uppercase mb-6">Visit Us</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex gap-2 items-start">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-1" />
              <span>{settings?.address || "Ahmedabad Palace Rd, Kohefiza, Bhopal, MP 462001"}</span>
            </li>
            <li className="flex gap-2 items-center">
              <Phone className="w-4 h-4 text-gold" />
              <span>{settings?.phone || "078289 98497"}</span>
            </li>
            <li className="flex gap-2 items-center">
              <Mail className="w-4 h-4 text-gold" />
              <span>{settings?.email || "info@khansama.com"}</span>
            </li>
            <li className="flex gap-2 items-center">
              <Clock className="w-4 h-4 text-gold" />
              <span>Open everyday: 6 PM - 2 AM</span>
            </li>
          </ul>
        </div>

        {/* Newsletter subscription */}
        <div>
          <h4 className="font-display text-gold text-sm tracking-wider uppercase mb-6">Newsletter</h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Subscribe to our newsletter to receive the latest updates, secret coupon codes, and promotional offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-dark-card border border-gold/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold transition"
              required 
            />
            <button type="submit" className="bg-gold hover:bg-gold-light text-dark font-semibold text-xs tracking-wider uppercase py-2.5 rounded-lg transition">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gold/10 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>© {new Date().getFullYear()} Khansama of Bhopal. All Rights Reserved.</span>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-gold transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gold transition">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
