/* SPDX-License-Identifier: MIT */
/* Copyright © 2018-2024 Adam Cherti <adamcherti@gmail.com> */

import { defined } from './utils';

const DEFAULT_REASON = 'OK';
const DEFAULT_STATUS = 200;

class MockResponse {
  constructor({
    status = DEFAULT_STATUS,
    body = null,
    headers = {},
    reason = DEFAULT_REASON,
  }) {
    this._status = status;
    this._reason = reason;
    this._headers = headers;
    this._body = body;
  }

  get status() {
    return this._status;
  }

  get statusText() {
    return null;
  }

  get reason() {
    return this._reason;
  }

  header(name, value) {
    if (defined(name) && defined(value)) {
      this._headers[name] = value;
      return this;
    } else if (defined(name)) {
      return this._headers[name];
    }
    return this._headers;
  }

  get body() {
    return this._body;
  }
}

export default MockResponse;