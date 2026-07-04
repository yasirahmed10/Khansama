import React, { useState, useEffect } from 'react';
import { ordersApi } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { RefreshCw, ShoppingBag, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await ordersApi.adminList(filterStatus ? { status: filterStatus } : {});
      setOrders(data.items);
    } catch (err) {
      toast.error('Failed to sync orders database');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders().then(() => setLoading(false));
  }, [filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      await ordersApi.updateStatus(id, { order_status: status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, order_status: status });
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handlePaymentChange = async (id, status) => {
    try {
      await ordersApi.updateStatus(id, { payment_status: status });
      toast.success(`Payment updated to ${status}`);
      fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, payment_status: status });
      }
    } catch (err) {
      toast.error('Failed to update payment status');
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  return (
    <div className="bg-dark min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 pl-68 pr-8 pt-28 pb-20">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Fulfillment Center</span>
            <h1 className="font-display text-white text-2xl sm:text-3xl font-black uppercase mt-1">Orders Manager</h1>
          </div>
          <div className="flex gap-4">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-dark-card border border-gold/20 text-xs text-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button 
              onClick={() => { setLoading(true); fetchOrders().then(() => setLoading(false)); }}
              className="p-2 border border-gold/30 hover:bg-gold/10 text-gold rounded-xl transition"
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <span className="text-gold font-display text-xs tracking-widest animate-pulse uppercase">Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-dark-card border border-gold/10 rounded-2xl p-12 text-center text-gray-500 text-xs">
            No orders found matching status filter.
          </div>
        ) : (
          <div className="bg-dark-card border border-gold/15 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark border-b border-gold/15 text-gold uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Number</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10 text-gray-300">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-dark/30 transition">
                    <td className="p-4 font-bold text-white">#{order.order_number}</td>
                    <td className="p-4 font-semibold text-white">{order.customer_name}</td>
                    <td className="p-4">{order.customer_phone}</td>
                    <td className="p-4">₹{order.total}</td>
                    <td className="p-4">
                      <select 
                        value={order.payment_status}
                        onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                        className={`bg-dark border border-gold/15 rounded px-2 py-1 text-[10px] uppercase font-bold focus:outline-none ${order.payment_status === 'paid' ? 'text-emerald-400' : order.payment_status === 'failed' ? 'text-red-400' : 'text-yellow-500'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <select 
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-dark border border-gold/15 text-gray-300 rounded px-2 py-1 text-[10px] uppercase font-bold focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleOpenDetails(order)}
                        className="p-1.5 border border-gold/30 hover:bg-gold/10 text-gold rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Details Modal */}
        {modalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
            <div className="bg-dark-mid border border-gold/20 p-6 rounded-2xl w-full max-w-lg relative z-10 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gold/10">
                <h3 className="font-display text-gold text-sm font-bold uppercase tracking-wider">Order details #{selectedOrder.order_number}</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gold transition"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-300">
                <div>
                  <h4 className="font-bold text-white uppercase mb-1">Customer</h4>
                  <p>{selectedOrder.customer_name}</p>
                  <p>{selectedOrder.customer_phone}</p>
                  <p className="truncate">{selectedOrder.customer_email || 'No email'}</p>
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase mb-1">Delivery Address</h4>
                  <p className="line-clamp-3">{selectedOrder.delivery_address}</p>
                  {selectedOrder.landmark && <p className="text-gray-500">Landmark: {selectedOrder.landmark}</p>}
                </div>
              </div>

              {/* Items Summary Table */}
              <div className="border border-gold/15 rounded-xl overflow-hidden bg-dark">
                <div className="bg-dark p-3 border-b border-gold/15 font-semibold text-[10px] text-gold uppercase tracking-wider">Order items</div>
                <div className="p-3 divide-y divide-gold/5 max-h-40 overflow-y-auto">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-2 first:pt-0 last:pb-0 text-gray-300">
                      <span>{item.food_name} <strong>x {item.qty}</strong></span>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary calculations */}
              <div className="text-xs text-gray-400 space-y-2 border-t border-gold/10 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>₹{selectedOrder.delivery_charge}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Discount:</span>
                    <span>- ₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white border-t border-gold/10 pt-2 flex-wrap">
                  <span>Total Amount:</span>
                  <span className="text-gold">₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderManager;
