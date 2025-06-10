require("dotenv").config();
const { Pool } = require("pg");

// Debug database configuration
console.log("🔧 Database Configuration Debug:");
console.log("- DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("- NODE_ENV:", process.env.NODE_ENV || "development");
if (process.env.DATABASE_URL) {
  // Hide sensitive parts of the URL for logging
  const maskedUrl = process.env.DATABASE_URL.replace(
    /\/\/([^:]+):([^@]+)@/,
    "//***:***@"
  );
  console.log("- Using DATABASE_URL:", maskedUrl);
} else {
  console.log("- Fallback to individual DB params");
  console.log("- DB_HOST:", process.env.DB_HOST || "not set");
}

// Railway Configuration
const pool = new Pool({
  // Railway menyediakan DATABASE_URL sebagai connection string
  // Fallback ke individual parameters untuk development
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,

  // SSL configuration untuk production (Railway memerlukan SSL)
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,

  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout for Railway
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
const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log(
      "✅ Database connection test successful at:",
      result.rows[0].now
    );
  } catch (err) {
    console.error("❌ Database connection test failed:", err.message);
    console.log("Database configuration check:");
    console.log(
      "- DATABASE_URL:",
      process.env.DATABASE_URL ? "Set" : "Not set"
    );
    console.log("- NODE_ENV:", process.env.NODE_ENV || "Not set");
    console.log(
      "- SSL enabled:",
      process.env.NODE_ENV === "production" ? "Yes" : "No"
    );

    // Jangan exit di production, biarkan Railway retry
    if (process.env.NODE_ENV !== "production") {
      console.log("Exiting due to database connection failure in development");
    }
  }
};

testConnection();

module.exports = pool;
