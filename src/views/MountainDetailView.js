export class MountainDetailView {
  constructor() {
    this.app = document.getElementById("app");
    this.weatherData = [];
  }

  // Tambahkan di sini!
  mapConditionToDesc(conditions) {
    if (!conditions) return "Cerah";
    const codes = conditions.split(",").map((c) => c.trim());
    const mapping = {
      type_21: "Hujan",
      type_22: "Sebagian Berawan",
      type_23: "Berawan",
      type_24: "Hujan Ringan",
      type_41: "Mendung",
      type_42: " Sebagian Berawan",
      // dst...
    };
    return codes.map((code) => mapping[code] || code).join(", ");
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

        <!-- Render semua konten tab secara berurutan -->
        <div id="section-ikhtisar" class="section-container">
          ${this.renderIkhtisarTab(mountain)}
        </div>
        <div id="section-cuaca" class="section-container">
          <div class="cuaca-loading">Memuat data cuaca...</div>
        </div>
        <div id="section-jalur" class="section-container">
          ${this.renderJalurTab(mountain)}
        </div>
        <div id="section-ulasan" class="section-container">
          ${this.renderUlasanTab(mountain)}
        </div>
        <div id="section-area-sekitar" class="section-container">
          ${this.renderAreaSekitarTab(mountain)}
        </div>
      </main>
      <footer-component></footer-component>
    `;

    this.setupNavbarBehavior();
    this.bindEvents();

    // Render tab cuaca secara async setelah render utama
    this.renderCuacaTabAsync(mountain);
  }

  async renderCuacaTabAsync(mountain) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/mountains/${mountain.id}/weather`
      );
      const weatherData = await response.json();
      this.weatherData = weatherData.slice(0, 7).map((data) => ({
        temp: data.temp,
        humidity: data.humidity,
        precipprob: data.precipprob,
        windspeed: data.windspeed,
        desc: this.mapConditionToDesc(data.conditions), // gunakan mapping!
        wind: data.windspeed + " km/jam",
        humid: data.humidity + " %",
        precip: data.precipprob + " %",
        icon: getWeatherIcon(data.conditions),
        weather: data.conditions,
      }));

      // Tambahkan fungsi mapping icon cuaca
      function getWeatherIcon(conditions) {
        if (!conditions) return "bi-cloud";
        const c = conditions.toLowerCase();
        if (c.includes("hujan")) return "bi-cloud-rain";
        if (c.includes("badai")) return "bi-cloud-lightning-rain";
        if (c.includes("cerah")) return "bi-sun";
        if (c.includes("berawan")) return "bi-cloud";
        return "bi-cloud";
      }

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

      const html = `
        <section class="cuaca-section">
          <div class="cuaca-container">
            <h2>CUACA</h2>
            <div class="weather-forecast">
              ${this.weatherData
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
                    <div class="forecast-details-vertical">
                      <div class="forecast-detail"><i class="bi bi-wind"></i> ${data.wind}</div>
                      <div class="forecast-detail-row">
                        <div class="forecast-detail"><i class="bi bi-cloud-rain-heavy"></i> ${data.precip}</div>
                        <div class="forecast-detail"><i class="bi bi-droplet"></i> ${data.humid}</div>
                      </div>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>
        </section>
      `;
      document.getElementById("section-cuaca").innerHTML = html;
      this.setupWeatherClickHandlers();
      console.log(weatherData);
    } catch (err) {
      document.getElementById("section-cuaca").innerHTML =
        "<p style='color:red'>Gagal memuat data cuaca.</p>";
    }
  }

  setupNavbarBehavior() {
    setTimeout(() => {
      const navBar = document.querySelector("nav-bar");
      const mountainTabs = document.querySelector(".mountain-tabs");

      if (navBar) {
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
              <img src="${
                mountain.mainImage && mountain.mainImage.startsWith("http")
                  ? mountain.mainImage
                  : require("../assets/images/" + mountain.mainImage)
              }" 
                alt="${mountain.name}" 
                class="main-photo" 
                onerror="this.src='${require("../assets/images/bromo.jpg")}'" />
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
  async renderCuacaTab(mountain) {
    // Ambil data cuaca dari backend
    const response = await fetch(
      `http://localhost:3001/api/mountains/${mountain.id}/weather`
    );
    const weatherData = await response.json();

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
                <div class="forecast-details-vertical">
                  <div class="forecast-detail"><i class="bi bi-wind"></i> ${data.wind}</div>
                  <div class="forecast-detail-row">
                    <div class="forecast-detail"><i class="bi bi-cloud-rain-heavy"></i> ${data.precip}</div>
                    <div class="forecast-detail"><i class="bi bi-droplet"></i> ${data.humid}</div>
                  </div>
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
                  <p id="estimatedTime">-</p>
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
    const nearbyMountains = this.presenter
      ? this.presenter.getNearbyMountains()
      : [];

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
            <img src="${
              mountain.mainImage && mountain.mainImage.startsWith("http")
                ? mountain.mainImage
                : require("../assets/images/" + mountain.mainImage)
            }" 
              alt="Pemandangan Gunung ${mountain.name}" 
              onerror="this.src='${require("../assets/images/bromo.jpg")}'" />
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

        tabs.forEach((t) => t.classList.remove("active"));

        tab.classList.add("active");

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

    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY + 200;

      const sections = document.querySelectorAll(".section-container");

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          const sectionId = section.getAttribute("id");

          tabs.forEach((tab) => {
            if (tab.getAttribute("data-section") === sectionId) {
              tabs.forEach((t) => t.classList.remove("active"));
              tab.classList.add("active");
            }
          });
        }
      });
    });

    this.setupWeatherClickHandlers();
  }

  setCurrentMountain(mountain) {
    this.currentMountain = mountain;
  }

  // Method untuk update tampilan tingkat kesulitan
  updateDifficultyDisplay(
    difficulty,
    description,
    color,
    selectedWeather,
    estimatedTime
  ) {
    const difficultyScore = document.getElementById("difficultyScore");
    const difficultyDescription = document.getElementById(
      "difficultyDescription"
    );
    const weatherEffect = document.getElementById("weatherEffect");
    const selectedWeatherText = document.getElementById("selectedWeatherText");
    const estimatedTimeElem = document.getElementById("estimatedTime");

    if (difficultyScore) {
      difficultyScore.textContent = `${difficulty}/10`;
      difficultyScore.style.color = color;
    }

    if (difficultyDescription) {
      difficultyDescription.textContent = description;
      difficultyDescription.style.color = color;
    }

    if (estimatedTimeElem && estimatedTime) {
      estimatedTimeElem.textContent = estimatedTime;
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
    weatherCards.forEach((card, idx) => {
      card.addEventListener("click", async () => {
        // Hapus class 'selected' dari semua card
        weatherCards.forEach((c) => c.classList.remove("selected"));
        // Tambahkan class 'selected' ke card yang diklik
        card.classList.add("selected");

        // Ambil data cuaca dari atribut/data
        const weather = this.weatherData[idx];
        // Kirim ke backend untuk prediksi
        const response = await fetch(
          `http://localhost:3001/api/mountains/${this.currentMountain.id}/predict-difficulty`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              temp: weather.temp,
              humidity: weather.humidity,
              precipprob: weather.precipprob,
              windspeed: weather.windspeed,
            }),
          }
        );
        const prediction = await response.json();
        this.updateDifficultyDisplay(
          prediction.difficulty,
          prediction.description,
          prediction.color,
          weather.conditions,
          prediction.estimated_time
        );
      });
    });
  }
}
