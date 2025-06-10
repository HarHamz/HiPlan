require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  // Railway menyediakan DATABASE_URL sebagai connection string
  // Fallback ke individual parameters untuk development
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,

  // SSL configuration untuk production
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,

  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test koneksi database
pool.on("connect", (client) => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client:", err);
  // Jangan exit process di production, biarkan app tetap running
  if (process.env.NODE_ENV !== "production") {
    process.exit(-1);
  }
});

// Test initial connection
pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("❌ Database connection test failed:", err);
  } else {
    console.log(
      "✅ Database connection test successful at:",
      result.rows[0].now
    );
  }
});

module.exports = pool;
