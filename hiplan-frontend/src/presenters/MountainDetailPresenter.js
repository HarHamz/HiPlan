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
  } // Method untuk menangani pemilihan cuaca
  selectWeather(weatherCondition) {
    this.selectedWeather = weatherCondition;
    // The actual difficulty calculation is now handled by ML model in MountainDetailView
    // when predictDifficultyForSelectedWeather() is called
  }

  // Get base difficulty from mountain data
  getCurrentDifficulty() {
    // Return base difficulty - ML prediction handles dynamic calculation
    return this.mountainData.baseDifficulty || this.mountainData.difficulty;
  }

  // Get description for base difficulty
  getCurrentDifficultyDescription() {
    const difficulty = this.getCurrentDifficulty();
    return this.mountainData.getDifficultyDescription(difficulty);
  }

  // Get color for base difficulty
  getCurrentDifficultyColor() {
    const difficulty = this.getCurrentDifficulty();
    return this.mountainData.getDifficultyColor(difficulty);
  }

  // This method is no longer needed as ML handles the prediction  // updateDifficultyDisplay() is now handled by MountainDetailView's predictDifficultyForSelectedWeather()
  updateDifficultyDisplay() {
    // ML prediction is handled by MountainDetailView
  }
}
