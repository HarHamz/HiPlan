const API_CONFIG = {
  baseURL: "https://hiplan-production.up.railway.app/api",
  mlRecomBackendURL: "https://hiplan-ml-recommender-system.up.railway.app", // ML backend URL
  endpoints: {
    register: "/register",
    login: "/login",
    profile: "/profile",
    health: "/health",
    // ML endpoints
    recommendations: "/rekomendasi",
  },

  getURL: function (endpoint) {
    return this.baseURL + this.endpoints[endpoint];
  },

  getMLURL: function (endpoint) {
    return this.mlRecomBackendURL + this.endpoints[endpoint];
  },
};

export default API_CONFIG;
