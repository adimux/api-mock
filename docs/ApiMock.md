<a name="ApiMock"></a>

## ApiMock
**Kind**: global class  
**Access**: public  

* [ApiMock](#ApiMock)
    * [.mock(url, response, options)](#ApiMock+mock)
    * [.mock(options)](#ApiMock+mock)
    * [.get(url, response)](#ApiMock+get)
    * [.post(url, response)](#ApiMock+post)
    * [.put(url, response)](#ApiMock+put)
    * [.reset()](#ApiMock+reset)
    * [.restore()](#ApiMock+restore)
    * [.getRoute(urlOrName, method)](#ApiMock+getRoute)
    * [.called(route, options)](#ApiMock+called) ⇒ <code>Boolean</code>

<a name="ApiMock+mock"></a>

### apiMock.mock(url, response, options)
Regiters a mock route.

**Kind**: instance method of [<code>ApiMock</code>](#ApiMock)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}` |
| response | <code>Object</code> \| <code>Number</code> \| <code>function</code> | <code>200</code> | The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that returns a response object. |
| options | <code>Object</code> |  | More options defining the route. |
| options.method | <code>String</code> |  | The HTTP method the route responds to. |

<a name="ApiMock+mock"></a>

### apiMock.mock(options)
Registers a mock route.

**Kind**: instance method of [<code>ApiMock</code>](#ApiMock)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options defining the route. |
| options.url | <code>String</code> |  | The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}` |
| options.response | <code>Object</code> \| <code>Number</code> \| <code>function</code> | <code>200</code> | The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that returns a response object. |
| options.method | <code>String</code> |  | The HTTP method. If not specified, the URL will be mocked no matter the HTTP method. |

<a name="ApiMock+get"></a>

### apiMock.get(url, response)
Shortcut for `mock`, but sets the HTTP method to `get`.

**Kind**: instance method of [<code>ApiMock</code>](#ApiMock)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}` |
| response | <code>Object</code> \| <code>Number</code> \| <code>function</code> | <code>200</code> | The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that returns a response object. |

<a name="ApiMock+post"></a>

### apiMock.post(url, response)
Shortcut for `mock`, but sets the HTTP method to `post`.

**Kind**: instance method of [<code>ApiMock</code>](#ApiMock)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}` |
| response | <code>Object</code> \| <code>Number</code> \| <code>function</code> | <code>200</code> | The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that returns a response object. |

<a name="ApiMock+put"></a>

### apiMock.put(url, response)
Shortcut for `mock`, but sets the HTTP method to `put`.

**Kind**: instance method of [<code>ApiMock</code>](#ApiMock)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | The URL to mock, optionally containing placeholders, e.g `api/users/{user_id}` |
| response | <code>Object</code> \| <code>Number</code> \| <code>function</code> | <code>200</code> | The response to return when the URL is requested, as an object (e.g `{ body: { 'foo': 'bar' }, status: 200 }`), or simply a status code (e.g `400`) or a callback function that returns a response object. |

<a name="ApiMock+reset"></a>

### apiMock.reset()
Clears all the routes and clear the history of intercepted API calls.

**Kind**: instance method of [<code>ApiMock</code>](#ApiMock)  
**Access**: public  
<a name="ApiMock+restore"></a>

### apiMock.restore()
Restores everything to its original state (i.e unmocks, clears the routes, clears the call registered).

**Kind**: instance method of [<code>ApiMock</code>](#ApiMock)  
**Access**: public  
<a name="ApiMock+getRoute"></a>

### apiMock.getRoute(urlOrName, method)
Get a route by its name (or URL if it doesn't have a name).

**Kind**: instance method of [<code>ApiMock</code>](#ApiMock)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| urlOrName | <code>string</code> |  | The name of the route, if it has one, or its URL. |
| method | <code>string</code> | <code>null</code> | The HTTP method of the route, in case multiple routes have the same URL but a different HTTP method. If you pass `null` and you are searching by URL, the first route that matches the URL will be returned. Of course, if the route has a name, there is no need to specify the HTTP method because the name is supposed to be unique. |

<a name="ApiMock+called"></a>

### apiMock.called(route, options) ⇒ <code>Boolean</code>
Determines whether a route was called with a specific body or specific query / URL parameters.

**Kind**: instance method of [<code>ApiMock</code>](#ApiMock)  
**Returns**: <code>Boolean</code> - True if the route was called with those options, False if not.  

| Param | Type | Description |
| --- | --- | --- |
| route | <code>string</code> | The name of the route, or its URL if it doesn't have a name, |
| options | <code>Object</code> | The URL parameters, query parameters or body to filter the calls with. |
| options.params | <code>Object</code> | The URL parameters (i.e the values of the placeholders in the URL of the route like `user_id` in `api/users/{user_id}`) by which the call should have been made. |
| options.query | <code>Object</code> | The query parameters (i.e the parameters after "?") by which the call should have been made. |
| options.body | <code>Object</code> | The body by which the call should have been made. |

