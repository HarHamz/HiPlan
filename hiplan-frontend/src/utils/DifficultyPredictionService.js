import API_CONFIG from "../config/api.js";

/**
 * Difficulty and Time Prediction Service
 * Handles API calls to the ML model for difficulty and time estimation
 */
class DifficultyPredictionService {
  constructor() {
    // Using API_CONFIG for better configuration management
    this.baseUrl = API_CONFIG.mlDifficultyBackendURL;
  }

  /**
   * Predict difficulty score and estimated time based on mountain and weather data
   * @param {Object} mountainData - Mountain information
   * @param {Object} weatherData - Weather conditions
   * @returns {Promise<Object>} Prediction result
   */ async predictDifficulty(mountainData, weatherData) {
    try {
      const payload = {
        ketinggian: parseFloat(mountainData.altitude) || 0,
        jarak: parseFloat(mountainData.distance) * 1000 || 0,
        elevation_gain: parseFloat(mountainData.elevationGain) || 0,
        temp: parseFloat(weatherData.temp) || 20,
        precipprob: parseFloat(weatherData.precipprob) || 0,
        windspeed: parseFloat(weatherData.windspeed) || 0,
        humidity: parseFloat(weatherData.humidity) || 50,
      };

      const response = await fetch(
        API_CONFIG.getDifficultyMLURL("difficultyPrediction"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const result = await response.json();

      // Validate response structure
      if (
        typeof result.difficulty_score !== "number" ||
        typeof result.estimated_time !== "string"
      ) {
        throw new Error("Invalid response format from ML API");
      }

      return {
        success: true,
        data: {
          difficulty_score: result.difficulty_score,
          estimated_time: result.estimated_time,
        },
      };
    } catch (error) {
      console.error("Error predicting difficulty:", error);

      // Provide more specific error messages
      let errorMessage = error.message;
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage =
          "Gagal terhubung ke server ML. Periksa koneksi internet Anda.";
      } else if (error.message.includes("HTTP 5")) {
        errorMessage = "Server ML mengalami masalah. Silakan coba lagi nanti.";
      } else if (error.message.includes("HTTP 4")) {
        errorMessage =
          "Data yang dikirim tidak valid. Periksa kembali data gunung dan cuaca.";
      }

      return {
        success: false,
        error: errorMessage,
        data: null,
      };
    }
  }

  /**
   * Get difficulty color based on score
   * @param {number} score
   * @returns {string}
   */
  getDifficultyColor(score) {
    if (score <= 3) return "#28a745";
    if (score <= 5) return "#ffc107";
    if (score <= 7) return "#fd7e14";
    return "#dc3545";
  }

  /**
   * Get difficulty description based on score
   * @param {number} score
   * @returns {string}
   */
  getDifficultyDescription(score) {
    if (score <= 3) return "Mudah";
    if (score <= 5) return "Sedang";
    if (score <= 7) return "Sulit";
    return "Sangat Sulit";
  }

  /**
   * Parse weather data from Visual Crossing format
   * @param {Object} weatherCard - Weather card data from Visual Crossing
   * @returns {Object} Parsed weather data for prediction
   */
  parseWeatherForPrediction(weatherCard) {
    return {
      temp: this.extractNumericValue(weatherCard.temp),
      precipprob: this.extractNumericValue(weatherCard.precip),
      windspeed: this.extractNumericValue(weatherCard.wind),
      humidity: this.extractNumericValue(weatherCard.humid),
    };
  }

  /**
   * Extract numeric value from string (remove units)
   * @param {string} valueString - String with value and unit
   * @returns {number} Numeric value
   */
  extractNumericValue(valueString) {
    if (typeof valueString === "number") return valueString;
    if (typeof valueString !== "string") return 0;

    // Remove units and extract number
    const numericValue = parseFloat(valueString.replace(/[^0-9.-]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  }
}

export default new DifficultyPredictionService();
