import { findUser, verifyEmail } from "lib/dbUser";
import { loginSchema, secretCodeSchema } from "lib/yupSchemas";
import * as Yup from "yup";

/**
 * @swagger
 * /api/user/verifyEmail/{username, verifyEmail}:
 *   get:
 *     summary: Verify the email of the user
 *     description: verify the email of the user
 *     tags:
 *     - user
 *     parameters:
 *       - name: username
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: verifyEmail
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       405:
 *         description: Method not allowed
 *       409:
 *         description: user already verified
 *       500:
 *         description: error updating password
 */

async function verifyEmailHandler(req, res) {
  const schema = Yup.object().shape({
    username: loginSchema.username,
    verifyEmail: secretCodeSchema,
  });

  if (req.method !== "GET") return res.status(405).send("Method not allowed");

  try {
    await schema.validate(req.query);

    const validatedUser = req.query;
    const user = await findUser(validatedUser, false);

    if (!user) throw new Error("User not found");
    if (user.verified) return res.status(409).send("user already verified");

    if (user.verifyEmailSecret === req.query.verifyEmail) {
      verifyEmail(user);
      return res.redirect(307, "/login");
    } else {
      return res.status(400).send("Invalid verification link");
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send("Error while verifying email");
  }
}

export default verifyEmailHandler;
