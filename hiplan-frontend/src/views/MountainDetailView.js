import authManager from "../utils/auth.js";
import WeatherMLService from "../utils/WeatherMLService.js";
import VisualCrossingService from "../utils/VisualCrossingService.js";
import DifficultyPredictionService from "../utils/DifficultyPredictionService.js";

export class MountainDetailView {
  constructor() {
    this.app = document.getElementById("app");
    this.authManager = authManager;
    this.weatherData = null; // Store fetched weather data
    this.selectedWeatherCard = null; // Store selected weather card for prediction
    this.difficultyPrediction = null; // Store difficulty prediction result
  }
  render(mountain, presenter = null) {
    // Check authentication first
    if (!this.authManager.isAuthenticated()) {
      sessionStorage.setItem(
        "loginMessage",
        "Anda harus login terlebih dahulu untuk melihat detail gunung."
      );
      window.location.hash = "#login";
      return;
    }

    this.currentMountain = mountain;
    this.presenter = presenter;

    // Initialize weather data loading
    this.loadWeatherData();

    this.app.innerHTML = `
      <header>
        <nav-bar></nav-bar>
      </header>      
      <main class="mountain-detail">      <section class="mountain-tabs">
          <div class="tabs-container">
            <a href="#section-ikhtisar" class="tab active" data-section="section-ikhtisar">Ikhtisar</a>
            <a href="#section-cuaca" class="tab" data-section="section-cuaca">Cuaca</a>
            <a href="#section-jalur" class="tab" data-section="section-jalur">Jalur</a>
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
        </div>        <div id="section-jalur" class="section-container">
          ${this.renderJalurTab(mountain)}
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
          <p class="mountain-info">${mountain.location}</p>
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
      </div>    `;
  }
  /**
   * Load weather data from Visual Crossing API
   */
  async loadWeatherData() {
    try {
      // Get location for weather data
      const kecamatanName = this.extractKecamatanFromMountain(
        this.currentMountain
      );

      if (!kecamatanName) {
        throw new Error("Could not determine location for weather data");
      } // Fetch weather data from Visual Crossing API only
      const weatherResult = await VisualCrossingService.getDailyForecast(
        kecamatanName,
        7
      );

      if (!weatherResult.success || weatherResult.days.length === 0) {
        throw new Error(
          `Failed to load weather data: ${
            weatherResult.error || "No data available"
          }`
        );
      }

      // Format data from Visual Crossing API
      this.weatherData = VisualCrossingService.formatWeatherForCards(
        weatherResult.days
      );

      // Update the weather display
      this.updateWeatherDisplay();
    } catch (error) {
      // Show error message to user instead of fallback data
      this.showWeatherError(error.message);
    }
  }

  /**
   * Update weather display with loaded data
   */
  updateWeatherDisplay() {
    const weatherForecastContainer =
      document.querySelector(".weather-forecast");
    if (weatherForecastContainer && this.weatherData) {
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

      const weatherCardsHTML = this.weatherData
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
        .join("");
      weatherForecastContainer.innerHTML = weatherCardsHTML;

      // Re-bind weather click handlers after weather data is loaded
      this.setupWeatherClickHandlers();
    }
  }
  renderCuacaTab(mountain) {
    return `
    <section class="cuaca-section">
      <div class="cuaca-container">
        <h2>CUACA</h2>
        <!--<p class="weather-instruction">Klik pada kartu cuaca untuk melihat bagaimana kondisi cuaca mempengaruhi tingkat kesulitan pendakian</p>-->

        <div class="weather-forecast">
          <div class="weather-loading-state">
            <div class="loading-spinner">🌤️</div>
            <h3>Memuat Data Cuaca Real-time</h3>
            <p>Mengambil data cuaca dari Visual Crossing API...</p>
            <div class="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        </div>
        </div>        <!-- Weather Prediction Section -->
        <div class="weather-prediction-section">
          <div class="weather-prediction-header">
            <span class="weather-icon">🌤️</span>
            <h3>Prediksi Kecenderungan Cuaca Bulanan</h3>
          </div>
          
          <div class="month-selector">
            <select id="month-select" class="month-dropdown">
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
            
            <input type="number" id="year-input" class="year-input" min="2025" max="2030" value="2025" placeholder="Tahun">
            
            <button id="get-weather-prediction-btn" class="prediction-btn">Lihat Prediksi</button>
          </div>

          <div id="weather-prediction-result" class="weather-prediction-result" style="display: none;">
            <!-- Results will be inserted here -->
          </div>
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
                      <span class="difficulty-score" id="difficultyScore">-</span>
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
            document.querySelector(".mountain-tabs")?.offsetHeight || 0;

          // Safely get navbar height with proper null checks
          let navbarHeight = 0;
          try {
            const navbarElement = document.querySelector("nav-bar");
            if (navbarElement && navbarElement.shadowRoot) {
              const navbarInner =
                navbarElement.shadowRoot.querySelector(".navbar");
              navbarHeight = navbarInner?.offsetHeight || 70; // fallback to 70px
            } else {
              navbarHeight = 70; // default navbar height
            }
          } catch (error) {
            navbarHeight = 70; // fallback
          }

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
    this.setupWeatherPrediction();
  }

  setCurrentMountain(mountain) {
    this.currentMountain = mountain;
  }

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
  setupWeatherClickHandlers() {
    const weatherCards = document.querySelectorAll(".clickable-weather");
    const weatherImpactInfo = document.getElementById("weatherImpactInfo");
    const weatherImpactText = document.getElementById("weatherImpactText");

    weatherCards.forEach((card, index) => {
      card.addEventListener("click", async () => {
        const weather = card.getAttribute("data-weather");
        const day = card.getAttribute("data-day");

        weatherCards.forEach((c) => c.classList.remove("active-weather"));
        card.classList.add("active-weather"); // Store selected weather card data
        if (this.weatherData && this.weatherData[index]) {
          this.selectedWeatherCard = this.weatherData[index];

          // Predict difficulty and time
          await this.predictDifficultyForSelectedWeather();
        }

        if (weatherImpactInfo) {
          weatherImpactInfo.style.display = "block";
          weatherImpactText.textContent = this.getWeatherImpactText(
            weather,
            day
          );
        }

        if (this.presenter && this.presenter.selectWeather) {
          this.presenter.selectWeather(weather);
        }

        setTimeout(() => {
          const jalurSection = document.getElementById("section-jalur");
          if (jalurSection) {
            jalurSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      });
    });
  }

  /**
   * Setup weather prediction functionality
   */
  setupWeatherPrediction() {
    const predictionBtn = document.getElementById("get-weather-prediction-btn");
    const monthSelect = document.getElementById("month-select");
    const yearInput = document.getElementById("year-input");
    const resultContainer = document.getElementById(
      "weather-prediction-result"
    );
    if (!predictionBtn || !monthSelect || !yearInput || !resultContainer) {
      return;
    }

    // Set default values
    const currentDate = new Date();
    monthSelect.value = (currentDate.getMonth() + 1).toString();
    yearInput.value = currentDate.getFullYear().toString();

    predictionBtn.addEventListener("click", async () => {
      const selectedMonth = parseInt(monthSelect.value);
      const selectedYear = parseInt(yearInput.value);

      // Validate inputs
      if (!selectedMonth || !selectedYear) {
        alert("Pilih bulan dan tahun terlebih dahulu");
        return;
      }

      if (selectedYear < 2025 || selectedYear > 2030) {
        alert("Tahun harus antara 2025-2030");
        return;
      }

      // Show loading state
      predictionBtn.disabled = true;
      predictionBtn.textContent = "Memuat prediksi...";
      resultContainer.style.display = "block";
      resultContainer.innerHTML =
        '<div class="weather-loading">Mengambil prediksi cuaca...</div>';

      try {
        // Get district name from current mountain (must match Streamlit exactly)
        const kecamatanName = this.extractKecamatanFromMountain(
          this.currentMountain
        );

        if (!kecamatanName) {
          throw new Error(
            `Tidak dapat menentukan lokasi kecamatan dari data gunung. Pastikan data gunung memiliki field 'kecamatan' atau 'Kecamatan'. Mountain: ${this.currentMountain.name}`
          );
        }

        // Get seasonality prediction only (match Streamlit behavior)
        const seasonalityResult =
          await WeatherMLService.getSeasonalityPrediction(
            kecamatanName,
            selectedMonth,
            selectedYear
          );

        if (seasonalityResult.success) {
          this.displayWeatherPredictionResult(
            seasonalityResult.data,
            null, // No monthly data, only seasonality
            selectedMonth,
            selectedYear,
            kecamatanName
          );
        } else {
          throw new Error(
            seasonalityResult.message || "Gagal mendapatkan prediksi cuaca"
          );
        }
      } catch (error) {
        resultContainer.innerHTML = `
          <div class="weather-error">
            <h4>⚠️ Gagal Mendapatkan Prediksi</h4>
            <p>${error.message}</p>
            <p><em>Pastikan koneksi internet stabil dan server ML sedang berjalan.</em></p>
          </div>
        `;
      } finally {
        // Reset button state
        predictionBtn.disabled = false;
        predictionBtn.textContent = "Lihat Prediksi";
      }
    });
  }
  /**
   * Extract kecamatan name from mountain data - MUST match Streamlit exactly
   */
  extractKecamatanFromMountain(mountain) {
    if (!mountain) {
      return null;
    }

    // Priority 1: Use actual kecamatan data from JSON (same as Streamlit should use)
    if (mountain.kecamatan && mountain.kecamatan.trim() !== "") {
      const kecamatanLowercase = mountain.kecamatan.toLowerCase();
      return kecamatanLowercase;
    }

    // Priority 2: Use Kecamatan field with capital K (alternative field name)
    if (mountain.Kecamatan && mountain.Kecamatan.trim() !== "") {
      const kecamatanLowercase = mountain.Kecamatan.toLowerCase();
      return kecamatanLowercase;
    }

    // Return null to force error rather than using inconsistent fallback
    // This will help identify when web app and Streamlit might use different kecamatan names
    return null;
  }

  /**
   * Display weather prediction result
   */
  displayWeatherPredictionResult(
    seasonalityData,
    monthlyData,
    month,
    year,
    kecamatan
  ) {
    const resultContainer = document.getElementById(
      "weather-prediction-result"
    );
    const monthName = WeatherMLService.getMonthName(month);
    const seasonality = WeatherMLService.formatSeasonality(
      seasonalityData.analysis?.determined_seasonality ||
        seasonalityData.determined_seasonality ||
        seasonalityData.seasonality
    );
    const html = `
      <div class="weather-prediction-simple">
        <h3>Hasil Prediksi - ${monthName} ${year}</h3>
        
        <div class="weather-summary">
          <h4>Rata - Rata Parameter Cuaca:</h4>
          <div class="weather-params-grid">
            <div class="weather-param">
              <span class="param-label">Suhu Cuaca (°C)</span>
              <span class="param-value">${(
                seasonalityData.analysis?.reasoning_metrics?.average_temp ||
                monthlyData.reasoning_metrics?.average_temp ||
                monthlyData.avg_temp ||
                monthlyData.temperature ||
                0
              ).toFixed(2)}°C</span>
            </div>
            <div class="weather-param">
              <span class="param-label">Kecepatan Angin</span>
              <span class="param-value">${(
                seasonalityData.analysis?.reasoning_metrics
                  ?.average_windspeed ||
                monthlyData.reasoning_metrics?.average_windspeed ||
                monthlyData.avg_windspeed ||
                monthlyData.windspeed ||
                0
              ).toFixed(2)} km/h</span>
            </div>
            <div class="weather-param">
              <span class="param-label">Probabilitas Hujan (%)</span>
              <span class="param-value">${(
                seasonalityData.analysis?.reasoning_metrics
                  ?.average_precipprob ||
                monthlyData.reasoning_metrics?.average_precipprob ||
                monthlyData.avg_precipprob ||
                monthlyData.precipitation_probability ||
                0
              ).toFixed(2)} %</span>
            </div>
            <div class="weather-param">
              <span class="param-label">Kelembapan (%)</span>
              <span class="param-value">${(
                seasonalityData.analysis?.reasoning_metrics?.average_humidity ||
                monthlyData.reasoning_metrics?.average_humidity ||
                monthlyData.avg_humidity ||
                monthlyData.humidity ||
                0
              ).toFixed(2)} %</span>
            </div>
          </div>        </div>

        <div class="weather-prediction-tendency">
          <h4>Kecenderungan Cuaca: <span class="tendency-result">${
            seasonality.label
          }</span></h4>
        </div>
      </div>
    `;

    resultContainer.innerHTML = html;
  }

  /**
   * Get weather-based hiking recommendation
   */ getWeatherRecommendation(seasonality, seasonalityData) {
    // Normalize seasonality value
    const normalizedSeasonality = seasonality ? seasonality.toLowerCase() : "";

    if (normalizedSeasonality === "hujan") {
      const precipProb =
        seasonalityData.analysis?.reasoning_metrics?.average_precipprob ||
        seasonalityData.reasoning_metrics?.average_precipprob ||
        seasonalityData.avg_precipprob ||
        0;
      const humidity =
        seasonalityData.analysis?.reasoning_metrics?.average_humidity ||
        seasonalityData.reasoning_metrics?.average_humidity ||
        seasonalityData.avg_humidity ||
        0;
      return `Bulan ini cenderung hujan dengan probabilitas ${precipProb.toFixed(
        1
      )}% dan kelembapan ${humidity.toFixed(
        1
      )}%. Siapkan perlengkapan anti hujan yang memadai, sepatu dengan grip baik, dan pertimbangkan untuk menunda pendakian jika kondisi cuaca ekstrem.`;
    } else if (normalizedSeasonality === "cerah") {
      const avgTemp =
        seasonalityData.analysis?.reasoning_metrics?.average_temp ||
        seasonalityData.reasoning_metrics?.average_temp ||
        seasonalityData.avg_temp ||
        0;
      return `Bulan ini cenderung cerah dengan suhu rata-rata ${avgTemp.toFixed(
        1
      )}°C. Kondisi baik untuk pendakian, namun tetap bawa perlengkapan cadangan dan perhatikan hidrasi karena suhu yang relatif hangat.`;
    } else {
      return `Data cuaca menunjukkan kondisi bervariasi. Siapkan perlengkapan untuk berbagai kondisi cuaca dan pantau prakiraan cuaca terkini sebelum melakukan pendakian.`;
    }
  }

  /**
   * Get weather impact text for selected weather condition
   */
  getWeatherImpactText(weather, day) {
    const weatherImpacts = {
      cerah: `Cuaca cerah pada hari ${day} memberikan kondisi ideal untuk pendakian. Visibility baik, jalur kering, dan risiko minimal. Pastikan membawa perlindungan dari sinar matahari.`,
      berawan: `Cuaca berawan pada hari ${day} memberikan kondisi cukup baik untuk pendakian. Suhu lebih sejuk, namun tetap waspada terhadap kemungkinan perubahan cuaca mendadak.`,
      hujan: `Cuaca hujan pada hari ${day} meningkatkan tingkat kesulitan pendakian. Jalur licin, visibility terbatas, dan risiko hipotermia. Gunakan perlengkapan anti hujan yang memadai.`,
      badai: `Cuaca badai pada hari ${day} sangat berbahaya untuk pendakian. Tingkat kesulitan meningkat drastis. Disarankan untuk menunda pendakian atau mencari hari alternatif.`,
    };

    return (
      weatherImpacts[weather] ||
      `Kondisi cuaca ${weather} pada hari ${day} mempengaruhi tingkat kesulitan pendakian. Selalu persiapkan perlengkapan yang sesuai dengan kondisi cuaca.`
    );
  }

  /**
   * Show weather error when Visual Crossing API fails
   */
  showWeatherError(errorMessage) {
    const weatherForecastContainer =
      document.querySelector(".weather-forecast");
    if (weatherForecastContainer) {
      weatherForecastContainer.innerHTML = `
        <div class="weather-api-error">
          <div class="error-icon">⚠️</div>
          <h3>Gagal Memuat Data Cuaca</h3>
          <p>Tidak dapat mengambil data cuaca dari Visual Crossing API.</p>
          <p class="error-detail">Error: ${errorMessage}</p>
          <p class="error-suggestion">Pastikan koneksi internet stabil dan coba refresh halaman.</p>
          <button class="retry-weather-btn" onclick="location.reload()">Coba Lagi</button>
        </div>
      `;
    }
  }

  /**
   * Predict difficulty and time for selected weather
   */ async predictDifficultyForSelectedWeather() {
    if (!this.selectedWeatherCard || !this.currentMountain) {
      return;
    }

    try {
      // Show loading state in difficulty display
      this.updateDifficultyDisplayLoading();

      // Parse weather data for prediction
      const weatherData = DifficultyPredictionService.parseWeatherForPrediction(
        this.selectedWeatherCard
      );

      // Make prediction
      const predictionResult =
        await DifficultyPredictionService.predictDifficulty(
          this.currentMountain,
          weatherData
        );
      if (predictionResult.success) {
        this.difficultyPrediction = predictionResult.data;
        this.updateDifficultyDisplayWithPrediction();
      } else {
        this.updateDifficultyDisplayError(predictionResult.error);
      }
    } catch (error) {
      this.updateDifficultyDisplayError(error.message);
    }
  }

  /**
   * Update difficulty display with loading state
   */
  updateDifficultyDisplayLoading() {
    const difficultyScore = document.getElementById("difficultyScore");
    const estimatedTimeElement = document.querySelector(
      ".jalur-detail-item:nth-child(3) p"
    );

    if (difficultyScore) {
      difficultyScore.innerHTML =
        '<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
      difficultyScore.style.color = "#666";
    }

    if (estimatedTimeElement) {
      estimatedTimeElement.innerHTML =
        '<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
    }
  }

  /**
   * Update difficulty display with prediction results
   */
  updateDifficultyDisplayWithPrediction() {
    if (!this.difficultyPrediction) return;

    const difficultyScore = document.getElementById("difficultyScore");
    const estimatedTimeElement = document.querySelector(
      ".jalur-detail-item:nth-child(3) p"
    );
    const jalurDescription = document.querySelector(".jalur-description");

    const score = this.difficultyPrediction.difficulty_score;
    const time = this.difficultyPrediction.estimated_time;
    const color = DifficultyPredictionService.getDifficultyColor(score);
    const description =
      DifficultyPredictionService.getDifficultyDescription(score);

    if (difficultyScore) {
      difficultyScore.textContent = `${score}/10`;
      difficultyScore.style.color = color;
    }

    if (estimatedTimeElement) {
      estimatedTimeElement.textContent = time;
      estimatedTimeElement.style.color = color;
      estimatedTimeElement.style.fontWeight = "bold";
    }

    if (jalurDescription) {
      jalurDescription.innerHTML = `
        <div class="prediction-result-info">
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
            * Prediksi ini berdasarkan kondisi cuaca yang Anda pilih dan data gunung menggunakan model AI.
          </p>
        </div>
      `;
    }
  }

  /**
   * Update difficulty display with error message
   */
  updateDifficultyDisplayError(errorMessage) {
    const difficultyScore = document.getElementById("difficultyScore");
    const estimatedTimeElement = document.querySelector(
      ".jalur-detail-item:nth-child(3) p"
    );
    const jalurDescription = document.querySelector(".jalur-description");

    if (difficultyScore) {
      difficultyScore.textContent = `${this.currentMountain.difficulty}/10`;
      difficultyScore.style.color = "#666";
    }

    if (estimatedTimeElement) {
      estimatedTimeElement.textContent = "-";
      estimatedTimeElement.style.color = "#666";
    }

    if (jalurDescription) {
      jalurDescription.innerHTML = `
        <div class="prediction-error-info">
          <div class="error-badge">
            <strong>⚠️ Gagal Memprediksi Kesulitan</strong><br>
            <span style="font-size: 0.9rem;">${errorMessage}</span>
          </div>
          <p style="margin-top: 1rem;">
            **Silakan memilih tanggal pada bagian cuaca untuk mengetahui estimasi waktu dan tingkat kesulitan
          </p>
        </div>
      `;
    }
  }
}
