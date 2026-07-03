import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { foodsApi, categoriesApi } from '../services/api';
import FoodCard from '../components/FoodCard';
import { CardSkeleton } from '../components/SkeletonLoader';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [isVeg, setIsVeg] = useState(searchParams.get('is_veg') === 'true' ? true : searchParams.get('is_veg') === 'false' ? false : null);
  const [spiceLevel, setSpiceLevel] = useState(searchParams.get('spice_level') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'display_order');
  const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'asc');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  useEffect(() => {
    categoriesApi.list().then(({ data }) => setCategories(data)).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {
      page,
      per_page: 8,
      sort_by: sortBy,
      order: sortOrder,
    };
    if (search) params.search = search;
    if (selectedCategory) params.category_id = selectedCategory;
    if (isVeg !== null) params.is_veg = isVeg;
    if (spiceLevel) params.spice_level = spiceLevel;

    foodsApi.list(params).then(({ data }) => {
      setFoods(data.items);
      setTotal(data.total);
      setPages(data.pages);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });

    // Update query params
    const nextParams = {};
    if (search) nextParams.search = search;
    if (selectedCategory) nextParams.category = selectedCategory;
    if (isVeg !== null) nextParams.is_veg = String(isVeg);
    if (spiceLevel) nextParams.spice_level = spiceLevel;
    if (sortBy) nextParams.sort_by = sortBy;
    if (sortOrder) nextParams.order = sortOrder;
    if (page > 1) nextParams.page = String(page);
    setSearchParams(nextParams);

  }, [search, selectedCategory, isVeg, spiceLevel, sortBy, sortOrder, page]);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <p className="section-eyebrow">Mughal Culinary Selection</p>
          <h1 className="font-display text-gold text-3xl sm:text-5xl font-black uppercase mt-2 tracking-wider">Explore Our Menu</h1>
        </div>

        {/* Search, Sort, Filters Bar */}
        <div className="bg-dark-card border border-gold/15 p-5 rounded-2xl mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-xl">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search Butter Chicken, Garlic Bread, Biryani..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-dark border border-gold/25 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold transition"
            />
          </div>

          {/* Sorters and Quick Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Veg / Non-Veg filters */}
            <div className="flex border border-gold/20 rounded-xl overflow-hidden bg-dark">
              <button 
                onClick={() => { setIsVeg(null); setPage(1); }}
                className={`px-4 py-2 text-xs font-bold uppercase transition ${isVeg === null ? 'bg-gold text-dark' : 'text-gray-400 hover:text-white'}`}
              >
                All
              </button>
              <button 
                onClick={() => { setIsVeg(true); setPage(1); }}
                className={`px-4 py-2 text-xs font-bold uppercase transition ${isVeg === true ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Veg
              </button>
              <button 
                onClick={() => { setIsVeg(false); setPage(1); }}
                className={`px-4 py-2 text-xs font-bold uppercase transition ${isVeg === false ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Non-Veg
              </button>
            </div>

            {/* Sort selectors */}
            <div className="relative">
              <select 
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split('-');
                  setSortBy(by);
                  setSortOrder(order);
                  setPage(1);
                }}
                className="bg-dark border border-gold/25 text-xs text-gray-300 px-4 py-2.5 rounded-xl appearance-none pr-8 focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="display_order-asc">Sort: Recommend</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Grid layout (Sidebar categories + Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-dark-card border border-gold/15 p-5 rounded-2xl shadow-xl">
              <h3 className="font-display text-gold text-sm tracking-wider uppercase mb-4 pb-2 border-b border-gold/10">Categories</h3>
              <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0">
                <button 
                  onClick={() => { setSelectedCategory(''); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition whitespace-nowrap lg:whitespace-normal w-auto lg:w-full ${selectedCategory === '' ? 'bg-gold text-dark' : 'bg-dark/40 text-gray-400 border border-gold/10 hover:border-gold'}`}
                >
                  All Items
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => { setSelectedCategory(String(cat.id)); setPage(1); }}
                    className={`px-4 py-2 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition whitespace-nowrap lg:whitespace-normal w-auto lg:w-full ${selectedCategory === String(cat.id) ? 'bg-gold text-dark' : 'bg-dark/40 text-gray-400 border border-gold/10 hover:border-gold'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Spice filter card */}
            <div className="bg-dark-card border border-gold/15 p-5 rounded-2xl shadow-xl">
              <h3 className="font-display text-gold text-sm tracking-wider uppercase mb-4 pb-2 border-b border-gold/10">Spice Levels</h3>
              <div className="flex gap-2">
                {['mild', 'medium', 'hot'].map(spice => (
                  <button 
                    key={spice}
                    onClick={() => { setSpiceLevel(spiceLevel === spice ? '' : spice); setPage(1); }}
                    className={`flex-1 text-center py-2 rounded-xl text-xs font-bold capitalize transition border ${spiceLevel === spice ? 'bg-gold text-dark border-transparent' : 'bg-dark/45 text-gray-400 border-gold/15 hover:border-gold'}`}
                  >
                    {spice}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards catalog */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => <CardSkeleton key={idx} />)}
              </div>
            ) : foods.length === 0 ? (
              <div className="bg-dark-card border border-gold/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
                <SlidersHorizontal className="w-12 h-12 text-gray-600 stroke-1" />
                <h3 className="text-lg font-bold text-white">No dishes matched your filters</h3>
                <button 
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('');
                    setIsVeg(null);
                    setSpiceLevel('');
                    setPage(1);
                  }}
                  className="text-sm text-gold underline font-semibold"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                  {foods.map(food => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <button 
                      disabled={page === 1}
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      className="p-2 border border-gold/25 rounded-xl text-gold disabled:opacity-40 disabled:pointer-events-none hover:bg-gold/10 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-bold text-gray-400">Page {page} of {pages}</span>
                    <button 
                      disabled={page === pages}
                      onClick={() => setPage(prev => Math.min(prev + 1, pages))}
                      className="p-2 border border-gold/25 rounded-xl text-gold disabled:opacity-40 disabled:pointer-events-none hover:bg-gold/10 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default MenuPage;
