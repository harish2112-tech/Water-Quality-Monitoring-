import api from './api';

export const userService = {
  /** Get all users (Admin only) */
  getAll: (skip = 0, limit = 100) => 
    api.get('/users', { params: { skip, limit } }).then(r => r.data),

  /** Update any user profile (Admin only) */
  update: (id, data) => 
    api.patch(`/users/${id}`, data).then(r => r.data),

  /** Delete any user (Admin only) */
  delete: (id) => 
    api.delete(`/users/${id}`).then(r => r.data),
    
  /** Get user by ID (Admin/Authority only) */
  getById: (id) => 
    api.get(`/users/${id}`).then(r => r.data),
};
