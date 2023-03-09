import { findEventById } from "lib/dbEvent";
import { findUser } from "lib/dbUser";

/**
 * @swagger
 * /api/event/myAgenda/{userid}:
 *   get:
 *     summary: Gets the agenda of the user
 *     description: Gets the agenda of the user
 *     tags:
 *     - event
 *     parameters:
 *     - in: query
 *       name: username
 *       username: users username
 *       required: true
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       400:
 *         description: Missing information
 *       404:
 *         description: User not found
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Something went wrong, please try again
 */

async function subscribeEventHandeler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method not allowed");
  if (!req.query.username) return res.status(400).send("Missing information");

  try {
    const userFetched = await findUser(req.query);

    if (!userFetched) return res.status(404).send("User not found");

    const userEvents = userFetched.subscribedEventIds;
    let events = [];

    for (let i = 0; i < userEvents.length; i++) {
      const eventFetched = await findEventById(userEvents[i]);
      if (!eventFetched)
        return res.status(500).send("Something went wrong, please try again");
      events.push(eventFetched);
    }

    return res.status(200).json(events);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send("Something went wrong, please try again");
  }
}

export default subscribeEventHandeler;
