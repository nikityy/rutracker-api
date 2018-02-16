class AuthorizationError extends Error {
  constructor(...args) {
    super(...args);

    this.name = 'AuthorizationError';
    this.message = 'Incorrect username or password';
  }
}

class ServerError extends Error {}

module.exports = {
  AuthorizationError,
  ServerError,
};
