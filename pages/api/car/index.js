import {
  findCarById,
  findCarByUserId,
  createCar,
  updateCar,
  deleteCar,
} from "lib/dbCar";
import { getLoginSession } from "lib/auth";
import { removeTokenCookie } from "lib/auth-cookies";
import { findUser } from "lib/dbUser";
import { carSchema } from "lib/yupSchemas";
import * as Yup from "yup";

/**
 * @swagger
 * tags:
 * - name: car
 *   description: Apis relevant to car objects
 * /api/car/{carid, userid}:
 *   get:
 *     summary: Returns the requested car
 *     description: Return car
 *     tags:
 *     - car
 *     parameters:
 *     - in: query
 *       name: carid
 *       carid: car id
 *       required: false
 *     - in: query
 *       name: userid
 *       carid: user id
 *       required: false
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Something went wrong, please try again
 * /api/car:
 *   post:
 *     summary: Creates a new car
 *     description: Creates a new car
 *     tags:
 *     - car
 *     parameters:
 *     - in: cookie
 *       name: carmeetingSession
 *       carmeetingSession: cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producer:
 *                 type: string
 *                 description: The producer of the car
 *               model:
 *                 type: string
 *                 description: The model of the car
 *               year:
 *                 type: number
 *                 description: Year of production
 *               image:
 *                 type: string
 *                 description: Image of the car
 *               description:
 *                 type: string
 *                 description: Simple description of the car
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Something went wrong, please try again
 *
 *   patch:
 *     summary: Update an existing car
 *     description: Update car
 *     tags:
 *     - car
 *     parameters:
 *     - in: cookie
 *       name: carmeetingSession
 *       carmeetingSession: cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producer:
 *                 type: string
 *                 description: The producer of the car
 *               model:
 *                 type: string
 *                 description: The model of the car
 *               year:
 *                 type: number
 *                 description: Year of production
 *               image:
 *                 type: string
 *                 description: Image of the car
 *               description:
 *                 type: string
 *                 description: Simple description of the car
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Something went wrong, please try again
 *
 *   delete:
 *     summary: Delete an existing car
 *     description: Delete car
 *     tags:
 *     - car
 *     parameters:
 *     - in: cookie
 *       name: carmeetingSession
 *       carmeetingSession: cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carId:
 *                 type: string
 *                 description: The id of the car
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Something went wrong, please try again
 */

async function carHandler(req, res) {
  if (
    req.method !== "GET" &&
    req.method !== "POST" &&
    req.method !== "PATCH" &&
    req.method !== "DELETE"
  )
    return res.status(405).send("Method not allowed");

  try {
    //-------------------------------------------------------------------GET
    if (req.method === "GET") {
      var car;
      if (req.query.carid) car = await findCarById(req.query.carid);
      else if (req.query.userid) car = await findCarByUserId(req.query.userid);
      else return res.status(400).send("Bad request");
      return res.status(200).json(car ? car : null);
    }

    const session = await getLoginSession(req);
    if (!session) return res.status(401).json("Unauthorized");
    const userFetched = await findUser(session);
    if (userFetched && userFetched.lastPasswordChange > session.createdAt) {
      removeTokenCookie(res);
      return res.redirect(307, "/login");
    }

    //-------------------------------------------------------------------DELETE
    if (req.method === "DELETE") {
      const car = await findCarById(req.body.id);
      if (car.ownerId !== userFetched.id)
        return res.status(401).send("Unauthorized");
      await deleteCar(req.body.id);
      return res.status(200).json({ done: true });
    }

    // YUP VALIDATION

    const schema = Yup.object().shape({
      producer: Yup.string().required(),
      model: Yup.string().required(),
      year: Yup.number().required(),
      description: carSchema.description,
    });

    await schema.validate(req.body);
    const carTypes = require("data/cars.json");
    let nationality;
    try {
      nationality = carTypes.cars.find(
        (car) => car.producer === req.body.producer
      ).nationality;
    } catch (error) {
      return res.status(400).send("Bad request");
    }

    //-------------------------------------------------------------------POST
    if (req.method === "POST") {
      const car = await createCar({
        ...req.body,
        nationality: nationality,
        userId: userFetched.id,
      });
      return res.status(200).json({ id: car.id });
    }

    //-------------------------------------------------------------------PATCH
    else if (req.method === "PATCH") {
      const car = await findCarById(req.body);
      if (car.ownerId !== userSession.userid)
        return res.status(401).send("Unauthorized");
      await updateCar({
        ...req.body,
        nationality: nationality,
        userId: userFetched.id,
      });
      return res.status(200).json({ done: true });
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "development") console.error(error);
    return res.status(500).send("Something went wrong, please try again");
  }
}

export default carHandler;
