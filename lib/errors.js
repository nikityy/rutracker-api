class AuthorizationError extends Error {
  constructor(...args) {
    super(...args);

    this.name = "AuthorizationError";
    this.message = "Incorrect username or password";
  }
}

class NotAuthorizedError extends Error {
  constructor(...args) {
    super(...args);

    this.name = "NotAuthorizedError";
    this.message = `Try to call 'login' method first`;
  }
}

class NetworkError extends Error {
  constructor(...args) {
    super(...args);
    this.name = "Econnect";
    this.message =
      "Can't connect to rutracker URL, check mirror option, or use proxy";
  }
}

class ProxyError extends Error {
  constructor(...args) {
    super(...args);
    this.name = "Econnrefused";
    this.message = "Can't connect to proxy, check proxy settings";
  }
}

class ServerError extends Error {}

class ValidationError extends Error {}

module.exports = {
  ProxyError,
  NetworkError,
  AuthorizationError,
  NotAuthorizedError,
  ServerError,
  ValidationError,
};
