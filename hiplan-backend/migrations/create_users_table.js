const pool = require("../src/config/database");

async function createUsersTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        birth_date DATE,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log("✅ Tabel users berhasil dibuat");

    // Create index for better performance
    const createIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `;

    await pool.query(createIndexQuery);
    console.log("✅ Index berhasil dibuat");
  } catch (error) {
    console.error("❌ Error membuat tabel:", error.message);
  } finally {
    pool.end();
  }
}

createUsersTable();
