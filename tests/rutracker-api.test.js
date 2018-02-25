const RutrackerApi = require("../index");
const { range } = require("../lib/utils");

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
    expect.assertions(3);

    const rutracker = new RutrackerApi();
    const query = "query";
    const sort = "sort";
    const order = "order";

    const search = jest
      .fn()
      .mockImplementationOnce(q => Promise.resolve({ request: q }));
    rutracker.pageProvider.search = search;

    const parseSearch = jest.fn().mockImplementationOnce(() => range(50));
    rutracker.parser.parseSearch = parseSearch;

    const parseCount = jest.fn().mockImplementation(() => 50);
    rutracker.parser.parseCount = parseCount;

    return rutracker.search({ query, sort, order }).then(torrents => {
      expect(parseSearch).toHaveBeenCalledTimes(1);
      expect(parseSearch).toHaveBeenCalledWith({
        request: { from: 0, query, sort, order }
      });
      expect(torrents).toEqual(range(50));
    });
  });

  test("concatenates multiple requests", () => {
    expect.assertions(4);

    const rutracker = new RutrackerApi();
    const query = "query";
    const sort = "sort";
    const order = "order";

    const search = jest
      .fn()
      .mockImplementation(request =>
        Promise.resolve({ from: request.from, limit: request.limit })
      );
    rutracker.pageProvider.search = search;

    const parseSearch = jest.fn().mockImplementation(({ from }) =>
      new Array(50).fill(null).map((_, index) => ({
        id: from + index
      }))
    );
    rutracker.parser.parseSearch = parseSearch;

    const parseCount = jest.fn().mockImplementation(() => 500);
    rutracker.parser.parseCount = parseCount;

    return rutracker
      .search({ query, sort, order, limit: 400 })
      .then(torrents => {
        expect(search).toHaveBeenCalledTimes(8);
        expect(search.mock.calls).toEqual([
          [{ from: 0, query, sort, order }],
          [{ from: 50, query, sort, order }],
          [{ from: 100, query, sort, order }],
          [{ from: 150, query, sort, order }],
          [{ from: 200, query, sort, order }],
          [{ from: 250, query, sort, order }],
          [{ from: 300, query, sort, order }],
          [{ from: 350, query, sort, order }]
        ]);
        expect(torrents).toHaveLength(400);
        expect(torrents.map(x => x.id)).toEqual(range(400));
      });
  });

  test("trims if got more than set in limit", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();
    const query = "query";
    const sort = "sort";
    const order = "order";

    const search = jest
      .fn()
      .mockImplementation(request =>
        Promise.resolve({ from: request.from, limit: request.limit })
      );
    rutracker.pageProvider.search = search;

    const parseSearch = jest
      .fn()
      .mockImplementation(({ from }) => range(50).map(index => from + index));
    rutracker.parser.parseSearch = parseSearch;

    const parseCount = jest.fn().mockImplementation(() => 500);
    rutracker.parser.parseCount = parseCount;

    return expect(
      rutracker.search({ query, sort, order, limit: 44 })
    ).resolves.toEqual(range(44));
  });

  test("request all if limit is set to 0", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();
    const query = "query";
    const sort = "sort";
    const order = "order";

    const search = jest
      .fn()
      .mockImplementation(request =>
        Promise.resolve({ from: request.from, limit: request.limit })
      );
    rutracker.pageProvider.search = search;

    const parseSearch = jest
      .fn()
      .mockImplementation(({ from }) => range(50).map(index => from + index));
    rutracker.parser.parseSearch = parseSearch;

    const parseCount = jest.fn().mockImplementation(() => 500);
    rutracker.parser.parseCount = parseCount;

    return expect(
      rutracker.search({ query, sort, order, limit: 0 })
    ).resolves.toEqual(range(500));
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
