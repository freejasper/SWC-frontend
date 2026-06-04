import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getWines, getWine } from '../api/wineApi'

export const fetchWines = createAsyncThunk('wines/fetchWines', async (params, { rejectWithValue }) => {
  try {
    const res = await getWines(params)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wines')
  }
})

export const fetchWine = createAsyncThunk('wines/fetchWine', async (id, { rejectWithValue }) => {
  try {
    const res = await getWine(id)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wine')
  }
})

const winesSlice = createSlice({
  name: 'wines',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrentWine(state) {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWines.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchWines.fulfilled, (state, action) => { state.loading = false; state.list = action.payload })
      .addCase(fetchWines.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchWine.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchWine.fulfilled, (state, action) => { state.loading = false; state.current = action.payload })
      .addCase(fetchWine.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { clearCurrentWine } = winesSlice.actions
export default winesSlice.reducer
