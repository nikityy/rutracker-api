const windows1251 = require("windows-1251");

module.exports = {
  decodeWindows1251: string =>
    windows1251.decode(string.toString("binary"), { mode: "html" })
};
