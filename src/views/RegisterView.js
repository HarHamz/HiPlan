export class RegisterView {
  constructor() {
    this.app = document.getElementById("app");
  }
  render() {
    this.app.innerHTML = `            <header>
                <nav-bar></nav-bar>
            </header>
            <main class="register-container">
                <div class="register-form">
                    <h1>Daftar</h1>
                    <form id="registerForm">
                        <div class="form-group">
                            <label for="nama">Nama</label>
                            <input type="text" id="nama" name="nama" placeholder="Masukan nama anda" required>
                        </div>
                        <div class="form-group">
                            <label for="tanggal">Tanggal Lahir</label>
                            <input type="text" id="tanggal" name="tanggal" placeholder="DD/MM/YYYY" required>
                        </div>
                        <div class="form-group">
                            <label for="alamat">Alamat</label>
                            <input type="text" id="alamat" name="alamat" placeholder="Nama Kota / Kabupaten, Provinsi" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="user@hotmail.com" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="register-btn">Daftar</button>
                    </form>
                </div>
            </main>
        `;

    this.bindEvents();
  }

  bindEvents() {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.onRegister) {
        const formData = {
          nama: document.getElementById("nama").value,
          tanggal: document.getElementById("tanggal").value,
          alamat: document.getElementById("alamat").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
        };
        this.onRegister(formData);
      }
    });
  }

  setRegisterHandler(handler) {
    this.onRegister = handler;
  }

  setLoginHandler(handler) {
    this.onLogin = handler;
  }
}
