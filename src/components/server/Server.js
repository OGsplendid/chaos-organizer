export default class Server {
  constructor(url) {
    this.url = url;
  }

  async get(startingIndex) {
    const response = await fetch(`${this.url}/notes/?startingIndex=${startingIndex}`);
    if (response.status === 400 || this.finished) return null;
    const data = await response.json();
    return data;
  }

  async getNew() {
    const response = await fetch(`${this.url}/note`);
    const data = await response.json();
    return data;
  }

  async post(message) {
    const response = await fetch(`${this.url}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    return response.status;
  }

  async delete(id) {
    const response = await fetch(`${this.url}/notes/${id}`, {
      method: 'DELETE',
    });
    return response.status;
  }
}
