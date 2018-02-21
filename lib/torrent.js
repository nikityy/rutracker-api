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

Torrent.APPROVED = 'APPROVED';
Torrent.NOT_APPROVED = 'NOT_APPROVED';
Torrent.NEED_EDIT = 'NEED_EDIT';
Torrent.DUBIOUSLY = 'DUBIOUSLY';
Torrent.CONSUMED = 'CONSUMED';
Torrent.TEMPORARY = 'TEMPORARY';

module.exports = Torrent;
