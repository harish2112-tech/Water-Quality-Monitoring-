import api from './api';

export const stationService = {
  /** Get all stations */
  getAll: () => api.get('/stations').then(r => r.data),

  /** Get a single station */
  getById: (id) => api.get(`/stations/${id}`).then(r => r.data),

  /** Create a new station (admin/authority only) */
  create: (data) => api.post('/stations', data).then(r => r.data),

  /** Update a station */
  update: (id, data) => api.put(`/stations/${id}`, data).then(r => r.data),

  /** Delete a station */
  delete: (id) => api.delete(`/stations/${id}`),
};
