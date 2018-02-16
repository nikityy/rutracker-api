const PageProvider = require("../lib/page-provider");
const utils = require("./utils");

test("correctly making login request", () => {
  expect.assertions(2);

  const pageProvider = new PageProvider();
  const request = jest.fn();
  const username = "aaa";
  const password = "bbb";

  request.mockReturnValueOnce(Promise.resolve());
  pageProvider.request = request;

  pageProvider.login(username, password);

  expect(request.mock.calls.length).toBe(1);
  expect(request.mock.calls[0][0]).toEqual({
    data: `login_username=${username}&login_password=${password}&login=%D0%92%D1%85%D0%BE%D0%B4`,
    maxRedirects: 0,
    method: "POST",
    responseType: "arraybuffer",
    url: "http://rutracker.org/forum/login.php"
  });
});

test("resolves if login was made with correct credentials", () => {
  expect.assertions(1);

  const pageProvider = new PageProvider();
  const request = jest.fn();
  const username = "aaa";
  const password = "bbb";

  request.mockReturnValueOnce(Promise.resolve({ status: 302 }));
  pageProvider.request = request;

  expect(pageProvider.login(username, password)).resolves.toBe(true);
});

test("throws if login was made with incorrect credentials", () => {
  expect.assertions(1);

  const pageProvider = new PageProvider();
  const request = jest.fn();
  const username = "aaa";
  const password = "bbb";

  request.mockReturnValueOnce(Promise.resolve({ status: 200 }));
  pageProvider.request = request;

  expect(pageProvider.login(username, password)).rejects.toThrow('Incorrect username or password');
});
