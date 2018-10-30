'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getQueryString(url) {
  var startIdx = url.indexOf('?');
  if (startIdx >= 0) {
    return url.substring(startIdx + 1);
  }
  return '';
}

function extractQuery(url) {
  var query = {};
  var urlParams = new URLSearchParams(getQueryString(url));
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = urlParams.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      var value = urlParams.getAll(key);
      if (value.length === 1) {
        query[key] = value[0];
      } else {
        query[key] = value;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return query;
}

var Calls = function () {
  function Calls() {
    var initCalls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, Calls);

    this.calls = initCalls;
  }

  _createClass(Calls, [{
    key: 'filter',
    value: function filter(urlOrName) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      function routeMatches(call) {
        if (typeof route === 'undefined') {
          return true;
        }
        return call.route.url === urlOrName || call.route.name === urlOrName;
      }
      function optionsMatch(call) {
        if (options.method && !(0, _utils.sameMethod)(call.method, options.method)) {
          return false;
        }
        if (options.params && !(0, _isEqual2.default)(call.params, (0, _utils.normalizeParams)(options.params))) {
          return false;
        }
        if (options.query && !(0, _isEqual2.default)(call.query, (0, _utils.normalizeParams)(options.query))) {
          return false;
        }
        if (options.body && !(0, _isEqual2.default)(call.body, options.body)) {
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
  }, {
    key: 'called',
    value: function called(route, options) {
      return this.filter(route, options).length > 0;
    }
  }, {
    key: 'lastCall',
    value: function lastCall(route, options) {
      var calls = this.filter(route, options);
      if (calls.lengh > 0) {
        return calls.pop();
      }
      return null;
    }
  }, {
    key: 'registerCall',
    value: function registerCall(request, route) {
      var url = request.url,
          method = request.method,
          body = request.body;

      var params = route.extractParams(request.url);
      var query = extractQuery(request.url);
      this.calls.push({
        route: {
          url: route.url,
          name: route.name
        },
        url: url,
        method: method,
        body: (0, _utils.parseRequestBody)(body),
        rawBody: body,
        params: params,
        query: query
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.calls = [];
    }
  }]);

  return Calls;
}();

exports.default = Calls;