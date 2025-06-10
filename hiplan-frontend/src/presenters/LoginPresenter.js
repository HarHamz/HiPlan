import authManager from "../utils/auth.js";
import { NotificationUtils } from "../utils/NotificationUtils.js";

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
    const loginButton = document.querySelector(".login-btn");
    const originalText = loginButton?.textContent || "Masuk";

    try {
      // Show loading state
      if (loginButton) {
        loginButton.disabled = true;
        loginButton.textContent = "Masuk...";
      }

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

        // Get user name with same logic as navbar
        const user = result.data.user;
        const userName =
          user?.fullName ||
          user?.full_name ||
          user?.nama ||
          user?.name ||
          user?.email ||
          "User";

        NotificationUtils.success(
          `Selamat datang kembali, ${userName}! Login berhasil.`,
          3000
        );

        setTimeout(() => {
          window.location.hash = "#";
        }, 1000);
      } else {
        console.error("Login gagal:", result.message);

        let errorMessage = "Email atau password salah. Silakan coba lagi.";
        if (result.message) {
          if (result.message.includes("email")) {
            errorMessage = "Email tidak terdaftar. Pastikan email Anda benar.";
          } else if (result.message.includes("password")) {
            errorMessage =
              "Password salah. Silakan periksa kembali password Anda.";
          } else {
            errorMessage = result.message;
          }
        }

        NotificationUtils.error(errorMessage, 4000);
      }
    } catch (error) {
      console.error("Error saat login:", error);

      // Show network error notification
      NotificationUtils.error(
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.",
        4000
      );
    } finally {
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.textContent = originalText;
      }
    }
  }

  handleRegister() {
    window.location.hash = "#register";
  }
}
