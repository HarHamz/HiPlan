class NavBar extends HTMLElement {
  static get observedAttributes() {
    return ["active-page"];
  }

  constructor() {
    super();
    console.log("NavBar component constructed");

    // Create shadow root
    this._root = this.attachShadow({ mode: "open" });
    console.log("Shadow root created:", this._root);

    // Initialize state
    this._isMenuOpen = false;

    // Bind event handlers
    this._onHamburgerClick = this._onHamburgerClick.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onMasukClick = this._onMasukClick.bind(this);
    this._onDaftarClick = this._onDaftarClick.bind(this);

    // Initial render
    this.render();
  }

  connectedCallback() {
    console.log("NavBar component connected to DOM");
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
    console.log("NavBar component disconnected");
    document.removeEventListener("click", this._onDocumentClick);
    window.removeEventListener("hashchange", this._updateActivePage);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
    if (name === "active-page") {
      this._updateActivePage(newValue);
    }
  }

  render() {
    this._root.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: "Poppins", sans-serif;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .navbar {
          background-color: #8fc098;
          position: fixed;
          width: 100%;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .nav-brand {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00381f;
          text-decoration: none;
        }

        .nav-menu {
          margin-left: auto;
        }

        .nav-menu .nav-links {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 2rem;
        }

        .nav-menu .nav-links li {
          display: flex;
          align-items: center;
        }

        .nav-menu .nav-links a {
          text-decoration: none;
          color: #1a1a19;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .btn-masuk {
          background: none;
          border: 1px solid #1a1a19;
          color: #1a1a19;
          margin-left: 1rem;
        }

        .btn-daftar {
          background: #1a1a19;
          border: none;
          color: rgb(255, 255, 255);
          margin-left: 1rem;
        }

        .hamburger-menu {
          display: none;
        }

        @media screen and (max-width: 768px) {
          .navbar-container {
            padding: 0.8rem 1rem;
          }

          .hamburger-menu {
            display: block;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            z-index: 1100;
          }

          .hamburger-line {
            display: block;
            width: 24px;
            height: 2px;
            margin: 5px 0;
            background-color: #1a1a19;
            transition: transform 0.3s ease;
          }

          .nav-menu {
            position: fixed;
            top: 0;
            left: -100%;
            width: 280px;
            height: 100vh;
            background: #fff;
            padding: 4rem 1.5rem 2rem;
            transition: left 0.3s ease;
            z-index: 1000;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          }

          .nav-menu .nav-links {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .nav-menu .nav-links li {
            width: 100%;
          }

          .nav-menu .nav-links a,
          .nav-menu .nav-links button {
            display: block;
            width: 100%;
            padding: 0.8rem 0;
            text-align: center;
          }

          .btn-masuk,
          .btn-daftar {
            margin: 0.5rem 0;
            width: 100%;
          }

          .nav-menu.active {
            left: 0;
          }

          .hamburger-menu.active .hamburger-line:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
          }

          .hamburger-menu.active .hamburger-line:nth-child(2) {
            opacity: 0;
          }

          .hamburger-menu.active .hamburger-line:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
          }

          .navbar.menu-active::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
        }
      
      </style>
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
              <li role="none"><a href="/" role="menuitem" aria-current="page">Beranda</a></li>
              <li role="none"><a href="#" role="menuitem">Jelajah</a></li>
              <li role="none"><a href="#about" role="menuitem">Tentang</a></li>
              <li role="none"><button class="btn btn-masuk" type="button">Masuk</button></li>
              <li role="none"><button class="btn btn-daftar" type="button">Daftar</button></li>
            </ul>
          </div>
        </div>
      </nav>
    `;
  }
  _setupEventListeners() {
    // Query elements once
    const hamburgerBtn = this._root.querySelector(".hamburger-menu");
    const masukBtn = this._root.querySelector(".btn-masuk");
    const daftarBtn = this._root.querySelector(".btn-daftar");

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
    document.addEventListener("click", this._onDocumentClick);
  }

  _updateActivePage(page) {
    const links = this._root.querySelectorAll(".nav-links a");
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
    const hamburger = this._root.querySelector(".hamburger-menu");
    const navMenu = this._root.querySelector(".nav-menu");
    const navbar = this._root.querySelector(".navbar");

    this._isMenuOpen = !this._isMenuOpen;
    hamburger.setAttribute("aria-expanded", this._isMenuOpen);

    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    navbar.classList.toggle("menu-active");
  }

  _onDocumentClick(e) {
    // Only act if the click was outside the component
    if (!this._root.contains(e.target)) {
      const hamburger = this._root.querySelector(".hamburger-menu");
      const navMenu = this._root.querySelector(".nav-menu");
      const navbar = this._root.querySelector(".navbar");

      if (this._isMenuOpen) {
        this._isMenuOpen = false;
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        navbar.classList.remove("menu-active");
      }
    }
  }

  _onMasukClick() {
    window.location.hash = "#login";
  }

  _onDaftarClick() {
    window.location.hash = "#register";
  }
}

customElements.define("nav-bar", NavBar);
