import api from './axios'

export const getProducers = () => api.get('/producers')
export const getProducer = (id) => api.get(`/producers/${id}`)
export const createProducer = (data) => api.post('/producers', data)
export const updateProducer = (id, data) => api.put(`/producers/${id}`, data)
export const deleteProducer = (id) => api.delete(`/producers/${id}`)
