import api from './api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data;
  },
  
  register: async (formData) => {
    const { data } = await api.post('/api/auth/register', formData);
    return data;
  },
  
  getMe: async () => {
    const { data } = await api.get('/api/auth/me');
    return data;
  },

  updateProfile: async (data) => {
    const { data: updated } = await api.put('/api/users/me', data);
    return updated;
  },

  updatePassword: async (passwordData) => {
    const { data } = await api.post('/api/users/me/password', passwordData);
    return data;
  }
};
