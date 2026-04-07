import api from './api';

export const reportService = {
  /** Get all citizen reports (paginated) */
  getAll: (skip = 0, limit = 200) => 
    api.get('/reports', { params: { skip, limit } }).then(r => r.data),

  /** Submit a new citizen report */
  submit: (data) => api.post('/reports', data).then(r => r.data),

  /** Update report status (NGO/Admin) */
  updateStatus: (id, status) => 
    api.patch(`/reports/${id}/status`, { status }).then(r => r.data),

  /** Get report by ID */
  getById: (id) => api.get(`/reports/${id}`).then(r => r.data),

  /** Delete a report (Admin only) */
  delete: (id) => api.delete(`/reports/${id}`).then(r => r.data),
};
