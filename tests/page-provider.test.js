const PageProvider = require("../lib/page-provider");
const { NotAuthorizedError, ValidationError } = require("../lib/errors");

describe("#login", () => {
  test("making correct request", () => {
    expect.assertions(2);

    const pageProvider = new PageProvider();
    const request = jest.fn();
    const username = "aaa";
    const password = "bbb";

    request.mockReturnValue(Promise.reject());
    pageProvider.request = request;

    pageProvider.login(username, password);

    expect(request.mock.calls.length).toBe(1);
    expect(request.mock.calls[0][0]).toEqual({
      data: `login_username=${username}&login_password=${password}&login=%D0%92%D1%85%D0%BE%D0%B4`,
      maxRedirects: 0,
      method: "POST",
      url: "http://rutracker.org/forum/login.php",
      validateStatus: request.mock.calls[0][0].validateStatus
    });
  });

  test("correctly parses cookie", () => {
    expect.assertions(2);

    const pageProvider = new PageProvider();
    const request = jest.fn().mockReturnValue(
      Promise.resolve({
        headers: {
          "set-cookie": [
            "bb_session=XXX; expires=Tue, 15-Feb-2028 10:09:15 GMT; Max-Age=315360000; path=/forum/; domain=.rutracker.org; HttpOnly"
          ]
        }
      })
    );
    const username = "aaa";
    const password = "bbb";

    pageProvider.request = request;

    return pageProvider.login(username, password).then(() => {
      expect(pageProvider.authorized).toBeTruthy();
      expect(pageProvider.cookie).toEqual("bb_session=XXX");
    });
  });

  test("resolves if called with correct credentials", () => {
    expect.assertions(1);

    const pageProvider = new PageProvider();
    const request = jest.fn();
    const username = "aaa";
    const password = "bbb";

    request.mockReturnValue(
      Promise.resolve({
        status: 302,
        headers: {
          "set-cookie": "COOKIE"
        }
      })
    );
    pageProvider.request = request;

    expect(pageProvider.login(username, password)).resolves.toBe(true);
  });

  test("rejects if called with incorrect credentials", () => {
    expect.assertions(1);

    const pageProvider = new PageProvider();
    const request = jest.fn();
    const username = "aaa";
    const password = "bbb";

    request.mockReturnValue(Promise.reject(Error()));
    pageProvider.request = request;

    expect(pageProvider.login(username, password)).rejects.toThrow(
      "Incorrect username or password"
    );
  });
});

describe("#search", () => {
  test("making correct request", () => {
    expect.assertions(4);

    const pageProvider = new PageProvider();
    const request = jest.fn().mockReturnValue(Promise.resolve({ status: 200 }));
    const cookie = "cookie";
    const query = "query";

    pageProvider.authorized = true;
    pageProvider.cookie = cookie;
    pageProvider.request = request;

    pageProvider.search({ query });

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      data: "",
      headers: { Cookie: cookie },
      method: "POST",
      responseType: "arraybuffer",
      url: `http://rutracker.org/forum/tracker.php?nm=${query}`
    });

    pageProvider.search({ query, sort: "size" });
    expect(request.mock.calls[1][0].data).toEqual("o=7");

    pageProvider.search({ query, sort: "size", order: "asc" });
    expect(request.mock.calls[2][0].data).toEqual("o=7&s=1");
  });

  test("rejects if called with unknown sorting", () => {
    expect.assertions(1);

    const pageProvider = new PageProvider();
    pageProvider.authorized = true;

    const unknownSortField = "123321";

    expect(
      pageProvider.search({ query: "query", sort: unknownSortField })
    ).rejects.toThrowError(ValidationError);
  });

  test("rejects if called with unknown order", () => {
    expect.assertions(1);

    const pageProvider = new PageProvider();
    pageProvider.authorized = true;

    const sort = "size";
    const order = "123321";

    expect(
      pageProvider.search({ query: "query", sort, order })
    ).rejects.toThrowError(ValidationError);
  });

  test("rejects if called with order but without sort", () => {
    expect.assertions(1);

    const pageProvider = new PageProvider();
    pageProvider.authorized = true;

    const order = "desc";

    expect(pageProvider.search({ query: "query", order })).rejects.toThrowError(
      ValidationError
    );
  });

  test("rejects if called when not authorized", () => {
    expect.assertions(1);

    const pageProvider = new PageProvider();

    expect(pageProvider.search({ query: "query" })).rejects.toThrowError(
      NotAuthorizedError
    );
  });
});

describe("#thread", () => {
  test("making correct request", () => {
    expect.assertions(2);

    const pageProvider = new PageProvider();
    const request = jest.fn();
    const cookie = "cookie";
    const id = "123";

    request.mockReturnValue(Promise.resolve({ status: 200 }));
    pageProvider.authorized = true;
    pageProvider.cookie = cookie;
    pageProvider.request = request;

    pageProvider.thread(id);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      headers: { Cookie: cookie },
      method: "GET",
      responseType: "arraybuffer",
      url: `http://rutracker.org/forum/viewtopic.php?t=${id}`
    });
  });

  test("rejects if called when not authorized", () => {
    expect.assertions(1);

    const pageProvider = new PageProvider();

    expect(pageProvider.thread("123")).rejects.toThrowError();
  });
});

describe("#torrentFile", () => {
  test("making correct request", () => {
    expect.assertions(2);

    const pageProvider = new PageProvider();
    const request = jest.fn();
    const cookie = "cookie";
    const id = "123";

    request.mockReturnValue(Promise.resolve({ status: 200 }));
    pageProvider.authorized = true;
    pageProvider.cookie = cookie;
    pageProvider.request = request;

    pageProvider.torrentFile(id);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      headers: { Cookie: cookie },
      method: "GET",
      responseType: "stream",
      url: `http://rutracker.org/forum/dl.php?t=${id}`
    });
  });

  test("rejects if called when not authorized", () => {
    expect.assertions(1);

    const pageProvider = new PageProvider();

    expect(pageProvider.torrentFile("123")).rejects.toThrowError();
  });
});
