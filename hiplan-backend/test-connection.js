const pool = require("./src/config/database");

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...");
  console.log("Environment variables:");
  console.log("- NODE_ENV:", process.env.NODE_ENV || "Not set");
  console.log(
    "- DATABASE_URL:",
    process.env.DATABASE_URL ? "Set (Railway)" : "Not set"
  );
  console.log("- DB_HOST:", process.env.DB_HOST || "Not set");
  console.log("- DB_PORT:", process.env.DB_PORT || "Not set");
  console.log("- DB_NAME:", process.env.DB_NAME || "Not set");
  console.log("- DB_USER:", process.env.DB_USER || "Not set");
  console.log(
    "- SSL enabled:",
    process.env.NODE_ENV === "production" ? "Yes" : "No"
  );

  try {
    const result = await pool.query("SELECT NOW(), version()");
    console.log("✅ Database connection successful!");
    console.log("Current time:", result.rows[0].now);
    console.log("PostgreSQL version:", result.rows[0].version);

    // Test creating a simple table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_time TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query("INSERT INTO connection_test DEFAULT VALUES");
    const testResult = await pool.query(
      "SELECT * FROM connection_test ORDER BY id DESC LIMIT 1"
    );
    console.log("✅ Database write test successful:", testResult.rows[0]);

    // Cleanup
    await pool.query("DROP TABLE IF EXISTS connection_test");
    console.log("✅ Database cleanup successful");
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error detail:", error.detail);

    if (error.code === "ECONNREFUSED") {
      console.log("\n🔧 Troubleshooting ECONNREFUSED:");
      console.log("1. Check if PostgreSQL is running");
      console.log("2. Verify host and port configuration");
      console.log("3. For Railway: ensure PostgreSQL addon is added");
      console.log("4. For Railway: check if DATABASE_URL is set");
    }

    if (error.code === "ENOTFOUND") {
      console.log("\n🔧 Troubleshooting ENOTFOUND:");
      console.log("1. Check database host configuration");
      console.log("2. For Railway: verify DATABASE_URL format");
    }

    process.exit(1);
  }

  await pool.end();
  console.log("🏁 Database connection test completed");
}

testDatabaseConnection();
