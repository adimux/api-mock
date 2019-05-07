import isEqual from 'lodash/isEqual';
import { sameMethod, parseRequestBody, normalizeParams, formDataToObject } from './utils';

function isFormData(obj) {
  if (window && window.FormData) {
    return obj instanceof window.FormData;
  }
  return false;
}

function normalizeBody(body) {
  if (isFormData(body)) {
    return formDataToObject(body);
  }
  return body;
}

class Calls {
  constructor(initCalls = []) {
    this.calls = initCalls;
  }
  filter(urlOrName, options = {}) {
    function routeMatches(call) {
      if (typeof urlOrName === 'undefined') {
        return true;
      }
      return call.route.url === urlOrName || call.route.name === urlOrName;
    }
    function optionsMatch(call) {
      if (options.method && !sameMethod(call.method, options.method)) {
        return false;
      }
      if (options.params && !isEqual(call.params, normalizeParams(options.params))) {
        return false;
      }
      if (options.query && !isEqual(call.query, normalizeParams(options.query))) {
        return false;
      }
      if (options.body && !isEqual(normalizeBody(call.body), normalizeBody(options.body))) {
        return false;
      }
      return true;
    }
    function callMatches(call) {
      if (routeMatches(call)) {
        return optionsMatch(call);
      }
      return false;
    }

    return this.calls.filter(callMatches);
  }
  called(route, options) {
    return this.filter(route, options).length > 0;
  }
  lastCall(route, options) {
    const calls = this.filter(route, options);
    if (calls.length > 0) {
      return calls.pop();
    }
    return null;
  }
  registerCall(request, route) {
    const { url, method, body } = request;
    const params = route.extractParams(request.url);
    const query = request.query;
    this.calls.push({
      route: {
        url: route.url,
        name: route.name,
      },
      url,
      method,
      body: parseRequestBody(body),
      rawBody: body,
      params,
      query,
    });
  }
  clear() {
    this.calls = [];
  }
}

export default Calls;
