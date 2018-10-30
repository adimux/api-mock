'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VueHttpInterceptor = exports.AjaxInterceptor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MockXMLHTTPRequest = require('./MockXMLHTTPRequest');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VueHttpRequestAdapter = function () {
  function VueHttpRequestAdapter(request) {
    _classCallCheck(this, VueHttpRequestAdapter);

    this.request = request;
  }

  _createClass(VueHttpRequestAdapter, [{
    key: 'url',
    get: function get() {
      return this.request.getUrl();
    }
  }, {
    key: 'method',
    get: function get() {
      return this.request.method;
    }
  }]);

  return VueHttpRequestAdapter;
}();

var Interceptor = function () {
  function Interceptor(interceptor) {
    _classCallCheck(this, Interceptor);

    this._interceptor = interceptor;
    this._active = false;
  }

  _createClass(Interceptor, [{
    key: 'active',
    get: function get() {
      return this._active;
    }
  }]);

  return Interceptor;
}();

var AjaxInterceptor = function (_Interceptor) {
  _inherits(AjaxInterceptor, _Interceptor);

  function AjaxInterceptor() {
    _classCallCheck(this, AjaxInterceptor);

    return _possibleConstructorReturn(this, (AjaxInterceptor.__proto__ || Object.getPrototypeOf(AjaxInterceptor)).apply(this, arguments));
  }

  _createClass(AjaxInterceptor, [{
    key: 'setup',
    value: function setup() {
      if (!this._active) {
        (0, _MockXMLHTTPRequest.hook)(this._interceptor);
        this._active = true;
      }
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      (0, _MockXMLHTTPRequest.restore)();
      this._active = false;
    }
  }]);

  return AjaxInterceptor;
}(Interceptor);

var VueHttpInterceptor = function (_Interceptor2) {
  _inherits(VueHttpInterceptor, _Interceptor2);

  function VueHttpInterceptor(interceptor) {
    _classCallCheck(this, VueHttpInterceptor);

    var _this2 = _possibleConstructorReturn(this, (VueHttpInterceptor.__proto__ || Object.getPrototypeOf(VueHttpInterceptor)).call(this, interceptor));

    _this2.interceptFunc = _this2.intercept.bind(_this2);
    return _this2;
  }

  _createClass(VueHttpInterceptor, [{
    key: 'setup',
    value: function setup() {
      if (!this.active) {
        Vue.http.interceptors.unshift(this.interceptFunc);
        this._active = true;
      }
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      if (this.active) {
        Vue.http.interceptors.shift(this.interceptFunc);
        this._active = false;
      }
    }
  }, {
    key: 'intercept',
    value: function intercept(vueHttpRequest, next) {
      var request = new VueHttpRequestAdapter(vueHttpRequest);
      var response = this._interceptor(request);
      if (response) {
        var status = response.status,
            reason = response.reason;

        var headers = response.header();
        next(request.respondWith(response.body, {
          status: status, reason: reason, headers: headers
        }));
      } else {
        next();
      }
    }
  }]);

  return VueHttpInterceptor;
}(Interceptor);

exports.AjaxInterceptor = AjaxInterceptor;
exports.VueHttpInterceptor = VueHttpInterceptor;