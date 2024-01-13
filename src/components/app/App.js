import Server from '../server/Server';
import Desk from '../desk/Desk';
import Input from '../input/Input';
import Organizer from '../organizer/Organizer';
import { defineFileType, downloadFile, getNotificationInfo } from '../handlers';
import MessageMaker from '../desk/MessageMaker';

export default class App {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.server = new Server('http://localhost:7070');
    this.ws = new WebSocket('ws://localhost:7070/ws');
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
    this.audioBtn = this.wrapper.querySelector('.audio');
    this.videoBtn = this.wrapper.querySelector('.video');
    this.inputForm = this.wrapper.querySelector('.input-wrapper');
    this.deskWrapper = this.wrapper.querySelector('.desk-wrapper');
    this.topScroll = this.wrapper.querySelector('.top-scroll');
    this.bottomScroll = this.wrapper.querySelector('.bottom-scroll');
    this.sendBtn = this.wrapper.querySelector('.send-button');
    this.organizerWrapper = this.wrapper.querySelector('.organizer-wrapper');
  }

  bindEvents() {
    this.onWsMessage = this.onWsMessage.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.loadOnScroll = this.loadOnScroll.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.checkLoadingNecessity = this.checkLoadingNecessity.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.toggleMessageOptions = this.toggleMessageOptions.bind(this);
    this.onOptionsClick = this.onOptionsClick.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.onGeolocationClick = this.onGeolocationClick.bind(this);
    this.handleSendCoords = this.handleSendCoords.bind(this);
    this.onMediaClick = this.onMediaClick.bind(this);

    this.ws.addEventListener('open', this.onWsOpen);
    this.ws.addEventListener('message', this.onWsMessage);
    this.ws.addEventListener('close', this.onWsClose);
    this.ws.addEventListener('error', this.onWsError);

    this.attachButton.addEventListener('click', () => {
      this.fileInput.dispatchEvent(new MouseEvent('click'));
    });
    this.fileInput.addEventListener('change', this.handleFileInputChange);
    this.searchButton.addEventListener('click', this.onSearchClick);

    document.addEventListener('DOMContentLoaded', this.loadOnScroll);
    this.deskWrapper.addEventListener('scroll', this.checkLoadingNecessity);
    this.deskWrapper.addEventListener('resize', this.checkLoadingNecessity);
    this.inputForm.addEventListener('submit', this.handleSendMessage);
    this.deskWrapper.addEventListener('drop', this.onDrop);
    this.wrapper.addEventListener('click', this.toggleMessageOptions);

    this.geolocationBtn.addEventListener('click', this.onGeolocationClick);
    this.audioBtn.addEventListener('click', (e) => {
      this.onMediaClick(e.target.className);
    });
    this.videoBtn.addEventListener('click', (e) => {
      this.onMediaClick(e.target.className);
    });
  }

  static onWsOpen() {
    MessageMaker.showInfo('Добро пожаловать в чат');
  }

  static onWsClose() {
    MessageMaker.showInfo('Соединение невозможно');
  }

  onWsMessage(e) {
    this.messages.push(JSON.parse(e.data));
    this.desk.render(this.messages);
  }

  static onWsError() {
    MessageMaker.showInfo('Соединение невозможно');
  }

  async loadOnScroll() { // загрузка сообщений по скроллу
    this.isLoading = true;
    const data = await this.server.get(this.messages.length);
    if (!data) return;
    this.messages = [...this.messages, ...data];
    this.desk.render(this.messages);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  checkLoadingNecessity() { // проверка необходимости подгрузки новых сообщений
    const topScroll = document.getElementById('top-scroll');
    if (topScroll.getBoundingClientRect().bottom > -200 && !this.isLoading) {
      this.loadOnScroll();
    }
  }

  onSearchClick() { // добавить или убрать строку поиска по сообщениям
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

  onDrop(e) { // обработка DnD
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
      this.ws.send(JSON.stringify(message));
    });
  }

  handleFileInputChange() { // добавление вложения
    const file = this.fileInput.files && this.fileInput.files[0];
    if (!file) return;

    const type = defineFileType(file.type);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', async (e) => {
      const link = e.target.result;
      const data = { type, name: file.name, link };
      const message = MessageMaker.createMessageObj(data);
      this.ws.send(JSON.stringify(message));
    });
  }

  async handleSendMessage(e) { // отправка сообщения через основной input
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
    this.ws.send(JSON.stringify(message));
    this.inputForm.reset();
  }

  toggleMessageOptions(e) { // нажатие на опции сообщения
    if (!e.target.classList.contains('message-options-btn')) {
      const existingOptions = this.deskWrapper.querySelector('.message-options-wrapper');
      if (existingOptions) existingOptions.remove();
      return;
    }
    const active = e.target.closest('.message');
    if (active.querySelector('.message-options-wrapper')) {
      active.querySelector('.message-options-wrapper').remove();
      return;
    }
    const existingOptions = this.deskWrapper.querySelector('.message-options-wrapper');
    if (existingOptions) existingOptions.remove();
    const id = active.getAttribute('data-id');
    const oneditMessage = this.messages.find((m) => m.id === Number(id));
    const html = MessageMaker.createMessageOptions(oneditMessage);
    active.insertAdjacentElement('beforeend', html);
    const options = active.querySelector('.message-options-wrapper');
    options.addEventListener('click', this.onOptionsClick);
  }

  async onOptionsClick(e) {
    const id = e.target.closest('.message').getAttribute('data-id');
    if (e.target.classList.contains('message-options-delete')) {
      const status = await this.server.delete(id);
      if (status === 204) {
        const deletable = this.messages.findIndex((m) => m.id === Number(id));
        this.messages.splice(deletable, 1);
        this.desk.render(this.messages);
      }
    }
    if (e.target.classList.contains('message-options-download')) {
      const linkSrc = e.target.closest('.message').getAttribute('data-link');
      const fileName = e.target.closest('.message').querySelector('p').textContent;
      downloadFile(linkSrc, fileName);
    }
    // if (e.target.classList.contains('message-options-pin')) {
    //   const index = this.messages.findIndex((m) => m.id === Number(id));
    //   this.messages[index].pinned = true;
    //   this.deskWrapper.insertAdjacentElement('beforebegin', e.target.closest('.message'));
    // e.target.closest('.message').remove();
    // }
  }

  onGeolocationClick() { // отправка геолокации
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => {
        this.handleSendCoords(data);
      }, (error) => {
        MessageMaker.showInfo('Разрешите доступ к координатам на вашем устройстве');
      }, { enableHighAccuracy: true });
    }
  }

  async handleSendCoords(data) {
    const { latitude, longitude } = await data.coords;
    const geo = { type: 'text', text: `${latitude}, ${longitude}` };
    const message = MessageMaker.createMessageObj(geo);
    this.ws.send(JSON.stringify(message));
  }

  async onMediaClick(type) { // работа с медиа
    let stream;
    if (type === 'audio') {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    } else {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    }

    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.addEventListener('start', () => {
      MessageMaker.showInfo('Запись началась');
    });
    recorder.addEventListener('dataavailable', (e) => {
      chunks.push(e.data);
    });
    recorder.addEventListener('stop', async () => {
      MessageMaker.showInfo('Конец записи');
      const blob = new Blob(chunks);
      const link = URL.createObjectURL(blob);
      const data = { type, name: '', link };
      const message = MessageMaker.createMessageObj(data);
      this.ws.send(JSON.stringify(message));
    });
    recorder.start();
    this.wrapper.querySelector('.stopBtn').addEventListener('click', () => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    });
  }

  static handleSchedule(text) { // настройка уведомления
    const { time, info } = getNotificationInfo(text);
    if (time <= 0) {
      MessageMaker.showInfo('Вы не можете запланировать прошедшие события');
      return;
    }
    setTimeout(() => {
      const notification = new Notification('Scheduled', {
        body: `${info}`,
        requireInteraction: true,
      });
    }, time);
  }

  static async scheduleNotification(text) {
    if (!window.Notification) return;

    if (Notification.permission === 'granted') {
      App.handleSchedule(text);
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission) {
        App.handleSchedule(text);
      } else {
        MessageMaker.showInfo('Разрешите уведомления в настройках браузера');
      }
    }
  }
}
