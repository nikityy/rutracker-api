const cheerio = require('cheerio');

class Parser {
  constructor() {
    this.host = 'rutracker.org';
  }

  formatSize(size_in_bytes) {
    var size_in_megabytes = size_in_bytes / (1000 * 1000 * 1000);
    return ('' + size_in_megabytes).slice(0, 4) + ' GB';
  }

  parseSearch(rawHtml) {
    const $ = cheerio.load(rawHtml, { decodeEntities: false });
    let tracks = $('#tor-tbl tbody').find('tr');
    let results = [];
    const length = tracks.length;

    for (var i = 0; i < length; i++) {
      // Ah-m... Couldn't find any better method
      var document = tracks.find('td'),
          state    = document.next(),
          category = state.next(),
          title    = category.next(),
          author   = title.next(),
          size     = author.next(),
          seeds    = size.next(),
          leechs   = seeds.next();

      results.push({
        state    : state.attr('title'),
        id       : title.find('div a').attr('data-topic_id'),
        category : category.find('.f-name a').html(),
        title    : title.find('div a ').html(),
        author   : author.find('div a ').html(),
        size     : this.formatSize( size.find('*').html() ),
        seeds    : seeds.find('b').html(),
        leechs   : leechs.find('b').html(),
        url      : 'http://' + this.host + '/forum/' + title.find('div a').attr('href')
      });

      tracks = tracks.next();
    }

    // Handle case where search has no results
    results = results.filter(function(x) {
      return typeof x.id !== 'undefined';
    });

    return results;
  };
}

module.exports = Parser;
