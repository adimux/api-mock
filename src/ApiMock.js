/* SPDX-License-Identifier: MIT */
/* Copyright © 2018-2024 Adam Cherti <adamcherti@gmail.com> */

import {
  AjaxInterceptor,
} from './interceptors';
import Calls from './Calls';
import Router from './Router';
import Route from './Route';

/**
 * @access private
 */
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

/**
 * @access public
 */
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
   * Regiters a mock route.
   *
   * @param {String} url The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}`
   * @param {Object|Number|Function} response=200 The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that returns a response object.
   * @param {Object} options More options defining the route.
   * @param {String} options.method The HTTP method the route responds to.
   * @access public
   *//**
   * Registers a mock route.
   * @param {Object} options Options defining the route.
   * @param {String} options.url The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}`
   * @param {Object|Number|Function} options.response=200 The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that returns a response object.
   * @param {String} options.method The HTTP method. If not specified, the URL will be mocked no matter the HTTP method.
   * @access public
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
  /**
   * Shortcut for `mock`, but sets the HTTP method to `get`.
   * @param {String} url The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}`
   * @param {Object|Number|Function} response=200 The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that returns a response object.
   *
   * @access public
   */
  get(url, response, options = {}) {
    this.mock(url, response, Object.assign({}, options, { method: 'get' }));
  }
  /**
   * Shortcut for `mock`, but sets the HTTP method to `post`.
   * @param {String} url The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}`
   * @param {Object|Number|Function} response=200 The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that returns a response object.
   * @access public
   */
  post(url, response, options = {}) {
    this.mock(url, response, Object.assign({}, options, { method: 'post' }));
  }
  /**
   * Shortcut for `mock`, but sets the HTTP method to `put`.
   * @param {String} url The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}`
   * @param {Object|Number|Function} response=200 The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that returns a response object.
   * @access public
   */
  put(url, response, options = {}) {
    this.mock(url, response, Object.assign({}, options, { method: 'put' }));
  }
  setup() {
    this.reset();
    this.interceptorsManager.activate();
  }
  /**
   * Clears all the routes and clear the history of intercepted API calls.
   *
   * @access public
   */
  reset() {
    this.router.clear();
    this.calls.clear();
  }
  /**
   * Restores everything to its original state (i.e unmocks, clears the routes, clears the call registered).
   *
   * @access public
   */
  restore() {
    this.reset();
    this.interceptorsManager.deactivate();
  }
/**
 * Get a route by its name (or URL if it doesn't have a name).
 * @param {string} urlOrName The name of the route, if it has one, or its URL.
 * @param {string} method The HTTP method of the route, in case multiple routes have the same URL but a different HTTP method. If you pass `null` and you are searching by URL, the first route that matches the URL will be returned. Of course, if the route has a name, there is no need to specify the HTTP method because the name is supposed to be unique.
 */
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
  /**
   * Determines whether a route was called with a specific body or specific query / URL parameters.
   *
   * @param {string} route The name of the route, or its URL if it doesn't have a name,
   * @param {Object} options The URL parameters, query parameters or body to filter the calls with.
   * @param {Object} options.params The URL parameters (i.e the values of the placeholders in the URL of the route like `user_id` in `api/users/{user_id}`) by which the call should have been made.
   * @param {Object} options.query The query parameters (i.e the parameters after "?") by which the call should have been made.
   * @param {Object} options.body The body by which the call should have been made.
   * @return {Boolean} True if the route was called with those options, False if not.
   */
  called(route, options) {
    return this.calls.called(route, options);
  }
  lastCall(route, options) {
    return this.calls.lastCall(route, options);
  }
}

export default ApiMock;
