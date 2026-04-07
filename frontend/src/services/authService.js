import api from './api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  
  register: async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    return data;
  },
  
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  updateProfile: async (data) => {
    const { data: updated } = await api.put('/users/me', data);
    return updated;
  },

  updatePassword: async (passwordData) => {
    const { data } = await api.post('/users/me/password', passwordData);
    return data;
  }
};
