import './organizer.css';

export default class Organizer {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static get html() {
    return `
      <div class="organizer-wrapper">
        <div class="logo">
          <h2 class="logo-text">Chaos Organizer</h2>
        </div>
        <input name="search-input" class="search-input hidden" placeholder="Type your query here" />
        <div class="buttons-wrapper">
          <div class="button-container">
            <button class="search-button"></button>
          </div>
          <div class="button-container">
            <button class="attach-button"></button>
            <input type="file" name="file" class="file-input" id="file" />
          </div>
          <div class="button-container">
            <button class="others-button"></button>
          </div>
        </div>
      </div>
    `;
  }

  bindToDOM() {
    const layout = Organizer.html;
    this.parentEl.insertAdjacentHTML('afterbegin', layout);
    this.wrapper = this.parentEl.querySelector('.organizer-wrapper');
    this.searchButton = this.wrapper.querySelector('.search-button');
    this.attachButton = this.wrapper.querySelector('.attach-button');
    this.othersButton = this.wrapper.querySelector('.others-button');
    this.searchInput = this.wrapper.querySelector('.search-input');
  }

  bindEvents() {
    this.toggleSearchInput = this.toggleSearchInput.bind(this);

    this.attachButton.addEventListener('click', () => {
      this.fileInput.dispatchEvent(new MouseEvent('click'));
    });
  }

  toggleSearchInput() {
    this.searchInput.value = '';
    this.searchInput.classList.toggle('hidden');
  }
}
