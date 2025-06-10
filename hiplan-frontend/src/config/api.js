const API_CONFIG = {
  baseURL:
    process.env.NODE_ENV === "production"
      ? "hiplan-production.up.railway.app"
      : "http://localhost:3001/api",

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
