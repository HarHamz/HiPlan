import { SettingsView } from "../views/SettingsView.js";
import authManager from "../utils/auth.js";

export class SettingsPresenter {
  constructor() {
    this.view = new SettingsView();
    this.init();
  }

  init() {
    // Check if user is authenticated
    if (!authManager.isAuthenticated()) {
      window.location.hash = "#login";
      return;
    }

    // Render the development notice page
    this.view.render();
  }
}
