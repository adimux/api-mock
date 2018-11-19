'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var InterceptorsManager = function () {
  function InterceptorsManager() {
    _classCallCheck(this, InterceptorsManager);

    this.interceptors = [];
    this.interceptFn = null;
  }

  _createClass(InterceptorsManager, [{
    key: 'add',
    value: function add(interceptor) {
      if (this.interceptFn) {
        interceptor.setFn(this.interceptFn);
      }
      this.interceptors.push(interceptor);
    }
  }, {
    key: 'activate',
    value: function activate() {
      this.interceptors.forEach(function (interceptor) {
        if (!interceptor.active) {
          interceptor.setup();
        }
      });
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.interceptors.forEach(function (interceptor) {
        if (interceptor.active) {
          interceptor.teardown();
        }
      });
    }
  }, {
    key: 'setFn',
    value: function setFn(interceptFn) {
      this.interceptFn = interceptFn;
      this.interceptors.forEach(function (interceptor) {
        interceptor.setFn(interceptFn);
      });
    }
  }]);

  return InterceptorsManager;
}();

var ApiMock = function () {
  function ApiMock() {
    _classCallCheck(this, ApiMock);

    this.router = new _Router2.default();
    this.interceptorsManager = new InterceptorsManager();

    this.interceptorsManager.add(new _interceptors.AjaxInterceptor());
    this.interceptorsManager.setFn(this._interceptor.bind(this));

    this.calls = new _Calls2.default();
  }

  _createClass(ApiMock, [{
    key: 'addInterceptor',
    value: function addInterceptor(interceptor) {
      this.interceptorsManager.add(interceptor);
    }
  }, {
    key: 'mock',
    value: function mock() {
      var options = {};

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (_typeof(args[0]) === 'object') {
        Object.assign(options, args[0]);
      } else {
        var url = args[0],
            response = args[1],
            _args$ = args[2],
            opts = _args$ === undefined ? {} : _args$;

        Object.assign(options, _extends({ url: url, response: response }, opts));
      }

      this.router.register(new _Route2.default(options));

      this.interceptorsManager.activate();
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
    key: 'setup',
    value: function setup() {
      this.reset();
      this.interceptorsManager.activate();
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
      this.interceptorsManager.deactivate();
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