const Parser = require("./lib/parser");
const PageProvider = require("./lib/page-provider");

class RutrackerApi {
  constructor() {
    this.parser = new Parser();
    this.pageProvider = new PageProvider();
  }

  login({ username, password }) {
    return this.pageProvider.login(username, password);
  }

  search(query) {
    return this.pageProvider
      .search(query)
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
