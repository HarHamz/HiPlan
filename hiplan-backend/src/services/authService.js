const bcrypt = require("bcryptjs");
const jwt = require("@hapi/jwt");
const { nanoid } = require("nanoid");
const pool = require("../config/database");

class AuthService {
  async register(userData) {
    const { nama, tanggal, alamat, email, password } = userData;

    try {
      // Check if user already exists
      const checkUser = await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      );

      if (checkUser.rows.length > 0) {
        throw new Error("Email sudah terdaftar");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate user ID
      const { nanoid } = await import("nanoid");
      const userId = `user-${nanoid(16)}`;

      // Insert new user
      const result = await pool.query(
        `INSERT INTO users (id, username, email, password, full_name, birth_date, address, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
         RETURNING id, username, email, full_name, birth_date, address, created_at`,
        [userId, nama, email, hashedPassword, nama, tanggal, alamat]
      );

      return {
        success: true,
        message: "User berhasil terdaftar",
        data: result.rows[0],
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(email, password) {
    try {
      // Find user by email
      const result = await pool.query(
        "SELECT id, username, email, password, full_name FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error("Email atau password salah");
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error("Email atau password salah");
      }

      // Generate JWT token
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
      };

      const token = jwt.token.generate(
        payload,
        process.env.JWT_SECRET || "secrettokenhiplan"
      );

      return {
        success: true,
        message: "Login berhasil",
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            full_name: user.full_name,
          },
          token,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserById(userId) {
    try {
      const result = await pool.query(
        "SELECT id, username, email, full_name, birth_date, address, created_at FROM users WHERE id = $1",
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error("User tidak ditemukan");
      }

      return {
        success: true,
        data: result.rows[0],
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new AuthService();
