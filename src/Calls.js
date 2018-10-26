import isEqual from 'lodash/isEqual';
import { sameMethod, parseRequestBody, normalizeParams } from './utils';

function getQueryString(url) {
  const startIdx = url.indexOf('?');
  if (startIdx >= 0) {
    return url.substring(startIdx + 1);
  }
  return '';
}

function extractQuery(url) {
  const query = {};
  const urlParams = new URLSearchParams(getQueryString(url));
  for (const key of urlParams.keys()) {
    const value = urlParams.getAll(key);
    if (value.length === 1) {
      query[key] = value[0];
    } else {
      query[key] = value;
    }
  }
  return query;
}


class Calls {
  constructor(initCalls = []) {
    this.calls = initCalls;
  }
  filter(urlOrName, options = {}) {
    function routeMatches(call) {
      if (typeof route === 'undefined') {
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
      if (options.body && !isEqual(call.body, options.body)) {
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
    if (calls.lengh > 0) {
      return calls.pop();
    }
    return null;
  }
  registerCall(request, route) {
    const { url, method, body } = request;
    const params = route.extractParams(request.url);
    const query = extractQuery(request.url);
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
