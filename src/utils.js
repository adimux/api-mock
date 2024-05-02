/* SPDX-License-Identifier: MIT */
/* Copyright © 2018-2024 Adam Cherti <adamcherti@gmail.com> */


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

export function formDataToObject (formData) {
  const output = {};
  formData.forEach(
    (value, key) => {
      // Check if property already exists
      if (Object.prototype.hasOwnProperty.call(output, key)) {
        let current = output[key];
        if ( !Array.isArray(current) ) {
          // If it's not an array, convert it to an array.
          current = output[key] = [current];
        }
        current.push(value); // Add the new value to the array.
      } else {
        output[key] = value;
      }
    }
  );
  return output;
}

