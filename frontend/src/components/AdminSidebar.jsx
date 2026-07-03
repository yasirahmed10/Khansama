import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Utensils, FolderHeart, ShoppingBag, CalendarRange, Settings, Image, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/foods', label: 'Foods Manager', icon: Utensils },
    { to: '/admin/categories', label: 'Categories', icon: FolderHeart },
    { to: '/admin/orders', label: 'Orders Manager', icon: ShoppingBag },
    { to: '/admin/reservations', label: 'Reservations', icon: CalendarRange },
    { to: '/admin/gallery', label: 'Gallery Admin', icon: Image },
    { to: '/admin/reviews', label: 'Reviews Admin', icon: MessageSquare },
    { to: '/admin/settings', label: 'Restaurant Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-dark-mid border-r border-gold/15 flex flex-col justify-between h-screen fixed top-0 left-0 pt-24 pb-6 z-40">
      <div className="flex flex-col gap-1 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.to;
          return (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition ${active ? 'bg-gold text-dark' : 'text-gray-400 hover:text-white hover:bg-gold/10'}`}
            >
              <Icon className="w-4.5 h-4.5" /> {link.label}
            </Link>
          );
        })}
      </div>

      <div className="px-4">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <LogOut className="w-4.5 h-4.5" /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
