const RutrackerApi = require('../rutracker-api');
const fs = require('fs');
const windows1251 = require('windows-1251');

test('returns array of search results', () => {
  expect.assertions(3);

  const resultsPage = fs.readFileSync('./tests/mocks/search_results_page.html').toString('binary');
  const resultsPageHtml = windows1251.decode(resultsPage, {mode: 'html'})
  const rutracker = new RutrackerApi();

  rutracker.parseSearch(resultsPageHtml, results => {
    expect(results).toHaveLength(31);
    expect(results[0]).toEqual({
      author: 'Dnipro_11',
      category: "Зарубежная рок-музыка (оцифровки)",
      id: '5515973',
      leechs: '0',
      seeds: '2',
      size: '3.02 GB',
      state: 'проверено',
      title: '(Heavy Thrash Metal) [LP] [24/192] Metallica - Metallica (Black Album) - 27 Jul 2015, FLAC (image+.cue)',
      url: 'http://rutracker.org/forum/viewtopic.php?t=5515973',
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
      url: "http://rutracker.org/forum/viewtopic.php?t=88068",
    });
  });
});

test('returns empty array if no results', () => {
  expect.assertions(1);

  const noResultsPage = fs.readFileSync('./tests/mocks/no_results_page.html').toString('binary');
  const noResultsPageHtml = windows1251.decode(noResultsPage, {mode: 'html'})
  const rutracker = new RutrackerApi();

  rutracker.parseSearch(noResultsPageHtml, results => {
    expect(results).toHaveLength(0);
  });
});
