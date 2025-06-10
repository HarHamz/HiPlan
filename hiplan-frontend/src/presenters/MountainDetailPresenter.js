import { MountainDetailView } from "../views/MountainDetailView";

export class MountainDetailPresenter {
  constructor(view, model, mountainId) {
    this.view = view || new MountainDetailView();
    this.model = model;
    this.mountainId = mountainId;
    this.selectedWeather = null;

    this.mountainData = this.model.getMountainById(this.mountainId);

    if (!this.mountainData) {
      this.mountainData = this.model.getAllMountains()[0];
    }
  }
  init() {
    this.view.render(this.mountainData, this);
  }

  getMountainById(id) {
    return this.model.getMountainById(id);
  }

  getAllMountains() {
    return this.model.getAllMountains();
  }

  getNearbyMountains() {
    return this.model.getNearbyMountains(this.mountainId, 4);
  }

  // Method untuk menangani pemilihan cuaca
  selectWeather(weatherCondition) {
    this.selectedWeather = weatherCondition;
    // Update tampilan jalur dengan tingkat kesulitan yang baru
    this.updateDifficultyDisplay();
  }

  // Method untuk mendapatkan tingkat kesulitan berdasarkan cuaca yang dipilih
  getCurrentDifficulty() {
    if (this.selectedWeather) {
      return this.mountainData.calculateWeatherDifficulty(this.selectedWeather);
    }
    return this.mountainData.difficulty;
  }

  // Method untuk mendapatkan deskripsi tingkat kesulitan saat ini
  getCurrentDifficultyDescription() {
    const difficulty = this.getCurrentDifficulty();
    return this.mountainData.getDifficultyDescription(difficulty);
  }

  // Method untuk mendapatkan warna tingkat kesulitan saat ini
  getCurrentDifficultyColor() {
    const difficulty = this.getCurrentDifficulty();
    return this.mountainData.getDifficultyColor(difficulty);
  }

  // Method untuk update tampilan tingkat kesulitan
  updateDifficultyDisplay() {
    if (this.view && this.view.updateDifficultyDisplay) {
      this.view.updateDifficultyDisplay(
        this.getCurrentDifficulty(),
        this.getCurrentDifficultyDescription(),
        this.getCurrentDifficultyColor(),
        this.selectedWeather
      );
    }
  }
}
