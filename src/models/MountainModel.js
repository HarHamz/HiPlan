import gunungData from "../assets/data/gunung_indonesia.json";

export class Mountain {
  constructor(
    id,
    nama,
    provinsi,
    kabupaten,
    ketinggian,
    jenisGunung,
    status,
    akses,
    jarakKm,
    jarakM,
    elevationGain,
    estimatedTime,
    latitude,
    longitude,
    deskripsi,
    gambar
  ) {
    this.id = id;
    this.name = nama;
    this.location = `${kabupaten}, ${provinsi}`;
    this.altitude = ketinggian;
    this.mainImage = gambar || "bromo.jpg";
    this.description = deskripsi;
    this.difficulty = this.calculateDifficulty(elevationGain, jarakM);
    this.distance = jarakM ? (jarakM / 1000).toFixed(1) : "N/A";
    this.lat = latitude;
    this.long = longitude;
    this.jenisGunung = jenisGunung;
    this.status = status;
    this.access = akses;
    this.jarakKm = jarakKm;
    this.elevationGain = elevationGain;
    this.estimatedTime = estimatedTime;
    this.ulasan = Math.floor(Math.random() * 100) + 10; // Random
  }
  // Dummy nunggu model
  calculateDifficulty(elevationGain, distance) {
    // Skala 1-10 berdasarkan elevation gain dan distance
    let score = 1;

    // Faktor elevation gain (bobot 60%)
    if (elevationGain > 2500) score += 5.4; // Sangat tinggi
    else if (elevationGain > 2000) score += 4.8;
    else if (elevationGain > 1500) score += 3.6;
    else if (elevationGain > 1000) score += 2.4;
    else if (elevationGain > 500) score += 1.2;

    // Faktor distance (bobot 40%)
    if (distance > 30000) score += 3.6; // Sangat jauh
    else if (distance > 25000) score += 3.2;
    else if (distance > 20000) score += 2.4;
    else if (distance > 15000) score += 1.6;
    else if (distance > 10000) score += 0.8;

    // Batasi score antara 1-10 dan bulatkan ke 1 desimal
    return Math.min(Math.max(Math.round(score * 10) / 10, 1), 10);
  }

  // Menghitung tingkat kesulitan berdasarkan cuaca
  calculateWeatherDifficulty(weatherCondition) {
    const baseDifficulty = this.difficulty;
    let weatherModifier = 0;

    // Faktor penambah kesulitan berdasarkan kondisi cuaca
    switch (weatherCondition.toLowerCase()) {
      case "badai":
      case "storm":
        weatherModifier = 3.5;
        break;
      case "hujan":
      case "rain":
        weatherModifier = 2.0;
        break;
      case "berawan":
      case "cloudy":
        weatherModifier = 0.5;
        break;
      case "cerah":
      case "sunny":
        weatherModifier = 0;
        break;
      default:
        weatherModifier = 0;
    }

    const weatherDifficulty = baseDifficulty + weatherModifier;
    return Math.min(Math.max(Math.round(weatherDifficulty * 10) / 10, 1), 10);
  }

  // Mendapatkan deskripsi tingkat kesulitan berdasarkan nilai
  getDifficultyDescription(difficulty) {
    if (difficulty <= 2) return "Sangat Mudah";
    if (difficulty <= 4) return "Mudah";
    if (difficulty <= 6) return "Sedang";
    if (difficulty <= 8) return "Sulit";
    return "Sangat Sulit";
  }

  // Mendapatkan warna berdasarkan tingkat kesulitan
  getDifficultyColor(difficulty) {
    if (difficulty <= 2) return "#28a745"; // Hijau
    if (difficulty <= 4) return "#17a2b8"; // Biru
    if (difficulty <= 6) return "#ffc107"; // Kuning
    if (difficulty <= 8) return "#fd7e14"; // Orange
    return "#dc3545"; // Merah
  }
}

export class MountainModel {
  constructor() {
    // Transform the raw data into Mountain objects
    this.mountains = gunungData.map(
      (data) =>
        new Mountain(
          data.Id,
          data.Nama,
          data.Provinsi,
          data.Kabupaten,
          data["Ketinggian (dpl)"],
          data["Jenis Gunung"],
          data.Status,
          data.Akses,
          data["Jarak (km)"],
          data["Jarak (m)"],
          data["Elevation gain (m)"],
          data["Estimated Time "],
          data.Latitude,
          data.Longitude,
          data.Deskripsi,
          data.Gambar
        )
    );
  }

  getAllMountains() {
    return this.mountains;
  }

  getMountainById(id) {
    const mountain = this.mountains.find(
      (mountain) => mountain.id === parseInt(id)
    );
    return mountain;
  }

  searchMountains(query) {
    const searchTerm = query.toLowerCase();
    return this.mountains.filter(
      (mountain) =>
        mountain.name.toLowerCase().includes(searchTerm) ||
        mountain.location.toLowerCase().includes(searchTerm)
    );
  }

  // Method untuk menghitung jarak antara dua koordinat menggunakan Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius bumi dalam km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Jarak dalam km
  }

  // Method untuk mendapatkan gunung terdekat
  getNearbyMountains(mountainId, limit = 4) {
    const currentMountain = this.getMountainById(mountainId);
    if (!currentMountain || !currentMountain.lat || !currentMountain.long) {
      // Jika tidak ada koordinat, kembalikan gunung random
      return this.mountains
        .filter((m) => m.id !== parseInt(mountainId))
        .slice(0, limit);
    }

    // Hitung jarak untuk semua gunung kecuali gunung saat ini
    const mountainsWithDistance = this.mountains
      .filter((mountain) => mountain.id !== parseInt(mountainId))
      .filter((mountain) => mountain.lat && mountain.long) // Pastikan ada koordinat
      .map((mountain) => ({
        ...mountain,
        distance: this.calculateDistance(
          currentMountain.lat,
          currentMountain.long,
          mountain.lat,
          mountain.long
        ),
      }))
      .sort((a, b) => a.distance - b.distance); // Urutkan berdasarkan jarak terdekat

    return mountainsWithDistance.slice(0, limit);
  }
}
