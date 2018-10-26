import Vue from 'vue';
import { hook, restore } from './MockXMLHTTPRequest';

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


class Interceptor {
  constructor(interceptor) {
    this._interceptor = interceptor;
    this._active = false;
  }
  get active() {
    return this._active;
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
  constructor(interceptor) {
    super(interceptor);
    this.interceptFunc = this.intercept.bind(this);
  }
  setup() {
    if (!this.active) {
      Vue.http.interceptors.unshift(this.interceptFunc);
      this._active = true;
    }
  }
  teardown() {
    if (this.active) {
      Vue.http.interceptors.shift(this.interceptFunc);
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

export {
  AjaxInterceptor,
  VueHttpInterceptor,
};
