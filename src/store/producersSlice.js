import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProducers, getProducer } from '../api/producerApi'

export const fetchProducers = createAsyncThunk('producers/fetchProducers', async (_, { rejectWithValue }) => {
  try {
    const res = await getProducers()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch producers')
  }
})

export const fetchProducer = createAsyncThunk('producers/fetchProducer', async (id, { rejectWithValue }) => {
  try {
    const res = await getProducer(id)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch producer')
  }
})

const producersSlice = createSlice({
  name: 'producers',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrentProducer(state) {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducers.fulfilled, (state, action) => { state.loading = false; state.list = action.payload })
      .addCase(fetchProducers.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchProducer.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducer.fulfilled, (state, action) => { state.loading = false; state.current = action.payload })
      .addCase(fetchProducer.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { clearCurrentProducer } = producersSlice.actions
export default producersSlice.reducer
