import api from "./api";

const settingsService = {
  getThresholds: async () => {
    const response = await api.get("/settings/thresholds");
    return response.data;
  },

  updateThresholds: async (thresholds) => {
    const response = await api.post("/settings/thresholds", thresholds);
    return response.data;
  },

  getPreferences: async () => {
    const response = await api.get("/settings/preferences");
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.post("/settings/preferences", preferences);
    return response.data;
  },
};

export default settingsService;
