import { defined } from './utils';
import { extractQuery } from './utils';

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
  get query() {
    return extractQuery(this.url);
  }
}

export default Request;
