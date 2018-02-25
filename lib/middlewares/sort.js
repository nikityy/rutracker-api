const { ValidationError } = require("../errors");

const sortMapping = {
  registered: "1",
  title: "2",
  downloads: "4",
  size: "7",
  lastMessage: "8",
  seeds: "10",
  leeches: "11"
};

module.exports = (params, body) => {
  const { sort } = params;

  if (!sort) {
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(sortMapping, sort)) {
    const validSortFields = Object.keys(sortMapping);
    throw new ValidationError(
      `Invalid sort property "${sort}". Valid properties are ${validSortFields.join(
        ", "
      )}`
    );
  }

  body.append("o", sortMapping[sort]);
};
