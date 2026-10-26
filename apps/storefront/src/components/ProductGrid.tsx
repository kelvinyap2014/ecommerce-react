import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchProducts } from '../store/productSlice';
import { ProductCard } from './ProductCard';

export const ProductGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, error, selectedCategory, searchQuery } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts({ category: selectedCategory }));
    }
  }, [status, selectedCategory, dispatch]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category & Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} Catalog`}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {items.length} fresh products available with optional Autodeliver savings.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {status === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 border border-gray-200 h-80 animate-pulse flex flex-col justify-between"
            >
              <div className="bg-gray-200 h-40 rounded-xl mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto">
          <div className="text-3xl mb-2">⚠️</div>
          <h3 className="text-lg font-bold text-red-800">Failed to load catalog</h3>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button
            onClick={() => dispatch(fetchProducts({ category: selectedCategory }))}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {status === 'succeeded' && items.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-lg font-bold text-gray-800">No products found</h3>
          <p className="text-sm text-gray-500 mt-1">
            Try searching for something else or switch categories.
          </p>
        </div>
      )}

      {/* Success Grid */}
      {status === 'succeeded' && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};
