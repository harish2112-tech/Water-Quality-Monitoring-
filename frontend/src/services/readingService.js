import api from './api';

export const readingService = {
  /** Get all readings (paginated) */
  getAll: (skip = 0, limit = 200) => 
    api.get('/api/readings', { params: { skip, limit } }).then(r => r.data),

  /** Get readings for a specific station */
  getByStation: (stationId) =>
    api.get(`/api/readings/station/${stationId}`).then(r => r.data),
};
