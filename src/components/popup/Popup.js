import './popup.css';

export default class Popup {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static getHTML(title) {
    return `
      <dialog class="popup">
        <div class="popup-wrapper">
          <h3 class="popup-title"></h3>
          <div class="popup-buttons">
            <button class="yes">Yes</button>
            <button class="no">No</button>
          </div>
        </div>
      </dialog>
    `;
  }

  showUp(title) {
    const html = Popup.getHTML(title);
    this.parentEl.insertAdjacentHTML('afterbegin', html);
  }

  closeDown() {
    const popup = this.parentEl.querySelector('.popup-wrapper');
    popup.remove();
  }
}
