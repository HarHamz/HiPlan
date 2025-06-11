const API_CONFIG = {
  baseURL: "https://hiplan-production.up.railway.app/api",
  mlBackendURL: "http://127.0.0.1:8000", // ML backend URL
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
    return this.mlBackendURL + this.endpoints[endpoint];
  },
};

export default API_CONFIG;
