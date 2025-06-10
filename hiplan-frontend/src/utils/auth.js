class AuthManager {
  constructor() {
    this.TOKEN_KEY = "auth_token";
    this.USER_KEY = "user_data";
    this.listeners = [];
  }

  // Save authentication token and user data
  saveAuthData(token, userData = null) {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (userData) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }
    this.notifyListeners();
  }

  // Get authentication token
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get user data
  getUserData() {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Logout user
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.notifyListeners();

    window.location.href = "/";
  }

  addAuthStateListener(callback) {
    this.listeners.push(callback);
  }

  removeAuthStateListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.isAuthenticated(), this.getUserData());
      } catch (error) {
        console.error("Error in auth state listener:", error);
      }
    });
  }

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Check token expiration (basic implementation)
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  }
  // Auto logout if token is expired
  checkTokenValidity() {
    if (this.isAuthenticated() && this.isTokenExpired()) {
      console.log("Token expired, logging out...");
      this.logout();
    }
  }
}

// Create singleton instance
const authManager = new AuthManager();

// Check token validity on page load
authManager.checkTokenValidity();

export default authManager;
