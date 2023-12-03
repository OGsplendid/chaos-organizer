import MessageMaker from './MessageMaker';

export default class Desk {
  constructor() {
    this.messageMaker = new MessageMaker();
  }

  static render() {
    return `
      <div class="desk-wrapper">
        <div class="message">
          sdlkjfasldkjflasjdf;dsf
        </div>
        <div class="message">
        <p>
          sdlkjfasldkjflasjdf;dsf
   <a href='#'>http://dfgfd.com</a>
           dsaf
          dsaf
          sadfdsafadsfdsf
          sdgds
        </p>
        </div>
      </div>
    `;
  }

  static formMessageObj(message) {
    return {
      message,
    };
  }
}

// const str = 'sdfkjl 1dsk 2ksldfj 3sldfj 2sdlkfj';
// const arr = str.split(' ');
// for (let i = 0; i < arr.length; i++) {
//   if (arr[i].startsWith('2')) {
//     const withLink = `<a href=${arr[i]}>${arr[i]}</a>`;
//     arr[i] = withLink;
//   }
// }
// const result = arr.join(' ');
// console.log(result);
