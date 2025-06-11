import API_CONFIG from "../config/api.js";

/**
 * Service class for handling ML recommendation API calls
 */
class RecommendationService {
  /**
   * Get mountain recommendations from ML backend
   * @param {string} lokasi - Location preference (e.g., "Jawa Barat")
   * @param {number|string} ketinggian - Maximum altitude preference
   * @returns {Promise<Object>} - API response with recommendations
   */
  static async getRecommendations(lokasi, ketinggian) {
    try {
      // Validate inputs
      if (!lokasi || !ketinggian) {
        return {
          success: false,
          message: "Lokasi dan ketinggian harus diisi",
          recommendations: [],
        };
      }

      // Convert ketinggian to number if it's a string
      const altitude =
        typeof ketinggian === "string" ? parseInt(ketinggian) : ketinggian;

      // Prepare request payload according to ML API contract
      const requestBody = {
        lokasi: lokasi.trim(),
        ketinggian: altitude,
      };

      console.log("Sending recommendation request:", requestBody);

      // Make API call to ML backend
      const response = await fetch(API_CONFIG.getMLURL("recommendations"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error("ML API Error:", response.status, errorText);

        return {
          success: false,
          message: `Server error: ${response.status}`,
          recommendations: [],
        };
      }

      // Parse JSON response
      const data = await response.json();
      console.log("ML API Response:", data);

      // Validate response structure
      if (!data || !Array.isArray(data.rekomendasi)) {
        console.error("Invalid response structure:", data);
        return {
          success: false,
          message: "Format response tidak valid dari server",
          recommendations: [],
        };
      }

      // Return successful response
      return {
        success: true,
        message: `Ditemukan ${data.rekomendasi.length} rekomendasi gunung`,
        recommendations: data.rekomendasi,
      };
    } catch (error) {
      console.error("Error in getRecommendations:", error);

      // Handle network errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        return {
          success: false,
          message:
            "Tidak dapat terhubung ke server ML. Pastikan server ML sedang berjalan di http://127.0.0.1:8000",
          recommendations: [],
        };
      }

      // Handle other errors
      return {
        success: false,
        message: "Terjadi kesalahan saat mengambil rekomendasi",
        recommendations: [],
      };
    }
  }

  /**
   * Test ML backend connection
   * @returns {Promise<boolean>} - Connection status
   */
  static async testConnection() {
    try {
      const response = await fetch(API_CONFIG.mlRecomBackendURL, {
        method: "GET",
      });

      return response.ok;
    } catch (error) {
      console.error("ML Backend connection test failed:", error);
      return false;
    }
  }
}

export default RecommendationService;
