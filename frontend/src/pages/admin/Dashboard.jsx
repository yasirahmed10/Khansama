import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShoppingBag, TrendingUp, Users, CalendarDays } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.dashboard().then(({ data: res }) => {
      setData(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-dark flex items-center justify-center">
        <span className="text-gold font-display text-sm tracking-widest animate-pulse uppercase">Loading Dashboard Analytics...</span>
      </div>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};

  return (
    <div className="bg-dark min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 pl-68 pr-8 pt-28 pb-20">
        
        <div className="mb-8">
          <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Management Console</span>
          <h1 className="font-display text-white text-2xl sm:text-3xl font-black uppercase mt-1">Dashboard Overview</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total Orders</span>
              <h3 className="font-display text-white text-2xl font-black mt-1">{stats.total_orders}</h3>
              <p className="text-[10px] text-gold mt-1">+{stats.today_orders} orders today</p>
            </div>
            <div className="p-3 bg-gold/10 rounded-xl text-gold"><ShoppingBag className="w-6 h-6" /></div>
          </div>

          <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Gross Revenue</span>
              <h3 className="font-display text-white text-2xl font-black mt-1">₹{stats.revenue}</h3>
              <p className="text-[10px] text-emerald-400 mt-1">Paid transactions</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><TrendingUp className="w-6 h-6" /></div>
          </div>

          <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Pending Reservations</span>
              <h3 className="font-display text-white text-2xl font-black mt-1">{stats.pending_reservations}</h3>
              <p className="text-[10px] text-gray-500 mt-1">Table bookings awaiting confirm</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><CalendarDays className="w-6 h-6" /></div>
          </div>

          <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total Customers</span>
              <h3 className="font-display text-white text-2xl font-black mt-1">{stats.total_users}</h3>
              <p className="text-[10px] text-gray-500 mt-1">Registered users database</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Users className="w-6 h-6" /></div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Monthly Revenue chart */}
          <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl shadow-xl">
            <h3 className="font-display text-gold text-sm tracking-wider uppercase mb-6 pb-2 border-b border-gold/10">Monthly Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.monthly_revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#241910" />
                  <XAxis dataKey="month" stroke="#6e5f52" fontSize={10} />
                  <YAxis stroke="#6e5f52" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e1410', borderColor: '#c9a84c', color: '#fff' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2} dot={{ fill: '#c9a84c' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily orders chart */}
          <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl shadow-xl">
            <h3 className="font-display text-gold text-sm tracking-wider uppercase mb-6 pb-2 border-b border-gold/10">Daily Order Volume</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.daily_orders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#241910" />
                  <XAxis dataKey="date" stroke="#6e5f52" fontSize={8} />
                  <YAxis stroke="#6e5f52" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e1410', borderColor: '#c9a84c', color: '#fff' }} />
                  <Bar dataKey="orders" fill="#6b1a1a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top selling foods */}
        <div className="bg-dark-card border border-gold/15 p-6 rounded-2xl shadow-xl">
          <h3 className="font-display text-gold text-sm tracking-wider uppercase mb-6 pb-2 border-b border-gold/10">Top Performing Dishes</h3>
          <div className="divide-y divide-gold/10">
            {charts.top_foods?.map((food, idx) => (
              <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-bold w-6">{idx + 1}.</span>
                  <span className="text-sm font-semibold text-white">{food.name}</span>
                </div>
                <span className="text-xs bg-gold/10 text-gold px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{food.qty} items sold</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
