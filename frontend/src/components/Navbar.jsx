import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User as UserIcon, Phone, MapPin, Calendar, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { settingsApi } from '../services/api';

const Navbar = ({ onCartClick }) => {
  const { user, admin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [restaurantSettings, setRestaurantSettings] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    settingsApi.restaurant().then(({ data }) => {
      setRestaurantSettings(data);
    }).catch(err => console.error(err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoUrl = restaurantSettings?.logo_url || '/uploads/gallery/logo.png'; // Fallback if logo upload exists later

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${scrolled ? 'bg-dark/95 backdrop-blur-md border-b border-gold/20 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-gold/40 shadow-[0_0_12px_rgba(201,168,76,0.3)] overflow-hidden bg-dark-card flex items-center justify-center">
              <img src="/uploads/gallery/logo.png" alt="Khansama Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-gold tracking-widest text-sm font-bold uppercase">Khansama</span>
              <span className="text-[10px] text-gray-400 tracking-wider">OF BHOPAL</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-gold transition">Home</Link>
            <Link to="/menu" className="text-sm font-medium text-gray-300 hover:text-gold transition">Menu</Link>
            <Link to="/offers" className="text-sm font-medium text-gray-300 hover:text-gold transition">Offers</Link>
            <Link to="/gallery" className="text-sm font-medium text-gray-300 hover:text-gold transition">Gallery</Link>
            <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-gold transition">About</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-300 hover:text-gold transition">Contact</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/reservation" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold border border-gold/40 hover:bg-gold/10 px-4 py-2 rounded-full transition">
              <Calendar className="w-3.5 h-3.5" /> Book Table
            </Link>
            
            {/* Cart Icon */}
            <button onClick={onCartClick} className="relative p-2 text-gray-300 hover:text-gold transition">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-gold text-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Actions */}
            {admin ? (
              <div className="flex items-center gap-3">
                <Link to="/admin" className="text-xs bg-gold hover:bg-gold-light text-dark font-bold px-4 py-2 rounded-full transition">Admin Panel</Link>
                <button onClick={logout} className="p-2 text-gray-300 hover:text-red-400 transition" title="Logout"><LogOut className="w-5 h-5" /></button>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-gold"><UserIcon className="w-4 h-4" /> {user.name}</Link>
                <button onClick={logout} className="p-2 text-gray-300 hover:text-red-400 transition" title="Logout"><LogOut className="w-5 h-5" /></button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-gold transition">
                <UserIcon className="w-4 h-4" /> Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={onCartClick} className="relative p-2 text-gray-300 hover:text-gold transition">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-gold text-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gold transition">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-mid border-b border-gold/20 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold">Home</Link>
          <Link to="/menu" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold">Menu</Link>
          <Link to="/offers" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold">Offers</Link>
          <Link to="/gallery" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold">Gallery</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold">About</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gold">Contact</Link>
          
          <div className="pt-4 border-t border-gold/10 flex flex-col gap-3">
            <Link to="/reservation" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-1.5 text-center text-sm font-semibold uppercase tracking-wider text-gold border border-gold/40 hover:bg-gold/10 px-4 py-2.5 rounded-full transition">
              <Calendar className="w-4 h-4" /> Book Table
            </Link>

            {admin ? (
              <div className="flex flex-col gap-2">
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-center text-sm bg-gold text-dark font-bold px-4 py-2.5 rounded-full transition">Admin Panel</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-center text-sm text-red-400 font-semibold px-4 py-2.5 rounded-full hover:bg-red-500/10 transition">Logout</button>
              </div>
            ) : user ? (
              <div className="flex flex-col gap-2">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-center text-sm text-gray-300 font-semibold px-4 py-2.5 rounded-full hover:bg-gold/10 transition">My Profile</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-center text-sm text-red-400 font-semibold px-4 py-2.5 rounded-full hover:bg-red-500/10 transition">Logout</button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center text-sm text-gold border border-gold/30 font-semibold px-4 py-2.5 rounded-full transition">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
