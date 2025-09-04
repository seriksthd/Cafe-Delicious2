import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productsSlice from './slices/productsSlice';
import ordersSlice from './slices/ordersSlice';
import cartSlice from './slices/cartSlice';
import gallerySlice from './slices/gallerySlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    orders: ordersSlice,
    cart: cartSlice,
    gallery: gallerySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;