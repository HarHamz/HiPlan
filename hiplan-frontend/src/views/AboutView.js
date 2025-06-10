export class AboutView {
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
                    <h1 style="color: #f5f5f5;">HiPlan: AI-Powered Hiking Safety & Smart Planning Platform</h1>
                    <p>HiPlan adalah platform berbasis AI yang mentransformasikan cara pendaki merencanakan petualangan dengan lebih aman, cerdas, dan terinformasi untuk pengalaman mendaki yang tak terlupakan</p>
                </div>
            </section>

            <main>
            <div class="section-title">
            <h1 style="padding-top: 50px;">MENGAPA HIPLAN DICIPTAKAN?</h1>
            </div>

                <section class="AboutView-section" aria-labelledby="">
                  <div class="content-block">
                    <h2 id="">Popularitas Mendaki dan Tantangan Perencanaan</h2>
                    <p class="AboutView-p-left">Mendaki gunung telah menjadi kegiatan yang sangat digemari di Indonesia.  Namun, popularitas ini tidak selalu diimbangi dengan kemudahan akses informasi yang terpadu. Banyak pendaki, terutama pemula, kesulitan menemukan detail penting seperti kondisi cuaca terkini di gunung, tingkat kesulitan jalur yang sebenarnya, dan perkiraan waktu tempuh yang akurat.  Informasi yang ada seringkali tersebar di berbagai platform, tidak terstandardisasi, dan kadang kurang dapat diandalkan.</p>
                  </div>
                  <div class="image-block">
                    <img src="${require("../assets/images/AboutView/1.png")}" alt="people climbing the mountain">
                  </div>
                </section>

                <section class="AboutView-section" id="AboutView-section-reverse" aria-labelledby="">
                  <div class="image-block">
                    <img src="${require("../assets/images/AboutView/2.png")}" alt="people climbing the mountain">
                  </div>
                  <div class="content-block">
                    <h2 id="">Risiko Keselamatan dan Kurangnya Kesiapan</h2>
                    <p class="AboutView-p-left">Akibat minimnya informasi yang komprehensif, banyak pendaki berangkat dengan persiapan yang kurang matang atau memilih gunung yang tingkat kesulitannya tidak sesuai dengan kemampuan fisik dan pengalaman mereka.  Hal ini tidak hanya mengurangi kenyamanan dan kenikmatan pendakian tetapi juga dapat meningkatkan risiko insiden atau masalah keselamatan selama di gunung.</p>
                  </div>

                </section>

                <section class="AboutView-section" aria-labelledby="">
                  <div class="content-block">
                    <h2 id="">Kebutuhan Akan Platform Cerdas dan Prediktif</h2>
                    <p class="AboutView-p-left">Melihat tantangan tersebut, ada kebutuhan mendesak untuk sebuah solusi yang dapat membantu pendaki merencanakan perjalanan mereka dengan lebih baik. HiPlan hadir untuk menjawab kebutuhan ini dengan menyediakan platform berbasis web yang tidak hanya mengumpulkan informasi penting tetapi juga memberikan prediksi tingkat kesulitan, estimasi waktu, rekomendasi gunung sesuai preferensi, hingga prediksi kecenderungan cuaca bulanan.</p>
                  </div>
                  <div class="image-block">
                    <img src="${require("../assets/images/AboutView/3.png")}" alt="compas">
                  </div>
                </section>

                <section class="AboutView-section" id="AboutView-section-reverse" aria-labelledby="">
                  <div class="image-block">
                    <img src="${require("../assets/images/AboutView/4.png")}" alt="people using map">
                  </div>
                  <div class="content-block">
                    <h2 id="">Mendorong Pendekatan Perencanaan yang Lebih Proaktif</h2>
                    <p class="AboutView-p-left">Daripada hanya mengandalkan informasi dari mulut ke mulut atau sumber yang sporadis, HiPlan mendorong pendekatan perencanaan yang lebih proaktif. Dengan fitur prediktif, pendaki dapat mengantisipasi berbagai kondisi dan mempersiapkan diri jauh-jauh hari, bukan hanya bereaksi terhadap situasi yang tidak terduga di lapangan</p>
                  </div>
                </section>                <section class="cara-kerja-section">
                    <div class="section-title">
                        <h1>CARA KERJA HIPLAN</h1>
                    </div>
                    
                    <div class="cara-kerja-steps">
                        <div class="step-item">
                            <div class="step-icon">
                                <img src="${require("../assets/images/AboutView/lens_icon.png")}" alt="Search Icon">
                            </div>
                            <div class="step-content">
                                <h3>Tentukan Preferensi Pendakian</h3>
                                <p>Mulailah dengan memasukkan kriteria pendakian yang Anda inginkan, seperti lokasi gunung, perkiraan tingkat kesulitan, atau rentang ketinggian.</p>
                            </div>
                        </div>

                        <div class="step-item">
                            <div class="step-icon">
                                <img src="${require("../assets/images/AboutView/brain_icon.png")}" alt="AI Brain Icon">
                            </div>
                            <div class="step-content">
                                <h3>Analisis AI Cerdas</h3>
                                <p>Sistem AI kami menganalisis data historis cuaca, tingkat kesulitan, dan kondisi gunung untuk memberikan rekomendasi yang akurat dan personal.</p>
                            </div>
                        </div>

                        <div class="step-item">
                            <div class="step-icon">
                                <img src="${require("../assets/images/AboutView/mountain_page.png")}" alt="Mountain Results Icon">
                            </div>
                            <div class="step-content">
                                <h3>Dapatkan Rekomendasi Terbaik</h3>
                                <p>Terima rekomendasi gunung yang sesuai dengan kemampuan Anda, lengkap dengan prediksi cuaca, estimasi waktu, dan tips keselamatan.</p>
                            </div>
                        </div>
                    </div>
                </section>                <section class="fitur-unggulan-section">
                    <div class="section-title">
                        <h1>FITUR UNGGULAN HIPLAN</h1>
                    </div>
                    
                    <div class="AboutView-card-container">
                        <article class="AboutView-card">
                            <img src="${require("../assets/images/AboutView/weather_icon.png")}" alt="weather_icon">
                            <div class="AboutView-card-content">
                                <h3 class="AboutView-h3-center">Prediksi Cuaca</h3>
                                <div class="AboutView-p-center">
                                    <p>Rencanakan pendakian di musim ideal dengan prediksi kecenderungan cuaca bulanan berbasis data historis.</p>
                                </div>
                            </div>
                        </article>

                        <article class="AboutView-card">
                            <img src="${require("../assets/images/AboutView/target_icon.png")}" alt="target_icon">
                            <div class="AboutView-card-content">
                                <h3 class="AboutView-h3-center">Tingkat kesulitan</h3>
                                <div class="AboutView-p-center">
                                    <p>Pahami tingkat kesulitan gunung secara prediktif berdasarkan elevasi dan suhu rata-rata untuk persiapan terbaik.</p>
                                </div>
                            </div>
                        </article>

                        <article class="AboutView-card">
                            <img src="${require("../assets/images/AboutView/stopwatch_icon.png")}" alt="stopwatch_icon">
                            <div class="AboutView-card-content">
                                <h3 class="AboutView-h3-center">Waktu Tempuh</h3>
                                <div class="AboutView-p-center">
                                    <p>Dapatkan perkiraan waktu tempuh pendakian yang realistis sesuai tingkat kesulitan dan ketinggian gunung.</p>
                                </div>
                            </div>
                        </article>

                        <article class="AboutView-card">
                            <img src="${require("../assets/images/AboutView/lens_icon_2.png")}" alt="lens_icon_2">
                            <div class="AboutView-card-content">
                                <h3 class="AboutView-h3-center">Destinasi Ideal</h3>
                                <div class="AboutView-p-center">
                                    <p>Temukan destinasi pendakian ideal yang cocok dengan preferensi dan level kemampuanmu.</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>

            </main>

            <footer-component></footer-component>
        `;

    this.bindEvents();
  }

  renderMountainCards(mountains) {
    return mountains
      .map(
        (mountain) => `
            <article class="card">
                <img src="${require("../assets/images/" +
                  mountain.image)}" alt="Pemandangan ${mountain.name}" />
                <div class="card-content">
                    <h3>${mountain.name}</h3>
                    <p>${mountain.location}</p>
                    <p class="altitude">${mountain.altitude}</p>
                </div>
            </article>
        `
      )
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
