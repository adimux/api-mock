'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_REASON = 'OK';
var DEFAULT_STATUS = 200;

var MockResponse = function () {
  function MockResponse(_ref) {
    var _ref$status = _ref.status,
        status = _ref$status === undefined ? DEFAULT_STATUS : _ref$status,
        _ref$body = _ref.body,
        body = _ref$body === undefined ? null : _ref$body,
        _ref$headers = _ref.headers,
        headers = _ref$headers === undefined ? {} : _ref$headers,
        _ref$reason = _ref.reason,
        reason = _ref$reason === undefined ? DEFAULT_REASON : _ref$reason;

    _classCallCheck(this, MockResponse);

    this._status = status;
    this._reason = reason;
    this._headers = headers;
    this._body = body;
  }

  _createClass(MockResponse, [{
    key: 'header',
    value: function header(name, value) {
      if ((0, _utils.defined)(name) && (0, _utils.defined)(value)) {
        this._headers[name] = value;
        return this;
      } else if ((0, _utils.defined)(name)) {
        return this._headers[name];
      }
      return this._headers;
    }
  }, {
    key: 'status',
    get: function get() {
      return this._status;
    }
  }, {
    key: 'statusText',
    get: function get() {
      return null;
    }
  }, {
    key: 'reason',
    get: function get() {
      return this._reason;
    }
  }, {
    key: 'body',
    get: function get() {
      return this._body;
    }
  }]);

  return MockResponse;
}();

exports.default = MockResponse;