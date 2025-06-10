import gunungData from "../assets/data/gunung_indonesia.json";
import cartenzImg from "../assets/images/cartenz.jpg";
import authManager from "../utils/auth.js";

export class ExploreView {
  constructor() {
    this.app = document.getElementById("app");
    this.authManager = authManager;
  }
  render() {
    // Check authentication first
    if (!this.authManager.isAuthenticated()) {
      sessionStorage.setItem(
        "loginMessage",
        "Anda harus login terlebih dahulu untuk mengakses halaman Jelajah."
      );
      window.location.hash = "#login";
      return;
    }

    this.app.innerHTML = `
      <header>
        <nav-bar active-page="#jelajah"></nav-bar>
      </header>
      <main class="map-page-full-container" style="position:relative;">
        <div class="side-panel-container">
          <div id="gunung-highlight-card" class="gunung-highlight-card"></div>
            <div class="search-panel">
            <div class="search-bar">
              <span class="search-icon">
                <i class="bi bi-search"></i>
              </span>
              <input id="search-gunung" type="text" placeholder="Telusuri Gunung Indonesia" autocomplete="off" />
              <button id="search-exit-btn" class="search-exit-btn" type="button" title="Tutup Pencarian" style="display:none;">
                <i class="bi bi-x"></i>
              </button>
            </div>
            <ul id="search-result-list" class="search-result-list"></ul>
          </div>
        </div>
        <div id="map"></div>
        <!-- Mobile highlight -->
        <div id="gunung-highlight-card-mobile" class="gunung-highlight-card-mobile"></div>
      </main>
      <footer-component></footer-component>
    `;
    this.initMap();
  }

  initMap() {
    if (
      typeof L === "undefined" ||
      typeof L.MarkerClusterGroup === "undefined"
    ) {
      console.error("Leaflet library or MarkerCluster plugin not loaded.");
      return;
    }

    const map = L.map("map", {
      scrollWheelZoom: true,
      wheelPxPerZoomLevel: 120,
      zoomAnimation: true,
      zoomDelta: 0.25,
      zoomSnap: 0,
      zoomControl: false, // Matikan kontrol default
    }).setView([-2.5, 118], 5);

    // --- Tambahkan tile layer ---
    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        updateWhenZooming: true,
        updateInterval: 100,
      }
    ).addTo(map);

    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" }
    );

    // --- Custom control container ---
    const customControl = L.control({ position: "topright" });
    customControl.onAdd = function () {
      const div = L.DomUtil.create("div", "custom-map-controls");
      div.innerHTML = `
        <button class="ctrl-btn" id="layer-btn" title="Ganti Layer">
          <svg width="24" height="24"><rect x="4" y="6" width="16" height="3" rx="1.5" fill="none" stroke="#222" stroke-width="2"/><rect x="4" y="11" width="16" height="3" rx="1.5" fill="none" stroke="#222" stroke-width="2"/><rect x="4" y="16" width="16" height="3" rx="1.5" fill="none" stroke="#222" stroke-width="2"/></svg>
        </button>
        <div id="layer-dropdown" class="layer-dropdown">
          <button class="layer-option" data-layer="osm">OpenStreetMap</button>
          <button class="layer-option" data-layer="satellite">Satelit</button>
        </div>
        <button class="ctrl-btn" id="zoom-in-btn" title="Zoom In">+</button>
        <button class="ctrl-btn" id="zoom-out-btn" title="Zoom Out">-</button>
        <button class="ctrl-btn" id="locate-btn" title="Lokasi Saya">
          <svg width="24" height="24"><circle cx="12" cy="12" r="10" stroke="#222" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" fill="none" stroke="#222" stroke-width="2"/></svg>
        </button>
        <button class="ctrl-btn" id="north-btn" title="Arah Utara">
          <svg width="24" height="24"><polygon points="12,4 16,20 12,16 8,20" fill="none" stroke="#222" stroke-width="2"/><polygon points="12,4 13,8 11,8" fill="#f44336"/></svg>
        </button>
      `;
      return div;
    };
    customControl.addTo(map);

    // --- Event tombol ---
    document.getElementById("layer-btn").onclick = function () {
      if (map.hasLayer(osm)) {
        map.removeLayer(osm);
        map.addLayer(satellite);
      } else {
        map.removeLayer(satellite);
        map.addLayer(osm);
      }
    };
    document.getElementById("zoom-in-btn").onclick = function () {
      map.zoomIn();
    };
    document.getElementById("zoom-out-btn").onclick = function () {
      map.zoomOut();
    };
    document.getElementById("locate-btn").onclick = function () {
      map.locate({ setView: true, maxZoom: 12 });
    };
    document.getElementById("north-btn").onclick = function () {
      map.setBearing
        ? map.setBearing(0)
        : map.setView(map.getCenter(), map.getZoom()); // Kompas (reset view)
    };

    // --- Styling tombol (tambahkan ke CSS Anda) ---
    const style = document.createElement("style");
    style.innerHTML = `
      .custom-map-controls {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 16px;
      }
      .ctrl-btn {
        background: #fff;
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin: 0;
        padding: 0;
        transition: box-shadow 0.2s;
      }
      .ctrl-btn:active {
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
      }
      .ctrl-btn svg {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // --- Cluster group ---
    const markersCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 13,
    });

    // --- Buat marker gunung ---
    const allMarkers = gunungData
      .map((gunung) => {
        if (gunung.Latitude && gunung.Longitude) {
          const lat =
            gunung.Latitude *
            (gunung.Koordinat && gunung.Koordinat.includes("LS") ? -1 : 1);
          const marker = L.circleMarker([lat, gunung.Longitude], {
            radius: 9,
            color: "#388e3c",
            weight: 2,
            fillColor: "#69f0ae",
            fillOpacity: 0.7,
          }).bindPopup(
            `<b>${gunung.Nama}</b><br>${gunung.Provinsi}<br>Ketinggian: ${gunung["Ketinggian (dpl)"]} mdpl`
          );
          marker.gunungNama = gunung.Nama.toLowerCase();
          marker.gunungData = gunung;
          return marker;
        }
        return null;
      })
      .filter(Boolean);

    allMarkers.forEach((marker) => markersCluster.addLayer(marker));
    map.addLayer(markersCluster);

    // --- Search logic ---
    const searchInput = document.getElementById("search-gunung");
    const resultList = document.getElementById("search-result-list");
    const searchExitBtn = document.getElementById("search-exit-btn");

    function renderResults(keyword) {
      resultList.innerHTML = "";
      if (!keyword) return;
      const results = gunungData
        .filter((g) => g.Nama.toLowerCase().includes(keyword))
        .slice(0, 2); // HANYA 2 hasil saja

      results.forEach((gunung) => {
        const marker = allMarkers.find((m) => m.gunungData === gunung);
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="result-icon">
            <svg width="20" height="20" fill="none" stroke="#222" stroke-width="2" viewBox="0 0 24 24"><path d="M3 20L12 4L21 20H3Z" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span>
            <div class="result-title">${gunung.Nama}</div>
            <div class="result-sub">${gunung.Provinsi} &bull; ${gunung["Ketinggian (dpl)"]} mdpl</div>
          </span>
        `;
        li.addEventListener("click", () => {
          const lat =
            gunung.Latitude *
            (gunung.Koordinat && gunung.Koordinat.includes("LS") ? -1 : 1);
          map.setView([lat, gunung.Longitude], 11, {
            animate: true,
            duration: 1.5,
          });
          const onMoveEnd = () => {
            if (marker) marker.openPopup();
            showHighlightCard([gunung]);
            map.off("moveend", onMoveEnd);
          };
          map.on("moveend", onMoveEnd);
        });
        resultList.appendChild(li);
      });
    }

    searchInput.addEventListener("input", function () {
      const keyword = this.value.toLowerCase();
      renderResults(keyword);
      if (keyword) {
        searchExitBtn.style.display = "flex";
      } else {
        searchExitBtn.style.display = "none";
      }
    });

    searchExitBtn.addEventListener("click", function () {
      searchInput.value = "";
      resultList.innerHTML = ""; // Hapus semua rekomendasi
      resultList.classList.remove("active");
      searchBar.classList.remove("expanded");
      searchExitBtn.style.display = "none";
      searchInput.blur();
    });

    const highlightCard = document.getElementById("gunung-highlight-card");
    const highlightCardMobile = document.getElementById(
      "gunung-highlight-card-mobile"
    ); // Fungsi render highlight mobile
    function showHighlightCardMobile(gunung) {
      if (!highlightCardMobile) return;
      if (!gunung) {
        highlightCardMobile.classList.remove("active");
        highlightCardMobile.innerHTML = "";
        return;
      }
      // Gunakan gambar dari Cloudinary jika ada, jika tidak fallback ke cartenzImg
      const imgSrc = gunung.Gambar || cartenzImg;
      highlightCardMobile.innerHTML = `
        <button class="close-highlight-btn" aria-label="Tutup">&times;</button>
        <div class="highlight-card-content-mobile" data-mountain-id="${gunung.Id}" style="display:flex;gap:14px;align-items:flex-start;cursor:pointer;padding:8px;border-radius:12px;transition:background-color 0.2s ease;">
          <img src="${imgSrc}" alt="${gunung.Nama}" style="width:72px;height:72px;object-fit:cover;border-radius:14px;flex-shrink:0;background:#f5f5f5;" 
               onerror="this.src='${cartenzImg}'" />
          <div>
            <div class="highlight-title-mobile" style="font-size:1.1rem;font-weight:600;margin-bottom:2px;">${gunung.Nama}</div>
            <div class="highlight-sub-mobile" style="color:#3498db;font-size:0.97rem;margin-bottom:2px;">${gunung.Provinsi}</div>
            <div class="highlight-meta-mobile" style="color:#888;font-size:0.93rem;">${gunung["Ketinggian (dpl)"]} mdpl</div>
          </div>
        </div>
      `;
      highlightCardMobile.classList.add("active");

      // Add click functionality to mobile highlight card
      const mobileContent = highlightCardMobile.querySelector(
        ".highlight-card-content-mobile"
      );
      if (mobileContent) {
        const mountainId = mobileContent.getAttribute("data-mountain-id");

        // Add touch feedback
        mobileContent.addEventListener("touchstart", () => {
          mobileContent.style.backgroundColor = "#f8f9fa";
        });

        mobileContent.addEventListener("touchend", () => {
          mobileContent.style.backgroundColor = "transparent";
        });

        mobileContent.addEventListener("touchcancel", () => {
          mobileContent.style.backgroundColor = "transparent";
        });

        // Add click functionality
        mobileContent.addEventListener("click", () => {
          if (mountainId) {
            // Navigate to mountain detail page
            window.location.hash = `#/mountain/${mountainId}`;
          }
        });
      }

      // Tombol close
      highlightCardMobile.querySelector(".close-highlight-btn").onclick =
        () => {
          highlightCardMobile.classList.remove("active");
          highlightCardMobile.innerHTML = "";
        };
    }

    function showHighlightCard(gunungList) {
      if (!Array.isArray(gunungList)) gunungList = [gunungList];
      if (!gunungList.length) {
        highlightCard.innerHTML = `<div>Tidak ada gunung di area ini.</div>`;
        highlightCard.style.display = "flex";
        return;
      }

      // Jika sedang minimized, render hanya header
      if (highlightCard.classList.contains("minimized")) {
        highlightCard.innerHTML = `
          <div class="highlight-card-header-bar">
            <span class="highlight-card-title">Jelajah</span>
            <button id="minimize-highlight-card" class="highlight-min-btn" title="Maximize">
              <svg width="20" height="20" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="2" rx="1" fill="#222"/></svg>
            </button>
          </div>
        `;
        highlightCard.style.display = "flex";
        // Event maximize
        const minimizeBtn = document.getElementById("minimize-highlight-card");
        if (minimizeBtn) {
          minimizeBtn.onclick = function (e) {
            e.stopPropagation();
            highlightCard.classList.remove("minimized");
            showHighlightCard(gunungList); // Render ulang isi penuh
          };
        }
        return;
      }

      // Normal mode
      highlightCard.innerHTML = `
        <div class="highlight-card-header-bar">
          <span class="highlight-card-title">Jelajah</span>
          <button id="minimize-highlight-card" class="highlight-min-btn" title="Minimize">
            <svg width="20" height="20" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="2" rx="1" fill="#222"/></svg>
          </button>
        </div>        <div class="highlight-list">
          ${gunungList
            .slice(0, 6)
            .map(
              (gunung, index) => `
            <div class="highlight-card-item" data-mountain-id="${
              gunung.Id
            }" data-index="${index}" style="cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;">
              <div class="highlight-img-wrap">
                <img src="${gunung.Gambar || cartenzImg}" alt="${gunung.Nama}" 
                     onerror="this.src='${cartenzImg}'" />
              </div>
              <div class="highlight-info">
                <div class="highlight-title">${gunung.Nama}</div>
                <div class="highlight-sub">${gunung.Provinsi}</div>
                <div class="highlight-meta">
                ${gunung["Ketinggian (dpl)"]} mdpl
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
      highlightCard.style.display = "flex";

      // Add click functionality to highlight cards
      const highlightCardItems = highlightCard.querySelectorAll(
        ".highlight-card-item"
      );
      highlightCardItems.forEach((cardItem, index) => {
        const mountainId = cardItem.getAttribute("data-mountain-id");
        const gunung = gunungList[index];

        // Add hover effects
        cardItem.addEventListener("mouseenter", () => {
          cardItem.style.transform = "translateY(-2px)";
          cardItem.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        });

        cardItem.addEventListener("mouseleave", () => {
          cardItem.style.transform = "translateY(0)";
          cardItem.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
        });

        // Add click functionality
        cardItem.addEventListener("click", () => {
          if (mountainId) {
            // Navigate to mountain detail page
            window.location.hash = `#/mountain/${mountainId}`;
          }
        });
      });

      // Event minimize
      const minimizeBtn = document.getElementById("minimize-highlight-card");
      if (minimizeBtn) {
        minimizeBtn.onclick = function (e) {
          e.stopPropagation();
          highlightCard.classList.add("minimized");
          showHighlightCard(gunungList); // Render ulang hanya header
        };
      }
    }

    // --- Marker click: tampilkan highlight hanya 1 gunung ---
    allMarkers.forEach((marker) => {
      marker.on("click", () => {
        const gunung = marker.gunungData;
        const lat =
          gunung.Latitude *
          (gunung.Koordinat && gunung.Koordinat.includes("LS") ? -1 : 1);
        // Tampilkan highlight mobile hanya di mobile
        if (window.innerWidth <= 768) {
          showHighlightCardMobile(gunung);
        } else {
          showHighlightCard([gunung]);
        }
      });
    });

    // --- Highlight otomatis sesuai area peta ---
    function getGunungInBounds(bounds) {
      return gunungData.filter((gunung) => {
        if (!gunung.Latitude || !gunung.Longitude) return false;
        const lat =
          gunung.Latitude *
          (gunung.Koordinat && gunung.Koordinat.includes("LS") ? -1 : 1);
        const lng = gunung.Longitude;
        return bounds.contains([lat, lng]);
      });
    }

    map.on("moveend", () => {
      const bounds = map.getBounds();
      const gunungSekitar = getGunungInBounds(bounds);
      showHighlightCard(gunungSekitar);
    });

    // Tampilkan highlight card pertama kali
    const bounds = map.getBounds();
    const gunungSekitar = getGunungInBounds(bounds);
    showHighlightCard(gunungSekitar);

    const searchBar = document.querySelector(".search-bar");

    // Expand saat input focus/click
    searchInput.addEventListener("focus", () => {
      searchBar.classList.add("expanded");
      resultList.classList.add("active");
    });

    // Collapse saat blur (dan input kosong)
    searchInput.addEventListener("blur", () => {
      setTimeout(() => {
        if (!searchInput.value) {
          searchBar.classList.remove("expanded");
          resultList.classList.remove("active");
        }
      }, 100);
    });

    // Klik pada search bar juga expand
    searchBar.addEventListener("click", () => {
      searchBar.classList.add("expanded");
      resultList.classList.add("active");
      searchInput.focus();
    });

    // Sembunyikan dropdown jika tidak ada hasil
    searchInput.addEventListener("input", function () {
      const keyword = this.value.toLowerCase();
      renderResults(keyword);
      if (keyword) {
        resultList.classList.add("active");
      } else {
        resultList.classList.remove("active");
      }
    });

    style.innerHTML += `
      .gunung-highlight-card {
        position: relative;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        padding: 24px 16px 16px 16px;
        min-width: 280px;
        max-width: 340px;
        min-height: 180px;   /* Ubah dari 400px ke 180px */
        max-height: 572px;   /* Ubah dari 700px ke 320px */
        margin-bottom: 18px;
        display: flex;
        flex-direction: column;
      }
      .highlight-card-header-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
        padding: 4px 4px 8px;
      }
      .highlight-card-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #222;
        letter-spacing: 0.5px;
      }
      .highlight-min-btn {
        background: rgba(255,255,255,0.85);
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 4px rgba(0,0,0,0.07);
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s;
        outline: none;
      }
      .highlight-min-btn:hover, .highlight-min-btn:focus {
        background: #f5f5f5;
        box-shadow: 0 2px 8px rgba(0,0,0,0.13);
      }
      .highlight-min-btn svg {
        pointer-events: none;
      }
      .highlight-list {
        flex: 1 1 auto;
        max-height: 600px;      /* Sesuaikan agar scroll tetap muncul jika isi banyak */
        overflow-y: auto;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
      }
      .highlight-list::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
      }
    `;

    const layerBtn = document.getElementById("layer-btn");
    const layerDropdown = document.getElementById("layer-dropdown");

    layerBtn.onclick = function (e) {
      e.stopPropagation();
      layerDropdown.classList.toggle("open");
    };

    // Tutup dropdown jika klik di luar
    document.addEventListener("click", function () {
      layerDropdown.classList.remove("open");
    });

    // Ganti layer saat opsi dipilih
    layerDropdown.querySelectorAll(".layer-option").forEach((btn) => {
      btn.onclick = function (e) {
        e.stopPropagation();
        layerDropdown.classList.remove("open"); // GUNAKAN INI SAJA
        if (this.dataset.layer === "osm") {
          if (!map.hasLayer(osm)) {
            map.addLayer(osm);
            map.removeLayer(satellite);
          }
          // (opsional) update label layer jika ada
        } else if (this.dataset.layer === "satellite") {
          if (!map.hasLayer(satellite)) {
            map.addLayer(satellite);
            map.removeLayer(osm);
          }
          // (opsional) update label layer jika ada
        }
      };
    });

    let userMarker = null;

    map.on("locationfound", function (e) {
      // Hapus marker lama jika ada
      if (userMarker) {
        map.removeLayer(userMarker);
      }
      // Tambahkan marker baru di lokasi user
      userMarker = L.marker(e.latlng, {
        icon: L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        }),
      })
        .addTo(map)
        .bindPopup("Lokasi Anda")
        .openPopup();
    });

    // (Opsional) Tangani error lokasi
    map.on("locationerror", function (e) {
      alert("Lokasi tidak ditemukan atau akses GPS ditolak.");
    });
  }
}
