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
        <button type="button" class="stopBtn hidden"></button>
        <button type="button" class="options-button"></button>
        <button type="submit" class="send-button"></button>
        <div class="options hidden">
          <button class="geolocation">Send Geolocation</button>
          <button class="audio">Record Audio</button>
          <button class="video">Record Video</button>
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
    this.geoBtn = this.wrapper.querySelector('.geolocation');
    this.audioBtn = this.wrapper.querySelector('.audio');
    this.videoBtn = this.wrapper.querySelector('.video');

    this.bindEvents();
  }

  bindEvents() {
    this.onOptionsClick = this.onOptionsClick.bind(this);
    this.showStopBtn = this.showStopBtn.bind(this);

    this.optionsBtn.addEventListener('click', this.onOptionsClick);
    this.geoBtn.addEventListener('click', this.onOptionsClick);
    this.audioBtn.addEventListener('click', this.onOptionsClick);
    this.audioBtn.addEventListener('click', this.showStopBtn);
    this.videoBtn.addEventListener('click', this.onOptionsClick);
    this.videoBtn.addEventListener('click', this.showStopBtn);
  }

  onOptionsClick() {
    this.options.classList.toggle('hidden');
  }

  showStopBtn() {
    const btn = this.wrapper.querySelector('.stopBtn');
    btn.classList.remove('hidden');
    btn.addEventListener('click', () => btn.classList.add('hidden'));
  }
}
