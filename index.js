const Parser = require("./lib/parser");
const PageProvider = require("./lib/page-provider");

const defaultConfig = {
  host: "http://rutracker.org",
  proxy: null
};

class RutrackerApi {
  constructor({ host, proxy } = defaultConfig) {
    this.parser = new Parser();
    this.pageProvider = new PageProvider(host, proxy);
  }

  login({ username, password }) {
    return this.pageProvider.login(username, password);
  }

  search({ query, sort, order }) {
    return this.pageProvider
      .search({ query, sort, order })
      .then(html => this.parser.parseSearch(html));
  }

  download(id) {
    return this.pageProvider.torrentFile(id);
  }

  getMagnetLink(id) {
    return this.pageProvider
      .thread(id)
      .then(html => this.parser.parseMagnetLink(html));
  }
}

module.exports = RutrackerApi;
