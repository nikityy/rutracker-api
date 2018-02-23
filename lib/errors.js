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

class ServerError extends Error {}

class ValidationError extends Error {}

module.exports = {
  AuthorizationError,
  NotAuthorizedError,
  ServerError,
  ValidationError
};
