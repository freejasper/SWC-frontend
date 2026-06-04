import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import winesReducer from './winesSlice'
import producersReducer from './producersSlice'
import tagsReducer from './tagsSlice'
import cartReducer from './cartSlice'
import ordersReducer from './ordersSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    wines: winesReducer,
    producers: producersReducer,
    tags: tagsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
})

export default store
