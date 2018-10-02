const { URL, URLSearchParams } = require("url");
const { AuthorizationError, NotAuthorizedError } = require("./errors");
const {
  orderMiddleware,
  queryMiddleware,
  sortMiddleware
} = require("./middlewares");
const { decodeWindows1251 } = require("./utils");
const axios = require("axios");

class PageProvider {
  constructor(host, proxy) {
    this.authorized = false;
    this.request = axios;
    this.cookie = null;
    this.host = host;
    this.proxy = proxy;
    this.loginUrl = `${this.host}/forum/login.php`;
    this.searchUrl = `${this.host}/forum/tracker.php`;
    this.threadUrl = `${this.host}/forum/viewtopic.php`;
    this.downloadUrl = `${this.host}/forum/dl.php`;

    this.searchMiddlewares = [queryMiddleware, sortMiddleware, orderMiddleware];
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
      proxy: this.proxy,
      validateStatus(status) {
        return status === 302;
      }
    })
      .then(response => {
        const [cookie] = response.headers["set-cookie"][0].split(";");
        this.cookie = cookie;
        this.authorized = true;

        return true;
      })
      .catch(() => {
        throw new AuthorizationError();
      });
  }

  search(params) {
    if (!this.authorized) {
      return Promise.reject(new NotAuthorizedError());
    }

    const url = new URL(this.searchUrl);
    const body = new URLSearchParams();

    try {
      this.searchMiddlewares.forEach(middleware => {
        middleware(params, body, url);
      });
    } catch (err) {
      return Promise.reject(err);
    }

    return this.request({
      url: url.toString(),
      data: body.toString(),
      method: "POST",
      proxy: this.proxy,
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
      proxy: this.proxy,
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
      proxy: this.proxy,
      headers: {
        Cookie: this.cookie
      }
    }).then(response => response.data);
  }
}

module.exports = PageProvider;
