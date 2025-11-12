// Mock 여부 설정
const USE_MOCK = false;

import MockServer from "./MockServer.js";

class Axioxs {
  constructor(config = {}) {
    this.baseURL = config.baseURL || "";
    this.headers = config.headers || {};
    this.useMock = config.useMock !== undefined ? config.useMock : USE_MOCK;
    this.mockServer = new MockServer();
  }

  async request(method, url, body, options = {}) {
    if (this.useMock) {
      console.log(`[MOCK] ${method} ${url}`);
      return await this.mockServer.handle(method, url, body);
    }

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

      if (res.status === 204 || res.headers.get("Content-Length") === "0") {
        return null;
      }

      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch (e) {
      throw new Error(e.message || "Request failed");
    }
  }

  prepareBody(body, headers = {}) {
    if (!body) return null;
    if (body instanceof FormData) return body;

    const type = headers["Content-Type"] || headers["content-type"];
    if (type && type.includes("multipart/form-data")) return body;

    return JSON.stringify(body);
  }

  get(url, opt = {}) { return this.request("GET", url, null, opt); }
  post(url, body, opt = {}) { return this.request("POST", url, body, opt); }
  put(url, body, opt = {}) { return this.request("PUT", url, body, opt); }
  patch(url, body, opt = {}) { return this.request("PATCH", url, body, opt); }
  delete(url, opt = {}) { return this.request("DELETE", url, null, opt); }
}

export default Axioxs;
