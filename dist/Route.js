'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MockResponse = require('./MockResponse');

var _MockResponse2 = _interopRequireDefault(_MockResponse);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QUERY_PARAMS = '(?:\\?.+|)';
var ENDING_SLASH = '(?:/|)';
var PARAM = '([^/]+)';
var PLACEHOLDER_REGEX = /({(?:[^}]+)})/g;

function clearPlaceholder(placeholder) {
  return placeholder.replace(/{/, '').replace(/}/, '');
}

function extractPlaceholders(routeUrl) {
  var matches = routeUrl.match(PLACEHOLDER_REGEX);
  if (matches) {
    return matches.map(function (m) {
      return clearPlaceholder(m);
    });
  }
  return [];
}

function replaceAt(str, index, replacement) {
  return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

function replacePlaceholders(str, callback) {
  var clear = function clear(placeholder) {
    return placeholder.replace(/{/, '').replace(/}/, '');
  };

  return str.replace(PLACEHOLDER_REGEX, function (p) {
    return callback(clear(p));
  });
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
  var urlReg = replacePlaceholders(treatEndSlash(routeUrl), function () {
    return PARAM;
  });
  return new RegExp('' + urlReg + QUERY_PARAMS + '$');
}

function getAbsoluteUrl(url) {
  var isAbsolute = /^[a-z][a-z0-9+.-]*:/.test(url);
  if (!isAbsolute) {
    return window.location + url;
  }
  return url;
}

var Route = function () {
  function Route(options) {
    _classCallCheck(this, Route);

    var url = options.url,
        response = options.response,
        _options$name = options.name,
        name = _options$name === undefined ? null : _options$name,
        _options$method = options.method,
        method = _options$method === undefined ? null : _options$method;


    if (!url || !(0, _utils.defined)(response)) {
      throw new Error('At least url and response should be present.');
    }
    this._url = url;
    this._response = response;
    this._regex = asReg(url);
    this._name = name || url;

    var isStringUrl = typeof url === 'string';
    this._placeholders = isStringUrl ? extractPlaceholders(url) : [];

    this._method = method ? method.toLowerCase() : null;
  }

  _createClass(Route, [{
    key: 'getResponse',
    value: function getResponse(request) {
      return this.adaptResponse(this._response, request);
    }
  }, {
    key: 'adaptResponse',
    value: function adaptResponse(response, request) {
      if (typeof response === 'function') {
        var params = this.extractParams(request.url);

        return this.adaptResponse(response(request, { params: params }));
      } else if (typeof response === 'number') {
        return new _MockResponse2.default({
          status: response
        });
      }
      return new _MockResponse2.default(response);
    }
  }, {
    key: 'extractParams',
    value: function extractParams(url) {
      var _this = this;

      var matches = url.match(this._regex);

      if (matches && matches.length > 1) {
        var params = {};
        matches.slice(1).forEach(function (value, idx) {
          var placeholder = _this._placeholders[idx];
          params[placeholder] = value;
        });
        return params;
      }
      return {};
    }
  }, {
    key: 'matches',
    value: function matches(request) {
      if (this.method && !(0, _utils.sameMethod)(request.method, this.method)) {
        return false;
      }

      var matches = this._urlMatches(request.url);

      return this._urlMatches(request.url);
    }
  }, {
    key: '_urlMatches',
    value: function _urlMatches(url) {
      var matches = url.match(this._regex);
      return matches && matches.length > 0;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    }
  }, {
    key: 'method',
    get: function get() {
      return this._method;
    }
  }, {
    key: 'url',
    get: function get() {
      return this._url;
    }
  }, {
    key: 'numPlaceholders',
    get: function get() {
      return this._placeholders.length;
    }
  }]);

  return Route;
}();

exports.default = Route;