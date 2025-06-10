const Hapi = require("@hapi/hapi");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3001,
    host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
    routes: {
      cors: {
        origin: ["*"], // Allow all origins for development
        credentials: true,
        headers: [
          "Accept",
          "Authorization",
          "Content-Type",
          "If-None-Match",
          "X-Requested-With",
        ],
        additionalHeaders: ["cache-control", "x-requested-with"],
      },
    },
  });

  // Add CORS headers to all responses
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    if (response.isBoom) {
      response.output.headers["Access-Control-Allow-Origin"] = "*";
      response.output.headers["Access-Control-Allow-Credentials"] = "true";
      response.output.headers["Access-Control-Allow-Methods"] =
        "GET, POST, PUT, DELETE, OPTIONS";
      response.output.headers["Access-Control-Allow-Headers"] =
        "Accept, Authorization, Content-Type, If-None-Match, X-Requested-With";
    } else {
      response.header("Access-Control-Allow-Origin", "*");
      response.header("Access-Control-Allow-Credentials", "true");
      response.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.header(
        "Access-Control-Allow-Headers",
        "Accept, Authorization, Content-Type, If-None-Match, X-Requested-With"
      );
    }

    return h.continue;
  });

  // Register JWT plugin
  await server.register(require("@hapi/jwt"));

  // JWT authentication strategy
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET || "your-secret-key",
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400, // 4 hours
      timeSkewSec: 15,
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload },
      };
    },
  });

  server.auth.default("jwt");

  // Register routes
  server.route(authRoutes);

  await server.start();
  console.log(`Server berjalan di ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
