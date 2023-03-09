import signupHandler from "../pages/api/user/signup";
import "@testing-library/jest-dom";
import { createMocks } from "node-mocks-http";

describe("/api/user/signup test", () => {
  //----------------------------------------------------------------------------------------
  test("Should create a new user", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        email: "user@mydoma.in",
        username: "utente",
        password: "Password123!",
      },
    });

    await signupHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBeDefined();
  });

  //----------------------------------------------------------------------------------------
  test("Should return 500, Username not valid", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        email: "user@mydoma.in",
        username: process.env.USERNAME_MINIMI,
        password: "Password123!",
      },
    });

    await signupHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
  });
  //----------------------------------------------------------------------------------------
  test("Should return 400, Bad Request", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        username: "Dinosauro",
        password: "Verde",
      },
    });

    await signupHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  //----------------------------------------------------------------------------------------
  test("Should return 405, Method not allowed", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await signupHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
