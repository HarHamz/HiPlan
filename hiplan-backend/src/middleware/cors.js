const corsMiddleware = {
  name: "cors-middleware",
  register: async (server, options) => {
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
  },
};

module.exports = corsMiddleware;
