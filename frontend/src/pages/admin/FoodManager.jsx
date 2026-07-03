import React, { useState, useEffect } from 'react';
import { foodsApi, categoriesApi, mediaApi } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const FoodManager = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category_id: '',
    price: '',
    discount_percent: 0,
    description: '',
    is_veg: false,
    spice_level: 'medium',
    ingredients: '',
    allergens: '',
    preparation_time_mins: 20,
    is_available: true,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: false,
    display_order: 0
  });

  const [primaryImage, setPrimaryImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery');

    setUploadingImage(true);
    try {
      const { data } = await mediaApi.upload(formData);
      setPrimaryImage(data.url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload image');
    }
    setUploadingImage(false);
  };

  const fetchFoods = async () => {
    try {
      const { data } = await foodsApi.adminList();
      setFoods(data);
    } catch (err) {
      toast.error('Failed to load foods database');
    }
  };

  useEffect(() => {
    categoriesApi.list().then(({ data }) => setCategories(data)).catch(err => console.error(err));
    fetchFoods().then(() => setLoading(false));
  }, []);

  const handleEdit = (food) => {
    setEditingId(food.id);
    setForm({
      name: food.name,
      category_id: food.category?.id || '',
      price: food.price,
      discount_percent: food.discount_percent || 0,
      description: food.description || '',
      is_veg: food.is_veg,
      spice_level: food.spice_level,
      ingredients: food.ingredients || '',
      allergens: food.allergens || '',
      preparation_time_mins: food.preparation_time_mins || 20,
      is_available: food.is_available,
      is_featured: food.is_featured,
      is_bestseller: food.is_bestseller,
      is_new_arrival: food.is_new_arrival,
      display_order: food.display_order || 0
    });
    setPrimaryImage(food.primary_image || '');
    setDrawerOpen(true);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setForm({
      name: '',
      category_id: categories[0]?.id || '',
      price: '',
      discount_percent: 0,
      description: '',
      is_veg: false,
      spice_level: 'medium',
      ingredients: '',
      allergens: '',
      preparation_time_mins: 20,
      is_available: true,
      is_featured: false,
      is_bestseller: false,
      is_new_arrival: false,
      display_order: 0
    });
    setPrimaryImage('');
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await foodsApi.update(editingId, form);
        if (primaryImage) {
          await foodsApi.addImage(editingId, { image_url: primaryImage, is_primary: true });
        }
        toast.success('Food updated successfully!');
      } else {
        const { data: newFood } = await foodsApi.create(form);
        if (primaryImage) {
          await foodsApi.addImage(newFood.id, { image_url: primaryImage, is_primary: true });
        }
        toast.success('Food created successfully!');
      }
      setDrawerOpen(false);
      fetchFoods();
    } catch (err) {
      toast.error('Failed to save food');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await foodsApi.delete(id);
      toast.success('Food deleted');
      fetchFoods();
    } catch (err) {
      toast.error('Failed to delete food');
    }
  };

  return (
    <div className="bg-dark min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 pl-68 pr-8 pt-28 pb-20">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Catalog Control</span>
            <h1 className="font-display text-white text-2xl sm:text-3xl font-black uppercase mt-1">Foods Manager</h1>
          </div>
          <button 
            onClick={handleCreateNew}
            className="btn-primary flex items-center gap-1.5 text-xs uppercase"
          >
            <Plus className="w-4 h-4" /> Add Food
          </button>
        </div>

        {/* Table list */}
        {loading ? (
          <div className="text-center py-12">
            <span className="text-gold font-display text-xs tracking-widest animate-pulse uppercase">Syncing items...</span>
          </div>
        ) : (
          <div className="bg-dark-card border border-gold/15 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark border-b border-gold/15 text-gold uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4">Available</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10 text-gray-300">
                {foods.map(food => (
                  <tr key={food.id} className="hover:bg-dark/30 transition">
                    <td className="p-4">
                      <img src={food.primary_image || '/uploads/gallery/butter_chicken.png'} alt={food.name} className="w-12 h-12 rounded-lg object-cover border border-gold/20" />
                    </td>
                    <td className="p-4 font-semibold text-white">{food.name}</td>
                    <td className="p-4">{food.category?.name}</td>
                    <td className="p-4">₹{food.price}</td>
                    <td className="p-4 flex gap-1.5 flex-wrap items-center h-full">
                      {food.is_veg ? (
                        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Veg</span>
                      ) : (
                        <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Non-Veg</span>
                      )}
                      {food.is_featured && <span className="bg-gold/10 border border-gold/30 text-gold text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Featured</span>}
                      {food.is_bestseller && <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Best</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${food.is_available ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {food.is_available ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEdit(food)} className="p-2 border border-gold/30 hover:bg-gold/10 text-gold rounded-lg transition"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(food.id)} className="p-2 border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit/Add Drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}></div>
            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-lg bg-dark-mid border-l border-gold/20 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gold/15 flex justify-between items-center">
                  <h3 className="font-display text-gold text-base font-bold uppercase tracking-wider">{editingId ? 'Edit Dish' : 'NEW DISH'}</h3>
                  <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-gold transition"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase font-semibold">Food Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="e.g. Butter Chicken" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 uppercase font-semibold">Category</label>
                      <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: parseInt(e.target.value) })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-gray-300 focus:outline-none focus:border-gold transition">
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 uppercase font-semibold">Price (₹)</label>
                      <input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" placeholder="120" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 uppercase font-semibold">Discount (%)</label>
                      <input type="number" min="0" max="100" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: parseFloat(e.target.value) })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold transition" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 uppercase font-semibold">Prep Time (mins)</label>
                      <input type="number" min="0" value={form.preparation_time_mins} onChange={(e) => setForm({ ...form, preparation_time_mins: parseInt(e.target.value) })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold transition" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase font-semibold">Primary Image</label>
                    <div className="flex items-center gap-2">
                      <input type="text" value={primaryImage} onChange={(e) => setPrimaryImage(e.target.value)} className="flex-1 bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold transition" placeholder="/uploads/gallery/butter_chicken.png" />
                      <label className={`cursor-pointer bg-dark-card border border-gold/30 hover:bg-gold/10 text-gold px-3 py-2 rounded-lg transition flex items-center gap-1 text-xs ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {uploadingImage ? <span className="animate-pulse">...</span> : <Upload className="w-3.5 h-3.5" />}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase font-semibold">Description</label>
                    <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition resize-none" placeholder="Rich description of ingredients and tastes..." />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 uppercase font-semibold">Spice Level</label>
                      <select value={form.spice_level} onChange={(e) => setForm({ ...form, spice_level: e.target.value })} className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-gray-300 focus:outline-none focus:border-gold transition">
                        <option value="mild">Mild</option>
                        <option value="medium">Medium</option>
                        <option value="hot">Hot</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-around gap-1 border border-gold/15 rounded-xl p-2 bg-dark/30 select-none">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="diet" checked={form.is_veg} onChange={() => setForm({ ...form, is_veg: true })} />
                        <span className="text-[9px] text-gray-300 uppercase font-bold">Veg</span>
                      </label>
                      <div className="w-px h-5 bg-gold/20"></div>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="diet" checked={!form.is_veg} onChange={() => setForm({ ...form, is_veg: false })} />
                        <span className="text-[9px] text-gray-300 uppercase font-bold">Non-Veg</span>
                      </label>
                    </div>
                    <label className="flex items-center gap-2 border border-gold/15 rounded-xl p-3 bg-dark/30 select-none cursor-pointer">
                      <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} />
                      <span className="text-[10px] text-gray-300 uppercase tracking-wider font-bold">Available</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <label className="flex items-center gap-2 border border-gold/10 rounded-xl p-2 bg-dark/25 select-none cursor-pointer">
                      <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                      <span className="text-[9px] text-gray-400 uppercase font-bold">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 border border-gold/10 rounded-xl p-2 bg-dark/25 select-none cursor-pointer">
                      <input type="checkbox" checked={form.is_bestseller} onChange={(e) => setForm({ ...form, is_bestseller: e.target.checked })} />
                      <span className="text-[9px] text-gray-400 uppercase font-bold">Best Seller</span>
                    </label>
                    <label className="flex items-center gap-2 border border-gold/10 rounded-xl p-2 bg-dark/25 select-none cursor-pointer">
                      <input type="checkbox" checked={form.is_new_arrival} onChange={(e) => setForm({ ...form, is_new_arrival: e.target.checked })} />
                      <span className="text-[9px] text-gray-400 uppercase font-bold">New Arrival</span>
                    </label>
                  </div>

                  <button type="submit" className="w-full bg-gold hover:bg-gold-light text-dark font-bold py-3.5 rounded-xl transition mt-4 uppercase text-xs tracking-wider">
                    {editingId ? 'Save Updates' : 'Add New Dish'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FoodManager;
