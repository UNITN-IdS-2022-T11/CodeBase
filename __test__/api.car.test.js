import carHandler from "../pages/api/car";
import "@testing-library/jest-dom";
import { createMocks } from "node-mocks-http";

describe("/api/car test", () => {
  //----------------------------------------------------------------------------------------
  test("Should return a existing car", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        carid: "e2f9c72d-f23f-4d82-bf3a-b002a57db964",
      },
    });

    await carHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBeDefined();
  });

  //----------------------------------------------------------------------------------------
  test("Should return a car of a user", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        userid: "60c44466-f99c-4c52-9984-2a4348ccd490",
      },
    });

    await carHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBeDefined();
  });

  //----------------------------------------------------------------------------------------
  test("Should return error 400, bad request", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await carHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  let carid;

  //----------------------------------------------------------------------------------------
  test("Should create a car", async () => {
    const { req, res } = createMocks({
      method: "POST",
      cookies: { carmeetingSession: process.env.COOKIE_SESSION_MINIMI },
      headers: { "Content-Type": "application/json" },
      body: {
        producer: "Volkswagen",
        model: "Polo",
        year: 2021,
        description: "Macchina",
      },
    });

    await carHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    carid = res._getJSONData().id;
  });

  //----------------------------------------------------------------------------------------
  test("Should return 400, Bad Request", async () => {
    const { req, res } = createMocks({
      method: "POST",
      cookies: { carmeetingSession: process.env.COOKIE_SESSION_MINIMI },
      headers: { "Content-Type": "application/json" },
      body: {
        producer: "Iveco",
        model: "Skyline",
        year: 2025,
        description: "Camion",
      },
    });

    await carHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  //----------------------------------------------------------------------------------------
  test("Should delete the newly created car", async () => {
    const { req, res } = createMocks({
      method: "DELETE",
      cookies: { carmeetingSession: process.env.COOKIE_SESSION_MINIMI },
      headers: { "Content-Type": "application/json" },
      body: {
        id: carid,
      },
    });

    await carHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });
  //----------------------------------------------------------------------------------------
  test("Should return 401, Unauthorized", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        producer: "Iveco",
        model: "Skyline",
        year: 2025,
        description: "Camion",
      },
    });

    await carHandler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

  //----------------------------------------------------------------------------------------
  test("Should return 405, Method not allowed", async () => {
    const { req, res } = createMocks({
      method: "PUT",
    });

    await carHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
