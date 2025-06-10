import { SettingsView } from "../views/SettingsView.js";
import authManager from "../utils/auth.js";

export class SettingsPresenter {
  constructor() {
    this.view = new SettingsView();
    this.init();
  }

  init() {
    if (!authManager.isAuthenticated()) {
      window.location.hash = "#login";
      return;
    }

    this.view.render();
  }
}
