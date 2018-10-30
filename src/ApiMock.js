import {
  AjaxInterceptor,
} from './interceptors';
import Calls from './Calls';
import Router from './Router';
import Route from './Route';


class ApiMock {
  constructor() {
    this.activated = false;
    this.router = new Router();
    this.interceptor = new AjaxInterceptor(this._interceptor.bind(this));
    this.calls = new Calls();
  }
  /**
   * Register a mock route.
   *
   * @param {string} url The url to mock
   * @param {Function|Object|Number} response The response as a status code (Number), an object
   * containing at least `body`, or a callback function that will return a response object
   * and receive the request as an argument.
   * @param {Object} options Other options, like `method` to specify an HTTP method.
   * By default any HTTP method matches.
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
    this.activateInterceptor();
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
  activateInterceptor() {
    if (!this.interceptor.active) {
      this.interceptor.setup();
    }
  }
  setup() {
    this.reset();
    this.activateInterceptor();
  }
  reset() {
    this.router.clear();
    this.calls.clear();
  }
  restore() {
    this.reset();
    if (this.interceptor.active) {
      this.interceptor.teardown();
    }
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
    // const route = routes.find(routeMatches(request));
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
