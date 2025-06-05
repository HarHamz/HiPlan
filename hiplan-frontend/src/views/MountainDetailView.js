export class MountainDetailView {
  constructor() {
    this.app = document.getElementById("app");
  }
  render(mountain, presenter = null) {
    this.currentMountain = mountain;
    this.presenter = presenter;
    this.app.innerHTML = `
      <header>
        <nav-bar></nav-bar>
      </header>      
      <main class="mountain-detail">
      <section class="mountain-tabs">
          <div class="tabs-container">
            <a href="#section-ikhtisar" class="tab active" data-section="section-ikhtisar">Ikhtisar</a>
            <a href="#section-cuaca" class="tab" data-section="section-cuaca">Cuaca</a>
            <a href="#section-jalur" class="tab" data-section="section-jalur">Jalur</a>
            <a href="#section-ulasan" class="tab" data-section="section-ulasan">Ulasan</a>
            <a href="#section-area-sekitar" class="tab" data-section="section-area-sekitar">Area Sekitar</a>
          </div>
        </section>

        
        </section>

        <!-- Render semua konten tab secara berurutan -->
        <div id="section-ikhtisar" class="section-container">
          ${this.renderIkhtisarTab(mountain)}
        </div>
        <div id="section-cuaca" class="section-container">
          ${this.renderCuacaTab(mountain)}
        </div>
        <div id="section-jalur" class="section-container">
          ${this.renderJalurTab(mountain)}
        </div>        <div id="section-ulasan" class="section-container">
          ${this.renderUlasanTab(mountain)}
        </div>        <div id="section-area-sekitar" class="section-container">
          ${this.renderAreaSekitarTab(mountain)}
        </div>
      </main>

      <footer-component></footer-component>
    `;

    this.setupNavbarBehavior();
    this.bindEvents();
  }

  setupNavbarBehavior() {
    // Tunggu sebentar untuk memastikan custom element sudah loaded
    setTimeout(() => {
      const navBar = document.querySelector("nav-bar");
      const mountainTabs = document.querySelector(".mountain-tabs");

      if (navBar) {
        // Hapus sticky dari navbar global
        navBar.style.setProperty("--navbar-position", "static");
      }

      if (mountainTabs) {
        // sticky mountain tabs
        mountainTabs.style.position = "sticky";
        mountainTabs.style.top = "0";
        mountainTabs.style.zIndex = "999";
        mountainTabs.style.backgroundColor = "white";
      }
    }, 100);
  }

  renderIkhtisarTab(mountain) {
    return `
    
      <section class="mountain-header">
          <h1> ${mountain.name}</h1>
          <p class="mountain-info">${mountain.ulasan} Ulasan - ${
      mountain.location
    }</p>
      <div class="mountain-content-container">
        <div class="mountain-image-wrapper">
          <section class="mountain-gallery">
            <div class="main-image">
              <img src="${require("../assets/images/" +
                mountain.mainImage)}" alt="${
      mountain.name
    }" class="main-photo" />
            </div>
          </section>
        </div>

        <section class="mountain-details">
          <div class="mountain-description">
            <h3>${mountain.name} - ${mountain.altitude} mdpl</h3>
            <p>${mountain.description}</p>
          </div>
        </section>
      </div>
    `;
  }
  renderCuacaTab(mountain) {
    // Generate tanggal real-time untuk 6 hari (hari ini + 5 hari ke depan)
    const today = new Date();
    const dayNames = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ags",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    // Data cuaca tetap sama, hanya tanggal yang berubah
    const weatherData = [
      {
        weather: "cerah",
        icon: "bi-sun",
        desc: "Cerah",
        temp: "22°",
        wind: "8 kph",
        precip: "10%",
        humid: "40%",
      },
      {
        weather: "badai",
        icon: "bi-cloud-lightning-rain",
        desc: "Badai",
        temp: "12°",
        wind: "25 kph",
        precip: "90%",
        humid: "80%",
      },
      {
        weather: "hujan",
        icon: "bi-cloud-rain",
        desc: "Hujan",
        temp: "17°",
        wind: "15 kph",
        precip: "70%",
        humid: "60%",
      },
      {
        weather: "berawan",
        icon: "bi-cloud",
        desc: "Berawan",
        temp: "18°",
        wind: "10 kph",
        precip: "30%",
        humid: "50%",
      },
      {
        weather: "cerah",
        icon: "bi-sun",
        desc: "Cerah",
        temp: "22°",
        wind: "6 kph",
        precip: "5%",
        humid: "30%",
      },
      {
        weather: "berawan",
        icon: "bi-cloud",
        desc: "Berawan",
        temp: "18°",
        wind: "12 kph",
        precip: "25%",
        humid: "40%",
      },
    ];

    return `
    <section class="cuaca-section">
      <div class="cuaca-container">
        <h2>CUACA</h2>
        <!--<p class="weather-instruction">Klik pada kartu cuaca untuk melihat bagaimana kondisi cuaca mempengaruhi tingkat kesulitan pendakian</p>-->

        <div class="weather-forecast">
          ${weatherData
            .map((data, index) => {
              const currentDate = new Date(today);
              currentDate.setDate(today.getDate() + index);
              const dayName = dayNames[currentDate.getDay()];
              const dateNumber = currentDate.getDate();
              const monthName = monthNames[currentDate.getMonth()];
              const year = currentDate.getFullYear();

              return `
              <div class="forecast-card clickable-weather" data-weather="${data.weather}" data-day="${dayName}">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-date">${dateNumber} ${monthName} ${year}</div>
                <div class="forecast-icon">
                  <i class="bi ${data.icon}"></i>
                </div>
                <div class="forecast-temp">${data.temp}</div>
                <div class="forecast-desc">${data.desc}</div>
                <div class="forecast-details">
                  <div class="forecast-wind"><i class="bi bi-wind"></i> ${data.wind}</div>
                  <div class="forecast-precip"><i class="bi bi-cloud-rain-heavy"></i> ${data.precip}</div>
                  <div class="forecast-humid"><i class="bi bi-droplet"></i> ${data.humid}</div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    </section>
  `;
  }

  renderJalurTab(mountain) {
    return `
      <section class="jalur-section">
        <div class="jalur-container">
          <h2>JALUR PENDAKIAN</h2>
          <div class="jalur-info-card">
            <div class="jalur-status">
              <div class="status-header">
                <i class="bi bi-sign-turn-right"></i>
                <h3>Status Jalur</h3>
              </div>
              <span class="status open">${
                mountain.access || "Tidak Tersedia"
              }</span>
            </div>

            <div class="jalur-main-info">
              <div class="jalur-detail-item">
                <div class="detail-icon">
                  <i class="bi bi-signpost-split"></i>
                </div>
                <div class="detail-info">
                  <h4>Jarak Tempuh</h4>
                  <p>${mountain.distance || "N/A"} km</p>
                </div>
              </div>
              
              <div class="jalur-detail-item">
                <div class="detail-icon">
                  <i class="bi bi-graph-up"></i>
                </div>
                <div class="detail-info">
                  <h4>Kenaikan Elevasi</h4>
                  <p>${mountain.elevationGain || "N/A"} m</p>
                </div>
              </div>

              <div class="jalur-detail-item">
                <div class="detail-icon">
                  <i class="bi bi-clock"></i>
                </div>
                <div class="detail-info">
                  <h4>Estimasi Waktu</h4>
                  <p>-</p>
                </div>
              </div>

                <div class="jalur-detail-item">
                  <div class="detail-icon">
                    <i class="bi bi-bar-chart"></i>
                  </div>
                  <div class="detail-info">
                    <h4>Tingkat Kesulitan</h4>
                    <div class="difficulty-display" id="difficultyDisplay">
                      <span class="difficulty-score" id="difficultyScore">${
                        mountain.difficulty
                      }/10</span>
                    </div>
                  </div>
                </div>
              </div>

              <p class="jalur-description">
                **Silakan memilih tanggal pada bagian cuaca untuk mengetahui estimasi waktu dan tingkat kesulitan
              </p>
            </div>
          </div>

          <div class="jalur-notes">
            <div class="note-header">
              <i class="bi bi-info-circle"></i>
              <h3>Catatan Penting</h3>
            </div>
            <ul class="note-list">
              <li>Pendakian harus mendaftar di pos basecamp</li>
              <li>Wajib membawa kartu identitas</li>
              <li>Bawa perlengkapan pendakian yang memadai</li>
              <li>Saat musim hujan, perhatikan peringatan cuaca</li>
              <li>Dilarang membawa alkohol dan meninggalkan sampah</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  renderUlasanTab(mountain) {
    return `
      <section class="ulasan-section">
        <div class="ulasan-container">
          <h2>ULASAN</h2>
          
          <!-- Review Form -->
          <div class="review-form-card">
            <h3>Tambahkan Ulasan Anda</h3>
            
            <div class="rating-input">
              <p>Berikan penilaian Anda:</p>
              <div class="star-rating">
                <input type="radio" id="star5" name="rating" value="5" />
                <label for="star5"><i class="bi bi-star-fill"></i></label>
                
                <input type="radio" id="star4" name="rating" value="4" />
                <label for="star4"><i class="bi bi-star-fill"></i></label>
                
                <input type="radio" id="star3" name="rating" value="3" />
                <label for="star3"><i class="bi bi-star-fill"></i></label>
                
                <input type="radio" id="star2" name="rating" value="2" />
                <label for="star2"><i class="bi bi-star-fill"></i></label>
                
                <input type="radio" id="star1" name="rating" value="1" />
                <label for="star1"><i class="bi bi-star-fill"></i></label>
              </div>
            </div>
            
            <div class="review-comment">
              <textarea id="reviewComment" placeholder="Bagikan pengalaman pendakian Anda di Gunung ${mountain.name}..."></textarea>
            </div>
            
            <button class="submit-review-btn">Kirim Ulasan</button>
          </div>
          
          <!-- Sample Reviews -->
          <div class="reviews-list">
            <h3>Ulasan Pendaki (${mountain.ulasan})</h3>
            
            <div class="review-card">
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="reviewer-avatar">
                    <i class="bi bi-person-circle"></i>
                  </div>
                  <div class="reviewer-name">
                    <h4>Ahmad Sulaiman</h4>
                    <span class="review-date">Mei 10, 2025</span>
                  </div>
                </div>
                <div class="review-rating">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star"></i>
                  <span>4.0</span>
                </div>
              </div>
              <div class="review-content">
                <p>Pendakian yang menantang tapi sangat memuaskan! Jalur pendakian terawat dengan baik, pemandangan dari puncak sungguh memukau. Saya merekomendasikan untuk membawa jaket tebal karena cukup dingin di malam hari.</p>
              </div>
            </div>
            
            
            <div class="review-card">
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="reviewer-avatar">
                    <i class="bi bi-person-circle"></i>
                  </div>
                  <div class="reviewer-name">
                    <h4>Siti Rahayu</h4>
                    <span class="review-date">April 28, 2025</span>
                  </div>
                </div>
                <div class="review-rating">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <span>5.0</span>
                </div>
              </div>
              <div class="review-content">
                <p>Pengalaman pendakian terbaik! Gunung ${mountain.name} memiliki keindahan alam yang luar biasa. Basecamp sangat terorganisir dan petugas sangat membantu. Sunrise dari puncak adalah momen yang tidak akan pernah saya lupakan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  renderAreaSekitarTab(mountain) {
    // Ambil data gunung terdekat dari presenter
    const nearbyMountains = this.presenter
      ? this.presenter.getNearbyMountains()
      : []; // Fallback jika presenter belum tersedia

    return `
      <section class="area-sekitar-section">
        <div class="area-sekitar-container">
          <h2>AREA SEKITAR</h2>
          <p class="area-description">Jelajahi gunung-gunung lain di sekitar ${
            mountain.name
          } yang mungkin menarik untuk Anda kunjungi.</p>
          
          <div class="nearby-mountains">
            <h3>Gunung Terdekat</h3>
            <div class="card-container">
              ${this.renderMountainCards(nearbyMountains)}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderMountainCards(mountains) {
    if (!mountains || mountains.length === 0) {
      return `<p class="no-mountains">Belum ada data gunung terdekat yang tersedia.</p>`;
    }

    return mountains
      .map((mountain) => {
        const distanceText = mountain.distance
          ? `<p class="distance">~${mountain.distance.toFixed(
              0
            )} km dari sini</p>`
          : "";

        return `            
        <article class="card" data-id="${mountain.id}">
          <a href="#/mountain/${mountain.id}" class="card-link">
            <img src="${require("../assets/images/" +
              mountain.mainImage)}" alt="Pemandangan Gunung ${mountain.name}" />
            <div class="card-content">
              <h3>${mountain.name}</h3>
              <p>${mountain.location}</p>
              <p class="altitude">${mountain.altitude} mdpl</p>
              ${distanceText}
            </div>
          </a>
        </article>
        `;
      })
      .join("");
  }
  bindEvents() {
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionId = tab.getAttribute("data-section");

        // Hapus kelas active
        tabs.forEach((t) => t.classList.remove("active"));

        // Tambahkan kelas active
        tab.classList.add("active");

        // Smooth scroll
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          const tabsHeight =
            document.querySelector(".mountain-tabs").offsetHeight;
          const navbarHeight = document
            .querySelector("nav-bar")
            .shadowRoot.querySelector(".navbar").offsetHeight;
          const offset = tabsHeight + navbarHeight;

          window.scrollTo({
            top: targetSection.offsetTop - offset,
            behavior: "smooth",
          });
        }
      });
    });

    // Check scroll position to highlight active tab
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY + 200;

      // Get all section elements
      const sections = document.querySelectorAll(".section-container");

      // Find the current section in view
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          const sectionId = section.getAttribute("id");

          // Highlight the corresponding tab
          tabs.forEach((tab) => {
            if (tab.getAttribute("data-section") === sectionId) {
              tabs.forEach((t) => t.classList.remove("active"));
              tab.classList.add("active");
            }
          });
        }
      });
    });

    // Setup weather click handlers for interactive difficulty system
    this.setupWeatherClickHandlers();
  }

  setCurrentMountain(mountain) {
    this.currentMountain = mountain;
  }

  // Method untuk update tampilan tingkat kesulitan
  updateDifficultyDisplay(difficulty, description, color, selectedWeather) {
    const difficultyScore = document.getElementById("difficultyScore");
    const difficultyDescription = document.getElementById(
      "difficultyDescription"
    );
    const weatherEffect = document.getElementById("weatherEffect");
    const selectedWeatherText = document.getElementById("selectedWeatherText");

    if (difficultyScore) {
      difficultyScore.textContent = `${difficulty}/10`;
      difficultyScore.style.color = color;
    }

    if (difficultyDescription) {
      difficultyDescription.textContent = description;
      difficultyDescription.style.color = color;
    }

    if (weatherEffect && selectedWeatherText) {
      if (selectedWeather) {
        weatherEffect.style.display = "block";
        selectedWeatherText.textContent = selectedWeather;
      } else {
        weatherEffect.style.display = "none";
      }
    }
  }

  // Method untuk menangani klik pada card cuaca
  setupWeatherClickHandlers() {
    const weatherCards = document.querySelectorAll(".clickable-weather");
    const resetBtn = document.getElementById("resetWeatherBtn");
    const weatherImpactInfo = document.getElementById("weatherImpactInfo");
    const weatherImpactText = document.getElementById("weatherImpactText");

    weatherCards.forEach((card) => {
      card.addEventListener("click", () => {
        const weather = card.getAttribute("data-weather");
        const day = card.getAttribute("data-day");

        // Remove active class from all cards
        weatherCards.forEach((c) => c.classList.remove("active-weather"));

        // Add active class to clicked card
        card.classList.add("active-weather");

        // Show weather impact info
        if (weatherImpactInfo) {
          weatherImpactInfo.style.display = "block";
          weatherImpactText.textContent = this.getWeatherImpactText(
            weather,
            day
          );
        }

        // Notify presenter about weather selection
        if (this.presenter && this.presenter.selectWeather) {
          this.presenter.selectWeather(weather);
        } // Smooth scroll to jalur section to see the effect
        setTimeout(() => {
          const jalurSection = document.getElementById("section-jalur");
          if (jalurSection) {
            jalurSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      });
    });

    // Reset weather selection
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        // Remove active class from all cards
        weatherCards.forEach((c) => c.classList.remove("active-weather"));

        // Hide weather impact info
        if (weatherImpactInfo) {
          weatherImpactInfo.style.display = "none";
        }

        // Reset presenter weather selection
        if (this.presenter && this.presenter.resetWeatherSelection) {
          this.presenter.resetWeatherSelection();
        }
      });
    }
  }

  // Method untuk mendapatkan teks dampak cuaca
  getWeatherImpactText(weather, day) {
    const impactTexts = {
      cerah: `Cuaca cerah pada hari ${day} memberikan kondisi ideal untuk pendakian. Jarak pandang yang baik dan jalur yang kering membuat pendakian lebih aman dan mudah.`,
      berawan: `Cuaca berawan pada hari ${day} menambah sedikit tantangan. Suhu lebih sejuk namun kemungkinan hujan ringan dapat membuat jalur licin.`,
      hujan: `Hujan pada hari ${day} significantly meningkatkan tingkat kesulitan. Jalur menjadi licin dan berlumpur, jarak pandang terbatas, dan risiko hipotermia meningkat.`,
      badai: `Badai pada hari ${day} sangat berbahaya untuk pendakian! Angin kencang, hujan deras, dan risiko petir membuat pendakian sangat berisiko. Disarankan untuk menunda pendakian.`,
    };
    return impactTexts[weather] || "Informasi dampak cuaca tidak tersedia.";
  }
}
