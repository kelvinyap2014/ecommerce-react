import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { CartState, CartSummary, Product, DeliveryFrequency } from '../types/grocery';

const AUTODELIVER_DISCOUNT_PERCENTAGE = 10; // 10% off for subscriptions
const TAX_RATE = 0.15; // 15% GST

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        isSubscribed?: boolean;
        frequency?: DeliveryFrequency;
      }>
    ) => {
      const { product, isSubscribed = false, frequency = '4-weeks' } = action.payload;
      const existingItem = state.items.find((item) => item.product.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
        if (isSubscribed) {
          existingItem.subscription.isSubscribed = true;
          existingItem.subscription.frequency = frequency;
        }
      } else {
        state.items.push({
          product,
          quantity: 1,
          subscription: {
            isSubscribed,
            frequency,
            discountPercentage: AUTODELIVER_DISCOUNT_PERCENTAGE,
          },
        });
      }
      state.isOpen = true; // Open cart drawer on item added
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },

    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product.id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.product.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },

    toggleSubscription: (
      state,
      action: PayloadAction<{ productId: number; frequency?: DeliveryFrequency }>
    ) => {
      const item = state.items.find((i) => i.product.id === action.payload.productId);
      if (item) {
        const nextSubState = !item.subscription.isSubscribed;
        item.subscription.isSubscribed = nextSubState;
        if (action.payload.frequency) {
          item.subscription.frequency = action.payload.frequency;
        }
      }
    },

    updateSubscriptionFrequency: (
      state,
      action: PayloadAction<{ productId: number; frequency: DeliveryFrequency }>
    ) => {
      const item = state.items.find((i) => i.product.id === action.payload.productId);
      if (item && item.subscription.isSubscribed) {
        item.subscription.frequency = action.payload.frequency;
      }
    },

    toggleCartDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleSubscription,
  updateSubscriptionFrequency,
  toggleCartDrawer,
  setCartDrawerOpen,
  clearCart,
} = cartSlice.actions;

// ==========================================
// MEMOIZED SELECTORS
// ==========================================

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectIsCartOpen = (state: { cart: CartState }) => state.cart.isOpen;

export const selectCartSummary = createSelector([selectCartItems], (items): CartSummary => {
  let subtotal = 0;
  let subscriptionSavings = 0;
  let totalItemCount = 0;

  items.forEach((item) => {
    const basePrice = item.product.price * item.quantity;
    subtotal += basePrice;
    totalItemCount += item.quantity;

    if (item.subscription.isSubscribed) {
      const discount = basePrice * (item.subscription.discountPercentage / 100);
      subscriptionSavings += discount;
    }
  });

  const netSubtotal = subtotal - subscriptionSavings;
  const shippingTotal = netSubtotal > 50 || items.length === 0 ? 0 : 5.99;
  const estimatedTax = netSubtotal * TAX_RATE;
  const grandTotal = netSubtotal + shippingTotal + estimatedTax;

  return {
    subtotal,
    subscriptionSavings,
    estimatedTax,
    shippingTotal,
    grandTotal,
    totalItemCount,
  };
});

export default cartSlice.reducer;
