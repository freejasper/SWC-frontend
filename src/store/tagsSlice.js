import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRegions, getVarietals, getColours } from '../api/tagApi'

export const fetchRegions = createAsyncThunk('tags/fetchRegions', async (_, { rejectWithValue }) => {
  try {
    const res = await getRegions()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch regions')
  }
})

export const fetchVarietals = createAsyncThunk('tags/fetchVarietals', async (_, { rejectWithValue }) => {
  try {
    const res = await getVarietals()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch varietals')
  }
})

export const fetchColours = createAsyncThunk('tags/fetchColours', async (_, { rejectWithValue }) => {
  try {
    const res = await getColours()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch colours')
  }
})

const tagsSlice = createSlice({
  name: 'tags',
  initialState: { regions: [], varietals: [], colours: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.fulfilled, (state, action) => { state.regions = action.payload })
      .addCase(fetchVarietals.fulfilled, (state, action) => { state.varietals = action.payload })
      .addCase(fetchColours.fulfilled, (state, action) => { state.colours = action.payload })
  },
})

export default tagsSlice.reducer
