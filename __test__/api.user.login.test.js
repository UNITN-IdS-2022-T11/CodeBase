import loginHandler from "../pages/api/user/login";
import "@testing-library/jest-dom";
import { createMocks } from "node-mocks-http";

describe("/api/user/login test", () => {
  //----------------------------------------------------------------------------------------
  test("Should login the user and return the user session", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        username: process.env.USERNAME_MINIMI,
        password: process.env.PASSWORD_MINIMI,
        remember: true,
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBeDefined();
  });

  //----------------------------------------------------------------------------------------
  test("Should return 401, Invalid username and password combination", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        username: "Dinosauro",
        password: "Verde",
        remember: false,
      },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

  //----------------------------------------------------------------------------------------
  test("Should return 405, Method not allowed", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
