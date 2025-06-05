import gunungData from "../assets/data/gunung_indonesia.json";
import cartenzImg from "../assets/images/cartenz.jpg";

export class ExploreView {
  constructor() {
    this.app = document.getElementById("app");
  }

  render() {
    this.app.innerHTML = `
      <header>
        <nav-bar active-page="#jelajah"></nav-bar>
      </header>
      <main class="map-page-full-container" style="position:relative;">
        <div class="side-panel-container">
        <div class="search-panel">
          <div class="search-bar">
            <span class="search-icon">
              <svg width="20" height="20" fill="none" stroke="#222" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input id="search-gunung" type="text" placeholder="Telusuri Gunung Indonesia" autocomplete="off" />
          </div>
          <ul id="search-result-list" class="search-result-list"></ul>
        </div>
          <div id="gunung-highlight-card" class="gunung-highlight-card"></div>
        </div>
        <div id="map"></div>
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

    function renderResults(keyword) {
      resultList.innerHTML = "";
      if (!keyword) return;
      const results = gunungData
        .filter((g) => g.Nama.toLowerCase().includes(keyword))
        .slice(0, 10);

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
    });

    const highlightCard = document.getElementById("gunung-highlight-card");

    function showHighlightCard(gunungList) {
      if (!Array.isArray(gunungList)) gunungList = [gunungList];
      if (!gunungList.length) {
        highlightCard.innerHTML = `<div>Tidak ada gunung di area ini.</div>`;
        highlightCard.style.display = "flex";
        return;
      }

      // Jika sedang minimized, tampilkan hanya tombol kecil
      if (highlightCard.classList.contains("minimized")) {
        highlightCard.innerHTML = `
          <div class="highlight-minimized-btn">
            <span class="highlight-minimized-title">Jelajah</span>
            <span class="highlight-minimized-icon">&#9660;</span>
          </div>
        `;
        highlightCard.style.display = "flex";
        return;
      }

      // Normal mode
      highlightCard.innerHTML = `
        <div class="highlight-card-header-bar">
          <span class="highlight-card-title">Jelajah</span>
          <button id="minimize-highlight-card" class="highlight-min-btn" title="Minimize">
            <svg width="20" height="20" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="2" rx="1" fill="#222"/></svg>
          </button>
        </div>
        <div class="highlight-list">
          ${gunungList
            .slice(0, 6)
            .map(
              (gunung) => `
            <div class="highlight-card-item">
              <div class="highlight-img-wrap">
                <img src="${cartenzImg}" alt="${gunung.Nama}" />
              </div>
              <div class="highlight-info">
                <div class="highlight-title">${gunung.Nama}</div>
                <div class="highlight-sub">${gunung.Provinsi}</div>
                <div class="highlight-meta">
                  ⭐ ${gunung.Rating || "-"} &bull; ${
                gunung["Ketinggian (dpl)"]
              } mdpl
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
      highlightCard.style.display = "flex";

      // Event minimize
      const minimizeBtn = document.getElementById("minimize-highlight-card");
      if (minimizeBtn) {
        minimizeBtn.onclick = function (e) {
          e.stopPropagation();
          highlightCard.classList.add("minimized");
          showHighlightCard(gunungList); // re-render tampilan minimized
        };
      }

      // Event maximize (klik card minimized)
      highlightCard.onclick = function (e) {
        if (highlightCard.classList.contains("minimized")) {
          highlightCard.classList.remove("minimized");
          showHighlightCard(gunungList); // re-render tampilan normal
          e.stopPropagation();
        }
      };
    }

    // --- Marker click: tampilkan highlight hanya 1 gunung ---
    allMarkers.forEach((marker) => {
      marker.on("click", () => {
        const gunung = marker.gunungData;
        const lat =
          gunung.Latitude *
          (gunung.Koordinat && gunung.Koordinat.includes("LS") ? -1 : 1);
        map.setView([lat, gunung.Longitude], 11, {
          animate: true,
          duration: 1.5,
          easeLinearity: 0.25,
        });
        showHighlightCard([gunung]);
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

    // Tambahkan/ubah CSS berikut setelah style.innerHTML (atau gabungkan dengan style yang sudah ada)
    style.innerHTML += `
      .gunung-highlight-card {
        position: relative;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        padding: 24px 16px 16px 16px;
        min-width: 280px;
        max-width: 340px;
        margin-bottom: 18px;
      }
      .highlight-card-header-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
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
        max-height: 340px;
        overflow-y: auto;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
      }
      .highlight-list::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
      }
    `;
  }
}
