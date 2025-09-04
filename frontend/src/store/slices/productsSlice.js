import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  categories: [],
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch products');
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create product');
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, ...productData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update product');
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete product');
    }
  }
);

// Get product by id
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Product not found');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products cases
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        // Extract unique categories
        const categories = [...new Set(action.payload.map(product => product.category))];
        state.categories = categories;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create product cases
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
        // Update categories if new category
        if (!state.categories.includes(action.payload.category)) {
          state.categories.push(action.payload.category);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update product cases
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.currentProduct = action.payload;
      })
      // Delete product cases
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      // Fetch single product cases
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      });
  },
});

export const { clearError, clearCurrentProduct, setCategories } = productsSlice.actions;
export default productsSlice.reducer;