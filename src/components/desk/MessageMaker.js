export default class MessageMaker {
  static renderText(message) {
    return `
      <div class="message">
        ${message}
      </div>
    `;
  }
}
