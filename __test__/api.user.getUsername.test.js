import getUserHandler from "../pages/api/user/getUsername";
import "@testing-library/jest-dom";
import { createMocks } from "node-mocks-http";

describe("/api/user/getUsername test", () => {
  //----------------------------------------------------------------------------------------
  test("Should get the correct username", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        userid: process.env.ID_MINIMI,
      },
    });

    await getUserHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().username).toBe("Minimi");
  });

  //----------------------------------------------------------------------------------------
  test("Should return 404, User Not Found", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        userid: "Dinosauro",
      },
    });

    await getUserHandler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });

  //----------------------------------------------------------------------------------------
  test("Should return 405, Method not allowed", async () => {
    const { req, res } = createMocks({
      method: "DELETE",
    });

    await getUserHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
