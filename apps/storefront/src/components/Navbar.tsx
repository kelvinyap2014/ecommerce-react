import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { selectCartSummary } from '../store/cartSlice';
import { toggleCartDrawer } from '../store/cartSlice';
import { setSearchQuery, setSelectedCategory, fetchProducts } from '../store/productSlice';

const CATEGORIES = [
  { id: 'groceries', label: 'Groceries' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'fragrances', label: 'Fragrances' },
  { id: 'furniture', label: 'Household' },
];

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { totalItemCount } = useAppSelector(selectCartSummary);
  const selectedCategory = useAppSelector((state) => state.products.selectedCategory);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchInput));
    dispatch(fetchProducts({ query: searchInput }));
  };

  const handleCategorySelect = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId));
    setSearchInput('');
    dispatch(fetchProducts({ category: categoryId }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleCategorySelect('groceries')}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              🛒
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-gray-900 block leading-tight">
                FreshMarket
              </span>
              <span className="text-xs text-emerald-600 font-medium">Autodeliver Hub</span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search fresh groceries, organic produce, snacks..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-600"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Cart Drawer Toggle Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleCartDrawer())}
              className="relative flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl font-medium transition-colors border border-emerald-200 cursor-pointer"
            >
              <span>🛒 Cart</span>
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 border-t border-gray-100 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
