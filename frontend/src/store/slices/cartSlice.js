import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product_id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
        });
      }
      
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product_id !== productId);
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product_id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.product_id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    openCart: (state) => {
      state.isOpen = true;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;