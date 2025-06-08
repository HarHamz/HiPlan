export class HomePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.view.setLoginHandler(this.handleLogin.bind(this));
    this.view.setRegisterHandler(this.handleRegister.bind(this));

    // Initial render
    this.init();
  }

  handleLogin() {
    window.location.hash = "#login";
  }

  handleRegister() {
    window.location.hash = "#register";
  }
  init() {
    const mountains = this.model.getAllMountains();
    this.view.setMountainsData(mountains);
    this.view.render(mountains);
  }
}
