const API_CONFIG = {
  baseURL: "https://hiplan-production.up.railway.app/api",
  endpoints: {
    register: "/register",
    login: "/login",
    profile: "/profile",
    health: "/health",
  },

  getURL: function (endpoint) {
    return this.baseURL + this.endpoints[endpoint];
  },
};

export default API_CONFIG;
