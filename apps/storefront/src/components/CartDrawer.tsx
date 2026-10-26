import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  selectCartItems,
  selectIsCartOpen,
  selectCartSummary,
  toggleCartDrawer,
  removeFromCart,
  updateQuantity,
  toggleSubscription,
  updateSubscriptionFrequency,
  clearCart,
} from '../store/cartSlice';
import { DeliveryFrequency } from '../types/grocery';

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCartOpen);
  const items = useAppSelector(selectCartItems);
  const summary = useAppSelector(selectCartSummary);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(toggleCartDrawer())}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <h2 className="text-lg font-bold text-gray-900">Your Fresh Cart</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {summary.totalItemCount} items
              </span>
            </div>
            <button
              onClick={() => dispatch(toggleCartDrawer())}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-4xl block mb-2">🛍️</span>
                <p className="text-gray-500 font-medium">Your cart is currently empty.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add some groceries and enable Autodeliver to save!
                </p>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = item.product.price * (item.subscription.isSubscribed ? 0.9 : 1);
                return (
                  <div
                    key={item.product.id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={item.product.thumbnail || item.product.images[0]}
                        alt={item.product.title}
                        className="w-16 h-16 object-contain bg-gray-50 rounded-xl border border-gray-100 p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">
                          {item.product.title}
                        </h4>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-sm font-bold text-emerald-700">
                            ${itemPrice.toFixed(2)}
                          </span>
                          {item.subscription.isSubscribed && (
                            <span className="text-xs text-gray-400 line-through">
                              ${item.product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.product.id))}
                        className="text-gray-400 hover:text-red-500 text-xs font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Autodeliver Subscription Control in Cart */}
                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.subscription.isSubscribed}
                            onChange={() =>
                              dispatch(toggleSubscription({ productId: item.product.id }))
                            }
                            className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-emerald-900">
                            Autodeliver (-10%)
                          </span>
                        </label>
                        {item.subscription.isSubscribed && (
                          <select
                            value={item.subscription.frequency}
                            onChange={(e) =>
                              dispatch(
                                updateSubscriptionFrequency({
                                  productId: item.product.id,
                                  frequency: e.target.value as DeliveryFrequency,
                                })
                              )
                            }
                            className="bg-white border border-emerald-300 text-emerald-900 text-[11px] rounded px-1.5 py-0.5 focus:outline-none cursor-pointer font-medium"
                          >
                            <option value="1-week">Every 1W</option>
                            <option value="2-weeks">Every 2W</option>
                            <option value="4-weeks">Every 4W</option>
                            <option value="8-weeks">Every 8W</option>
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Quantity Adjuster */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.product.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.product.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Financial Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>
                {summary.subscriptionSavings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Autodeliver Savings (10%)</span>
                    <span>-${summary.subscriptionSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (GST 15%)</span>
                  <span>${summary.estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {summary.shippingTotal === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-xs">Free</span>
                    ) : (
                      `$${summary.shippingTotal.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span>${summary.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Clear
                </button>
                <button
                  onClick={() => alert('Proceeding to secure checkout gateway!')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md text-sm cursor-pointer"
                >
                  Checkout Now 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
