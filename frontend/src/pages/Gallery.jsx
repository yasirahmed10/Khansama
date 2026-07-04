import React, { useState, useEffect } from 'react';
import { galleryApi } from '../services/api';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    galleryApi.albums().then(({ data }) => setAlbums(data)).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    galleryApi.list(selectedAlbum).then(({ data }) => {
      setItems(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [selectedAlbum]);

  const slides = items.map(item => ({ src: item.file_url }));

  return (
    <div className="pt-28 pb-20 bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <p className="section-eyebrow">Visual Tour</p>
          <h1 className="font-display text-gold text-3xl sm:text-5xl font-black uppercase mt-2 tracking-wider">Our Gallery</h1>
        </div>

        {/* Albums Filter row */}
        <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
          <button 
            onClick={() => setSelectedAlbum('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${selectedAlbum === '' ? 'bg-gold text-dark' : 'bg-dark-card border border-gold/15 text-gray-400 hover:text-white'}`}
          >
            All Media
          </button>
          {albums.map(alb => (
            <button 
              key={alb}
              onClick={() => setSelectedAlbum(alb)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition whitespace-nowrap ${selectedAlbum === alb ? 'bg-gold text-dark' : 'bg-dark-card border border-gold/15 text-gray-400 hover:text-white'}`}
            >
              {alb}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="text-center py-12">
            <span className="text-gold font-display text-xs tracking-widest animate-pulse uppercase">Loading Media...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-dark-card border border-gold/10 rounded-2xl p-12 text-center text-gray-400 text-sm">
            No gallery items uploaded in this album yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <div 
                key={item.id} 
                onClick={() => setIndex(idx)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-gold/10 group hover:border-gold/45 hover:shadow-xl transition"
              >
                {item.media_type === 'video' ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-gold text-3xl">▶</span>
                  </div>
                ) : (
                  <img src={item.file_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
                {item.title && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <h4 className="text-white text-xs font-semibold tracking-wide truncate">{item.title}</h4>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={slides}
        />

      </div>
    </div>
  );
};

export default GalleryPage;
