import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import productReducer from './productSlice';
import cartReducer from './cartSlice';

// 1. Configure the Redux store with sliced reducers
export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// 2. Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 3. Export pre-typed hooks for usage across UI components
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
