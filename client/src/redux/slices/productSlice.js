import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const listProducts = createAsyncThunk('products/list', async (keyword = '', { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/products?keyword=${keyword}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const listProductDetails = createAsyncThunk('products/details', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/products/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const productSlice = createSlice({
    name: 'product',
    initialState: { products: [], product: { reviews: [] }, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listProducts.pending, (state) => { state.loading = true; })
            .addCase(listProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(listProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(listProductDetails.pending, (state) => { state.loading = true; })
            .addCase(listProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(listProductDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export default productSlice.reducer;
