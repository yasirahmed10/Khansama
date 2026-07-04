import React, { useState, useEffect } from 'react';
import { reservationsApi } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { RefreshCw, Calendar, Check, X, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

const ReservationManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  
  const [tableNumber, setTableNumber] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const fetchReservations = async () => {
    try {
      const { data } = await reservationsApi.adminList(filterStatus ? { status: filterStatus } : {});
      setItems(data.items);
    } catch (err) {
      toast.error('Failed to sync reservations database');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchReservations().then(() => setLoading(false));
  }, [filterStatus]);

  const handleAction = async (id, status) => {
    try {
      const payload = { status };
      if (status === 'approved' && tableNumber) {
        payload.table_number = tableNumber;
      }
      if (adminNote) {
        payload.admin_note = adminNote;
      }
      
      await reservationsApi.update(id, payload);
      toast.success(`Reservation status updated to ${status}`);
      setEditingItem(null);
      setTableNumber('');
      setAdminNote('');
      fetchReservations();
    } catch (err) {
      toast.error('Failed to update reservation');
    }
  };

  return (
    <div className="bg-dark min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 pl-68 pr-8 pt-28 pb-20">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Lounge Bookings</span>
            <h1 className="font-display text-white text-2xl sm:text-3xl font-black uppercase mt-1">Reservations Manager</h1>
          </div>
          <div className="flex gap-4">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-dark-card border border-gold/20 text-xs text-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button 
              onClick={() => { setLoading(true); fetchReservations().then(() => setLoading(false)); }}
              className="p-2 border border-gold/30 hover:bg-gold/10 text-gold rounded-xl transition"
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <span className="text-gold font-display text-xs tracking-widest animate-pulse uppercase">Syncing bookings calendar...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-dark-card border border-gold/10 rounded-2xl p-12 text-center text-gray-500 text-xs">
            No bookings matches your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(res => (
              <div key={res.id} className="bg-dark-card border border-gold/15 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${res.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/35' : res.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/35' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/35'}`}>
                      {res.status}
                    </span>
                    <span className="text-[10px] text-gray-500">{new Date(res.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 className="font-semibold text-white text-base leading-tight mb-2">{res.name}</h3>
                  
                  <div className="space-y-1.5 text-xs text-gray-400 mb-4">
                    <p>📞 Phone: {res.phone}</p>
                    <p>📅 Date: {res.date} at {res.time}</p>
                    <p>👥 Guests: {res.guests} ({res.seating})</p>
                    {res.special_requests && (
                      <p className="bg-dark/40 border border-gold/10 p-2 rounded-lg mt-2 text-[10px] leading-relaxed italic text-gray-500">"{res.special_requests}"</p>
                    )}
                    {res.table_number && <p className="text-gold font-bold uppercase mt-1">Table Assigned: #{res.table_number}</p>}
                  </div>
                </div>

                {/* Status action buttons */}
                {res.status === 'pending' && (
                  <div className="border-t border-gold/10 pt-4 flex gap-2">
                    {editingItem === res.id ? (
                      <div className="w-full space-y-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-gray-400 uppercase font-semibold">Table Number</label>
                          <input type="text" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="bg-dark border border-gold/25 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" placeholder="e.g. 5" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-gray-400 uppercase font-semibold">Admin Notes</label>
                          <input type="text" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} className="bg-dark border border-gold/25 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none" placeholder="Confirm note" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(res.id, 'approved')} className="flex-1 bg-emerald-500 text-dark font-bold text-xs py-2 rounded-lg transition">Confirm Approve</button>
                          <button onClick={() => setEditingItem(null)} className="px-3 border border-gold/30 text-gold rounded-lg text-xs">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => setEditingItem(res.id)}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-dark font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button 
                          onClick={() => handleAction(res.id, 'rejected')}
                          className="flex-1 bg-red-500/10 border border-red-500/35 hover:bg-red-500/20 text-red-400 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ReservationManager;
