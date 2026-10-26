import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsAPIResponse, ProductState } from '../types/grocery';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Initial state for the product catalog
const initialState: ProductState = {
  items: [],
  selectedCategory: 'groceries',
  searchQuery: '',
  status: 'idle',
  error: null,
};

// Async thunk to fetch products from DummyJSON API based on category or search
export const fetchProducts = createAsyncThunk<
  Product[],
  { category?: string; query?: string } | undefined,
  { rejectValue: string }
>('products/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    let url = `${BASE_URL}/products`;

    if (params?.query && params.query.trim() !== '') {
      url = `${BASE_URL}/products/search?q=${encodeURIComponent(params.query)}`;
    } else if (params?.category) {
      url = `${BASE_URL}/products/category/${encodeURIComponent(params.category)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch products (Status ${response.status})`);
    }

    const data: ProductsAPIResponse = await response.json();
    return data.products;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'An unknown error occurred while fetching products.'
    );
  }
});

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.searchQuery = ''; // Clear search when switching categories
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load products';
      });
  },
});

export const { setSelectedCategory, setSearchQuery, clearError } = productSlice.actions;

export default productSlice.reducer;
