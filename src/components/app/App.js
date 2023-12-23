import Server from '../server/Server';
import Desk from '../desk/Desk';
import Input from '../input/Input';
import Organizer from '../organizer/Organizer';
import { defineFileType, downloadFile } from '../handlers';
import MessageMaker from '../desk/MessageMaker';

export default class App {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.server = new Server('http://localhost:7070');
    this.messages = [];
    this.isLoading = false;
  }

  static get html() {
    return '<div class="common-wrapper"></div>';
  }

  bindToDom() {
    const layout = App.html;
    this.parentEl.insertAdjacentHTML('afterbegin', layout);
    this.wrapper = this.parentEl.querySelector('.common-wrapper');

    this.inputController = new Input(this.wrapper);
    this.inputController.bindToDOM();

    this.desk = new Desk(this.wrapper);
    this.desk.bindToDOM();

    this.organizer = new Organizer(this.wrapper);
    this.organizer.bindToDOM();

    this.bindElements();
    this.bindEvents();
  }

  bindElements() {
    this.searchButton = this.wrapper.querySelector('.search-button');
    this.attachButton = this.wrapper.querySelector('.attach-button');
    this.othersButton = this.wrapper.querySelector('.others-button');
    this.fileInput = this.wrapper.querySelector('.file-input');

    this.emojiBtn = this.wrapper.querySelector('.emoji-button');
    this.geolocationBtn = this.wrapper.querySelector('.geolocation');
    // this.notificationBtn = this.wrapper.querySelector('.notification');
    this.inputForm = this.wrapper.querySelector('.input-wrapper');
    this.deskWrapper = this.wrapper.querySelector('.desk-wrapper');
    this.topScroll = this.wrapper.querySelector('.top-scroll');
    this.bottomScroll = this.wrapper.querySelector('.bottom-scroll');
    this.sendBtn = this.wrapper.querySelector('.send-button');
    this.organizerWrapper = this.wrapper.querySelector('.organizer-wrapper');
  }

  bindEvents() {
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.loadOnScroll = this.loadOnScroll.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.checkLoadingNecessity = this.checkLoadingNecessity.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.toggleMessageOptions = this.toggleMessageOptions.bind(this);
    this.onOptionsClick = this.onOptionsClick.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.loadOnChange = this.loadOnChange.bind(this);
    this.store = this.store.bind(this);
    this.restore = this.restore.bind(this);
    this.onGeolocationClick = this.onGeolocationClick.bind(this);
    this.handleSendCoords = this.handleSendCoords.bind(this);
    // this.onNotificationClick = this.onNotificationClick.bind(this);
    // this.scheduleNotification = this.scheduleNotification.bind(this);

    this.attachButton.addEventListener('click', () => {
      this.fileInput.dispatchEvent(new MouseEvent('click'));
    });
    this.fileInput.addEventListener('change', this.handleFileInputChange);
    this.searchButton.addEventListener('click', this.onSearchClick);

    window.addEventListener('storage', this.restore);
    document.addEventListener('DOMContentLoaded', this.restore);
    this.deskWrapper.addEventListener('scroll', this.checkLoadingNecessity);
    this.deskWrapper.addEventListener('resize', this.checkLoadingNecessity);
    this.inputForm.addEventListener('submit', this.handleSendMessage);
    this.deskWrapper.addEventListener('drop', this.onDrop);
    this.wrapper.addEventListener('click', this.toggleMessageOptions);

    this.geolocationBtn.addEventListener('click', this.onGeolocationClick);
    // this.notificationBtn.addEventListener('click', this.onNotificationClick);
  }

  store() {
    localStorage.setItem('messages', JSON.stringify(this.messages));
  }

  restore() {
    this.messages = JSON.parse(localStorage.getItem('messages'));
    this.desk.render(this.messages);
  }

  async loadOnScroll() {
    this.isLoading = true;
    const data = await this.server.get(this.messages.length);
    if (!data) return;
    this.messages = [...this.messages, ...data];
    this.store();
    this.desk.render(this.messages);
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  checkLoadingNecessity() {
    const topScroll = document.getElementById('top-scroll');
    if (topScroll.getBoundingClientRect().bottom > -100 && !this.isLoading) {
      this.loadOnScroll();
    }
  }

  async loadOnChange(message = false) {
    if (message) {
      const newMessage = await this.server.getNew();
      if (!newMessage) return;
      this.messages = [newMessage, ...this.messages];
    }
    this.store();
    this.desk.render(this.messages);
  }

  onSearchClick() {
    this.organizer.toggleSearchInput();
    const searchInput = this.organizerWrapper.querySelector('.search-input');
    searchInput.focus();
    if (searchInput.classList.contains('hidden')) {
      this.desk.render(this.messages);
    }
    searchInput.addEventListener('input', this.onSearchInputChange);
    window.addEventListener('keydown', (e) => {
      if (e.code !== 'Escape') return;
      this.organizer.toggleSearchInput();
      this.desk.render(this.messages);
    });
  }

  onSearchInputChange(e) {
    const text = e.target.value.toLowerCase();
    if (!text.trim()) {
      this.desk.render(this.messages);
    }
    const result = this.messages.filter((m) => m.content.text.toLowerCase().includes(text));
    this.desk.render(result);
  }

  onDrop(e) {
    e.preventDefault();
    this.deskWrapper.classList.remove('ondrag');
    const file = e.dataTransfer.files && e.dataTransfer.files[0];

    const type = defineFileType(file.type);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', async (ev) => {
      const link = ev.target.result;
      const data = { type, name: file.name, link };
      const message = MessageMaker.createMessageObj(data);
      const status = await this.server.post(message);
      if (status === 204) {
        this.loadOnChange(true);
      }
    });
  }

  handleFileInputChange() {
    const file = this.fileInput.files && this.fileInput.files[0];
    if (!file) return;

    const type = defineFileType(file.type);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', async (e) => {
      const link = e.target.result;
      const data = { type, name: file.name, link };
      const message = MessageMaker.createMessageObj(data);
      const status = await this.server.post(message);
      if (status === 204) {
        this.loadOnChange(true);
      }
    });
  }

  async handleSendMessage(e) {
    e.preventDefault();
    const text = this.wrapper.querySelector('.input').value;
    if (!text.trim()) return;
    if (text.trim().startsWith('@schedule')) {
      this.scheduleNotification(text);
      this.inputForm.reset();
      return;
    }
    const data = { type: 'text', text };
    const message = MessageMaker.createMessageObj(data);
    const status = await this.server.post(message);
    if (status === 204) {
      this.inputForm.reset();
      this.loadOnChange(true);
    }
  }

  toggleMessageOptions(e) {
    if (e.target.classList.contains('message-options-btn')
      && e.target.closest('.message').classList.contains('onedit')) {
      const message = e.target.closest('.message');
      message.classList.remove('onedit');
      message.querySelector('.message-options-wrapper').removeEventListener('click', this.onOptionsClick);
      message.querySelector('.message-options-wrapper').remove();
      return;
    }

    const messages = [...this.deskWrapper.querySelectorAll('.message')];
    if (!messages.length) return;
    messages.forEach((m) => {
      m.classList.remove('onedit');
      const options = m.querySelector('.message-options-wrapper');
      if (options) {
        options.removeEventListener('click', this.onOptionsClick);
        options.remove();
      }
    });

    if (e.target.classList.contains('message-options-btn')) {
      const message = e.target.closest('.message');
      let html;
      if (message.classList.contains('text-message')) {
        html = MessageMaker.createMessageOptions(false);
      } else {
        html = MessageMaker.createMessageOptions(true);
      }
      message.classList.add('onedit');
      message.insertAdjacentHTML('beforeend', html);
      const options = message.querySelector('.message-options-wrapper');
      options.addEventListener('click', this.onOptionsClick);
    }
  }

  async onOptionsClick(e) {
    const id = e.target.closest('.message').getAttribute('data-id');
    if (e.target.classList.contains('message-options-delete')) {
      const status = await this.server.delete(id);
      if (status === 204) {
        const deletable = this.messages.findIndex((m) => m.id === Number(id));
        this.messages.splice(deletable, 1);
        this.loadOnChange();
      }
    }
    if (e.target.classList.contains('message-options-download')) {
      const linkSrc = e.target.closest('.message').getAttribute('data-link');
      const fileName = e.target.closest('.message').querySelector('.file-name').textContent;
      downloadFile(linkSrc, fileName);
    }
  }

  onGeolocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => {
        this.handleSendCoords(data);
      }, (error) => {
        console.log(error);
      }, { enableHighAccuracy: true });
    }
  }

  async handleSendCoords(data) {
    const { latitude, longitude } = await data.coords;
    const geo = { type: 'text', text: `${latitude}, ${longitude}` };
    const message = MessageMaker.createMessageObj(geo);
    const status = await this.server.post(message);
    if (status === 204) {
      this.inputForm.reset();
      this.loadOnChange(true);
    }
  }
  //
  // async scheduleNotification(text) {
  //   if (Notification.permission === 'granted') {
  //     this.showNotification(text);
  //     return;
  //   }
  //   if (Notification.permission === 'default') {
  //     const permission = await Notification.requestPermission();
  //     if (permission) {
  //       this.showNotification(text);
  //     }
  //   }
  // }

  // showNotification(text) {
  //   const notification = new Notification(text, {
  //     body: 'Chaos Organizer',
  //     requireInteraction: true,
  //   });
  //   console.log(this);
  // }
}
