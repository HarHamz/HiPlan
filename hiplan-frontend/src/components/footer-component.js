class FooterComponent extends HTMLElement {
  constructor() {
    super();
    // Tidak perlu Shadow DOM jika mengikuti pola navbar-component
    // dan ingin style global dari styles.css berlaku langsung
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 class="mb-3 footer-brand-name">Mountain App</h5>
            <p class="small footer-text-muted">Jelajahi keindahan puncak dunia bersama kami.</p>
          </div>

          <div class="col-lg-2 col-md-6 mb-4 mb-lg-0 offset-lg-1">
            <h6 class="text-uppercase fw-bold mb-4 footer-column-title">Features</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-2"><a href="#!" class="footer-link">Analytics</a></li>
              <li class="mb-2"><a href="#!" class="footer-link">Payments</a></li>
              <li class="mb-2"><a href="#!" class="footer-link">Dashboard</a></li>
              <li class="mb-2"><a href="#!" class="footer-link">More...</a></li>
            </ul>
          </div>

          <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h6 class="text-uppercase fw-bold mb-4 footer-column-title">Resources</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-2"><a href="#!" class="footer-link">Blog</a></li>
              <li class="mb-2"><a href="#!" class="footer-link">Newsletter</a></li>
              <li class="mb-2"><a href="#!" class="footer-link">Help Centre</a></li>
              <li class="mb-2"><a href="#!" class="footer-link">Support</a></li>
            </ul>
          </div>

          <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h6 class="text-uppercase fw-bold mb-4 footer-column-title">Company</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-2"><a href="#!" class="footer-link">About Us</a></li>
              <li class="mb-2"><a href="#!" class="footer-link">Careers</a></li>
              <li class="mb-2"><a href="#!" class="footer-link">Contact Us</a></li>
              <li class="mb-2"><a href="#!" class="footer-link">Media</a></li>
            </ul>
          </div>
        </div>

        <hr class="my-4 footer-divider">

        <div class="row align-items-center">
          <div class="col-md-6 text-center text-md-start mb-3 mb-md-0 footer-social-icons">
            <a href="#!" class="footer-social-link me-3"><i class="bi bi-facebook"></i></a>
            <a href="#!" class="footer-social-link me-3"><i class="bi bi-instagram"></i></a>
            <a href="#!" class="footer-social-link me-3"><i class="bi bi-twitter-x"></i></a>
            <a href="#!" class="footer-social-link"><i class="bi bi-github"></i></a>
          </div>
          <div class="col-md-6 text-center text-md-end">
            <p class="small footer-text-muted mb-0 footer-right">&copy; ${new Date().getFullYear()} Mountain App. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("footer-component", FooterComponent);
