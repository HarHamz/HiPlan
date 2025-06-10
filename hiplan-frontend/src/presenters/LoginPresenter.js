import authManager from "../utils/auth.js";

export class LoginPresenter {
  constructor(view) {
    this.view = view;

    this.view.setLoginHandler(this.handleLogin.bind(this)); //
    this.view.setRegisterHandler(this.handleRegister.bind(this)); //

    this.init();
  }

  init() {
    this.view.render();
  }

  async handleLogin(email, password) {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        authManager.saveAuthData(result.data.token, result.data.user);

        window.location.hash = "#";
        alert("Login Berhasil!");
      } else {
        console.error("Login gagal:", result.message);
        alert(
          `Login Gagal: ${result.message || "Terjadi kesalahan pada server"}`
        );
      }
    } catch (error) {
      console.error("Error saat login:", error);
      alert("Terjadi kesalahan saat mencoba masuk. Silakan coba lagi.");
    }
  }

  handleRegister() {
    window.location.hash = "#register";
  }
}
