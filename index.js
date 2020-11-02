const Parser = require("./lib/parser");
const PageProvider = require("./lib/page-provider");
const AxiosSingleton = require("./lib/axios");

class RutrackerApi {
  constructor({ mirror, proxy, userAgent, timeout }) {
    this.axios = new AxiosSingleton({ mirror, proxy, userAgent, timeout });
    this.pageProvider = new PageProvider(this.axios);
    this.parser = new Parser(mirror);
  }

  login({ username, password }) {
    return this.pageProvider.login(username, password);
  }

  search({ query, sort, order }) {
    return this.pageProvider
      .search({ query, sort, order })
      .then((html) => this.parser.parseSearch(html));
  }

  download(id) {
    return this.pageProvider.torrentFile(id);
  }

  getMagnetLink(id) {
    return this.pageProvider
      .thread(id)
      .then((html) => this.parser.parseMagnetLink(html));
  }
}

module.exports = RutrackerApi;
