import "./components/navbar-component.js";
import "./components/footer-component.js";
import "./assets/styles/styles.css";
import { HomeView } from "./views/HomeView";
import { AboutView } from "./views/AboutView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { MountainModel } from "./models/MountainModel";
import { HomePresenter } from "./presenters/HomePresenter";
import { AboutPresenter } from "./presenters/AboutPresenter";
import { LoginPresenter } from "./presenters/LoginPresenter";
import { RegisterPresenter } from "./presenters/RegisterPresenter";

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  const model = new MountainModel();

  function handleRoute() {
    const hash = window.location.hash;

    if (hash === "#login") {
      const loginView = new LoginView();
      new LoginPresenter(loginView);
    } else if (hash === "#register") {
      const registerView = new RegisterView();
      new RegisterPresenter(registerView);
    } else if (hash === "#about") {
      const aboutView = new AboutView();
      new AboutPresenter(aboutView, model);
    } else {
      const homeView = new HomeView();
      new HomePresenter(homeView, model);
    }
  }

  // Listen for route changes
  window.addEventListener("hashchange", handleRoute);

  // Initial route handling
  handleRoute();
});
