const http = require('http');
const querystring = require('querystring');
const windows1251 = require('windows-1251');
const EventEmitter = require('events');
const Parser = require('./lib/parser');

class RutrackerApi {
  constructor() {
    this.parser = new Parser();
  }
}

module.exports = RutrackerApi;
