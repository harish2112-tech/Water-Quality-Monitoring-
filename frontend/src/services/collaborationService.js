import api from './api';

export const collaborationService = {
    getAll: (params) => api.get('/api/v1/collaborations', { params }).then(r => r.data),
    create: (data) => api.post('/api/v1/collaborations', data).then(r => r.data),
    update: (id, data) => api.patch(`/api/v1/collaborations/${id}`, data).then(r => r.data),
    delete: (id) => api.delete(`/api/v1/collaborations/${id}`).then(r => r.data),
    getReportsByStation: (stationId) => api.get(`/api/v1/reports`, { params: { station_id: stationId } }).then(r => r.data),
};
