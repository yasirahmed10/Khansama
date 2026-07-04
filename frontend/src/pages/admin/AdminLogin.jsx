import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(email, password);
      toast.success("Welcome to Khansama Admin Portal!");
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="pt-32 pb-20 bg-dark min-h-screen flex items-center justify-center px-4">
      <div className="bg-dark-card border border-gold/15 p-8 rounded-2xl max-w-sm w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-gold/40 overflow-hidden flex items-center justify-center bg-dark mx-auto mb-3">
            <img src="/assets/gallery/logo.png" alt="Khansama Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <h2 className="font-display text-gold text-base font-bold uppercase tracking-wider">Admin Portal</h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Khansama of Bhopal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" 
              placeholder="admin@khansama.com" 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-light disabled:opacity-50 text-dark font-bold py-3 rounded-xl transition mt-2 uppercase text-xs tracking-wider"
          >
            {loading ? 'Entering...' : 'Enter Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
