/* SPDX-License-Identifier: MIT */
/* Copyright © 2018-2024 Adam Cherti <adamcherti@gmail.com> */

import { sameMethod } from './utils';

function matches(urlOrName, method, strict = false) {
  function methodMatchesStrict(route) {
    if (method === null) {
      return route.method === null;
    }
    return sameMethod(route.method, method);
  }
  function methodMatches(route) {
    if (method === null || route.method === null) {
      return true;
    }
    return sameMethod(route.method, method);
  }

  return (route) => {
    const idMatches = (route.url === urlOrName || route.name === urlOrName);

    if (strict) {
      return idMatches && methodMatchesStrict(route);
    }
    return idMatches && methodMatches(route);
  };
}

class Router {
  constructor() {
    this.routes = [];
  }
  register(route) {
    const routeIdx = this.routes.findIndex(matches(route.name, route.method, true));
    const exists = routeIdx !== -1;

    if (!exists) {
      // console.log(`Add route ${route.url || route.name}`);
      // Add the route to the list of routes
      this.routes.push(route);
    } else {
      // console.log(`Replace route ${route.url || route.name}`);
      // Replace the existing route with this one
      this.routes[routeIdx] = route;
    }
  }
  clear() {
    this.routes = [];
  }
  getRoute(urlOrName, method = null) {
    const routes = this.routes.filter(matches(urlOrName, method));

    if (routes.length > 1) {
      throw new Error('Found more than one route');
    }

    return routes.length > 0 ? routes[0] : null;
  }
  route(request) {
    const matchingRoutes = this.routes.filter(r => r.matches(request));

    // If we found routes that match the request
    if (matchingRoutes.length) {
      // Sort the matching routes ascendingly by the number of placeholders since we want
      // to prioritize the routes that have no placeholders over the ones that have them.
      matchingRoutes.sort((r1, r2) => r1.numPlaceholders - r2.numPlaceholders);
      // Return the matching route that has the least number of placeholders.
      return matchingRoutes[0];
    }

    return null;
  }
}

export default Router;
