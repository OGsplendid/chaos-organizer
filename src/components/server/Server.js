export default class Server {
  constructor(url) {
    this.url = url;
  }

  async get(loadedQuantity) {
    const response = await fetch(`${this.url}/notes?loadedQuantity=${loadedQuantity}`);
    if (response.status === 400) return null;
    const data = await response.json();
    return data;
  }

  async delete(id) {
    const response = await fetch(`${this.url}/notes/${id}`, {
      method: 'DELETE',
    });
    return response.status;
  }
}
