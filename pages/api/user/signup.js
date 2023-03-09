import { createUser } from "lib/dbUser";
import { sendVerifyMail } from "lib/email";
import { regSchema } from "lib/yupSchemas";
import * as Yup from "yup";

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Creates a new user account
 *     description: Creates a new user account
 *     tags:
 *     - user
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
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       400:
 *         description: Bad Request
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: error creating new user
 */

const BASE_URI = process.env.BASE_URI;

if (!BASE_URI) throw new Error("BASE_URI local variable not set");

async function signupHandler(req, res) {
  const schema = Yup.object().shape({
    email: regSchema.email,
    username: regSchema.username,
    password: regSchema.password,
  });

  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    await schema.validate(req.body);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(400).send("Bad Request");
  }
  try {
    const { username, verifyEmail } = await createUser(req.body);

    const encodedUsername = encodeURIComponent(username);
    const encodedVerifyEmail = encodeURIComponent(verifyEmail);

    const verificationLink = `${BASE_URI}api/user/verifyEmail?username=${encodedUsername}&verifyEmail=${encodedVerifyEmail}`;

    if (process.env.NODE_ENV !== "test") {
      if (process.env.NODE_ENV !== "development") {
        await sendVerifyMail(req.body.email, { username, verificationLink });
      } else console.log("Email verification link: " + verificationLink);
    }

    return res.status(200).send({ done: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send(error.message);
  }
}

export default signupHandler;
