import { getLinks } from '../handlers';

export default class MessageMaker {
  static createMessageObj(data) {
    const obj = {
      type: data.type,
      content: {},
    };
    if (data.type === 'text') {
      obj.content.text = getLinks(data.text);
    } else {
      obj.content.text = data.name;
      obj.content.link = data.link;
    }
    return obj;
  }

  static createMessageHTML(messageObj) {
    const { content } = messageObj;
    const result = document.createElement('div');
    const button = document.createElement('button');
    button.className = 'message-options-btn';
    result.appendChild(button);
    result.dataset.id = messageObj.id;
    result.className = `${messageObj.type}-message message`;

    if (messageObj.type === 'audio' || messageObj.type === 'video') {
      const media = document.createElement(`${messageObj.type}`);
      media.setAttribute('controls', '');
      media.src = content.link;
      result.appendChild(media);
      return result;
    }

    const p = document.createElement('p');
    p.innerHTML = content.text;

    if (messageObj.type !== 'text') result.dataset.link = content.link;
    result.insertBefore(p, button);
    const img = document.createElement('img');
    img.className = 'src';
    if (messageObj.type === 'file') img.src = '../../../icons8-file-80.png';
    if (messageObj.type === 'image') img.src = `${content.link}#${Math.random()}`;
    result.insertBefore(img, button);
    return result;
  }

  static createMessageOptions(messageObj) {
    const options = document.createElement('div');
    options.className = 'message-options-wrapper';
    const button = document.createElement('button');
    button.className = 'message-options-delete';
    button.textContent = 'Delete';
    options.appendChild(button);
    const pinBtn = document.createElement('button');
    pinBtn.className = 'message-options-pin';
    pinBtn.textContent = 'Pin';
    options.appendChild(pinBtn);
    if (messageObj.type === 'text' || messageObj.type === 'audio' || messageObj.type === 'video') return options;
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'message-options-download';
    downloadBtn.textContent = 'Download';
    options.appendChild(downloadBtn);
    return options;
  }

  static showInfo(info) {
    let block = document.getElementById('popup');
    if (!block) {
      block = document.createElement('div');
      block.className = 'popup';
      block.id = 'popup';
      document.body.appendChild(block);
    }
    block.classList.remove('invisible');
    block.textContent = info;
    setTimeout(() => {
      block.classList.add('invisible');
    }, 3000);
  }
}
