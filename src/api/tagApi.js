import api from './axios'

export const getRegions = () => api.get('/tags/regions')
export const getVarietals = () => api.get('/tags/varietals')
export const getColours = () => api.get('/tags/colours')
export const createRegion = (data) => api.post('/tags/regions', data)
export const createVarietal = (data) => api.post('/tags/varietals', data)
export const createColour = (data) => api.post('/tags/colours', data)
