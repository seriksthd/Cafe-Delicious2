import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  orders: [],
  orderHistory: [],
  currentOrder: null,
  dashboardStats: null,
  isLoading: false,
  error: null,
};

// Create order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create order');
    }
  }
);

// Fetch active orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch orders');
    }
  }
);

// Fetch order history
export const fetchOrderHistory = createAsyncThunk(
  'orders/fetchOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/history');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch order history');
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      return { orderId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update order status');
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await api.delete(`/orders/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete order');
    }
  }
);

// Bulk delete orders
export const bulkDeleteOrders = createAsyncThunk(
  'orders/bulkDeleteOrders',
  async (orderIds, { rejectWithValue }) => {
    try {
      await api.post('/orders/bulk-delete', { order_ids: orderIds });
      return orderIds;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete orders');
    }
  }
);

// Clear order history
export const clearOrderHistory = createAsyncThunk(
  'orders/clearOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/orders/history/clear');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to clear history');
    }
  }
);

// Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'orders/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch dashboard stats');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order cases
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch orders cases
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch order history cases
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.orderHistory = action.payload;
      })
      // Update order status cases
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const order = state.orders.find(o => o.id === orderId);
        if (order) {
          order.status = status;
          // If order is delivered, move to history
          if (status === 'delivered') {
            state.orders = state.orders.filter(o => o.id !== orderId);
            state.orderHistory.unshift(order);
          }
        }
      })
      // Delete order cases
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(o => o.id !== action.payload);
        state.orderHistory = state.orderHistory.filter(o => o.id !== action.payload);
      })
      // Bulk delete orders cases
      .addCase(bulkDeleteOrders.fulfilled, (state, action) => {
        const orderIds = action.payload;
        state.orders = state.orders.filter(o => !orderIds.includes(o.id));
        state.orderHistory = state.orderHistory.filter(o => !orderIds.includes(o.id));
      })
      // Clear order history cases
      .addCase(clearOrderHistory.fulfilled, (state) => {
        state.orderHistory = [];
      })
      // Dashboard stats cases
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      });
  },
});

export const { clearError, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;