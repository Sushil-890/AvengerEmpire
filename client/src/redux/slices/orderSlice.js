import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrder = createAsyncThunk('order/create', async (order, { getState, rejectWithValue }) => {
    try {
        const { user: { userInfo } } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`/api/orders`, order, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const getOrderDetails = createAsyncThunk('order/details', async (id, { getState, rejectWithValue }) => {
    try {
        const { user: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const orderSlice = createSlice({
    name: 'order',
    initialState: { order: null, loading: false, success: false, error: null },
    reducers: {
        orderReset: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => { state.loading = true; })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(getOrderDetails.pending, (state) => { state.loading = true; })
            .addCase(getOrderDetails.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
            .addCase(getOrderDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    },
});

export const { orderReset } = orderSlice.actions;
export default orderSlice.reducer;
