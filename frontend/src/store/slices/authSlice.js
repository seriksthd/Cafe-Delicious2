import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

// Admin login thunk
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/login', { username, password });
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

// Verify token thunk
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/verify');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.detail || 'Token invalid');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
      })
      // Verify token cases
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;