// Anda bisa memperluas ini nanti jika perlu interaksi dengan model
export class ExplorePresenter {
  constructor(view, model) {
    // Tambahkan model jika perlu mengambil data gunung
    this.view = view;
    this.model = model; // Simpan referensi ke model
    this.init();
  }

  init() {
    // const mountains = this.model.getAllMountains(); // Jika ingin menggunakan data dari model
    // this.view.render(mountains); // Kirim data gunung ke view jika perlu
    this.view.render();
  }
}
