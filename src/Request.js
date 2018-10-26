import { defined } from './utils';

class Request {
  constructor(method, url) {
    this.method = method;
    this.url = url;
    this._headers = {};
    this._body = '';
  }

  header(name, value) {
    if (defined(name) && defined(value)) {
      this._headers[name] = value;
      return this;
    } else if (defined(name)) {
      return this._headers[name];
    }
    return this._headers;
  }

  get body() {
    return this._body;
  }
  set body(body) {
    this._body = body;
  }
}

export default Request;
