const Joi = require("joi");
const authService = require("../services/authService");

class AuthController {
  async register(request, h) {
    try {
      // Validation schema
      const schema = Joi.object({
        nama: Joi.string().min(2).max(100).required(),
        tanggal: Joi.date().required(),
        alamat: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      });

      const { error, value } = schema.validate(request.payload);

      if (error) {
        return h
          .response({
            status: "fail",
            message: `Validation Error: ${error.details[0].message}`,
          })
          .code(400);
      }

      const result = await authService.register(value);

      return h
        .response({
          status: "success",
          message: result.message,
          data: result.data,
        })
        .code(201);
    } catch (error) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }
  }

  async login(request, h) {
    try {
      // Validation schema
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });

      const { error, value } = schema.validate(request.payload);

      if (error) {
        return h
          .response({
            status: "fail",
            message: `Validation Error: ${error.details[0].message}`,
          })
          .code(400);
      }

      const result = await authService.login(value.email, value.password);

      return h
        .response({
          status: "success",
          message: result.message,
          data: result.data,
        })
        .code(200);
    } catch (error) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(401);
    }
  }

  async getProfile(request, h) {
    try {
      const userId = request.auth.credentials.user.id;
      const result = await authService.getUserById(userId);

      return h
        .response({
          status: "success",
          data: result.data,
        })
        .code(200);
    } catch (error) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(404);
    }
  }
}

module.exports = new AuthController();
