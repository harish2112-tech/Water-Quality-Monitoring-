import api from './api';

export const reportService = {
  /** Get all citizen reports (paginated) */
  getAll: (skip = 0, limit = 200) => 
    api.get('/api/reports', { params: { skip, limit } }).then(r => r.data),

  /** Submit a new citizen report */
  submit: (data) => api.post('/api/reports', data).then(r => r.data),

  /** Update report status (NGO/Admin) */
  updateStatus: (id, status) => 
    api.patch(`/api/reports/${id}/status`, { status }).then(r => r.data),

  /** Get report by ID */
  getById: (id) => api.get(`/api/reports/${id}`).then(r => r.data),

  /** Delete a report (Admin only) */
  delete: (id) => api.delete(`/api/reports/${id}`).then(r => r.data),
};
