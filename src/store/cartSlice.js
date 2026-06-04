import { createSlice } from '@reduxjs/toolkit'

const loadCart = () => {
  try {
    const data = localStorage.getItem('cart')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart(state, action) {
      const { wine, quantity } = action.payload
      const existing = state.items.find((item) => item.wine._id === wine._id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, wine.stock)
      } else {
        state.items.push({ wine, quantity: Math.min(quantity, wine.stock) })
      }
      saveCart(state.items)
    },
    updateQuantity(state, action) {
      const { wineId, quantity } = action.payload
      const item = state.items.find((i) => i.wine._id === wineId)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.wine._id !== wineId)
        }
      }
      saveCart(state.items)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.wine._id !== action.payload)
      saveCart(state.items)
    },
    clearCart(state) {
      state.items = []
      saveCart(state.items)
    },
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
