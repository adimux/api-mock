# Introduction

Library agnostic utility to Mock HTTP requests.
By default, it will work with any library that uses Ajax. It can be easily extended to work with other ways of making HTTP requests like `fetch`.

Contact the author to request that feature if you need it!

# Documentation

Read the documentation [here](./docs/ApiMock.md).

# Integration with Jest

`ApiMock` has an integration with the testing library `Jest`: [api-mock-jest](https://github.com/adimux/api-mock-jest/) which allows to make assertions on HTTP calls, like testing the request body, parameters and method.
