import {
  AjaxInterceptor,
} from './interceptors';
import Calls from './Calls';
import Router from './Router';
import Route from './Route';

class InterceptorsManager {
  constructor() {
    this.interceptors = [];
    this.interceptFn = null;
  }
  add(interceptor) {
    if (this.interceptFn) {
      interceptor.setFn(this.interceptFn);
    }
    this.interceptors.push(interceptor);
  }
  activate() {
    this.interceptors.forEach((interceptor) => {
      if (!interceptor.active) {
        interceptor.setup();
      }
    });
  }
  deactivate() {
    this.interceptors.forEach((interceptor) => {
      if (interceptor.active) {
        interceptor.teardown();
      }
    });
  }
  setFn(interceptFn) {
    this.interceptFn = interceptFn;
    this.interceptors.forEach((interceptor) => {
      interceptor.setFn(interceptFn);
    });
  }
}

class ApiMock {
  constructor() {
    this.router = new Router();
    this.interceptorsManager = new InterceptorsManager();

    this.interceptorsManager.add(new AjaxInterceptor());
    this.interceptorsManager.setFn(this._interceptor.bind(this));

    this.calls = new Calls();
  }
  addInterceptor(interceptor) {
    this.interceptorsManager.add(interceptor);
  }

  /**
   * Register a mock route.
   *
   * Either (url, response, options) where response can be a status code, a response object containing at least
   * `body` or a callback function that accepts a request that returns a response object, and `options` which
   * contains other options lie `method`.
   *
   * Or an object containing containing {url, response, method, ...other options}
   *
   * If `method` is not specified, any HTTP method will match.
   */
  mock(...args) {
    // Transform the arguments into options to create the route with
    const options = {};

    // If the first argument is an object, then we'll use at as the options
    if (typeof args[0] === 'object') {
      Object.assign(options, args[0]);
    } else {
      // Otherwise, we expect 3 arguments: url, response, options which
      // we will build the options object from
      const [url, response, opts = {}] = args;
      Object.assign(options, { url, response, ...opts });
    }

    // Create and register the route
    this.router.register(new Route(options));

    // Activate mocking, if it's not the case already
    this.interceptorsManager.activate();
  }
  get(url, response, options = {}) {
    this.mock(url, response, Object.assign({}, options, { method: 'get' }));
  }
  post(url, response, options = {}) {
    this.mock(url, response, Object.assign({}, options, { method: 'post' }));
  }
  put(url, response, options = {}) {
    this.mock(url, response, Object.assign({}, options, { method: 'put' }));
  }
  setup() {
    this.reset();
    this.interceptorsManager.activate();
  }
  reset() {
    this.router.clear();
    this.calls.clear();
  }
  restore() {
    this.reset();
    this.interceptorsManager.deactivate();
  }
  getRoute(urlOrName, method = null) {
    const route = this.router.getRoute(urlOrName, method);

    if (!route) {
      const methodFormatted = method ? `${method.toUpperCase()} ` : '';
      throw new Error(`No route found corresponding to ${methodFormatted}'${urlOrName}'`);
    }

    return route;
  }
  _interceptor(request) {
    // search for a registered mock route that matches the URL of the request
    const route = this.router.route(request);

    // if a route is found
    if (route) {
      // First, register the call for inspection purposes.
      this.calls.registerCall(request, route);
      // Interrupt the http request and respond immediately with the mock response
      return route.getResponse(request);
    }
    // if no route is found let the request continue executing by not returning anything.
  }
  called(route, options) {
    return this.calls.called(route, options);
  }
  lastCall(route, options) {
    return this.calls.lastCall(route, options);
  }
}

export default ApiMock;
