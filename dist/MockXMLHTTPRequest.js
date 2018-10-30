'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hook = hook;
exports.restore = restore;

var _Request = require('./Request');

var _Request2 = _interopRequireDefault(_Request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var XHR = window.XMLHttpRequest;
var READY_STATE = {
  DONE: 4,
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3
};

function MockXMLHTTPRequest() {
  var _Function$prototype$b;

  function overrideProps(xhr) {
    var overrideableProps = ['responseText', 'responseUrl', 'response', 'readyState', 'status', 'statusText'];

    overrideableProps.forEach(function (attr) {
      Object.defineProperty(xhr, attr, {
        writable: true
      });
    });
  }

  var send = XHR.prototype.send;
  var open = XHR.prototype.open;
  var getAllRresponseHeadersOrig = XHR.prototype.getAllRresponseHeaders;
  var getResponseHeaderOrig = XHR.prototype.getResponseHeader;
  var setRequestHeaderOrig = XHR.prototype.setRequestHeader;

  function sendReplacement(body) {
    this.request.body = body;
    var interceptor = MockXMLHTTPRequest.interceptor;

    if (interceptor) {
      var response = MockXMLHTTPRequest.interceptor(this.request);
      if (response) {
        overrideProps(this);
        this.mockResponse = response;
        this.status = response.status;
        this.statusText = response.statusText;
        this.readyState = READY_STATE.DONE;
        this.responseUrl = '';
        this.response = response.body;
        this.statusText = response.statusText;
        if (this.onload) {
          this.onload();
        }
        return;
      }
    }

    send.call(this, body);
  }

  function openReplacement(method, url) {
    this.request = new _Request2.default(method, url);

    for (var _len2 = arguments.length, openArgs = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      openArgs[_key2 - 2] = arguments[_key2];
    }

    open.call.apply(open, [this, method, url].concat(openArgs));
  }

  function getAllRresponseHeaders() {
    if (this.mockResponse) {
      return this.mockResponse.header();
    }
    return getAllRresponseHeadersOrig.call(this);
  }

  function getResponseHeader(name) {
    if (this.mockResponse) {
      return this.mockResponse.header(name)[name];
    }
    return getResponseHeaderOrig.call(this, name);
  }

  function setRequestHeader(name, value) {
    this.request.header(name, value);
    setRequestHeaderOrig.call(this, name, value);
  }

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var XhrConstructor = (_Function$prototype$b = Function.prototype.bind).call.apply(_Function$prototype$b, [XHR].concat(args));

  var wrapped = new XhrConstructor();

  wrapped.open = openReplacement;
  wrapped.send = sendReplacement;
  wrapped.getResponseHeader = getResponseHeader;
  wrapped.getAllRresponseHeaders = getAllRresponseHeaders;
  wrapped.setRequestHeader = setRequestHeader;

  return wrapped;
}

MockXMLHTTPRequest.interceptor = null;

MockXMLHTTPRequest.setInterceptor = function (i) {
  MockXMLHTTPRequest.interceptor = i;
};

function hook(interceptor) {
  if (window.XMLHttpRequest !== MockXMLHTTPRequest) {
    window.XMLHttpRequest = MockXMLHTTPRequest;
  }
  MockXMLHTTPRequest.setInterceptor(interceptor);
}

function restore() {
  window.XMLHttpRequest = XHR;
}

exports.default = MockXMLHTTPRequest;