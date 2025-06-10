import { NotificationUtils } from "../utils/NotificationUtils.js";
import API_CONFIG from "../config/api.js";

export class RegisterPresenter {
  constructor(view) {
    this.view = view;

    this.view.setRegisterHandler(this.handleRegister.bind(this));
    this.view.setLoginHandler(this.handleLogin.bind(this));

    this.init();
  }

  init() {
    this.view.render();
  }
  async handleRegister(formData) {
    const registerButton = document.querySelector(".register-btn");
    const originalText = registerButton?.textContent || "Daftar";

    try {
      if (registerButton) {
        registerButton.disabled = true;
        registerButton.textContent = "Mendaftar...";
      }

      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.register}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("Registrasi berhasil:", result);

        // Get user name from response or fallback to form data
        const user = result.data?.user || result.user;
        const userName =
          user?.fullName ||
          user?.full_name ||
          user?.nama ||
          user?.name ||
          formData.nama ||
          "User";

        NotificationUtils.success(
          `Selamat ${userName}! Akun Anda berhasil dibuat. Silakan masuk dengan akun baru Anda.`,
          4000
        );

        setTimeout(() => {
          window.location.hash = "#login";
        }, 1500);
      } else {
        console.error("Registrasi gagal:", result.message);

        let errorMessage = "Registrasi gagal. Silakan coba lagi.";
        if (result.message) {
          if (result.message.includes("email")) {
            errorMessage =
              "Email sudah terdaftar. Gunakan email lain atau coba masuk.";
          } else if (result.message.includes("validation")) {
            errorMessage =
              "Data tidak valid. Periksa kembali informasi yang Anda masukkan.";
          } else {
            errorMessage = result.message;
          }
        }

        NotificationUtils.error(errorMessage, 4000);
      }
    } catch (error) {
      console.error("Error saat registrasi:", error);

      // Show network error notification
      NotificationUtils.error(
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.",
        4000
      );
    } finally {
      if (registerButton) {
        registerButton.disabled = false;
        registerButton.textContent = originalText;
      }
    }
  }

  handleLogin() {
    window.location.hash = "#login";
  }
}
