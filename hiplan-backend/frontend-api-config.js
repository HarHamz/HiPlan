// Frontend API Configuration
const API_CONFIG = {
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://your-app-name.up.railway.app/api" // Ganti dengan URL Railway Anda
      : "http://localhost:3001/api",

  endpoints: {
    register: "/register",
    login: "/login",
    profile: "/profile",
    health: "/health",
  },
};

// For Railway deployment, replace 'your-app-name' with your actual Railway app name
// Example: https://hiplan-backend-production.up.railway.app/api

export default API_CONFIG;
