import gunungData from "../assets/data/gunung_indonesia.json";
import DifficultyPredictionService from "../utils/DifficultyPredictionService.js";

export class Mountain {
  constructor(
    id,
    nama,
    provinsi,
    kabupaten,
    kecamatan,
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
    this.kecamatan = kecamatan; // Add kecamatan field
    this.kabupaten = kabupaten; // Keep kabupaten for reference
    this.provinsi = provinsi; // Keep provinsi for reference
    this.altitude = ketinggian;
    this.mainImage = gambar || "bromo.jpg";
    this.description = deskripsi;
    // Initialize with basic difficulty, will be updated with ML prediction when weather data is available
    this.baseDifficulty = this.calculateBaseDifficulty(elevationGain, jarakM);
    this.difficulty = this.baseDifficulty; // Default to base difficulty
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

  // Basic difficulty calculation for initial display (before ML prediction)
  calculateBaseDifficulty(elevationGain, distance) {
    // Simple base calculation for initial display
    let score = 2; // Start with base score

    // Elevation factor (simplified)
    if (elevationGain > 2000) score += 3;
    else if (elevationGain > 1500) score += 2.5;
    else if (elevationGain > 1000) score += 2;
    else if (elevationGain > 500) score += 1;

    // Distance factor (simplified)
    if (distance > 25000) score += 2;
    else if (distance > 15000) score += 1.5;
    else if (distance > 10000) score += 1;

    return Math.min(Math.max(Math.round(score * 10) / 10, 1), 10);
  }

  /**
   * Get ML-based difficulty prediction with weather data
   * @param {Object} weatherData - Weather conditions
   * @returns {Promise<Object>} Prediction result with difficulty and time
   */
  async predictDifficultyWithWeather(weatherData) {
    try {
      const result = await DifficultyPredictionService.predictDifficulty(
        this,
        weatherData
      );

      if (result.success) {
        // Update the difficulty with ML prediction
        this.difficulty = result.data.difficulty_score;
        this.estimatedTimeML = result.data.estimated_time;

        return {
          success: true,
          difficulty: result.data.difficulty_score,
          estimatedTime: result.data.estimated_time,
          description: this.getDifficultyDescription(
            result.data.difficulty_score
          ),
          color: this.getDifficultyColor(result.data.difficulty_score),
        };
      } else {
        // Fallback to base difficulty if ML fails
        return {
          success: false,
          difficulty: this.baseDifficulty,
          estimatedTime: this.estimatedTime,
          description: this.getDifficultyDescription(this.baseDifficulty),
          color: this.getDifficultyColor(this.baseDifficulty),
          error: result.error,
        };
      }
    } catch (error) {
      // Fallback to base difficulty
      return {
        success: false,
        difficulty: this.baseDifficulty,
        estimatedTime: this.estimatedTime,
        description: this.getDifficultyDescription(this.baseDifficulty),
        color: this.getDifficultyColor(this.baseDifficulty),
        error: error.message,
      };
    }
  }

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
          data.Kecamatan, // Add kecamatan parameter
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
      .filter((mountain) => mountain.lat && mountain.long)
      .map((mountain) => ({
        ...mountain,
        distance: this.calculateDistance(
          currentMountain.lat,
          currentMountain.long,
          mountain.lat,
          mountain.long
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    return mountainsWithDistance.slice(0, limit);
  }
}
