
function getQueryString(url) {
  const startIdx = url.indexOf('?');
  if (startIdx >= 0) {
    return url.substring(startIdx + 1);
  }
  return '';
}


export function extractQuery(url) {
  const query = {};
  const urlParams = new URLSearchParams(getQueryString(url));
  for (const key of urlParams.keys()) {
    const value = urlParams.getAll(key);
    if (value.length === 1) {
      query[key] = value[0];
    } else {
      query[key] = value;
    }
  }
  return query;
}


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
