const RutrackerApi = require("../index");

describe("#login", () => {
  test("resolves with true", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();
    const username = "username";
    const password = "password";

    const login = jest.fn().mockImplementationOnce((u, p) => {
      if (u === username && p === password) {
        return Promise.resolve(true);
      }

      return Promise.reject(Error());
    });
    rutracker.pageProvider.login = login;

    expect(rutracker.login({ username, password })).resolves.toBe(true);
  });
});

describe("#search", () => {
  test("resolves with parsed torrents", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();
    const query = "query";
    const sort = "sort";
    const order = "order";

    const search = jest
      .fn()
      .mockImplementationOnce(q => Promise.resolve({ request: q }));
    rutracker.pageProvider.search = search;

    const parseSearch = jest
      .fn()
      .mockImplementationOnce(html => Promise.resolve({ container: html }));
    rutracker.parser.parseSearch = parseSearch;

    expect(rutracker.search({ query, sort, order })).resolves.toEqual({
      container: {
        request: {
          query,
          sort,
          order
        }
      }
    });
  });
});

describe("#download", () => {
  test("resolves with torrent file stream", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();
    const id = "id";

    const torrentFile = jest
      .fn()
      .mockImplementationOnce(i => Promise.resolve({ id: i }));
    rutracker.pageProvider.torrentFile = torrentFile;

    expect(rutracker.download(id)).resolves.toEqual({
      id
    });
  });
});

describe("#getMagnetLink", () => {
  test("resolves with magnet link", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();
    const id = "id";

    const thread = jest
      .fn()
      .mockImplementationOnce(i => Promise.resolve({ id: i }));
    rutracker.pageProvider.thread = thread;

    const parseMagnetLink = jest
      .fn()
      .mockImplementationOnce(html => Promise.resolve({ container: html }));
    rutracker.parser.parseMagnetLink = parseMagnetLink;

    expect(rutracker.getMagnetLink(id)).resolves.toEqual({
      container: {
        id
      }
    });
  });
});
