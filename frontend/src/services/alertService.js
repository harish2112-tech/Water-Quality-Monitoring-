import api from './api';

export const alertService = {
    getAll: async () => {
        const response = await api.get('/api/alerts');
        return response.data;
    },

    create: async (alertData) => {
        const response = await api.post('/api/alerts', alertData);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/alerts/${id}`);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/alerts/${id}`);
        return response.data;
    },

    acknowledge: async (id) => {
        const response = await api.put(`/api/alerts/${id}/acknowledge`);
        return response.data;
<<<<<<< HEAD
    },

    getPredictive: async (location = "") => {
        const response = await api.get('/api/v1/alerts/predictive', { params: { location } });
        return response.data;
    },

    generatePredictive: async () => {
        const response = await api.post('/api/v1/alerts/predictive/generate');
        return response.data;
=======
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29
    }
};
