'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interceptors = undefined;

var _ApiMock = require('./ApiMock');

var _ApiMock2 = _interopRequireDefault(_ApiMock);

var _interceptors = require('./interceptors');

var interceptors = _interopRequireWildcard(_interceptors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _ApiMock2.default();
exports.interceptors = interceptors;