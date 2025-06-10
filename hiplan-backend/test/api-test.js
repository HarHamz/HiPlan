// Test script untuk API endpoints
const testRegister = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama: "Test User",
        tanggal: "1990-01-01",
        alamat: "Jakarta, Indonesia",
        email: "test@example.com",
        password: "password123",
      }),
    });

    const result = await response.json();
    console.log("Register Response:", result);
  } catch (error) {
    console.error("Register Error:", error);
  }
};

const testLogin = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    const result = await response.json();
    console.log("Login Response:", result);
  } catch (error) {
    console.error("Login Error:", error);
  }
};

// Uncomment to test
// testRegister();
// testLogin();
