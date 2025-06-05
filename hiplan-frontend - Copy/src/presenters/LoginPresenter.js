// landing-page/src/presenters/LoginPresenter.js
export class LoginPresenter {
  constructor(view) {
    this.view = view;
    // Menyiapkan event handler dari view
    this.view.setLoginHandler(this.handleLogin.bind(this)); //
    this.view.setRegisterHandler(this.handleRegister.bind(this)); //
    // Render awal
    this.init(); //
  }

  init() {
    this.view.render(); //
  }

  async handleLogin(email, password) {
    //
    // Mengganti console.log dengan API call
    try {
      const response = await fetch("http://localhost:3001/login", {
        // Ganti 3001 dengan port Hapi.js Anda
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Login berhasil:", result);
        // TODO: Tangani login yang sukses (misalnya, simpan token, redirect)
        // Contoh: localStorage.setItem('authToken', result.token);
        // window.location.hash = '#'; // Redirect ke halaman utama
        alert("Login Berhasil!"); // Pesan sementara
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
    window.location.hash = "#register"; //
  }
}
