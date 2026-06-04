import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createOrder, getOrders, getOrder } from '../api/orderApi'

export const placeOrder = createAsyncThunk('orders/placeOrder', async (data, { rejectWithValue }) => {
  try {
    const res = await createOrder(data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to place order')
  }
})

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await getOrders()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders')
  }
})

export const fetchOrder = createAsyncThunk('orders/fetchOrder', async (id, { rejectWithValue }) => {
  try {
    const res = await getOrder(id)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch order')
  }
})

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null })
      .addCase(placeOrder.fulfilled, (state, action) => { state.loading = false })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.list = action.payload })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchOrder.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.loading = false; state.current = action.payload })
      .addCase(fetchOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default ordersSlice.reducer
