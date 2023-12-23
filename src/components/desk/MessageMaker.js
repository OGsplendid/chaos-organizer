import { getLinks } from '../handlers';

export default class MessageMaker {
  static createMessageObj(data) {
    if (data.type === 'text') {
      const textWithLinks = getLinks(data.text);
      return {
        type: data.type,
        content: {
          text: textWithLinks,
        },
      };
    }
    if (data.type === 'image') {
      return {
        type: data.type,
        content: {
          text: data.name,
          link: data.link,
        },
      };
    }
    if (data.type === 'file') {
      return {
        type: data.type,
        content: {
          text: data.name,
          link: data.link,
        },
      };
    }
    return 'undefined';
  }

  static createTextMessage(message) {
    const { content } = message;
    return `
      <div data-id="${message.id}" class="text-message message">
        <p>${content.text}</p>
        <button class="message-options-btn"></button>
      </div>
    `;
  }

  static createFileMessage(message) {
    const { content } = message;
    return `
      <div data-link=${content.link} data-id="${message.id}" class="file-message message">
        <h5 class='file-name'>${content.text}</h5>
        <img src='../../../icons8-file-80.png' />
        <button class="message-options-btn"></button>
      </div>
    `;
  }

  static createImgMessage(message) {
    const { content } = message;
    return `
      <div data-link=${content.link} data-id="${message.id}" class="img-message message">
        <h5 class='file-name'>${content.text}</h5>
        <img class="src" src=${content.link} />
        <button class="message-options-btn"></button>
      </div>
    `;
  }

  static createMessageOptions(withDownload) {
    if (withDownload) {
      return `
        <div class="message-options-wrapper">
          <button class="message-options-delete">Delete</button>
          <button class="message-options-download">Download</button>
        </div>
      `;
    }
    return `
      <div class="message-options-wrapper">
        <button class="message-options-delete">Delete</button>
      </div>
    `;
  }
}
