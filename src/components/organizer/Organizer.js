export default class Organizer {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static render() {
    return `
      <div class="organizer-wrapper">
        <div class="logo">
          <h2 class="logo-text">Chaos Organizer</h2>
        </div>
        <div class="buttons-wrapper">
          <button class="search-button"></button>
          <button class="attach-button"></button>
          <button class="others-button"></button>
        </div>
      </div>
    `;
  }
}
