import './input.css';

export default class Input {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static get html() {
    return `
      <form class="input-wrapper">
        <button type="button" class="emoji-button"></button>
        <textarea class="input" rows="5" placeholder="Type here"></textarea>
        <button type="button" class="options-button"></button>
        <button type="submit" class="send-button"></button>
        <div class="options hidden">
          <button class="geolocation">Send Geolocation</button>
          <button class="notification">Send Notification</button>
        </div>
      </form>
    `;
  }

  bindToDOM() {
    const layout = Input.html;
    this.parentEl.insertAdjacentHTML('afterbegin', layout);
    this.wrapper = this.parentEl.querySelector('.input-wrapper');
    this.optionsBtn = this.wrapper.querySelector('.options-button');
    this.options = this.wrapper.querySelector('.options');

    this.bindEvents();
  }

  bindEvents() {
    this.onOptionsClick = this.onOptionsClick.bind(this);

    this.optionsBtn.addEventListener('click', this.onOptionsClick);
  }

  onOptionsClick() {
    this.options.classList.toggle('hidden');
  }
}
