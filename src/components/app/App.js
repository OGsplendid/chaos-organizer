import Desk from '../desk/Desk';
import Input from '../input/Input';
import Organizer from '../organizer/Organizer';

export default class App {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.messages = [];
  }

  static render() {
    return '<div class="common-wrapper"></div>';
  }

  bindToDom() {
    const html = App.render();
    this.parentEl.insertAdjacentHTML('afterbegin', html);
    this.wrapper = this.parentEl.querySelector('.common-wrapper');

    this.organizer = new Organizer();
    const organizerHTML = Organizer.render();
    this.wrapper.insertAdjacentHTML('afterbegin', organizerHTML);

    this.desk = new Desk();
    const deskHTML = Desk.render();
    this.wrapper.insertAdjacentHTML('beforeend', deskHTML);

    this.input = new Input();
    const inputHTML = Input.render();
    this.wrapper.insertAdjacentHTML('beforeend', inputHTML);
  }
}

// export default class App {
//   constructor(parentElement) {
//     this.parentElement = parentElement;
//     this.wrapper = this.parentElement.querySelector('.wrapper');
//     this.ticketHandler = new TicketHandler();
//     this.popupCreator = new PopupCreator(this.parentElement);
//     this.addTicketBtn = this.wrapper.querySelector('.add-new-ticket');

//     this.pullTickets = this.pullTickets.bind(this);
//     this.createTicket = this.createTicket.bind(this);
//     this.updateTicket = this.updateTicket.bind(this);
//     this.deleteTicket = this.deleteTicket.bind(this);
//     this.showDetails = this.showDetails.bind(this);
//     this.toggleItemStatus = this.toggleItemStatus.bind(this);

//     document.addEventListener('DOMContentLoaded', this.pullTickets);
//     this.wrapper.addEventListener('click', this.toggleItemStatus);
//     this.addTicketBtn.addEventListener('click', this.createTicket);
//     this.wrapper.addEventListener('click', this.updateTicket);
//     this.wrapper.addEventListener('click', this.deleteTicket);
//     this.wrapper.addEventListener('click', this.showDetails);
//   }

//   toggleItemStatus(e) {
//     if (!e.target.classList.contains('checkbox')) return;
//     const ticketID = e.target.closest('li').getAttribute('data-id');
//     e.target.classList.toggle('task-done');
//     if (e.target.classList.contains('task-done')) {
//       this.handleRequest('POST', `updateById&id=${ticketID}`, ticketID, true);
//     } else {
//       this.handleRequest('POST', `updateById&id=${ticketID}`, ticketID, false);
//     }
//     this.pullTickets();
//   }

//   async pullTickets() {
//     const tickets = this.wrapper.querySelectorAll('li');
//     tickets.forEach((item) => item.remove());
//     const reply = await this.handleRequest('GET', 'allTickets');
//     const parsedReply = JSON.parse(reply);
//     parsedReply.forEach((item) => {
//       let doneClass;
//       if (item.status) {
//         doneClass = 'task-done';
//       } else {
//         doneClass = null;
//       }
//       this.ticketHandler.add(item.id, item.name, item.created, doneClass);
//     });
//   }

//   async deleteTicket(e) {
//     if (!e.target.classList.contains('delete-item')) return;
//     const ticketID = e.target.closest('.list-item').getAttribute('data-id');
//     this.popupCreator.show('delete');
//     const deleteBtn = document.querySelector('.popup-save-button');
//   }

//   async showDetails(e) {
//     if (!e.target.classList.contains('short-description-wrapper')) return;
//     const ticketID = e.target.closest('.list-item').getAttribute('data-id');
//     const data = await this.handleRequest('GET', `ticketById&id=${ticketID}`);
//     const parsedData = JSON.parse(data);
//     const shortDescription = parsedData.name;
//     const fullDescription = parsedData.description;
//     if (!fullDescription) return;
//     const li = e.target.closest('li');
//     const descriptionArea = li.querySelector('.short-description-wrapper');
//     if (li.classList.contains('full')) {
//       descriptionArea.textContent = shortDescription;
//       li.classList.toggle('full');
//       return;
//     }
//     descriptionArea.insertAdjacentHTML('beforeend', `<br><br>${fullDescription}`);
//     li.classList.toggle('full');
//   }

//   createTicket() {
//     this.popupCreator.show('Добавить');

//     const saveBtn = document.querySelector('.popup-save-button');
//     saveBtn.addEventListener('click', async () => {
//       await this.handleRequest('POST', 'createTicket', null);
//       this.pullTickets();
//     });
//   }

//   async updateTicket(e) {
//     if (!e.target.classList.contains('change-item')) return;
//     const li = e.target.closest('li');
//     const ticketID = li.getAttribute('data-id');
//     const data = await this.handleRequest('GET', `ticketById&id=${ticketID}`);
//     const parsedData = JSON.parse(data);
//     const shortDescription = parsedData.name;
//     const fullDescription = parsedData.description;
//     this.popupCreator.show('Изменить');
//     const saveBtn = document.querySelector('.popup-save-button');
//     this.parentElement.querySelector('.input-description').value = shortDescription;
//     this.parentElement.querySelector('.input-full-description').value = fullDescription;
//     saveBtn.addEventListener('click', async () => {
//       await this.handleRequest('POST', `updateById&id=${ticketID}`, ticketID);
//       this.pullTickets();
//     });
//   }

//   async handleRequest(method, ending, id, status) {
//     if (method === 'GET') {
//       try {
//         const response = await fetch(`http://localhost:7070?method=${ending}`, {
//           method,
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const json = await response.json();
//         return JSON.stringify(json);
//       } catch (error) {
//         console.error('Ошибка:', error);
//       }
//     } else {
//       let shortDescription;
//       let fullDescription;
//       let obj = {
//         id,
//         name: shortDescription,
//         description: fullDescription,
//         status,
//       };
//       try {
//         shortDescription = this.parentElement.querySelector('.input-description').value;
//         fullDescription = this.parentElement.querySelector('.input-full-description').value;
//       } catch (err) {
//         obj = {
//           id,
//           status,
//         };
//       }
//       try {
//         const response = await fetch(`http://localhost:7070?method=${ending}`, {
//           method: 'POST',
//           body: JSON.stringify(obj),
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const json = await response.json();
//       } catch (error) {
//         console.error('Ошибка:', error);
//       }
//     }
//     return null;
//   }
// }
