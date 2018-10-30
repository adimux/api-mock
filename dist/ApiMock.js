'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interceptors = require('./interceptors');

var _Calls = require('./Calls');

var _Calls2 = _interopRequireDefault(_Calls);

var _Router = require('./Router');

var _Router2 = _interopRequireDefault(_Router);

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiMock = function () {
  function ApiMock() {
    _classCallCheck(this, ApiMock);

    this.activated = false;
    this.router = new _Router2.default();
    this.interceptor = new _interceptors.AjaxInterceptor(this._interceptor.bind(this));
    this.calls = new _Calls2.default();
  }

  _createClass(ApiMock, [{
    key: 'mock',
    value: function mock() {
      var options = {};

      if (_typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object') {
        Object.assign(options, arguments.length <= 0 ? undefined : arguments[0]);
      } else {
        var _options = _slicedToArray(options, 3),
            url = _options[0],
            response = _options[1],
            opts = _options[2];

        Object.assign(options, _extends({ url: url, response: response }, opts));
      }

      this.router.register(new _Route2.default(options));

      this.activateInterceptor();
    }
  }, {
    key: 'get',
    value: function get(url, response) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.mock(url, response, Object.assign({}, options, { method: 'get' }));
    }
  }, {
    key: 'post',
    value: function post(url, response) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.mock(url, response, Object.assign({}, options, { method: 'post' }));
    }
  }, {
    key: 'put',
    value: function put(url, response) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.mock(url, response, Object.assign({}, options, { method: 'put' }));
    }
  }, {
    key: 'activateInterceptor',
    value: function activateInterceptor() {
      if (!this.interceptor.active) {
        this.interceptor.setup();
      }
    }
  }, {
    key: 'setup',
    value: function setup() {
      this.reset();
      this.activateInterceptor();
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.router.clear();
      this.calls.clear();
    }
  }, {
    key: 'restore',
    value: function restore() {
      this.reset();
      if (this.interceptor.active) {
        this.interceptor.teardown();
      }
    }
  }, {
    key: 'getRoute',
    value: function getRoute(urlOrName) {
      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var route = this.router.getRoute(urlOrName, method);

      if (!route) {
        var methodFormatted = method ? method.toUpperCase() + ' ' : '';
        throw new Error('No route found corresponding to ' + methodFormatted + '\'' + urlOrName + '\'');
      }

      return route;
    }
  }, {
    key: '_interceptor',
    value: function _interceptor(request) {
      var route = this.router.route(request);

      if (route) {
        this.calls.registerCall(request, route);

        return route.getResponse(request);
      }
    }
  }, {
    key: 'called',
    value: function called(route, options) {
      return this.calls.called(route, options);
    }
  }, {
    key: 'lastCall',
    value: function lastCall(route, options) {
      return this.calls.lastCall(route, options);
    }
  }]);

  return ApiMock;
}();

exports.default = ApiMock;