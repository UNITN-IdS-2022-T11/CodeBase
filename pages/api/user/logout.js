import { removeTokenCookie } from "lib/auth-cookies";

/**
 * @swagger
 * /api/user/logout:
 *   get:
 *     summary: Logs out user
 *     description: Logs out user
 *     tags:
 *     - user
 *     responses:
 *       307:
 *         description: Redirect to home page
 */

async function logoutHandler(_req, res) {
  removeTokenCookie(res);
  return res.redirect(307, "/");
}

export default logoutHandler;
