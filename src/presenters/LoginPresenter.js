export class LoginPresenter {    constructor(view) {
        this.view = view;
        
        // Set up event handlers
        this.view.setLoginHandler(this.handleLogin.bind(this));
        this.view.setRegisterHandler(this.handleRegister.bind(this));
        
        // Initial render
        this.init();
    }

    init() {
        this.view.render();
    }

    handleLogin(email, password) {
        // TODO: Implement actual login logic here
        console.log('Login attempt:', { email, password });
    }

    handleRegister() {
        window.location.hash = '#register';
    }
}
