// landing-page/src/presenters/RegisterPresenter.js
export class RegisterPresenter {
  constructor(view) {
    this.view = view;
    // Menyiapkan event handler dari view
    this.view.setRegisterHandler(this.handleRegister.bind(this)); //
    this.view.setLoginHandler(this.handleLogin.bind(this)); //
    // Render awal
    this.init(); //
  }

  init() {
    this.view.render(); //
  }

  async handleRegister(formData) {
    //
    // Mengganti console.log dengan API call
    try {
      const response = await fetch("http://localhost:3001/register", {
        // Ganti 3001 dengan port Hapi.js Anda
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Registrasi berhasil:", result);
        // TODO: Tangani registrasi yang sukses (misalnya, redirect ke halaman login)
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
    window.location.hash = "#login"; //
  }
}
