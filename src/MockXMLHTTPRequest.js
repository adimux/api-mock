import Request from './Request';

const XHR = window.XMLHttpRequest;
const READY_STATE = {
  DONE: 4,
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
};

function MockXMLHTTPRequest(...args) {
  function overrideProps(xhr) {
    const overrideableProps = [
      'responseText',
      // 'responseType',
      'responseUrl',
      'response',
      'readyState',
      'status',
      'statusText',
    ];

    overrideableProps.forEach((attr) => {
      Object.defineProperty(xhr, attr, {
        writable: true,
      });
    });
  }

  const send = XHR.prototype.send;
  const open = XHR.prototype.open;
  const getAllRresponseHeadersOrig = XHR.prototype.getAllRresponseHeaders;
  const getResponseHeaderOrig = XHR.prototype.getResponseHeader;
  const setRequestHeaderOrig = XHR.prototype.setRequestHeader;

  function sendReplacement(body) {
    this.request.body = body;
    const interceptor = MockXMLHTTPRequest.interceptor;

    if (interceptor) {
      const response = MockXMLHTTPRequest.interceptor(this.request);
      if (response) {
        overrideProps(this);
        this.mockResponse = response;
        this.status = response.status;
        this.statusText = response.statusText;
        this.readyState = READY_STATE.DONE;
        this.responseUrl = '';
        this.response = response.body;
        this.statusText = response.statusText;
        if (this.onload) {
          this.onload();
        }
        return;
      }
    }

    send.call(this, body);
  }

  function openReplacement(method, url, ...openArgs) {
    this.request = new Request(method, url);
    open.call(this, method, url, ...openArgs);
  }

  function getAllRresponseHeaders() {
    if (this.mockResponse) {
      return this.mockResponse.header();
    }
    return getAllRresponseHeadersOrig.call(this);
  }

  function getResponseHeader(name) {
    if (this.mockResponse) {
      return this.mockResponse.header(name)[name];
    }
    return getResponseHeaderOrig.call(this, name);
  }

  function setRequestHeader(name, value) {
    this.request.header(name, value);
    setRequestHeaderOrig.call(this, name, value);
  }

  // Cannot use apply directly since we want a 'new' version, which will allow us to override
  // the (previously read-only) properties responseType, responseText, etc.
  const XhrConstructor = Function.prototype.bind.call(XHR, ...args);

  const wrapped = new XhrConstructor();

  wrapped.open = openReplacement;
  wrapped.send = sendReplacement;
  wrapped.getResponseHeader = getResponseHeader;
  wrapped.getAllRresponseHeaders = getAllRresponseHeaders;
  wrapped.setRequestHeader = setRequestHeader;

  return wrapped;
}

MockXMLHTTPRequest.interceptor = null;

MockXMLHTTPRequest.setInterceptor = (i) => {
  MockXMLHTTPRequest.interceptor = i;
};


export function hook(interceptor) {
  if (window.XMLHttpRequest !== MockXMLHTTPRequest) {
    window.XMLHttpRequest = MockXMLHTTPRequest;
  }
  MockXMLHTTPRequest.setInterceptor(interceptor);
}

export function restore() {
  window.XMLHttpRequest = XHR;
}

export default MockXMLHTTPRequest;
