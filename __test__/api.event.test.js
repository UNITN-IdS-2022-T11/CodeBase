import eventHendler from "../pages/api/event";
import "@testing-library/jest-dom";
import { createMocks } from "node-mocks-http";

describe("/api/event GET method test", () => {
  //----------------------------------------------------------------------------------------
  test("Should return a existing event", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        eventid: "e9a1c6ab-a4b7-41bc-95ff-1182cb6a2615",
      },
    });

    await eventHendler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBeDefined();
  });

  //----------------------------------------------------------------------------------------
  test("Should return all programmed event", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await eventHendler(req, res);

    const resData = JSON.parse(res._getData());

    expect(res._getStatusCode()).toBe(200);
    expect(resData).toBeDefined();
    let allProgrammed = true;
    for (let i = 0; i < resData.length; i++) {
      if (resData[i].eventState !== "PROGRAMMATO") allProgrammed = false;
    }
    expect(allProgrammed).toBe(true);
  });

  //----------------------------------------------------------------------------------------
  test("Should return error 404, event not found", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        userid: "test123",
      },
    });

    await eventHendler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });

  //----------------------------------------------------------------------------------------
  test("Should return events of a user", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        userid: process.env.ID_MINIMI,
      },
    });

    await eventHendler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBeDefined();
  });

  //----------------------------------------------------------------------------------------
  test("Should return 405, Method not allowed", async () => {
    const { req, res } = createMocks({
      method: "DELETE",
    });

    await eventHendler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
