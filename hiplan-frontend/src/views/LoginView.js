export class LoginView {
  constructor() {
    this.app = document.getElementById("app");
  }
  render() {
    this.app.innerHTML = `            <header>
                <nav-bar></nav-bar>
            </header>
            <main class="login-container">
                <div class="login-form">
                    <h1>Masuk</h1>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="Masukan nama anda" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="••••••••••••" required>
                        </div>
                        <a href="#" class="forgot-password">Lupa password?</a>
                        <button type="submit" class="login-btn">Masuk</button>
                        <p class="register-link">Belum punya akun? <a href="#" class="register-now">Daftar</a></p>
                    </form>
                </div>
            </main>
        `;

    this.bindEvents();
  }

  bindEvents() {
    const loginForm = document.getElementById("loginForm");
    const registerLink = document.querySelector(".register-now");

    // Handle form submission
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.onLogin) {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        this.onLogin(email, password);
      }
    });

    // Handle register navigation from the link
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.onRegister) {
        this.onRegister();
      }
    });
  }

  setLoginHandler(handler) {
    this.onLogin = handler;
  }

  setRegisterHandler(handler) {
    this.onRegister = handler;
  }
}
