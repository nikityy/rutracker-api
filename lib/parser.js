const cheerio = require('cheerio');
const { formatSize }  = require('./utils');

class Parser {
  constructor() {
    this.host = 'rutracker.org';
  }

  parseSearch(rawHtml) {
    const $ = cheerio.load(rawHtml, { decodeEntities: false });
    const results = [];

    let tracks = $('#tor-tbl tbody').find('tr');
    const { length } = tracks;

    for (let i = 0; i < length; i += 1) {
      // Ah-m... Couldn't find any better method
      const document = tracks.find('td');
      const state    = document.next();
      const category = state.next();
      const title    = category.next();
      const author   = title.next();
      const size     = author.next();
      const seeds    = size.next();
      const leechs   = seeds.next();

      results.push({
        state    : state.attr('title'),
        id       : title.find('div a').attr('data-topic_id'),
        category : category.find('.f-name a').html(),
        title    : title.find('div a ').html(),
        author   : author.find('div a ').html(),
        size     : formatSize( size.find('*').html() ),
        seeds    : seeds.find('b').html(),
        leechs   : leechs.find('b').html(),
        url      : `http://${this.host}/forum/${title.find('div a').attr('href')}`
      });

      tracks = tracks.next();
    }

    // Handle case where search has no results
    return results.filter(x => typeof x.id !== 'undefined');
  }

  parseMagnetLink(rawHtml) {
    const $ = cheerio.load(rawHtml, {decodeEntities: false});

    return $('.magnet-link').attr('href');
  }
}

module.exports = Parser;
