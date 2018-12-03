import { hook, restore } from './MockXMLHTTPRequest';
import { extractQuery } from './utils';

class VueHttpRequestAdapter {
  constructor(request) {
    this.request = request;
  }
  get url() {
    return this.request.getUrl();
  }
  get method() {
    return this.request.method;
  }
}


class SuperAgentRequestAdapter {
  constructor(request) {
    this.request = request;
  }
  get url() {
    return this.request.url;
  }
  get method() {
    return this.request.method;
  }
  get query() {
    const saQuery = this.request.qs || {};
    return { ...extractQuery(this.url), ...saQuery }
  }
}


class Interceptor {
  constructor() {
    this._active = false;
  }
  get active() {
    return this._active;
  }
  setFn(interceptor) {
    this._interceptor = interceptor;
  }
  setup() {
    throw new Error('Not implemented');
  }
  teardown() {
    throw new Error('Not implemented');
  }
}

class AjaxInterceptor extends Interceptor {
  setup() {
    if (!this._active) {
      hook(this._interceptor);
      this._active = true;
    }
  }
  teardown() {
    restore();
    this._active = false;
  }
}

class VueHttpInterceptor extends Interceptor {
  constructor(vueHttp) {
    super();
    this.vueHttp = vueHttp;
    this.interceptFunc = this.intercept.bind(this);
  }
  setup() {
    if (!this.active) {
      this.vueHttp.interceptors.unshift(this.interceptFunc);
      this._active = true;
    }
  }
  teardown() {
    if (this.active) {
      this.vueHttp.interceptors.shift(this.interceptFunc);
      this._active = false;
    }
  }
  intercept(vueHttpRequest, next) {
    const request = new VueHttpRequestAdapter(vueHttpRequest);
    const response = this._interceptor(request);
    if (response) {
      const { status, reason } = response;
      const headers = response.header();
      next(request.respondWith(response.body, {
        status, reason, headers,
      }));
    } else {
      next();
    }
  }
}

function superAgentResponseAdapter(mockResponse) {
  return {
    status: mockResponse.status,
    body: mockResponse.body,
    reason: mockResponse.reason,
  };
}


class SuperAgentInterceptor extends Interceptor {
  constructor(superagent) {
    super();
    this.superagent = superagent;
  }
  setup() {
    if (!this.superagent._isPatched) {
      this.patch();
      this.superagent._isPatched = true;
    }
    this._active = true;
  }
  patch() {
    const self = this;
    this.origEnd = this.superagent.Request.prototype.end;

    this.superagent.Request.prototype.end = function end(callback) {
      function getCallbackArguments(response) {
        const saResponse = superAgentResponseAdapter(response);
        let error = null;
        const status = Number(response.status);
        if (status < 200 || status > 206) {
          error = new Error(response.status);
          error.status = response.status;
          error.response = saResponse;
        }

        return [error, error === null ? saResponse : null];
      }

      const request = new SuperAgentRequestAdapter(this);
      const response = self._interceptor(request);

      if (response) {
        const [error, adaptedResponse] = getCallbackArguments(response);
        callback(error, adaptedResponse);
      } else {
        self.origEnd.call(this, callback);
      }
    };
  }
  teardown() {
    if (this.superagent._isPatched) {
      this.superagent.end = this.origEnd;
    }
  }
}


export {
  Interceptor,
  AjaxInterceptor,
  VueHttpInterceptor,
  SuperAgentInterceptor,
};
