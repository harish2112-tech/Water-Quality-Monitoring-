import api from './api';

export const readingService = {
  /** Get all readings (paginated) */
  getAll: (skip = 0, limit = 200) => 
    api.get('/readings', { params: { skip, limit } }).then(r => r.data),

  /** Get readings for a specific station */
  getByStation: (stationId) =>
    api.get(`/readings/station/${stationId}`).then(r => r.data),

  /** Get aggregated hourly readings for a station */
  getAggregate: (stationId, periodHours = 24) =>
    api.get(`/stations/readings/aggregate`, { 
      params: { station_id: stationId, period: periodHours } 
    }).then(r => r.data),
};
