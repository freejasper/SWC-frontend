import api from './axios'

export const getUsers = () => api.get('/auth')
export const createUser = (data) => api.post('/auth/register', data)
export const deleteUser = (id) => api.delete(`/auth/${id}`)
export const getUserOrders = (userId) => api.get('/orders', { params: { userId } })
