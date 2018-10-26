export function defined(value) {
  return typeof value !== 'undefined';
}

export function assert(condition, message = '') {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function sameMethod(method1, method2) {
  return method1.toLowerCase() === method2.toLowerCase();
}


export function parseRequestBody(body) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (e) {
      // Skip
    }
  }
  return body;
}
function normalizeValue(value) {
  if (typeof value === 'string') {
    return value;
  } if (typeof value === 'number') {
    return String(value);
  } else if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }
  throw new Error('Invalid query parameter / url parameter value');
}

export function normalizeParams(params) {
  const normalized = {};
  Object.keys(params).forEach((key) => {
    normalized[key] = normalizeValue(params[key]);
  });
  return normalized;
}
