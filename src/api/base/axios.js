
class Axioxs{
  constructor(config = {}) {
    this.baseURL = config.baseURL || "";
    this.headers = config.headers || {};
  }

  async request(method, url, body) {
    const config = {
      method,
      headers: { "Content-Type": "application/json", ...this.headers },
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const res = await fetch(this.baseURL + url, config);
      const data = await res.json();
      return data;
    } catch (e) {
      throw new Error(e.message || "Request failed");
    }
  }

  async get(url) {
    return this.request("GET", url);
  }

  async post(url, body) {
    return this.request("POST", url, body);
  }

  async put(url, body) {
    return this.request("PUT", url, body);
  }

  async patch(url, body) {
    return this.request("PATCH", url, body);
  }

  async delete(url) {
    return this.request("DELETE", url);
  }
}

export default Axioxs;
