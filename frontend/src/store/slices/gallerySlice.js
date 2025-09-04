import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  images: [],
  isLoading: false,
  error: null,
};

// Fetch gallery images
export const fetchGalleryImages = createAsyncThunk(
  'gallery/fetchGalleryImages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/gallery');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch gallery images');
    }
  }
);

// Upload gallery image
export const uploadGalleryImage = createAsyncThunk(
  'gallery/uploadGalleryImage',
  async (imageData, { rejectWithValue }) => {
    try {
      const response = await api.post('/gallery', imageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to upload image');
    }
  }
);

// Delete gallery image
export const deleteGalleryImage = createAsyncThunk(
  'gallery/deleteGalleryImage',
  async (imageId, { rejectWithValue }) => {
    try {
      await api.delete(`/gallery/${imageId}`);
      return imageId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete image');
    }
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch images cases
      .addCase(fetchGalleryImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGalleryImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload;
      })
      .addCase(fetchGalleryImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Upload image cases
      .addCase(uploadGalleryImage.fulfilled, (state, action) => {
        state.images.unshift(action.payload);
      })
      // Delete image cases
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        state.images = state.images.filter(img => img.id !== action.payload);
      });
  },
});

export const { clearError } = gallerySlice.actions;
export default gallerySlice.reducer;