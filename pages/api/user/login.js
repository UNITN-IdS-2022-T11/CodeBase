import { setLoginSession } from "lib/auth";
import { findUser, validatePassword } from "lib/dbUser";
import { loginSchema } from "lib/yupSchemas";
import * as Yup from "yup";

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Lets user log in
 *     description: Lets user log in
 *     tags:
 *     - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       401:
 *         description: Invalid username and password combination
 *       405:
 *         description: Method not allowed
 *       409:
 *         description: Email not yet verified
 */

async function loginHandler(req, res) {
  const schema = Yup.object().shape({
    username: loginSchema.username,
    password: loginSchema.password,
  });

  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    await schema.validate(req.body);

    const user = await findUser(req.body);

    if (!user || !validatePassword(user, req.body.password)) {
      return res.status(401).send("Invalid username and password combination");
    }

    if (!user.verified) {
      return res.status(409).send("Email not yet verified");
    }

    const session = { username: user.username, userid: user.id };

    await setLoginSession(res, req.body.remember, session);

    return res.status(200).send({ done: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(401).send(error.message);
  }
}

export default loginHandler;
