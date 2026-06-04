import api from './axios'

export const getWines = (params) => api.get('/wines', { params })
export const getWine = (id) => api.get(`/wines/${id}`)
export const createWine = (data) => api.post('/wines', data)
export const updateWine = (id, data) => api.put(`/wines/${id}`, data)
export const deleteWine = (id) => api.delete(`/wines/${id}`)
