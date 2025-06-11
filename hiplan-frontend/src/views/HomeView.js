import authManager from "../utils/auth.js";
import RecommendationService from "../utils/RecommendationService.js";
export class HomeView {
  constructor() {
    this.app = document.getElementById("app");
  }

  render(mountains) {
    this.app.innerHTML = `
            <header>
                <nav-bar></nav-bar>
            </header>

            <section class="hero" style="background-image: url('${require("../assets/images/cartenz.jpg")}')" aria-label="Hero section">
                <div class="hero-content">
                    <h1>JELAJAHI GUNUNG DI INDONESIA</h1>                    <div class="search-wrapper">
                        <form class="search-container" role="search" aria-label="Pencarian gunung">
                            <input type="search" placeholder="Cari gunung di Indonesia" id="searchInput" aria-label="Cari gunung di Indonesia" autocomplete="off"/>
                            <button type="submit" class="search-btn" aria-label="Tombol cari">
                                <img src="${require("../assets/icon/search-icon.svg")}" alt="Icon pencarian"/>
                            </button>
                        </form>
                        <div id="search-suggestions" class="search-suggestions" style="display: none;">
                            <ul id="suggestions-list" class="suggestions-list"></ul>
                        </div>
                    </div>
                </div>
            </section>

            <main>
                <section class="mulai-jelajah-section" aria-labelledby="jelajah-heading">
                    <h2 id="jelajah-heading">Mulai Jelajahi dari Sini</h2>
                    <div class="card-container">
                        ${this.renderMountainCards(
                          [65, 73, 86, 51]
                            .map((id) =>
                              mountains.find((mountain) => mountain.id === id)
                            )
                            .filter((mountain) => mountain)
                        )}
                    </div>
                </section>                <section class="destinasi-populer-section" aria-labelledby="populer-heading">
                    <h2 id="populer-heading">Destinasi Populer</h2>
                    <div class="card-container">
                        ${this.renderMountainCards(
                          [170, 79, 197, 159]
                            .map((id) =>
                              mountains.find((mountain) => mountain.id === id)
                            )
                            .filter((mountain) => mountain)
                        )}
                    </div>
                </section>

                <section class="rekomendasi-section" aria-labelledby="rekomendasi-heading">
                    <h2 id="rekomendasi-heading">Butuh Rekomendasi?</h2>
                    <p class="rekomendasi-description">Dapatkan rekomendasi gunung berdasarkan preferensi Anda</p>
                    <div class="rekomendasi-container">
                        <form class="rekomendasi-form" id="rekomendasiForm">                            <div class="input-group">
                                <div class="input-field">
                                    <label for="lokasiInput">Lokasi Preferensi</label>
                                    <input type="text" id="lokasiInput" name="lokasi" placeholder="Masukkan lokasi (contoh: Jawa Barat, Bandung, dll)" required />
                                </div>
                                <div class="input-field">
                                    <label for="ketinggianInput">Kisaran Ketinggian (mdpl)</label>
                                    <input type="number" id="ketinggianInput" name="ketinggian"
                                           placeholder="Contoh: 2500"
                                           min="500"
                                           max="6000"
                                           step="100"
                                           required />
                                    <small class="input-help">Masukkan ketinggian dalam meter di atas permukaan laut</small>
                                </div>
                            </div>
                            <button type="submit" class="rekomendasi-btn">
                                <img src="${require("../assets/icon/search-icon.svg")}" alt="Search Icon" class="btn-icon"/>
                                Cari Rekomendasi
                            </button>
                        </form>
                    </div>                
                  </section>

                <!-- Hasil Rekomendasi Section (hidden by default) -->
                <section class="rekomendasi-results-section" id="rekomendasiResults" style="display: none;">
                    <div class="rekomendasi-results-container">
                        <div class="results-header">
                            <h2 id="results-title">Rekomendasi Gunung untuk Anda</h2>
                            <p id="results-subtitle">Ditemukan beberapa gunung yang sesuai dengan preferensi Anda</p>
                        </div>
                        <div class="card-container" id="recommendationCards">
                            <!-- Results will be inserted here -->
                        </div>
                    </div>
                </section>

                <section class="feature-section">
                    <h2>Perencanaan Cerdas dengan Fitur HiPlan</h2>
                    <div class="feature-container">
                        <div class="feature-image">
                            <img src="${require("../assets/images/lawu.jpg")}" alt="Pendaki di gunung" />
                        </div>
                        <div class="feature-content">                            
                        <p>Semangat petualangan memanggil jiwa untuk menjelajahi ketinggian. Namun, di balik setiap pendakian hebat, ada perencanaan yang matang.</p>
                            <p>Seringkali kita bertanya: Kapan cuaca terbaik untuk mendaki? Apakah gunung ini sesuai dengan kemampuan saya? Berapa lama waktu yang dibutuhkan? Mencari jawaban yang akurat bisa jadi tantangan.</p>
                            <p>HiPlan hadir sebagai solusi. Kami mengubah keraguan menjadi kepastian dengan menyediakan prediksi tren cuaca bulanan, analisis tingkat kesulitan gunung, estimasi waktu tempuh, dan rekomendasi yang dipersonalisasi. Semua berbasis data untuk perencanaan yang lebih cerdas.</p>
                            <div class="feature-icons">
                                <div class="feature-icon">
                                    <img src="${require("../assets/icon/heavy-rain.png")}" alt="Icon cuaca" />
                                    
                                </div>
                                <div class="feature-icon">
                                    <img src="${require("../assets/icon/mountain.png")}" alt="Icon tingkat kesulitan gunung" />
                                    
                                </div>
                                <div class="feature-icon">
                                    <img src="${require("../assets/icon/map.png")}" alt="Icon peta dan rute" />
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer-component></footer-component>
        `;
    this.bindEvents();
  }
  renderMountainCards(mountains) {
    return mountains
      .map((mountain) => {
        const imageUrl =
          mountain.mainImage && mountain.mainImage.startsWith("http")
            ? mountain.mainImage
            : require("../assets/images/" + mountain.mainImage);

        return `            
        <article class="card" data-id="${mountain.id}">
          <a href="#/mountain/${mountain.id}" class="card-link">
          <img src="${imageUrl}" alt="Pemandangan Gunung ${mountain.name}" 
              onerror="this.src='${require("../assets/images/bromo.jpg")}'" />
                    <div class="card-content">
                        <h3>${mountain.name}</h3>
                        <p>${mountain.location}</p>
                        <p class="altitude">${mountain.altitude} mdpl</p>
                    </div>
                  </a>
              </article>
          `;
      })
      .join("");
  }
  bindEvents() {
    const searchForm = document.querySelector(".search-container");
    const searchInput = document.getElementById("searchInput");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Check authentication before search
        if (!authManager.isAuthenticated()) {
          sessionStorage.setItem(
            "loginMessage",
            "Anda harus login terlebih dahulu untuk melakukan pencarian."
          );
          window.location.hash = "#login";
          return;
        }

        const query = searchInput.value.trim();

        if (query.length >= 2) {
          const searchResults = this.getSuggestions(query);
          this.showSearchResults(searchResults);
          this.hideSuggestions();
        } else {
          this.showDefaultContent();
        }
      });
    }
    setTimeout(() => {
      this.setupAutocomplete();
      this.setupCardProtection();
      this.setupRekomendasiForm();
    }, 100);
  }

  setLoginHandler(handler) {
    this.onLogin = handler;
  }

  setRegisterHandler(handler) {
    this.onRegister = handler;
  }

  setMountainsData(mountains) {
    this.mountainsData = mountains;
    this.originalMountains = mountains;
  }
  setupAutocomplete() {
    const searchInput = document.getElementById("searchInput");
    const suggestionsContainer = document.getElementById("search-suggestions");
    const suggestionsList = document.getElementById("suggestions-list");

    if (!searchInput || !suggestionsContainer || !suggestionsList) {
      return;
    }
    let currentFocus = -1;
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      currentFocus = -1;

      if (query.length < 2) {
        this.hideSuggestions();

        if (query.length === 0) {
          this.showDefaultContent();
        }
        return;
      }

      const suggestions = this.getSuggestions(query);
      this.showSuggestions(suggestions);
    });

    searchInput.addEventListener("focus", (e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        const suggestions = this.getSuggestions(query);
        this.showSuggestions(suggestions);
      }
    });

    searchInput.addEventListener("blur", () => {
      setTimeout(() => this.hideSuggestions(), 150);
    });

    // Handle keyboard navigation
    searchInput.addEventListener("keydown", (e) => {
      const items = suggestionsList.querySelectorAll("li");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentFocus = Math.min(currentFocus + 1, items.length - 1);
        this.setActiveSuggestion(currentFocus);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentFocus = Math.max(currentFocus - 1, -1);
        this.setActiveSuggestion(currentFocus);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentFocus >= 0 && items[currentFocus]) {
          items[currentFocus].click();
        } else {
          const query = searchInput.value.trim();
          if (query.length >= 2) {
            const searchResults = this.getSuggestions(query);
            this.showSearchResults(searchResults);
            this.hideSuggestions();
          } else if (query.length === 0) {
            this.showDefaultContent();
          }
        }
      } else if (e.key === "Escape") {
        this.hideSuggestions();
        searchInput.blur();
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrapper")) {
        this.hideSuggestions();
      }
    });
  }
  getSuggestions(query) {
    if (!this.mountainsData || !Array.isArray(this.mountainsData)) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    return this.mountainsData
      .filter(
        (mountain) =>
          (mountain.name && mountain.name.toLowerCase().includes(searchTerm)) ||
          (mountain.location &&
            mountain.location.toLowerCase().includes(searchTerm))
      )
      .slice(0, 8)
      .map((mountain) => ({
        id: mountain.id,
        name: mountain.name || "Nama tidak tersedia",
        location: mountain.location || "Lokasi tidak tersedia",
        altitude: mountain.altitude || "N/A",
      }));
  }

  showSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById("search-suggestions");
    const suggestionsList = document.getElementById("suggestions-list");

    if (!suggestions || suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }

    suggestionsList.innerHTML = suggestions
      .map(
        (suggestion) => `
      <li class="suggestion-item" data-mountain-id="${suggestion.id}">
        <div class="suggestion-icon">
          <i class="bi bi-geo-alt"></i>
        </div>
        <div class="suggestion-content">
          <div class="suggestion-name">${this.highlightMatch(
            suggestion.name,
            document.getElementById("searchInput").value
          )}</div>
          <div class="suggestion-details">${suggestion.location} • ${
          suggestion.altitude
        } mdpl</div>
        </div>
      </li>
    `
      )
      .join("");

    suggestionsList.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const mountainId = item.getAttribute("data-mountain-id");
        this.navigateToMountain(mountainId);
      });
    });

    suggestionsContainer.style.display = "block";
  }

  hideSuggestions() {
    const suggestionsContainer = document.getElementById("search-suggestions");
    if (suggestionsContainer) {
      suggestionsContainer.style.display = "none";
    }
  }

  setActiveSuggestion(index) {
    const items = document.querySelectorAll(".suggestion-item");
    items.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
  }

  // Highlight matching text dalam suggestions
  highlightMatch(text, query) {
    if (!query) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return text.replace(regex, "<strong>$1</strong>");
  }
  navigateToMountain(mountainId) {
    // Check authentication before navigation
    if (!authManager.isAuthenticated()) {
      sessionStorage.setItem(
        "loginMessage",
        "Anda harus login terlebih dahulu untuk melihat detail gunung."
      );
      window.location.hash = "#login";
      return;
    }

    window.location.hash = `#/mountain/${mountainId}`;
    this.hideSuggestions();

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = "";
    }
  }

  showSearchResults(searchResults) {
    const jelajahHeading = document.getElementById("jelajah-heading");
    const populerHeading = document.getElementById("populer-heading");

    if (jelajahHeading) jelajahHeading.style.display = "none";
    if (populerHeading) populerHeading.style.display = "none";

    const containers = document.querySelectorAll(".card-container");
    const firstContainer = containers[0];
    const secondContainer = containers[1];

    if (searchResults.length > 0) {
      const mountainsForCards = searchResults.map((result) => ({
        id: result.id,
        name: result.name,
        location: result.location,
        altitude: result.altitude,
        mainImage: this.findMountainImage(result.id),
      }));

      if (firstContainer) {
        firstContainer.innerHTML = this.renderMountainCards(mountainsForCards);
      }

      if (secondContainer) {
        secondContainer.innerHTML = "";
      }
    } else {
      if (firstContainer) {
        firstContainer.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #666;">
            <p>Tidak ada gunung yang ditemukan untuk pencarian ini.</p>
          </div>
        `;
      }

      if (secondContainer) {
        secondContainer.innerHTML = "";
      }
    }
  }
  showDefaultContent() {
    const jelajahHeading = document.getElementById("jelajah-heading");
    const populerHeading = document.getElementById("populer-heading");

    if (jelajahHeading) jelajahHeading.style.display = "block";
    if (populerHeading) populerHeading.style.display = "block";

    // Hide recommendation results
    this.hideRecommendations();

    if (this.originalMountains) {
      const containers = document.querySelectorAll(".card-container");
      const jelajahContainer = containers[0];
      const populerContainer = containers[1];

      if (jelajahContainer) {
        jelajahContainer.innerHTML = this.renderMountainCards(
          [65, 73, 86, 51]
            .map((id) =>
              this.originalMountains.find((mountain) => mountain.id === id)
            )
            .filter((mountain) => mountain)
        );
      }

      if (populerContainer) {
        populerContainer.innerHTML = this.renderMountainCards(
          [170, 79, 197, 159]
            .map((id) =>
              this.originalMountains.find((mountain) => mountain.id === id)
            )
            .filter((mountain) => mountain)
        );
      }
    }
  }

  findMountainImage(mountainId) {
    if (this.originalMountains) {
      const mountain = this.originalMountains.find((m) => m.id === mountainId);
      return mountain ? mountain.mainImage : "bromo.jpg";
    }
    return "bromo.jpg";
  }
  setupCardProtection() {
    // Add click protection to mountain cards
    document.addEventListener("click", (e) => {
      const cardLink = e.target.closest(".card-link");
      if (cardLink) {
        e.preventDefault();

        // Check authentication before navigating
        if (!authManager.isAuthenticated()) {
          sessionStorage.setItem(
            "loginMessage",
            "Anda harus login terlebih dahulu untuk melihat detail gunung."
          );
          window.location.hash = "#login";
          return;
        }

        // If authenticated, allow navigation
        window.location.hash = cardLink.getAttribute("href");
      }
    });
  }
  setupRekomendasiForm() {
    const rekomendasiForm = document.getElementById("rekomendasiForm");

    if (rekomendasiForm) {
      rekomendasiForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Check authentication before processing recommendation
        if (!authManager.isAuthenticated()) {
          sessionStorage.setItem(
            "loginMessage",
            "Anda harus login terlebih dahulu untuk mendapatkan rekomendasi."
          );
          window.location.hash = "#login";
          return;
        }
        const formData = new FormData(rekomendasiForm);
        const lokasi = formData.get("lokasi");
        const ketinggian = formData.get("ketinggian");

        // Validate input
        if (!lokasi || !ketinggian) {
          alert("Mohon lengkapi semua field yang diperlukan.");
          return;
        }

        // Validate ketinggian range
        const ketinggianNum = parseInt(ketinggian);
        if (
          isNaN(ketinggianNum) ||
          ketinggianNum < 500 ||
          ketinggianNum > 6000
        ) {
          alert("Ketinggian harus berupa angka antara 500 - 6000 mdpl.");
          return;
        }

        // Show loading state
        const submitBtn = rekomendasiForm.querySelector(".rekomendasi-btn");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = "<span>Mencari rekomendasi...</span>";
        submitBtn.disabled = true;

        try {
          console.log("Fetching recommendations for:", { lokasi, ketinggian });

          // Call ML API for recommendations
          const result = await RecommendationService.getRecommendations(
            lokasi,
            ketinggian
          );

          if (result.success) {
            // Display recommendations
            this.showRecommendations(result.recommendations);
          } else {
            // Show error message
            alert(
              result.message ||
                "Tidak ada rekomendasi yang ditemukan untuk kriteria Anda."
            );
          }
        } catch (error) {
          console.error("Error getting recommendations:", error);
          alert(
            "Terjadi kesalahan saat mengambil rekomendasi. Pastikan server ML sedang berjalan."
          );
        } finally {
          // Reset button state
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      });
    }
  }
  /**
   * Display recommendation results in dedicated section
   * @param {Array} recommendations - Array of recommended mountains
   */
  showRecommendations(recommendations) {
    const resultsSection = document.getElementById("rekomendasiResults");
    const resultsTitle = document.getElementById("results-title");
    const resultsSubtitle = document.getElementById("results-subtitle");
    const recommendationCards = document.getElementById("recommendationCards");

    if (!resultsSection || !recommendationCards) {
      console.error("Recommendation results elements not found");
      return;
    }
    if (recommendations && recommendations.length > 0) {
      // Transform API data to card format
      const mountainsForCards = recommendations.map((rec, index) => {
        // Try to find matching mountain from gunung_indonesia.json by name
        let mountainId = `rec_${index}`;
        let imageUrl = "bromo.jpg"; // Default fallback image        // Load gunung_indonesia.json data to get proper image URLs and location info
        let locationDisplay = rec.Provinsi; // Default fallback
        try {
          const gunungData = require("../assets/data/gunung_indonesia.json");
          const foundMountain = gunungData.find(
            (m) =>
              m.Nama &&
              (m.Nama.toLowerCase() === rec.Nama.toLowerCase() ||
                m.Nama.toLowerCase().includes(rec.Nama.toLowerCase()) ||
                rec.Nama.toLowerCase().includes(m.Nama.toLowerCase()))
          );

          if (foundMountain) {
            mountainId = foundMountain.Id;
            // Use the image URL from gunung_indonesia.json if available
            if (
              foundMountain.Gambar &&
              foundMountain.Gambar.startsWith("http")
            ) {
              imageUrl = foundMountain.Gambar;
            }
            // Format location as "Kabupaten, Provinsi" to match other sections
            if (foundMountain.Kabupaten && foundMountain.Provinsi) {
              locationDisplay = `${foundMountain.Kabupaten}, ${foundMountain.Provinsi}`;
            } else if (foundMountain.Provinsi) {
              locationDisplay = foundMountain.Provinsi;
            }
          }
        } catch (error) {
          console.warn(
            "Could not load gunung_indonesia.json for image mapping:",
            error
          );
        }

        return {
          id: mountainId,
          name: rec.Nama,
          location: locationDisplay,
          altitude: rec["Ketinggian (dpl)"],
          mainImage: imageUrl,
          access: rec.Akses || "Tidak Diketahui",
        };
      });

      // Update header text
      if (resultsTitle) {
        resultsTitle.textContent = "Rekomendasi Gunung untuk Anda";
      }
      if (resultsSubtitle) {
        resultsSubtitle.textContent = `Ditemukan ${recommendations.length} gunung yang sesuai dengan preferensi Anda`;
      }

      // Render recommendation cards
      recommendationCards.innerHTML =
        this.renderRecommendationCards(mountainsForCards);

      // Show the results section
      resultsSection.style.display = "block";

      // Scroll to results section smoothly
      setTimeout(() => {
        resultsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      // No recommendations found
      if (resultsTitle) {
        resultsTitle.textContent = "Tidak Ada Rekomendasi";
      }
      if (resultsSubtitle) {
        resultsSubtitle.textContent =
          "Tidak ada gunung yang cocok dengan kriteria Anda. Coba ubah preferensi lokasi atau ketinggian.";
      }

      recommendationCards.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🏔️</div>
          <h3 style="color: #00381f; margin-bottom: 1rem;">Pencarian Tidak Ditemukan</h3>
          <p>Coba dengan lokasi atau ketinggian yang berbeda untuk mendapatkan rekomendasi.</p>
        </div>
      `;

      // Show the results section
      resultsSection.style.display = "block";

      // Scroll to results section smoothly
      setTimeout(() => {
        resultsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }

    // Setup back button event
    this.setupBackToHomeButton();
  }
  /**
   * Render recommendation cards with special styling and clickable links
   * @param {Array} mountains - Array of mountain data
   */ renderRecommendationCards(mountains) {
    return mountains
      .map((mountain) => {
        // Handle both URL images from gunung_indonesia.json and local images
        let imageUrl;
        if (mountain.mainImage && mountain.mainImage.startsWith("http")) {
          // Use external URL directly
          imageUrl = mountain.mainImage;
        } else {
          // Use local image from assets
          imageUrl = require("../assets/images/" + mountain.mainImage);
        }

        const accessBadge =
          mountain.access === "Buka"
            ? '<span style="background: #28a745; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">Buka</span>'
            : '<span style="background: #dc3545; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">Tutup</span>';
        return `            
        <article class="card" data-id="${mountain.id}">
          <a href="#/mountain/${mountain.id}" class="card-link">
            <div style="position: relative;">
              <img src="${imageUrl}" alt="Pemandangan ${mountain.name}" 
                  onerror="this.src='${require("../assets/images/bromo.jpg")}'" />
              <div style="position: absolute; top: 8px; right: 8px;">
                ${accessBadge}
              </div>
            </div>
            <div class="card-content">
              <h3>${mountain.name}</h3>
              <p>${mountain.location}</p>
              <p class="altitude">${mountain.altitude} mdpl</p>
            </div>
          </a>
        </article>
        `;
      })
      .join("");
  }
  /**
   * Setup back to home button functionality
   */
  setupBackToHomeButton() {
    const backBtn = document.getElementById("backToDefaultBtn");
    if (backBtn) {
      // Remove previous event listeners to avoid duplicates
      backBtn.removeEventListener("click", this.handleBackToHome);

      // Add new event listener
      this.handleBackToHome = () => {
        this.hideRecommendations();
      };

      backBtn.addEventListener("click", this.handleBackToHome);
    }
  }

  /**
   * Hide recommendation results and return to default view
   */
  hideRecommendations() {
    const resultsSection = document.getElementById("rekomendasiResults");
    if (resultsSection) {
      resultsSection.style.display = "none";
    }

    // Scroll back to top of recommendations form
    const rekomendasiSection = document.querySelector(".rekomendasi-section");
    if (rekomendasiSection) {
      rekomendasiSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
}
