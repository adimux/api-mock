'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _jestDiff = require('jest-diff');

var _jestDiff2 = _interopRequireDefault(_jestDiff);

var _ApiMock = require('./ApiMock');

var _ApiMock2 = _interopRequireDefault(_ApiMock);

var _Calls = require('./Calls');

var _Calls2 = _interopRequireDefault(_Calls);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiMock = new _ApiMock2.default();

function last(list) {
  return list[list.length - 1];
}

function normalizeOptions(options) {
  var normalizedOpts = {};
  if ('params' in options) {
    normalizedOpts.params = (0, _utils.normalizeParams)(options.params);
  }
  if ('query' in options) {
    normalizedOpts.query = (0, _utils.normalizeParams)(options.query);
  }
  return Object.assign({}, options, normalizedOpts);
}

if (typeof expect !== 'undefined') {
  expect.extend({
    toHaveBeenRequested: function toHaveBeenRequested(route) {
      var _this = this;

      var called = apiMock.called(route.name);

      return {
        pass: called,
        message: function message() {
          return 'Expect ' + _this.utils.printExpected(route.name) + ' to have been requested';
        }
      };
    },
    toHaveBeenRequestedWith: function toHaveBeenRequestedWith(route, expectedOptions) {
      var _this2 = this;

      var routeCalls = new _Calls2.default(apiMock.calls.filter(route.name));
      var matchingCalls = routeCalls.filter(undefined, expectedOptions);

      var routeCalled = routeCalls.calls.length > 0;
      var optionsMatch = matchingCalls.length > 0;

      if (routeCalled && optionsMatch) {
        return {
          pass: true,
          message: function message() {
            return 'Expect ' + _this2.utils.printExpected(route.name) + ' to have been requested with:\n' + _this2.utils.printExpected(expectedOptions);
          }
        };
      } else if (routeCalled && !optionsMatch) {
        var call = last(routeCalls.calls);

        var optionsKeys = Object.keys(expectedOptions);
        var actualOptions = (0, _pick2.default)(call, optionsKeys);
        var diffString = (0, _jestDiff2.default)(normalizeOptions(expectedOptions), actualOptions, {
          expand: true
        });

        return {
          actual: actualOptions,
          pass: false,
          message: function message() {
            return 'Expect ' + _this2.utils.printExpected(route.name) + ' to have been requested with:\n' + (_this2.utils.printExpected(expectedOptions) + '\n') + 'Received:\n' + (_this2.utils.printReceived(actualOptions) + '\n\nDifference:\n\n' + diffString);
          }
        };
      }

      return {
        actual: 'not called',
        pass: false,
        message: function message() {
          return 'Expect ' + _this2.utils.printExpected(route.name) + ' to have been requested with:\n' + (_this2.utils.printExpected(expectedOptions) + '\n') + ('Received: ' + _this2.utils.printReceived('not called'));
        }
      };
    }
  });
}

exports.default = apiMock;