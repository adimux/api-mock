'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defined = defined;
exports.assert = assert;
exports.sameMethod = sameMethod;
exports.parseRequestBody = parseRequestBody;
exports.normalizeParams = normalizeParams;
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