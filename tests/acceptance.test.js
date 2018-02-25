const RutrackerApi = require("../");
const { AuthorizationError } = require("../lib/errors");

let USERNAME;
let PASSWORD;
let COOKIE;
let describeFunc = describe;

try {
  const config = require("./acceptance.config"); // eslint-disable-line global-require, import/no-unresolved

  USERNAME = config.username;
  PASSWORD = config.password;
  COOKIE = config.cookie;
} catch (err) {
  describeFunc = describe.skip;
}

describeFunc("#login", () => {
  test("resolves when called with correct credentials", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();

    return expect(
      rutracker.login({ username: USERNAME, password: PASSWORD })
    ).resolves.toBe(true);
  });

  test("rejects when called with incorrect credentials", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();

    return expect(
      rutracker.login({ username: "jdsklgjfsdlkgdfjglkfd", password: "fksdf" })
    ).rejects.toThrowError(AuthorizationError);
  });
});

describeFunc("#search", () => {
  test("resolves with search results", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();

    rutracker.pageProvider.authorized = true;
    rutracker.pageProvider.cookie = COOKIE;

    return expect(
      rutracker.search({ query: "дневник сельского священника" })
    ).resolves.toMatchSnapshot();
  });

  test("respects sort param", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();

    rutracker.pageProvider.authorized = true;
    rutracker.pageProvider.cookie = COOKIE;

    return rutracker
      .search({ query: "дневник сельского священника", sort: "size" })
      .then(torrents => {
        const snapshots = torrents.map(torrent => ({
          id: torrent.id,
          size: torrent.size
        }));

        expect(snapshots).toMatchSnapshot();
      });
  });

  test("respects order param", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();

    rutracker.pageProvider.authorized = true;
    rutracker.pageProvider.cookie = COOKIE;

    return rutracker
      .search({
        query: "дневник сельского священника",
        sort: "size",
        order: "asc"
      })
      .then(torrents => {
        const snapshots = torrents.map(torrent => ({
          id: torrent.id,
          size: torrent.size
        }));

        expect(snapshots).toMatchSnapshot();
      });
  });
});

describeFunc("#download", () => {
  test("resolves with torrent file ReadStream", done => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();

    rutracker.pageProvider.authorized = true;
    rutracker.pageProvider.cookie = COOKIE;

    rutracker.download("616058").then(stream => {
      let file = "";

      stream.on("data", data => {
        file += data.toString();
      });

      stream.on("end", () => {
        expect(file).toMatchSnapshot();

        done();
      });
    });
  });
});

describeFunc("#getMagnetLink", () => {
  test("resolves with url", () => {
    expect.assertions(1);

    const rutracker = new RutrackerApi();

    rutracker.pageProvider.authorized = true;
    rutracker.pageProvider.cookie = COOKIE;

    return expect(rutracker.getMagnetLink("616058")).resolves.toEqual(
      "magnet:?xt=urn:btih:A2E002795C19C5EEC09F5870BB3DB504A1B86C13&tr=http%3A%2F%2Fbt.t-ru.org%2Fann%3Fmagnet"
    );
  });
});
