const windows1251 = require("windows-1251");

module.exports = {
  decodeWindows1251: string =>
    windows1251.decode(string.toString("binary"), { mode: "html" }),

  formatSize: sizeInBytes => {
    const sizeInMegabytes = sizeInBytes / (1000 * 1000 * 1000);
    return `${sizeInMegabytes.toFixed(2)} GB`;
  }
};
