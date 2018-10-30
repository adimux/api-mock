'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
  function Request(method, url) {
    _classCallCheck(this, Request);

    this.method = method;
    this.url = url;
    this._headers = {};
    this._body = '';
  }

  _createClass(Request, [{
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
    key: 'body',
    get: function get() {
      return this._body;
    },
    set: function set(body) {
      this._body = body;
    }
  }]);

  return Request;
}();

exports.default = Request;