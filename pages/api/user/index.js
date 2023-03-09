import { getLoginSession } from "lib/auth";
import { removeTokenCookie } from "lib/auth-cookies";
import { findUser } from "lib/dbUser";

/**
 * @swagger
 * tags:
 * - name: user
 *   description: Apis relevant to user access
 * /api/user:
 *   get:
 *     summary: Gets user from session cookie
 *     description: Gets user from session cookie
 *     tags:
 *     - user
 *     parameters:
 *       - in: cookie
 *         name: carmeetingSession
 *         carmeetingSession: cookie
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       307:
 *         description: Authentication token is invalid, please log in
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Authentication token is invalid, please log in
 */

async function userHandler(req, res) {
  try {
    if (req.method === "GET") {
      const session = await getLoginSession(req);

      if (!session) return res.status(200).json(null);

      const userFetched = await findUser(session);

      if (userFetched && userFetched.lastPasswordChange > session.createdAt) {
        removeTokenCookie(res);
        return res.redirect(307, "/login");
      }

      const userSession = (session && userFetched) ?? null;
      session.email = userFetched.email;

      return res.status(200).json(userSession ? session : null);
    } else return res.status(405).send("Method not allowed");
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res
      .status(500)
      .send("Authentication token is invalid, please log in");
  }
}

export default userHandler;
