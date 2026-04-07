import api from './api';

export const alertService = {
    getAll: async () => {
        const response = await api.get('/alerts');
        return response.data;
    },

    create: async (alertData) => {
        const response = await api.post('/alerts', alertData);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/alerts/${id}`);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/alerts/${id}`);
        return response.data;
    },

    acknowledge: async (id) => {
        const response = await api.put(`/alerts/${id}/acknowledge`);
        return response.data;
    },

    getPredictive: async (location = "") => {
        const response = await api.get('/alerts/predictive', { params: { location } });
        return response.data;
    },

    generatePredictive: async () => {
        const response = await api.post('/alerts/predictive/generate');
        return response.data;
    }
};
