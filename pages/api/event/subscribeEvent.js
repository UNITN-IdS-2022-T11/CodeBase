import { subscribeEvent } from "lib/dbEvent";
import { getLoginSession } from "lib/auth";
import { removeTokenCookie } from "lib/auth-cookies";
import { findUser, subscribeUser } from "lib/dbUser";

/**
 * @swagger
 * /api/event/subscribeEvent:
 *   post:
 *     summary: Subscribes or unsubscribes a user to an event
 *     description: Subscribes a user to an event
 *     tags:
 *     - event
 *     parameters:
 *       - in: cookie
 *         name: carmeetingSession
 *         carmeetingSession: cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventid:
 *                 eventid: string
 *                 description: The event id of the event to subscribe
 *               subscribe:
 *                 type: boolean
 *                 description: User wants to subscribe or unsubscribe
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       307:
 *         description: Redirect to login
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Something went wrong, please try again
 */

async function subscribeEventHandeler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const session = await getLoginSession(req);
    if (!session) return res.status(401).send("Unauthorized");
    const userFetched = await findUser(session);
    if (userFetched && userFetched.lastPasswordChange > session.createdAt) {
      removeTokenCookie(res);
      return res.redirect(307, "/login");
    }

    //TODO: check if user has the allowed car

    if (await subscribeEvent({ ...req.body, userid: userFetched.id })) {
      await subscribeUser({
        userid: userFetched.id,
        eventid: req.body.eventid,
        subscribe: req.body.subscribe,
      });

      return res.status(200).json({ done: true });
    }
    return res.status(500).send();
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send("Something went wrong, please try again");
  }
}

export default subscribeEventHandeler;
