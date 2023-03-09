import { sendPwdRecoveryMail } from "lib/email";
import { createRecoverPasswordUser, findUser } from "lib/dbUser";
import { regSchema } from "lib/yupSchemas";
import * as Yup from "yup";

/**
 * @swagger
 * /api/user/requestRecoverPassword:
 *   post:
 *     summary: Sends an email to the user with a secret code to recover the password
 *     description: Sends an email to the user with a secret code to recover the password
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
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       404:
 *         description: User not found
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: error requesting recovering password
 */

async function requestRecoverPasswordHandler(req, res) {
  const schema = Yup.object().shape({
    email: regSchema.email,
    username: regSchema.username,
  });

  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    await schema.validate(req.body);

    const user = await findUser(req.body);

    if (!user || user.email !== req.body.email)
      return res.status(401).send("Username or email invalid");

    const { recoverPasswordCode } = await createRecoverPasswordUser(user);

    const recoverPasswordCodeURI = encodeURIComponent(recoverPasswordCode);
    const recoveryLink = `${process.env.BASE_URI}recover/${recoverPasswordCodeURI}`;
    if (process.env.NODE_ENV !== "test") {
      if (process.env.NODE_ENV !== "development") {
        await sendPwdRecoveryMail(req.body.email, {
          username: req.body.username,
          recoveryLink,
        });
      } else console.log("Recover password link: " + recoveryLink);
    }
    return res.status(200).json({ done: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send("Error requesting recover password");
  }
}

export default requestRecoverPasswordHandler;
