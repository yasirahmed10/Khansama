import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: '',
    display_order: 0,
    is_active: true
  });

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesApi.adminList();
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories().then(() => setLoading(false));
  }, []);

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description || '',
      image_url: cat.image_url || '',
      display_order: cat.display_order || 0,
      is_active: cat.is_active
    });
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      image_url: '',
      display_order: 0,
      is_active: true
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoriesApi.update(editingId, form);
        toast.success('Category updated');
      } else {
        await categoriesApi.create(form);
        toast.success('Category created');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category? (This will un-link matched food items)')) return;
    try {
      await categoriesApi.delete(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="bg-dark min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 pl-68 pr-8 pt-28 pb-20">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">System Taxonomy</span>
            <h1 className="font-display text-white text-2xl sm:text-3xl font-black uppercase mt-1">Categories Manager</h1>
          </div>
          <button onClick={handleCreateNew} className="btn-primary flex items-center gap-1 text-xs uppercase"><Plus className="w-4 h-4" /> Add Category</button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <span className="text-gold font-display text-xs tracking-widest animate-pulse uppercase">Syncing categories...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(cat => (
              <div key={cat.id} className="bg-dark-card border border-gold/15 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <img src={cat.image_url || '/uploads/gallery/placeholder.png'} alt={cat.name} className="w-12 h-12 rounded-lg object-cover border border-gold/20" />
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${cat.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/35' : 'bg-red-500/10 text-red-400 border border-red-500/35'}`}>
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm leading-tight">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">{cat.description || 'No description provided'}</p>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gold/10">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Order: {cat.display_order}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-1.5 border border-gold/30 hover:bg-gold/10 text-gold rounded-lg transition"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
            <form onSubmit={handleSubmit} className="bg-dark-mid border border-gold/20 p-6 rounded-2xl w-full max-w-md relative z-10 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gold/10">
                <h3 className="font-display text-gold text-sm font-bold uppercase tracking-wider">{editingId ? 'Edit Category' : 'Create Category'}</h3>
                <button type="button" onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gold transition"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Category Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition resize-none" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Category Image Link</label>
                <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Display Order</label>
                  <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold transition" />
                </div>
                <label className="flex items-center gap-2 border border-gold/15 rounded-xl p-3 bg-dark/30 select-none cursor-pointer mt-5">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                  <span className="text-[10px] text-gray-300 uppercase tracking-wider font-bold">Active Status</span>
                </label>
              </div>

              <button type="submit" className="w-full bg-gold hover:bg-gold-light text-dark font-bold py-3 rounded-xl transition mt-2 uppercase text-xs tracking-wider">
                {editingId ? 'Save Category' : 'Create Category'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryManager;
