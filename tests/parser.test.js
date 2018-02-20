const Parser = require("../lib/parser");
const utils = require("./utils");

describe('#parseSearch', () => {
  const resultsPageHtml = utils.readMockPage('search_results_page');
  const parser = new Parser();
  const results = parser.parseSearch(resultsPageHtml);

  test("provides host", () => {
    expect.assertions(1);

    expect(results[30].host).toEqual("http://rutracker.org");
  });

  test("parses id", () => {
    expect.assertions(1);

    expect(results[30].id).toEqual("88068");
  });

  test("parses title", () => {
    expect.assertions(1);

    expect(results[30].title).toEqual("[DTSCD][DVDA] Metallica - Black Album - 2005");
  });

  test("parses category", () => {
    expect.assertions(1);

    expect(results[30].category).toEqual("Рок-музыка (многоканальная музыка)");
  });

  test("parses author", () => {
    expect.assertions(1);

    expect(results[30].author).toEqual("Меля");
  });

  test("parses author", () => {
    expect.assertions(1);

    expect(results[30].author).toEqual("Меля");
  });

  test("parses seeds", () => {
    expect.assertions(2);

    expect(results[0].seeds).toEqual(2);
    expect(results[30].seeds).toEqual(1);
  });

  test("parses leeches", () => {
    expect.assertions(2);

    expect(results[0].leeches).toEqual(0);
    expect(results[30].leeches).toEqual(1);
  });

  test("parses state", () => {
    expect.assertions(1);

    expect(results[0].state).toEqual("проверено");
  });

  test("parses size", () => {
    expect.assertions(2);

    expect(results[0].size).toEqual(3028992302);
    expect(results[30].size).toEqual(682311748);
  });

  test("returns array of search results", () => {
    expect.assertions(1);

    expect(results).toHaveLength(31);
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
