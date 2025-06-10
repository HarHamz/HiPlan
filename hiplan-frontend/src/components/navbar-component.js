import authManager from "../utils/auth.js";
import profileUserIcon from "../assets/icon/profile-user.png";

class NavBar extends HTMLElement {
  static get observedAttributes() {
    return ["active-page"];
  }
  constructor() {
    super();

    // Initialize state
    this._isMenuOpen = false;
    this._isAuthenticated = authManager.isAuthenticated();
    this._isProfileDropdownOpen = false; // Bind event handlers
    this._onHamburgerClick = this._onHamburgerClick.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onMasukClick = this._onMasukClick.bind(this);
    this._onDaftarClick = this._onDaftarClick.bind(this);
    this._onProfileClick = this._onProfileClick.bind(this);
    this._onLogoutClick = this._onLogoutClick.bind(this);
    this._onSettingsClick = this._onSettingsClick.bind(this);
    this._onAuthStateChange = this._onAuthStateChange.bind(this);

    // Listen for auth state changes
    authManager.addAuthStateListener(this._onAuthStateChange);

    // Initial render
    this.render();
  }

  connectedCallback() {
    this._setupEventListeners();

    // Set initial active page
    const hash = window.location.hash || "/";
    this._updateActivePage(hash);

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      this._updateActivePage(window.location.hash);
    });
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._onDocumentClick);
    window.removeEventListener("hashchange", this._updateActivePage);
    authManager.removeAuthStateListener(this._onAuthStateChange);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "active-page") {
      this._updateActivePage(newValue);
    }
  }
  render() {
    const authButtons = this._isAuthenticated
      ? this._renderAuthenticatedButtons()
      : this._renderGuestButtons();

    this.innerHTML = `
      <nav class="navbar" aria-label="Main navigation">
        <div class="navbar-container">
          <a href="/" class="nav-brand">HiPlan</a>
          <button class="hamburger-menu" aria-label="Toggle menu" aria-expanded="false">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
          <div class="nav-menu">
            <ul class="nav-links" role="menubar">
              <li role="none"><a href="/#" role="menuitem" aria-current="page">Beranda</a></li>
              <li role="none"><a href="#jelajah" role="menuitem">Jelajah</a></li>
              <li role="none"><a href="#about" role="menuitem">Tentang</a></li>
              ${authButtons}
            </ul>
          </div>
        </div>
      </nav>
    `;
  }

  _renderGuestButtons() {
    return `
      <li role="none"><button class="btn btn-masuk" type="button">Masuk</button></li>
      <li role="none"><button class="btn btn-daftar" type="button">Daftar</button></li>
    `;
  }
  _renderAuthenticatedButtons() {
    const user = authManager.getUserData();
    const userName =
      user?.fullName || user?.full_name || user?.name || user?.email || "User";
    const profilePicture = user?.profilePicture || profileUserIcon;

    return `
      <li role="none" class="profile-menu">
        <button class="profile-btn" type="button" aria-label="Profile menu" aria-expanded="false">
          <img src="${profilePicture}" alt="Profile" class="profile-image">
        </button>
        <div class="profile-dropdown">
          <div class="dropdown-header">${userName}</div>
          <button class="dropdown-item settings-btn" type="button">
            <span class="dropdown-icon">⚙️</span>
            Pengaturan
          </button>
          <button class="dropdown-item logout-btn" type="button">
            <span class="dropdown-icon">🚪</span>
            Logout
          </button>
        </div>
      </li>
    `;
  }
  _setupEventListeners() {
    // Query elements once
    const hamburgerBtn = this.querySelector(".hamburger-menu");
    const masukBtn = this.querySelector(".btn-masuk");
    const daftarBtn = this.querySelector(".btn-daftar");
    const profileBtn = this.querySelector(".profile-btn");
    const logoutBtn = this.querySelector(".logout-btn");
    const settingsBtn = this.querySelector(".settings-btn");

    // Add event listeners with null checks
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener("click", this._onHamburgerClick);
    }
    if (masukBtn) {
      masukBtn.addEventListener("click", this._onMasukClick);
    }
    if (daftarBtn) {
      daftarBtn.addEventListener("click", this._onDaftarClick);
    }
    if (profileBtn) {
      profileBtn.addEventListener("click", this._onProfileClick);
    }
    if (logoutBtn) {
      logoutBtn.addEventListener("click", this._onLogoutClick);
    }
    if (settingsBtn) {
      settingsBtn.addEventListener("click", this._onSettingsClick);
    }
    document.addEventListener("click", this._onDocumentClick);
  }

  _updateActivePage(page) {
    const links = this.querySelectorAll(".nav-links a");
    links.forEach((link) => {
      if (link.getAttribute("href") === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  _onHamburgerClick(e) {
    e.stopPropagation();
    const hamburger = this.querySelector(".hamburger-menu");
    const navMenu = this.querySelector(".nav-menu");
    const navbar = this.querySelector(".navbar");

    this._isMenuOpen = !this._isMenuOpen;
    hamburger.setAttribute("aria-expanded", this._isMenuOpen);

    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    navbar.classList.toggle("menu-active");
  }
  _onDocumentClick(e) {
    // Only act if the click was outside the component
    if (!this.contains(e.target)) {
      const hamburger = this.querySelector(".hamburger-menu");
      const navMenu = this.querySelector(".nav-menu");
      const navbar = this.querySelector(".navbar");
      const profileBtn = this.querySelector(".profile-btn");
      const dropdown = this.querySelector(".profile-dropdown");

      // Close hamburger menu if open
      if (this._isMenuOpen) {
        this._isMenuOpen = false;
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        navbar.classList.remove("menu-active");
      }

      // Close profile dropdown if open
      if (this._isProfileDropdownOpen && profileBtn && dropdown) {
        this._isProfileDropdownOpen = false;
        profileBtn.setAttribute("aria-expanded", "false");
        dropdown.classList.remove("active");
      }
    }
  }

  _onMasukClick() {
    window.location.hash = "#login";
  }
  _onDaftarClick() {
    window.location.hash = "#register";
  }

  _onProfileClick(e) {
    e.stopPropagation();
    const profileBtn = this.querySelector(".profile-btn");
    const dropdown = this.querySelector(".profile-dropdown");

    this._isProfileDropdownOpen = !this._isProfileDropdownOpen;
    profileBtn.setAttribute("aria-expanded", this._isProfileDropdownOpen);
    dropdown.classList.toggle("active");
  }
  _onLogoutClick() {
    authManager.logout();
  }

  _onSettingsClick() {
    // Close the dropdown first
    this._isProfileDropdownOpen = false;
    const profileBtn = this.querySelector(".profile-btn");
    const dropdown = this.querySelector(".profile-dropdown");

    if (profileBtn && dropdown) {
      profileBtn.setAttribute("aria-expanded", "false");
      dropdown.classList.remove("active");
    }

    // Navigate to settings page
    window.location.hash = "#settings";
  }

  _onAuthStateChange(isAuthenticated, userData) {
    this._isAuthenticated = isAuthenticated;
    this.render();
    this._setupEventListeners();
  }
}

customElements.define("nav-bar", NavBar);
