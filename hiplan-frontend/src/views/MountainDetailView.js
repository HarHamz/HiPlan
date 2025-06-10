import authManager from "../utils/auth.js";

export class MountainDetailView {
  constructor() {
    this.app = document.getElementById("app");
    this.authManager = authManager;
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
      </div>
    `;
  }
  renderCuacaTab(mountain) {
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
      {
        weather: "cerah",
        icon: "bi-sun",
        desc: "Cerah",
        temp: "24°",
        wind: "5 kph",
        precip: "0%",
        humid: "35%",
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

        <!-- Sub Section: Kecenderungan Cuaca Bulanan -->
        <div class="monthly-weather-trend">
          <h3>Kecenderungan Cuaca Bulanan</h3>
            <div class="monthly-weather-selector">
            <label for="month-select">Bulan:</label>
            <select id="month-select" class="month-dropdown">
              
            </select>
            
            <label for="year-select">Tahun:</label>
            <select id="year-select" class="year-dropdown">
              
            </select>
            
            <button id="view-prediction-btn" class="prediction-btn">Lihat Prediksi Kecenderungan Cuaca Bulanan</button>
          </div>

          <div id="prediction-result" class="prediction-result">
            <h4>Hasil Prediksi</h4>
            
            <div class="weather-parameters">
              <h5>Rata-rata Parameter Cuaca:</h5>
              <div class="parameter-grid">
                <div class="parameter-item">
                  <span class="parameter-label">Suhu (°C)</span>
                  <span class="parameter-value" id="avg-temp">25.93 °C</span>
                </div>
                <div class="parameter-item">
                  <span class="parameter-label">Kecepatan Angin</span>
                  <span class="parameter-value" id="avg-wind">7.39 km/h</span>
                </div>
                <div class="parameter-item">
                  <span class="parameter-label">Probabilitas Hujan (%)</span>
                  <span class="parameter-value" id="avg-precip">97.00 %</span>
                </div>
                <div class="parameter-item">
                  <span class="parameter-label">Kelembapan (%)</span>
                  <span class="parameter-value" id="avg-humidity">87.63 %</span>
                </div>
              </div>
            </div>

            <div class="weather-tendency">
              <h5>Kecenderungan cuaca: <span id="weather-tendency-result">Hujan</span></h5>
            </div>
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

    setTimeout(() => {
      this.setupMonthlyWeatherTrend();
    }, 100);
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

    weatherCards.forEach((card) => {
      card.addEventListener("click", () => {
        const weather = card.getAttribute("data-weather");
        const day = card.getAttribute("data-day");

        weatherCards.forEach((c) => c.classList.remove("active-weather"));

        card.classList.add("active-weather");

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

  setupMonthlyWeatherTrend() {
    this.setupMonthDropdown();
    this.populateYearDropdown();
    this.setupMonthlyPredictionHandler();
  }

  populateYearDropdown() {
    const yearSelect = document.getElementById("year-select");
    if (!yearSelect) return;

    yearSelect.innerHTML = "";

    const currentYear = new Date().getFullYear();

    for (let i = 0; i <= 10; i++) {
      const year = currentYear + i;
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;

      if (i === 0) {
        option.selected = true;
      }

      yearSelect.appendChild(option);
    }
  }

  setupMonthDropdown() {
    const monthSelect = document.getElementById("month-select");
    if (!monthSelect) return;

    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    monthSelect.innerHTML = "";

    const currentMonth = new Date().getMonth();

    months.forEach((monthName, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = monthName;

      if (index === currentMonth) {
        option.selected = true;
      }

      monthSelect.appendChild(option);
    });
  }

  setupMonthlyPredictionHandler() {
    const predictionBtn = document.getElementById("view-prediction-btn");
    const predictionResult = document.getElementById("prediction-result");
    const monthSelect = document.getElementById("month-select");
    const yearSelect = document.getElementById("year-select");

    if (!predictionBtn || !predictionResult) return;

    predictionBtn.addEventListener("click", () => {
      const selectedMonth = monthSelect.value;
      const selectedYear = yearSelect.value;
      const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];

      predictionBtn.textContent = "Memuat Prediksi...";
      predictionBtn.disabled = true;

      setTimeout(() => {
        const weatherData = this.generateMonthlyWeatherData(
          selectedMonth,
          selectedYear
        );

        this.updatePredictionResults(
          weatherData,
          monthNames[selectedMonth],
          selectedYear
        );

        predictionResult.style.display = "block";

        predictionBtn.textContent =
          "Lihat Prediksi Kecenderungan Cuaca Bulanan";
        predictionBtn.disabled = false;

        predictionResult.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 1500);
    });
  }

  // Method untuk generate mock weather data berdasarkan bulan dan tahun
  generateMonthlyWeatherData(month, year) {
    const monthlyPatterns = {
      0: { temp: 22, precip: 85, wind: 6, humidity: 82, tendency: "Hujan" },
      1: { temp: 23, precip: 80, wind: 7, humidity: 80, tendency: "Hujan" },
      2: { temp: 24, precip: 75, wind: 8, humidity: 78, tendency: "Berawan" },
      3: { temp: 25, precip: 70, wind: 7, humidity: 75, tendency: "Berawan" },
      4: { temp: 26, precip: 65, wind: 6, humidity: 72, tendency: "Cerah" },
      5: { temp: 25, precip: 60, wind: 5, humidity: 70, tendency: "Cerah" },
      6: { temp: 24, precip: 55, wind: 6, humidity: 68, tendency: "Cerah" },
      7: { temp: 25, precip: 60, wind: 7, humidity: 70, tendency: "Cerah" },
      8: { temp: 26, precip: 70, wind: 8, humidity: 75, tendency: "Berawan" },
      9: { temp: 27, precip: 80, wind: 7, humidity: 80, tendency: "Hujan" },
      10: { temp: 25, precip: 90, wind: 6, humidity: 85, tendency: "Hujan" },
      11: { temp: 23, precip: 95, wind: 8, humidity: 88, tendency: "Hujan" },
    };

    const baseData = monthlyPatterns[month] || monthlyPatterns[11];

    const yearOffset = (year - 2024) * 0.1;

    return {
      temp: (baseData.temp + yearOffset + (Math.random() - 0.5) * 2).toFixed(2),
      precip: Math.max(
        0,
        Math.min(100, baseData.precip + (Math.random() - 0.5) * 10)
      ).toFixed(2),
      wind: (baseData.wind + (Math.random() - 0.5) * 2).toFixed(2),
      humidity: Math.max(
        0,
        Math.min(100, baseData.humidity + (Math.random() - 0.5) * 8)
      ).toFixed(2),
      tendency: baseData.tendency,
    };
  }

  // Method untuk update hasil prediksi di UI
  updatePredictionResults(weatherData, monthName, year) {
    const avgTemp = document.getElementById("avg-temp");
    const avgPrecip = document.getElementById("avg-precip");
    const avgWind = document.getElementById("avg-wind");
    const avgHumidity = document.getElementById("avg-humidity");
    const tendencyResult = document.getElementById("weather-tendency-result");

    if (avgTemp) avgTemp.textContent = `${weatherData.temp} °C`;
    if (avgPrecip) avgPrecip.textContent = `${weatherData.precip} %`;
    if (avgWind) avgWind.textContent = `${weatherData.wind} km/h`;
    if (avgHumidity) avgHumidity.textContent = `${weatherData.humidity} %`;
    if (tendencyResult) tendencyResult.textContent = weatherData.tendency;

    const resultTitle = document.querySelector("#prediction-result h4");
    if (resultTitle) {
      resultTitle.textContent = `Hasil Prediksi - ${monthName} ${year}`;
    }
  }
}
