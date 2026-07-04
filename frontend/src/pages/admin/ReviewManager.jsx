import React, { useState, useEffect } from 'react';
import { testimonialsApi } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { Trash2, Star, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await testimonialsApi.adminList();
      setReviews(data);
    } catch (err) {
      toast.error('Failed to load testimonials');
    }
  };

  useEffect(() => {
    fetchReviews().then(() => setLoading(false));
  }, []);

  const handleToggleApprove = async (review) => {
    try {
      await testimonialsApi.update(review.id, { is_approved: !review.is_approved });
      toast.success(review.is_approved ? 'Review hidden' : 'Review approved & live!');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update approval status');
    }
  };

  const handleToggleFeatured = async (review) => {
    try {
      await testimonialsApi.update(review.id, { is_featured: !review.is_featured });
      toast.success(review.is_featured ? 'Removed from featured list' : 'Marked as featured testimonial!');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update featured status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial forever?')) return;
    try {
      await testimonialsApi.delete(id);
      toast.success('Testimonial deleted');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete testimonial');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3.5 h-3.5 ${i < rating ? 'text-gold fill-gold' : 'text-gray-600'}`} 
      />
    ));
  };

  return (
    <div className="bg-dark min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 pl-68 pr-8 pt-28 pb-20">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Customer Feedback</span>
            <h1 className="font-display text-white text-2xl sm:text-3xl font-black uppercase mt-1">Reviews Admin</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <span className="text-gold font-display text-xs tracking-widest animate-pulse uppercase">Syncing testimonials...</span>
          </div>
        ) : (
          <div className="bg-dark-card border border-gold/15 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark border-b border-gold/15 text-gold uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Review</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10 text-gray-300">
                {reviews.map(review => (
                  <tr key={review.id} className="hover:bg-dark/30 transition">
                    <td className="p-4 font-semibold text-white">{review.name}</td>
                    <td className="p-4 max-w-xs md:max-w-md">
                      <p className="text-gray-300 line-clamp-2 leading-relaxed">"{review.review}"</p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                    </td>
                    <td className="p-4 text-gray-500">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleApprove(review)}
                        className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition ${review.is_approved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/35 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/35 hover:bg-amber-500/20'}`}
                      >
                        {review.is_approved ? 'Live (Hide)' : 'Pending (Approve)'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleToggleFeatured(review)}
                        className={`p-2 border rounded-lg transition ${review.is_featured ? 'border-gold/50 bg-gold/10 text-gold' : 'border-gold/20 text-gray-500 hover:text-gold hover:border-gold/50'}`}
                        title={review.is_featured ? 'Unfeature Review' : 'Feature Review'}
                      >
                        <Star className={`w-3.5 h-3.5 ${review.is_featured ? 'fill-gold' : ''}`} />
                      </button>
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-2 border border-red-500/20 text-gray-500 hover:text-red-400 hover:border-red-500/50 rounded-lg transition"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500 uppercase tracking-widest">
                      No testimonials submitted yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReviewManager;
