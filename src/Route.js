import MockResponse from './MockResponse';
import { sameMethod, defined } from './utils';

const QUERY_PARAMS = '(?:\\?.+|)';
const ENDING_SLASH = '(?:/|)';
const PARAM = '([A-Z0-9]*)';
const PLACEHOLDER_REGEX = /({(?:[^}]+)})/g;

function clearPlaceholder(placeholder) {
  return placeholder.replace(/{/, '').replace(/}/, '');
}

function extractPlaceholders(routeUrl) {
  const matches = routeUrl.match(PLACEHOLDER_REGEX);
  if (matches) {
    return matches.map(m => clearPlaceholder(m));
  }
  return [];
}

function replaceAt(str, index, replacement) {
  return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

function replacePlaceholders(str, callback) {
  const clear = placeholder => placeholder.replace(/{/, '').replace(/}/, '');

  return str.replace(PLACEHOLDER_REGEX, p => callback(clear(p)));
}

function treatEndSlash(url) {
  if (url.endsWith('/')) {
    return replaceAt(url, url.length - 1, ENDING_SLASH);
  }
  return url;
}

function asReg(routeUrl) {
  if (routeUrl instanceof RegExp) {
    return routeUrl;
  }
  const urlReg = replacePlaceholders(treatEndSlash(routeUrl), () => PARAM);
  return new RegExp(`${urlReg}${QUERY_PARAMS}`);
}

function getAbsoluteUrl(url) {
  const isAbsolute = /^[a-z][a-z0-9+.-]*:/.test(url);
  if (!isAbsolute) {
    return window.location + url;
  }
  return url;
}

class Route {
  constructor(options) {
    const { url, response, name = null, method = null } = options;

    if (!url || !defined(response)) {
      throw new Error('At least url and response should be present.');
    }
    this._url = url;
    this._response = response;
    this._regex = asReg(url);
    this._name = name || url;

    const isStringUrl = typeof url === 'string';
    this._placeholders = isStringUrl ? extractPlaceholders(url) : [];

    this._method = method ? method.toLowerCase() : null;
  }
  getResponse(request) {
    return this.adaptResponse(this._response, request);
  }
  adaptResponse(response, request) {
    // if response is a function
    if (typeof response === 'function') {
      const params = this.extractParams(request.url);

      // Call the function, passing it the request, and adapt the data returned to a response
      return this.adaptResponse(response(request, { params }));
    } else if (typeof response === 'number') {
      // If it's a number, then we assume it is the status code.
      // So we'll return a response object with that status code.
      return new MockResponse({
        status: response,
      });
    }
    return new MockResponse(response);
  }
  get name() {
    return this._name;
  }
  get method() {
    return this._method;
  }
  get url() {
    return this._url;
  }
  get numPlaceholders() {
    return this._placeholders.length;
  }
  /**
   * Extracts the url parameters defined in the route from an URL.
   *
   * @param  {String} The URL
   * @return {Object} The parameters.
   */
  extractParams(url) {
    // const absUrl = getAbsoluteUrl(url);
    const matches = url.match(this._regex);

    if (matches && matches.length > 1) {
      const params = {};
      matches.slice(1).forEach((value, idx) => {
        const placeholder = this._placeholders[idx];
        params[placeholder] = value;
      });
      return params;
    }
    return {};
  }
  matches(request) {
    if (this.method && !sameMethod(request.method, this.method)) {
      // console.log(`Method ${request.method} matches ${this.method}: false`);
      return false;
    }

    const matches = this._urlMatches(request.url);

    // console.log(`URL ${request.url} matches ${this.url}: ${matches}`);
    return this._urlMatches(request.url);
  }
  _urlMatches(url) {
    const matches = url.match(this._regex);
    return matches && matches.length > 0;
  }
}

export default Route;
