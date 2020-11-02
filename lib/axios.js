const axios = require("axios");

class AxiosSingleton {
  constructor({ mirror, proxy, userAgent, timeout }) {
    this.axios = axios.create({
      baseURL: mirror || "https://rutracker.org",
      timeout: timeout || 1000,
      headers: {
        "User-Agent": userAgent || "rutracker-api (nodejs client)",
      },
      proxy: proxy || {},
    });
  }
}

module.exports = AxiosSingleton;
