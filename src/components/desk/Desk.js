import { defineFileType } from '../handlers';
import Popup from '../popup/Popup';
import MessageMaker from './MessageMaker';
import './desk.css';

export default class Desk {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.messageMaker = new MessageMaker();
  }

  static get html() {
    return `
        <div class="desk-wrapper">
          <div id="top-scroll" class="top-scroll"></div>
        </div>
    `;
  }

  bindToDOM() {
    const layout = Desk.html;
    this.parentEl.insertAdjacentHTML('afterbegin', layout);
    this.wrapper = this.parentEl.querySelector('.desk-wrapper');
    this.popup = new Popup(document.body);

    this.bindEvents();
  }

  bindEvents() {
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);

    this.wrapper.addEventListener('dragleave', this.onDragLeave);
    this.wrapper.addEventListener('dragover', this.onDragOver);
  }

  onDragLeave(e) {
    this.wrapper.classList.remove('ondrag');
  }

  onDragOver(e) {
    e.preventDefault();
    this.wrapper.classList.add('ondrag');
  }

  clear() {
    const rendered = this.wrapper.querySelectorAll('.message');
    rendered.forEach((m) => m.remove());
  }

  render(messages) {
    this.clear();
    messages.forEach((message) => {
      let html;
      if (message.type === 'text') html = MessageMaker.createTextMessage(message);
      if (message.type === 'file') html = MessageMaker.createFileMessage(message);
      if (message.type === 'image') html = MessageMaker.createImgMessage(message);
      this.wrapper.querySelector('.top-scroll').insertAdjacentHTML('beforebegin', html);
    });
  }
}
