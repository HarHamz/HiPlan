import API_CONFIG from "../config/api.js";

/**
 * Service class for handling Weather ML API calls
 */
class WeatherMLService {
  /**
   * Get seasonal weather prediction (Rainy/Sunny) for a specific month
   * @param {string} kecamatanName - District name (e.g., "Berastagi", "Malang")
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Promise<Object>} - API response with seasonality prediction
   */
  static async getSeasonalityPrediction(kecamatanName, month, year) {
    try {
      // Validate inputs
      if (!kecamatanName || !month || !year) {
        return {
          success: false,
          message: "Kecamatan, bulan, dan tahun harus diisi",
          data: null,
        };
      } // Validate month range
      if (month < 1 || month > 12) {
        return {
          success: false,
          message: "Bulan harus antara 1-12",
          data: null,
        };
      } // Build URL with query parameters
      const url = new URL(API_CONFIG.getWeatherMLURL("weatherSeasonality"));
      url.searchParams.append("kecamatan_name", kecamatanName);
      url.searchParams.append("month", month.toString());
      url.searchParams.append("year", year.toString());

      // Make API call
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }); // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();

        return {
          success: false,
          message: `Error ${response.status}: ${errorText}`,
          data: null,
        };
      }

      // Parse response
      const result = await response.json();

      // Normalize response data structure to handle API variations
      const normalizedData = this.normalizeSeasonalityResponse(result);
      return {
        success: true,
        message: "Prediksi cuaca berhasil didapatkan",
        data: normalizedData,
      };
    } catch (error) {
      return {
        success: false,
        message:
          "Terjadi kesalahan saat mengambil prediksi cuaca: " + error.message,
        data: null,
      };
    }
  }

  /**
   * Normalize seasonality response to handle API structure variations
   * @param {Object} response - Raw API response
   * @returns {Object} - Normalized response data
   */
  static normalizeSeasonalityResponse(response) {
    // Handle different possible API response structures
    return {
      request_info: response.request_info || {
        kecamatan_name: response.kecamatan_name || response.location,
        month: response.month,
        year: response.year,
      },
      analysis: response.analysis || {
        determined_seasonality:
          response.determined_seasonality ||
          response.seasonality ||
          response.analysis?.determined_seasonality,
        reasoning_metrics: response.reasoning_metrics ||
          response.analysis?.reasoning_metrics ||
          response.metrics || {
            average_precipprob: response.average_precipprob || 0,
            average_windspeed: response.average_windspeed || 0,
            average_temp: response.average_temp || 0,
            average_humidity: response.average_humidity || 0,
          },
      },
    };
  }

  /**
   * Get detailed monthly weather forecast
   * @param {string} kecamatanName - District name
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Promise<Object>} - API response with monthly forecast details
   */
  static async getMonthlyForecast(kecamatanName, month, year) {
    try {
      // Validate inputs
      if (!kecamatanName || !month || !year) {
        return {
          success: false,
          message: "Kecamatan, bulan, dan tahun harus diisi",
          data: null,
        };
      }

      // Build URL with query parameters
      const url = new URL(API_CONFIG.getWeatherMLURL("weatherSeasonality"));
      url.searchParams.append("kecamatan_name", kecamatanName);
      url.searchParams.append("month", month.toString());
      url.searchParams.append("year", year.toString());

      // Make API call
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();

        return {
          success: false,
          message: `Error ${response.status}: ${errorText}`,
          data: null,
        };
      }

      const result = await response.json();

      return {
        success: true,
        message: "Prediksi cuaca bulanan berhasil didapatkan",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message:
          "Terjadi kesalahan saat mengambil prediksi cuaca bulanan: " +
          error.message,
        data: null,
      };
    }
  }

  /**
   * Get weather forecast for a date range
   * @param {string} kecamatanName - District name
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {number} daysToPredict - Number of days to predict (1-90)
   * @returns {Promise<Object>} - API response with range forecast
   */
  static async getRangeForecast(kecamatanName, startDate, daysToPredict) {
    try {
      // Validate inputs
      if (!kecamatanName || !startDate || !daysToPredict) {
        return {
          success: false,
          message: "Semua parameter harus diisi",
          data: null,
        };
      } // Validate days range
      if (daysToPredict < 1 || daysToPredict > 90) {
        return {
          success: false,
          message: "Jumlah hari harus antara 1-90",
          data: null,
        };
      }

      // Build URL with query parameters
      const url = new URL(API_CONFIG.getWeatherMLURL("weatherRange"));
      url.searchParams.append("kecamatan_name", kecamatanName);
      url.searchParams.append("start_date", startDate);
      url.searchParams.append("days_to_predict", daysToPredict.toString());

      // Make API call
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();

        return {
          success: false,
          message: `Error ${response.status}: ${errorText}`,
          data: null,
        };
      }

      const result = await response.json();

      return {
        success: true,
        message: "Prediksi cuaca periode berhasil didapatkan",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message:
          "Terjadi kesalahan saat mengambil prediksi cuaca periode: " +
          error.message,
        data: null,
      };
    }
  }

  /**
   * Helper function to get month name in Indonesian
   * @param {number} month - Month number (1-12)
   * @returns {string} - Month name in Indonesian
   */
  static getMonthName(month) {
    const months = [
      "",
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
    return months[month] || "Invalid Month";
  }
  /**
   * Helper function to format weather seasonality for display
   * @param {string} seasonality - "Cerah" or "Hujan" from API
   * @returns {Object} - Formatted seasonality info
   */ static formatSeasonality(seasonality) {
    // Normalize the seasonality value
    const normalizedSeasonality = seasonality ? seasonality.toLowerCase() : "";

    if (
      normalizedSeasonality === "rainy" ||
      normalizedSeasonality === "hujan"
    ) {
      return {
        label: "HUJAN",
        icon: "🌧️",
        class: "rainy-season",
        color: "#3498db",
        description: "Curah hujan tinggi, persiapkan perlengkapan anti hujan",
      };
    } else if (
      normalizedSeasonality === "sunny" ||
      normalizedSeasonality === "cerah"
    ) {
      return {
        label: "CERAH",
        icon: "☀️",
        class: "sunny-season",
        color: "#f39c12",
        description: "Cuaca cerah, cocok untuk pendakian",
      };
    } else {
      // Fallback - shouldn't happen with proper API
      return {
        label: "TIDAK DIKETAHUI",
        icon: "❓",
        class: "unknown-season",
        color: "#95a5a6",
        description: `Data cuaca: ${seasonality || "tidak tersedia"}`,
      };
    }
  }
}

export default WeatherMLService;
