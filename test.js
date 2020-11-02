const RutrackerApi = require("./index");

const rutracker = new RutrackerApi({
  mirror: "https://rutracker.org",
  proxy: {
    host: "proxy.weslyg.ru",
    port: 50500,
    auth: {
      username: "ss5",
      password: "Ve1sPer5",
    },
  },
});

rutracker
  .login({ username: "WeslyG", password: "Ve1sPer5" })
  .then(() => {
    console.log("Authorized");
  })
  .catch((err) => console.error(err));
