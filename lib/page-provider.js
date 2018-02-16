const { URLSearchParams } = require("url");
const { AuthorizationError } = require("./errors");
const axios = require("axios");

class PageProvider {
  constructor() {
    this.request = axios;
    this.host = "http://rutracker.org";
    this.loginUrl = `${this.host}/forum/login.php`;
  }

  login(username, password) {
    const body = new URLSearchParams();

    body.append("login_username", username);
    body.append("login_password", password);
    body.append("login", "Вход");

    return this.request({
      url: this.loginUrl,
      method: "POST",
      data: body.toString(),
      maxRedirects: 0,
      responseType: "arraybuffer"
    }).then(response => {
      if (response.status === 302) {
        return true;
      } else {
        throw new AuthorizationError();
      }
    });
  }
}

module.exports = PageProvider;
