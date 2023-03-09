import {
  findEventById,
  findEventByOwnerId,
  findProgrammedEvents,
  createEvent,
  updateEvent,
} from "lib/dbEvent";
import { getLoginSession } from "lib/auth";
import { removeTokenCookie } from "lib/auth-cookies";
import { findUser } from "lib/dbUser";
import { eventSchema } from "lib/yupSchemas";
import * as Yup from "yup";

/**
 * @swagger
 * tags:
 * - name: event
 *   description: Apis relevant to event objects
 * /api/event/{eventid, userid}:
 *   get:
 *     summary: Returns the requested event
 *     description: Return event
 *     tags:
 *     - event
 *     parameters:
 *     - in: query
 *       name: eventid
 *       eventid: event id
 *       required: false
 *     - in: query
 *       name: userid
 *       userid: user id
 *       required: false
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Event not found
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Something went wrong, please try again
 *
 * /api/event/:
 *   post:
 *     summary: Creates a new event
 *     description: Creates a new event
 *     tags:
 *     - event
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
 *               eventName:
 *                 type: string
 *                 description: The name of the event
 *               image:
 *                 type: string
 *                 description: The image of the event
 *               startDate:
 *                 type: date
 *                 description: The start date of the event
 *               finishDate:
 *                 type: date
 *                 description: The finish date of the event
 *               location:
 *                 type: string
 *                 description: The location of the event
 *               maxParticipants:
 *                 type: number
 *                 description: The max participants of the event
 *               price:
 *                 type: number
 *                 description: The price of the event
 *               allowedCars:
 *                 type: object
 *                 description: The allowed cars of the event
 *               gpxFile:
 *                 type: string
 *                 description: The gpx file of the event
 *               eventState:
 *                 type: string
 *                 description: The state of the event
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Something went wrong, please try again
 *
 *   patch:
 *     summary: Updates an existing event
 *     description: Update event
 *     tags:
 *     - event
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
 *               eventName:
 *                 type: string
 *                 description: The name of the event
 *               image:
 *                 type: string
 *                 description: The image of the event
 *               startDate:
 *                 type: date
 *                 description: The start date of the event
 *               finishDate:
 *                 type: date
 *                 description: The finish date of the event
 *               location:
 *                 type: string
 *                 description: The location of the event
 *               maxParticipants:
 *                 type: number
 *                 description: The max participants of the event
 *               price:
 *                 type: number
 *                 description: The price of the event
 *               allowedCars:
 *                 type: object
 *                 description: The allowed cars of the event
 *               gpxFile:
 *                 type: string
 *                 description: The gpx file of the event
 *               eventState:
 *                 type: string
 *                 description: The state of the event
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

async function eventHendler(req, res) {
  if (req.method !== "GET" && req.method !== "POST" && req.method !== "PATCH")
    return res.status(405).send("Method not allowed");

  try {
    //-------------------------------------------------------------------GET

    if (req.method === "GET") {
      let event;
      if (!req.query.eventid && !req.query.userid)
        event = await findProgrammedEvents();
      else if (req.query.eventid)
        event = await findEventById(req.query.eventid);
      else if (req.query.userid)
        event = await findEventByOwnerId(req.query.userid);
      if (event.length !== 0) return res.status(200).json(event);
      return res.status(404).send("Event not found");
    }

    //YUP VALIDATION

    const schema = Yup.object().shape({
      eventName: eventSchema.name,
      startDate: eventSchema.date,
      finishDate: eventSchema.date,
      location: eventSchema.location,
      maxParticipants: eventSchema.maxParticipants,
      cost: eventSchema.cost,
      description: eventSchema.description,
    });

    await schema.validate(req.body);

    // CHECK SESSION

    const session = await getLoginSession(req);
    if (!session) return res.status(401).send("Unauthorized");
    const userFetched = await findUser(session);
    if (userFetched && userFetched.lastPasswordChange > session.createdAt) {
      removeTokenCookie(res);
      return res.redirect(307, "/login");
    }

    //-------------------------------------------------------------------POST
    if (req.method === "POST") {
      //TODO: allowed cars filter
      //TODO: gpx file handler
      //TODO: image handler
      await createEvent({
        ...req.body,
        userId: userFetched.id,
        eventState: "PROGRAMMATO",
      });
      return res.status(200).json({ done: true });
    }

    //-------------------------------------------------------------------PATCH
    else if (req.method === "PATCH") {
      const event = await findEventById(req.body.eventid);
      if (event.ownerId !== userFetched.id)
        return res.status(401).send("Unauthorized");
      await updateEvent(req.body);
      return res.status(200).json({ done: true });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send("Something went wrong, please try again");
  }
}

export default eventHendler;
