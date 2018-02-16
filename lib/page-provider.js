const { URLSearchParams } = require("url");
const { AuthorizationError, NotAuthorizedError } = require("./errors");
const { decodeWindows1251 } = require('./utils');
const axios = require("axios");

class PageProvider {
  constructor() {
    this.authorized = false;
    this.request = axios;
    this.cookie = "bb_session=0-28047566-1lvC4FCsloqLOhx22ojn;";
    this.host = "http://rutracker.org";
    this.loginUrl = `${this.host}/forum/login.php`;
    this.searchUrl = `${this.host}/forum/tracker.php`;
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
      validateStatus: function(status) {
        return status === 302;
      }
    }).then(response => {
      this.cookie = response.headers["set-cookie"];
      this.authorized = true;

      return true;
    }).catch(err => {
      throw new AuthorizationError();
    });
  }

  search(query) {
    if (!this.authorized) {
      throw new NotAuthorizedError();
    }

    const url = `${this.searchUrl}?nm=${encodeURIComponent(query)}`;

    return this.request({
      url,
      method: "POST",
      responseType: 'arraybuffer',
      headers: {
        Cookie: this.cookie
      }
    }).then(response => decodeWindows1251(response.data));
  }
}

module.exports = PageProvider;
