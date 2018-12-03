'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractQuery = extractQuery;
exports.defined = defined;
exports.assert = assert;
exports.sameMethod = sameMethod;
exports.parseRequestBody = parseRequestBody;
exports.normalizeParams = normalizeParams;

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

function defined(value) {
  return typeof value !== 'undefined';
}

function assert(condition) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function sameMethod(method1, method2) {
  return method1.toLowerCase() === method2.toLowerCase();
}

function parseRequestBody(body) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (e) {}
  }
  return body;
}
function normalizeValue(value) {
  if (typeof value === 'string') {
    return value;
  }if (typeof value === 'number') {
    return String(value);
  } else if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }
  throw new Error('Invalid query parameter / url parameter value');
}

function normalizeParams(params) {
  var normalized = {};
  Object.keys(params).forEach(function (key) {
    normalized[key] = normalizeValue(params[key]);
  });
  return normalized;
}