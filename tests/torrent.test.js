const Torrent = require("../lib/torrent");

describe("formattedSize", () => {
  test("returns size in gigabytes", () => {
    expect.assertions(2);

    const smallTorrent = new Torrent({ size: 682311748 });
    const largeTorrent = new Torrent({ size: 3028992302 });

    expect(smallTorrent.formattedSize).toEqual("0.68 GB");
    expect(largeTorrent.formattedSize).toEqual("3.03 GB");
  });
});

describe("url", () => {
  test("uses id and host to build url", () => {
    expect.assertions(1);

    const host = "http://host.org";
    const id = "12345";
    const torrent = new Torrent({ id, host });

    expect(torrent.url).toEqual(`${host}/forum/viewtopic.php?t=${id}`);
  });
});
