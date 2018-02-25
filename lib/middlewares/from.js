module.exports = (params, body, url) => {
  const { from } = params;

  if (!from) {
    return;
  }

  url.searchParams.append("start", from);
};
