import getCarsHandler from "../pages/api/car/getCars";
import "@testing-library/jest-dom";
import { createMocks } from "node-mocks-http";

describe("/api/car/getCars test", () => {
  test("Should return the list", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await getCarsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBeDefined();
  });

  test("Should return 405, Method not allowed", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    await getCarsHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
