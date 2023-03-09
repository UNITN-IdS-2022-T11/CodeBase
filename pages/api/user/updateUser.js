import { findUser, updateUser } from "lib/dbUser";
import { loginSchema } from "lib/yupSchemas";
import * as Yup from "yup";

/**
 * @swagger
 * /api/user/updateUser:
 *   patch:
 *     summary: Updates the user account
 *     description: Updates the user account
 *     tags:
 *     - user
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
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               image:
 *                 type: string
 *                 description: The profile image of the user
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: error creating new user
 */

async function verifyEmailHandler(req, res) {
  const schema = Yup.object().shape({
    username: loginSchema.username,
    email: loginSchema.email,
  });

  if (req.method !== "PATCH") return res.status(405).send("Method not allowed");

  try {
    await schema.validate(req.body);

    const session = await getLoginSession(req);
    if (!session) return res.status(200).json({ done: true });
    const userFetched = await findUser(session);
    if (userFetched && userFetched.lastPasswordChange > session.createdAt) {
      removeTokenCookie(res);
      return res.redirect(307, "/login");
    }

    const { username, verifyEmail } = await updateUser(req.body);

    if (!verifyEmail) return res.status(200).json({ done: true });

    const verificationLink = `${BASE_URI}api/user/verifyEmail?username=${encodedUsername}&verifyEmail=${encodedVerifyEmail}`;
    if (process.env.NODE_ENV !== "test") {
      if (process.env.NODE_ENV !== "development") {
        await sendVerifyMail(req.body.email, { username, verificationLink });
      } else console.log("Email verification link: " + verificationLink);
    }
    removeTokenCookie(res);
    return res.redirect(307, "/login");
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send("Error updating user");
  }
}

export default verifyEmailHandler;
