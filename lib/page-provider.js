const { URLSearchParams } = require("url");
const { AuthorizationError, NotAuthorizedError } = require("./errors");
const { decodeWindows1251 } = require("./utils");
const axios = require("axios");

class PageProvider {
  constructor() {
    this.authorized = false;
    this.request = axios;
    this.cookie = null;
    this.host = "http://rutracker.org";
    this.loginUrl = `${this.host}/forum/login.php`;
    this.searchUrl = `${this.host}/forum/tracker.php`;
    this.threadUrl = `${this.host}/forum/viewtopic.php`;
    this.downloadUrl = `${this.host}/forum/dl.php`;
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
      validateStatus(status) {
        return status === 302;
      }
    })
      .then(response => {
        this.cookie = response.headers["set-cookie"];
        this.authorized = true;

        return true;
      })
      .catch(() => {
        throw new AuthorizationError();
      });
  }

  search(query) {
    if (!this.authorized) {
      return Promise.reject(new NotAuthorizedError());
    }

    const url = `${this.searchUrl}?nm=${encodeURIComponent(query)}`;

    return this.request({
      url,
      method: "POST",
      responseType: "arraybuffer",
      headers: {
        Cookie: this.cookie
      }
    }).then(response => decodeWindows1251(response.data));
  }

  thread(id) {
    if (!this.authorized) {
      return Promise.reject(new NotAuthorizedError());
    }

    const url = `${this.threadUrl}?t=${encodeURIComponent(id)}`;

    return this.request({
      url,
      method: "GET",
      responseType: "arraybuffer",
      headers: {
        Cookie: this.cookie
      }
    }).then(response => decodeWindows1251(response.data));
  }

  torrentFile(id) {
    if (!this.authorized) {
      return Promise.reject(new NotAuthorizedError());
    }

    const url = `${this.downloadUrl}?t=${encodeURIComponent(id)}`;

    return this.request({
      url,
      method: "GET",
      responseType: "stream",
      headers: {
        Cookie: this.cookie
      }
    }).then(response => response.data);
  }
}

module.exports = PageProvider;
