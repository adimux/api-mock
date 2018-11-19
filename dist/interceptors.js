'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuperAgentInterceptor = exports.VueHttpInterceptor = exports.AjaxInterceptor = exports.Interceptor = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var SuperAgentRequestAdapter = function () {
  function SuperAgentRequestAdapter(request) {
    _classCallCheck(this, SuperAgentRequestAdapter);

    this.request = request;
  }

  _createClass(SuperAgentRequestAdapter, [{
    key: 'url',
    get: function get() {
      return this.request.url;
    }
  }, {
    key: 'method',
    get: function get() {
      return this.request.method;
    }
  }]);

  return SuperAgentRequestAdapter;
}();

var Interceptor = function () {
  function Interceptor() {
    _classCallCheck(this, Interceptor);

    this._active = false;
  }

  _createClass(Interceptor, [{
    key: 'setFn',
    value: function setFn(interceptor) {
      this._interceptor = interceptor;
    }
  }, {
    key: 'setup',
    value: function setup() {
      throw new Error('Not implemented');
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      throw new Error('Not implemented');
    }
  }, {
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

  function VueHttpInterceptor(vueHttp) {
    _classCallCheck(this, VueHttpInterceptor);

    var _this2 = _possibleConstructorReturn(this, (VueHttpInterceptor.__proto__ || Object.getPrototypeOf(VueHttpInterceptor)).call(this));

    _this2.vueHttp = vueHttp;
    _this2.interceptFunc = _this2.intercept.bind(_this2);
    return _this2;
  }

  _createClass(VueHttpInterceptor, [{
    key: 'setup',
    value: function setup() {
      if (!this.active) {
        this.vueHttp.interceptors.unshift(this.interceptFunc);
        this._active = true;
      }
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      if (this.active) {
        this.vueHttp.interceptors.shift(this.interceptFunc);
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

function superAgentResponseAdapter(mockResponse) {
  return {
    status: mockResponse.status,
    body: mockResponse.body,
    reason: mockResponse.reason
  };
}

var SuperAgentInterceptor = function (_Interceptor3) {
  _inherits(SuperAgentInterceptor, _Interceptor3);

  function SuperAgentInterceptor(superagent) {
    _classCallCheck(this, SuperAgentInterceptor);

    var _this3 = _possibleConstructorReturn(this, (SuperAgentInterceptor.__proto__ || Object.getPrototypeOf(SuperAgentInterceptor)).call(this));

    _this3.superagent = superagent;
    return _this3;
  }

  _createClass(SuperAgentInterceptor, [{
    key: 'setup',
    value: function setup() {
      if (!this.superagent._isPatched) {
        this.patch();
        this.superagent._isPatched = true;
      }
      this._active = true;
    }
  }, {
    key: 'patch',
    value: function patch() {
      var self = this;
      this.origEnd = this.superagent.Request.prototype.end;

      this.superagent.Request.prototype.end = function end(callback) {
        function getCallbackArguments(response) {
          var saResponse = superAgentResponseAdapter(response);
          var error = null;
          var status = Number(response.status);
          if (status < 200 || status > 206) {
            error = new Error(response.status);
            error.status = response.status;
            error.response = saResponse;
          }

          return [error, error === null ? saResponse : null];
        }

        var request = new SuperAgentRequestAdapter(this);
        var response = self._interceptor(request);

        if (response) {
          var _getCallbackArguments = getCallbackArguments(response),
              _getCallbackArguments2 = _slicedToArray(_getCallbackArguments, 2),
              error = _getCallbackArguments2[0],
              adaptedResponse = _getCallbackArguments2[1];

          callback(error, adaptedResponse);
        } else {
          self.origEnd.call(this, callback);
        }
      };
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      if (this.superagent._isPatched) {
        this.superagent.end = this.origEnd;
      }
    }
  }]);

  return SuperAgentInterceptor;
}(Interceptor);

exports.Interceptor = Interceptor;
exports.AjaxInterceptor = AjaxInterceptor;
exports.VueHttpInterceptor = VueHttpInterceptor;
exports.SuperAgentInterceptor = SuperAgentInterceptor;