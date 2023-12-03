export default class Input {
  // constructor() {
  // }

  static render() {
    return `
      <form class="input-wrapper">
        <button type="button" class="emoji-button"></button>
        <textarea class="input" rows="5" placeholder="Type here"></textarea>
        <button type="text" class="send-button"></button>
      </form>
    `;
  }
}
