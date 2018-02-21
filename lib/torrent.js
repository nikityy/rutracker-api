const { formatSize } = require("./utils");

class Torrent {
  constructor({
    author = null,
    category = null,
    id = null,
    leeches = null,
    seeds = null,
    size = null,
    state = null,
    title = null,
    host = null
  }) {
    this.author = author;
    this.category = category;
    this.id = id;
    this.leeches = leeches;
    this.seeds = seeds;
    this.size = size;
    this.state = state;
    this.title = title;
    this.host = host;
  }

  get formattedSize() {
    const { size } = this;

    return formatSize(size);
  }

  get url() {
    const { host, id } = this;

    return `${host}/forum/viewtopic.php?t=${id}`;
  }
}

Torrent.APPROVED = 'проверено';
Torrent.NOT_APPROVED = 'не проверено';
Torrent.NEED_EDIT = 'недооформлено';
Torrent.DUBIOUSLY = 'сомнительно';
Torrent.CONSUMED = 'поглощено';
Torrent.TEMPORARY = 'временная';

module.exports = Torrent;
