export class ExplorePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.init();
  }

  init() {
    this.view.render();
  }
}
