import React, { useState } from 'react';
import { Product, DeliveryFrequency } from '../types/grocery';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cartSlice';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  // Local state for Autodeliver toggle configuration on this card
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [frequency, setFrequency] = useState<DeliveryFrequency>('4-weeks');

  // Calculate discounted price if Autodeliver is selected (10% off)
  const discountMultiplier = isSubscribed ? 0.9 : 1;
  const finalPrice = product.price * discountMultiplier;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        isSubscribed,
        frequency,
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group">
      {/* Product Image & Badge Header */}
      <div className="relative bg-gray-50 h-48 p-4 flex items-center justify-center overflow-hidden border-b border-gray-100">
        <img
          src={product.thumbnail || product.images[0]}
          alt={product.title}
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.discountPercentage > 0 && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow-sm">
              -{product.discountPercentage}% OFF
            </span>
          )}
        </div>
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
          ⭐ {product.rating.toFixed(1)}
        </span>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            {product.category}
          </span>
          <h3 className="text-base font-bold text-gray-900 mt-1 line-clamp-1">{product.title}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        </div>

        {/* Autodeliver Subscription Widget */}
        <div className="mt-4 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              🔄 Autodeliver{' '}
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                Save 10%
              </span>
            </span>
            <input
              type="checkbox"
              checked={isSubscribed}
              onChange={(e) => setIsSubscribed(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300 cursor-pointer"
            />
          </label>

          {isSubscribed && (
            <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-medium">Frequency:</span>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as DeliveryFrequency)}
                className="bg-white border border-emerald-300 text-emerald-900 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
              >
                <option value="1-week">Every 1 Week</option>
                <option value="2-weeks">Every 2 Weeks</option>
                <option value="4-weeks">Every 4 Weeks</option>
                <option value="8-weeks">Every 8 Weeks</option>
              </select>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-gray-900">${finalPrice.toFixed(2)}</span>
              {isSubscribed && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-500 block">
              {isSubscribed ? 'Recurring subscription price' : 'One-time purchase price'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>+ Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
