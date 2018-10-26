import pick from 'lodash/pick';
import diff from 'jest-diff';
import ApiMock from './ApiMock';
import Calls from './Calls';
import { normalizeParams } from './utils';

const apiMock = new ApiMock();

function last(list) {
  return list[list.length - 1];
}

function normalizeOptions(options) {
  const normalizedOpts = {};
  if ('params' in options) {
    normalizedOpts.params = normalizeParams(options.params);
  }
  if ('query' in options) {
    normalizedOpts.query = normalizeParams(options.query);
  }
  return Object.assign({}, options, normalizedOpts);
}

if (typeof expect !== 'undefined') {
  expect.extend({
    toHaveBeenRequested(route) {
      const called = apiMock.called(route.name);

      return {
        pass: called,
        message: () => `Expect ${this.utils.printExpected(route.name)} to have been requested`,
      };
    },
    toHaveBeenRequestedWith(route, expectedOptions) {
      const routeCalls = new Calls(apiMock.calls.filter(route.name));
      const matchingCalls = routeCalls.filter(undefined, expectedOptions);

      const routeCalled = routeCalls.calls.length > 0;
      const optionsMatch = matchingCalls.length > 0;

      if (routeCalled && optionsMatch) {
        return {
          pass: true,
          message: () => `Expect ${this.utils.printExpected(route.name)} to have been requested with:\n${this.utils.printExpected(expectedOptions)}`,
        };
      } else if (routeCalled && !optionsMatch) {
        const call = last(routeCalls.calls);

        const optionsKeys = Object.keys(expectedOptions);
        const actualOptions = pick(call, optionsKeys);
        const diffString = diff(normalizeOptions(expectedOptions), actualOptions, {
          expand: true,
        });

        return {
          actual: actualOptions,
          pass: false,
          message: () => `Expect ${this.utils.printExpected(route.name)} to have been requested with:\n`
          + `${this.utils.printExpected(expectedOptions)}\n`
          + `Received:\n`
          + `${this.utils.printReceived(actualOptions)}\n\nDifference:\n\n${diffString}`,
        };
      }

      return {
        actual: 'not called',
        pass: false,
        message: () => `Expect ${this.utils.printExpected(route.name)} to have been requested with:\n`
        + `${this.utils.printExpected(expectedOptions)}\n`
        + `Received: ${this.utils.printReceived('not called')}`,
      };
    },
  });
}

export default apiMock;
