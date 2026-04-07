import api from './api';

export const collaborationService = {
    getAll: (params) => api.get('/collaborations', { params }).then(r => r.data),
    create: (data) => api.post('/collaborations', data).then(r => r.data),
    update: (id, data) => api.patch(`/collaborations/${id}`, data).then(r => r.data),
    delete: (id) => api.delete(`/collaborations/${id}`).then(r => r.data),
    getReportsByStation: (stationId) => api.get(`/reports`, { params: { station_id: stationId } }).then(r => r.data),
};
