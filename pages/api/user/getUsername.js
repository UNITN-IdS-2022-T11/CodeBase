import { findUserById } from "lib/dbUser";

/**
 * @swagger
 * tags:
 * - name: user
 *   description: Apis relevant to user access
 * /api/user/getUsername:
 *   get:
 *     summary: Gets username from userid
 *     description: Gets username from userid
 *     tags:
 *     - user
 *     parameters:
 *     - in: query
 *       name: userid
 *       userid: user id
 *       required: true
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       404:
 *         description: User not found
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Something went wrong, please try again
 */

async function getUserHandler(req, res) {
  try {
    if (req.method === "GET") {
      if (!req.query.userid) return res.status(200).json({ done: true });

      const userFetched = await findUserById(req.query.userid);

      if (!userFetched) return res.status(404).send("User not found");

      return res
        .status(200)
        .json(
          userFetched
            ? { id: req.query.userid, username: userFetched.username }
            : null
        );
    } else return res.status(405).send("Method not allowed");
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send("Something went wrong, please try again");
  }
}

export default getUserHandler;
