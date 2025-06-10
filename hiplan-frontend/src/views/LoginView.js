export class LoginView {
  constructor() {
    this.app = document.getElementById("app");
  }
  render() {
    // Check for login message from sessionStorage
    const loginMessage = sessionStorage.getItem("loginMessage");
    const messageHTML = loginMessage
      ? `<div class="auth-message" style="background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
        ${loginMessage}
      </div>`
      : "";

    this.app.innerHTML = `            <header>
                <nav-bar></nav-bar>
            </header>
            <main class="login-container">
                <div class="login-form">
                    <h1>Masuk</h1>
                    ${messageHTML}
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

    // Clear the message from sessionStorage after displaying
    if (loginMessage) {
      sessionStorage.removeItem("loginMessage");
    }

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
