const pool = require("../src/config/database");

async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...");

    // Test koneksi
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful!");
    console.log("Current time:", result.rows[0].now);

    // Test tabel users
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);

    if (tableCheck.rows.length > 0) {
      console.log("✅ Table users exists");

      // Count records
      const count = await pool.query("SELECT COUNT(*) FROM users");
      console.log(`📊 Total users: ${count.rows[0].count}`);
    } else {
      console.log("❌ Table users does not exist");
    }

    console.log("🎉 Database test completed successfully!");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
  }

  // Force exit
  process.exit(0);
}

testDatabaseConnection();
