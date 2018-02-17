const Parser = require("../lib/parser");
const utils = require("./utils");

describe('#parseSearch', () => {
  test("returns array of search results", () => {
    expect.assertions(3);

    const resultsPageHtml = utils.readMockPage('search_results_page');
    const parser = new Parser();
    const results = parser.parseSearch(resultsPageHtml);

    expect(results).toHaveLength(31);
    expect(results[0]).toEqual({
      author: "Dnipro_11",
      category: "Зарубежная рок-музыка (оцифровки)",
      id: "5515973",
      leechs: "0",
      seeds: "2",
      size: "3.03 GB",
      state: "проверено",
      title:
        "(Heavy Thrash Metal) [LP] [24/192] Metallica - Metallica (Black Album) - 27 Jul 2015, FLAC (image+.cue)",
      url: "http://rutracker.org/forum/viewtopic.php?t=5515973"
    });
    expect(results[30]).toEqual({
      author: "Меля",
      category: "Рок-музыка (многоканальная музыка)",
      id: "88068",
      leechs: "1",
      seeds: "1",
      size: "0.68 GB",
      state: "проверено",
      title: "[DTSCD][DVDA] Metallica - Black Album - 2005",
      url: "http://rutracker.org/forum/viewtopic.php?t=88068"
    });
  });

  test("returns empty array if no results", () => {
    expect.assertions(1);

    const noResultsPageHtml = utils.readMockPage('no_results_page');
    const parser = new Parser();
    const results = parser.parseSearch(noResultsPageHtml);

    expect(results).toHaveLength(0);
  });
});

describe('#parseMagnetLink', () => {
  test("returns magnet link", () => {
    expect.assertions(1);

    const threadHtml = utils.readMockPage('thread');
    const parser = new Parser();
    const magnetLink = parser.parseMagnetLink(threadHtml);

    expect(magnetLink).toEqual('magnet:?xt=urn:btih:4904EC7AB6106C47B317BA10C688941A9F2202BF&tr=http%3A%2F%2Fbt4.t-ru.org%2Fann%3Fmagnet');
  });
});
