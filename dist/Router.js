'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function matches(urlOrName, method) {
  var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  function methodMatchesStrict(route) {
    if (method === null) {
      return route.method === null;
    }
    return (0, _utils.sameMethod)(route.method, method);
  }
  function methodMatches(route) {
    if (method === null || route.method === null) {
      return true;
    }
    return (0, _utils.sameMethod)(route.method, method);
  }

  return function (route) {
    var idMatches = route.url === urlOrName || route.name === urlOrName;

    if (strict) {
      return idMatches && methodMatchesStrict(route);
    }
    return idMatches && methodMatches(route);
  };
}

var Router = function () {
  function Router() {
    _classCallCheck(this, Router);

    this.routes = [];
  }

  _createClass(Router, [{
    key: 'register',
    value: function register(route) {
      var routeIdx = this.routes.findIndex(matches(route.name, route.method, true));
      var exists = routeIdx !== -1;

      if (!exists) {
        this.routes.push(route);
      } else {
        this.routes[routeIdx] = route;
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.routes = [];
    }
  }, {
    key: 'getRoute',
    value: function getRoute(urlOrName) {
      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var routes = this.routes.filter(matches(urlOrName, method));

      if (routes.length > 1) {
        throw new Error('Found more than one route');
      }

      return routes.length > 0 ? routes[0] : null;
    }
  }, {
    key: 'route',
    value: function route(request) {
      var matchingRoutes = this.routes.filter(function (r) {
        return r.matches(request);
      });

      if (matchingRoutes.length) {
        matchingRoutes.sort(function (r1, r2) {
          return r1.numPlaceholders - r2.numPlaceholders;
        });

        return matchingRoutes[0];
      }

      return null;
    }
  }]);

  return Router;
}();

exports.default = Router;