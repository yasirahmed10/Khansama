import React, { useState, useEffect } from 'react';
import { galleryApi } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { Plus, Trash2, X, Upload, Film } from 'lucide-react';
import toast from 'react-hot-toast';

const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('All');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    album: 'General',
    file: null
  });

  const fetchGallery = async () => {
    try {
      const albumParam = selectedAlbum === 'All' ? null : selectedAlbum;
      const { data } = await galleryApi.list(albumParam);
      setItems(data);
    } catch (err) {
      toast.error('Failed to load gallery items');
    }
  };

  const fetchAlbums = async () => {
    try {
      const { data } = await galleryApi.albums();
      setAlbums(data);
    } catch (err) {
      console.error('Failed to load albums', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchGallery(), fetchAlbums()]).then(() => setLoading(false));
  }, [selectedAlbum]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await galleryApi.delete(id);
      toast.success('Gallery item deleted');
      fetchGallery();
      fetchAlbums();
    } catch (err) {
      toast.error('Failed to delete gallery item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) {
      toast.error('Please select an image/video file');
      return;
    }

    const formData = new FormData();
    formData.append('file', form.file);
    formData.append('album', form.album || 'General');
    if (form.title) formData.append('title', form.title);

    setUploading(true);
    try {
      await galleryApi.upload(formData);
      toast.success('File uploaded successfully!');
      setModalOpen(false);
      setForm({ title: '', album: 'General', file: null });
      fetchGallery();
      fetchAlbums();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed');
    }
    setUploading(false);
  };

  return (
    <div className="bg-dark min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 pl-68 pr-8 pt-28 pb-20">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Visual Assets</span>
            <h1 className="font-display text-white text-2xl sm:text-3xl font-black uppercase mt-1">Gallery Admin</h1>
          </div>
          <button 
            onClick={() => setModalOpen(true)} 
            className="btn-primary flex items-center gap-1.5 text-xs uppercase"
          >
            <Plus className="w-4 h-4" /> Upload Media
          </button>
        </div>

        {/* Album filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gold/10">
          <button 
            onClick={() => setSelectedAlbum('All')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${selectedAlbum === 'All' ? 'bg-gold text-dark' : 'bg-dark-card text-gray-400 border border-gold/10 hover:text-white'}`}
          >
            All Albums
          </button>
          {albums.map(alb => (
            <button 
              key={alb}
              onClick={() => setSelectedAlbum(alb)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${selectedAlbum === alb ? 'bg-gold text-dark' : 'bg-dark-card text-gray-400 border border-gold/10 hover:text-white'}`}
            >
              {alb}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <span className="text-gold font-display text-xs tracking-widest animate-pulse uppercase">Loading media...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-dark-card border border-gold/15 rounded-2xl overflow-hidden group relative shadow-lg">
                <div className="aspect-square relative">
                  {item.media_type === 'video' ? (
                    <div className="w-full h-full bg-dark flex items-center justify-center relative">
                      <Film className="w-8 h-8 text-gold/40" />
                      <video src={item.file_url} className="absolute inset-0 w-full h-full object-cover" muted />
                    </div>
                  ) : (
                    <img src={item.file_url} alt={item.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition shadow-lg"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-dark-mid/50 border-t border-gold/10 flex justify-between items-center">
                  <div className="truncate pr-2">
                    <h4 className="text-[11px] text-white font-semibold truncate uppercase tracking-wider">{item.title || 'Untitled'}</h4>
                    <span className="text-[9px] text-gold/70 font-semibold uppercase">{item.album}</span>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center py-12 border border-dashed border-gold/20 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase tracking-widest">No media files in this album</p>
              </div>
            )}
          </div>
        )}

        {/* Upload Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
            <form onSubmit={handleSubmit} className="bg-dark-mid border border-gold/20 p-6 rounded-2xl w-full max-w-sm relative z-10 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gold/10">
                <h3 className="font-display text-gold text-sm font-bold uppercase tracking-wider">Upload Media</h3>
                <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gold transition"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Title (Optional)</label>
                <input 
                  type="text" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" 
                  placeholder="e.g. Interior View"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Album</label>
                <input 
                  type="text" 
                  required
                  value={form.album} 
                  onChange={(e) => setForm({ ...form, album: e.target.value })} 
                  className="bg-dark border border-gold/25 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold transition" 
                  placeholder="e.g. Ambience, Food, Events"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Select File</label>
                <label className="border border-dashed border-gold/25 rounded-lg p-6 bg-dark hover:bg-gold/5 transition cursor-pointer flex flex-col items-center justify-center gap-2">
                  <Upload className="w-5 h-5 text-gold" />
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider text-center">
                    {form.file ? form.file.name : 'Click to browse images/videos'}
                  </span>
                  <input 
                    type="file" 
                    required 
                    accept="image/*,video/*" 
                    onChange={(e) => setForm({ ...form, file: e.target.files[0] })} 
                    className="hidden" 
                  />
                </label>
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full bg-gold hover:bg-gold-light disabled:opacity-50 text-dark font-bold py-3.5 rounded-xl transition mt-2 uppercase text-xs tracking-wider flex items-center justify-center gap-2"
              >
                {uploading ? 'Uploading...' : 'Start Upload'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default GalleryManager;
