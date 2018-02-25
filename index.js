const Parser = require("./lib/parser");
const PageProvider = require("./lib/page-provider");
const { range } = require("./lib/utils");

const PER_PAGE = 50;
const getOffset = index => index * PER_PAGE;
const getPageIndex = offset => Math.ceil(offset / PER_PAGE);

class RutrackerApi {
  constructor() {
    this.parser = new Parser();
    this.pageProvider = new PageProvider();
  }

  login({ username, password }) {
    return this.pageProvider.login(username, password);
  }

  search({ query, sort, order, from = 0, limit = PER_PAGE }) {
    return this.pageProvider.search({ query, sort, order, from }).then(html => {
      const count = this.parser.parseCount(html);
      const torrents = this.parser.parseSearch(html);
      const loaded = torrents.length + from;
      const required = limit === 0 ? count : Math.min(limit, count);

      if (loaded >= required) {
        return torrents.slice(0, required - from);
      }

      const pagesCount = getPageIndex(required - loaded);
      const nextOffset = getOffset(getPageIndex(from) + 1);
      const rest = range(pagesCount).map(index =>
        this.search({
          query,
          sort,
          order,
          from: nextOffset + getOffset(index),
          limit: nextOffset + getOffset(index + 1)
        })
      );

      return Promise.all(rest).then(chunks =>
        torrents.concat(...chunks).slice(0, required - from)
      );
    });
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
