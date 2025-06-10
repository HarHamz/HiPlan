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
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Registrasi berhasil:", result);

        alert("Registrasi Berhasil! Silakan masuk.");
        window.location.hash = "#login";
      } else {
        console.error("Registrasi gagal:", result.message);
        alert(
          `Registrasi Gagal: ${
            result.message || "Terjadi kesalahan pada server"
          }`
        );
      }
    } catch (error) {
      console.error("Error saat registrasi:", error);
      alert("Terjadi kesalahan saat mencoba mendaftar. Silakan coba lagi.");
    }
  }

  handleLogin() {
    window.location.hash = "#login";
  }
}
