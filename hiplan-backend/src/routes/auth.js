const authController = require("../controllers/authController");

const authRoutes = [
  // Root endpoint
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h
        .response({
          status: "success",
          message: "HiPlan Backend API is running",
          version: "1.0.0",
        })
        .code(200);
    },
    options: {
      auth: false,
    },
  }, // CORS preflight handler
  {
    method: "OPTIONS",
    path: "/{any*}",
    handler: (request, h) => {
      return h
        .response()
        .header("Access-Control-Allow-Origin", "http://localhost:3000")
        .header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        )
        .header(
          "Access-Control-Allow-Headers",
          "Accept, Authorization, Content-Type, If-None-Match, X-Requested-With"
        )
        .header("Access-Control-Allow-Credentials", "true")
        .code(200);
    },
    options: {
      auth: false,
      cors: {
        origin: ["http://localhost:3000"],
        credentials: true,
      },
    },
  },
  {
    method: "POST",
    path: "/api/register",
    handler: authController.register,
    options: {
      auth: false, // No authentication required for registration
    },
  },
  {
    method: "POST",
    path: "/api/login",
    handler: authController.login,
    options: {
      auth: false, // No authentication required for login
    },
  },
  {
    method: "GET",
    path: "/api/profile",
    handler: authController.getProfile,
    options: {
      auth: "jwt", // JWT authentication required
    },
  },
  // Health check endpoint
  {
    method: "GET",
    path: "/api/health",
    handler: async (request, h) => {
      try {
        // Test database connection
        const pool = require("../config/database");
        await pool.query("SELECT 1");

        return h
          .response({
            status: "success",
            message: "Server is healthy",
            data: {
              server: "running",
              database: "connected",
              timestamp: new Date().toISOString(),
            },
          })
          .code(200);
      } catch (error) {
        return h
          .response({
            status: "error",
            message: "Health check failed",
            error: error.message,
          })
          .code(503);
      }
    },
    options: {
      auth: false,
    },
  },
];

module.exports = authRoutes;
