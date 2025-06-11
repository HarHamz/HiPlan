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
                    <h1>JELAJAHI GUNUNG DI INDONESIA</h1>
                    <form class="search-container" role="search" aria-label="Pencarian gunung">
                        <input type="search" placeholder="Cari gunung di Indonesia" id="searchInput" aria-label="Cari gunung di Indonesia"/>
                        <button type="submit" class="search-btn" aria-label="Tombol cari">
                            <img src="${require("../assets/icon/search-icon.svg")}" alt="Icon pencarian"/>
                        </button>
                    </form>
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
                </section>

                <section class="destinasi-populer-section" aria-labelledby="populer-heading">
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

                <section class="feature-section">
                    <h2>Perencanaan Cerdas dengan Fitur HiPlan</h2>
                    <div class="feature-container">
                        <div class="feature-image">
                            <img src="${require("../assets/images/lawu.jpg")}" alt="Pendaki di gunung" />
                        </div>
                        <div class="feature-content">                            <p>Semangat petualangan memanggil jiwa untuk menjelajahi ketinggian, seperti rekan pendaki di samping ini. Namun, di balik setiap pendakian hebat, ada perencanaan yang matang.</p>
                            <p>Seringkali kita bertanya: Kapan cuaca terbaik untuk mendaki? Apakah gunung ini sesuai dengan kemampuan saya? Berapa lama waktu yang dibutuhkan? Mencari jawaban yang akurat bisa jadi tantangan.</p>
                            <p>HiPlan hadir sebagai solusi. Kami mengubah keraguan menjadi kepastian dengan menyediakan prediksi tren cuaca bulanan, analisis tingkat kesulitan gunung, estimasi waktu tempuh, dan rekomendasi yang dipersonalisasi. Semua berbasis data untuk perencanaan yang lebih cerdas.</p>                            <div class="feature-icons">
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
        // Gunakan gambar dari Cloudinary jika tersedia, atau fallback ke local images
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

    // Handle search form submission
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.onSearch) {
          this.onSearch(searchInput.value);
        }
      });
    }
  }

  setLoginHandler(handler) {
    this.onLogin = handler;
  }

  setRegisterHandler(handler) {
    this.onRegister = handler;
  }

  setSearchHandler(handler) {
    this.onSearch = handler;
  }

  updateSearchResults(mountains) {
    const containers = document.querySelectorAll(".card-container");
    containers.forEach((container) => {
      container.innerHTML = this.renderMountainCards(mountains);
    });
  }
}
