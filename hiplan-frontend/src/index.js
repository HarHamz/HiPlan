import "./components/navbar-component.js";
import "./components/footer-component.js";
import "./assets/styles/styles.css";
import "./assets/styles/mountain-detail.css";
import "./assets/styles/about-page.css";
import './assets/styles/main.css';
import { HomeView } from "./views/HomeView";
import { AboutView } from "./views/AboutView";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { ExploreView } from "./views/ExploreView";
import { MountainModel } from "./models/MountainModel";
import { HomePresenter } from "./presenters/HomePresenter";
import { AboutPresenter } from "./presenters/AboutPresenter";
import { LoginPresenter } from "./presenters/LoginPresenter";
import { RegisterPresenter } from "./presenters/RegisterPresenter";
import { MountainDetailPresenter } from "./presenters/MountainDetailPresenter";
import { MountainDetailView } from "./views/MountainDetailView";
import { ExplorePresenter } from "./presenters/ExplorePresenter";

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
    } else if (hash.startsWith("#/mountain/")) {
      // Extract mountain ID from the hash
      const mountainId = hash.split("/")[2];
      const mountainDetailView = new MountainDetailView();
      const mountainDetailPresenter = new MountainDetailPresenter(
        mountainDetailView,
        model,
        mountainId
      );
      mountainDetailPresenter.init();
    } else if (hash === "#about") {
      const aboutView = new AboutView();
      new AboutPresenter(aboutView, model);
    } else if (hash === "#jelajah") {
      // Tambahkan rute untuk jelajah
      const exploreView = new ExploreView();
      new ExplorePresenter(exploreView, model); // Kirim model ke presenter jika perlu
    } else {
      // Rute default atau #/
      const homeView = new HomeView();
      new HomePresenter(homeView, model);
    }
  }

  // Listen for route changes
  window.addEventListener("hashchange", handleRoute);

  // Initial route handling
  handleRoute();
});
