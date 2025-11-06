
class Axioxs{
  constructor(config = {}) {
    this.baseURL = config.baseURL || "";
    this.headers = config.headers || {};
  }

  async request(method, url, body, options = {}) {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
        ...options.headers,
      },
      body: this.prepareBody(body, options.headers),
    };

    try {
      const res = await fetch(this.baseURL + url, config);
      const data = await res.json();
      return data;
    } catch (e) {
      throw new Error(e.message || "Request failed");
    }
  }

  prepareBody(body, headers = {}) {
    if (!body) return null;

    if (body instanceof FormData) {
      return body;
    }

    const contentType = headers["Content-Type"] || headers["content-type"];
    if (contentType && contentType.includes("multipart/form-data")) {
      return body;
    }

    return JSON.stringify(body);
  }

  async get(url, options = {}) {
    return this.request("GET", url, null, options);
  }

  async post(url, body, options = {}) {
    return this.request("POST", url, body, options);
  }

  async put(url, body, options = {}) {
    return this.request("PUT", url, body, options);
  }

  async patch(url, body, options = {}) {
    return this.request("PATCH", url, body, options);
  }

  async delete(url, options = {}) {
    return this.request("DELETE", url, null, options);
  }
}

export default Axioxs;
