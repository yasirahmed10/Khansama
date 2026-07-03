import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        // Register API flow inside AuthContext or direct API call
        const { authApi } = await import('../services/api');
        const { data } = await authApi.register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password
        });
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('role', 'user');
        toast.success("Registration successful!");
      } else {
        await login(form.email, form.password);
        toast.success("Login successful!");
      }
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Authentication failed");
    }
    setLoading(false);
  };

  return (
    <div className="pt-28 pb-20 bg-dark min-h-screen flex items-center justify-center px-4">
      <div className="bg-dark-card border border-gold/15 p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-gold/40 overflow-hidden flex items-center justify-center bg-dark mx-auto mb-3">
            <img src="/uploads/gallery/logo.png" alt="Khansama Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <h2 className="font-display text-gold text-lg font-bold uppercase tracking-wider">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Khansama of Bhopal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Your Name *</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="Arjun Sharma" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="07828998497" />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Email Address *</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="arjun@email.com" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Password *</label>
            <input type="password" name="password" required value={form.password} onChange={handleChange} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="••••••••" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-light disabled:opacity-50 text-dark font-bold py-3 rounded-xl transition mt-2 uppercase text-xs tracking-wider"
          >
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gold/10">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-gold hover:underline"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
