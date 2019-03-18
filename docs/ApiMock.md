# Global





* * *

## Class: InterceptorsManager



## Class: ApiMock



## Class: ApiMock


### ApiMock.mock(url, response, options) 

Regiters a mock route.

**Parameters**

**url**: `String`, The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}`

**response**: `Object | Number | function`, The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that retusn a response object.

**options**: `Object`, More options defining the route.

 - **options.method**: `String`, The HTTP method for which to register the mock route.


### ApiMock.mock(options) 

Registers a mock route.

**Parameters**

**options**: `Object`, Options defining the route.

 - **options.url**: `String`, The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}`

 - **options.method**: `String`, The HTTP method. If not specified, the URL will be mocked no matter the HTTP method.


### ApiMock.get() 

Shortcut for `mock`, but sets the HTTP method to `get`.


### ApiMock.post() 

Shortcut for `mock`, but sets the HTTP method to `post`.


### ApiMock.put() 

Shortcut for `mock`, but sets the HTTP method to `put`.


### ApiMock.reset() 

Clears all the routes and clear the history of intercepted API calls.


### ApiMock.restore() 

Restores everything to its original state (i.e unmocks, clears the routes, clears the call registered).


### ApiMock.getRoute(urlOrName, method) 

Get a route by its name (or URL if it doesn't have a name).

**Parameters**

**urlOrName**: `string`, The name of the route, if it has one, or its URL.

**method**: `string`, The HTTP method of the route, in case multiple routes have the same URL but a different HTTP method. Of course, if the route has a name, there is no need to specify the HTTP method because the name is supposted to be unique.


### ApiMock.called(route, options) 

Determines whether a route was called with certain request parameters or body.

**Parameters**

**route**: `string`, The name of the route, or its URL if it doesn't have a name,

**options**: `Object`, The URL parameters, query parameters or body to filter the calls with.

 - **options.params**: `Object`, The URL parameters (i.e the values of the placeholders in the URL of the route) by which the call should have been made.

 - **options.query**: `Object`, The query parameters (i.e the parameters after "?") by which the call should have been made.

 - **options.body**: `Object`, The body by which the call should have been made.

**Returns**: `Boolean`, True if the route was called with those options, False if not.



* * *










