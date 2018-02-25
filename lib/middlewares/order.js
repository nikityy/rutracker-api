const { ValidationError } = require("../errors");

const orderMapping = {
  asc: "1",
  desc: "2"
};

module.exports = (params, body) => {
  const { order, sort } = params;

  if (!order) {
    return;
  }

  if (!sort) {
    throw new ValidationError(`Sort should also be defined when order is set`);
  }

  if (!Object.prototype.hasOwnProperty.call(orderMapping, order)) {
    const validOrderFields = Object.keys(orderMapping);
    throw new ValidationError(
      `Invalid order property "${order}". Valid properties are ${validOrderFields.join(
        ", "
      )}`
    );
  }

  body.append("s", orderMapping[order]);
};
