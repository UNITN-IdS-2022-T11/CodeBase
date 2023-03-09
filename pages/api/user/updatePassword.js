import { changeUserPassword, findUser, validatePassword } from "lib/dbUser";
import { loginSchema, regSchema } from "lib/yupSchemas";
import * as Yup from "yup";

/**
 * @swagger
 * /api/user/updatePassword:
 *   patch:
 *     summary: Updates the password of the user
 *     description: updates the password of the user
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
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The username of the user
 *               newPassword:
 *                 type: string
 *                 description: The new password of the user
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       400:
 *         description: New password must be different from old password
 *       401:
 *         description: Invalid username and password combination
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: error updating password
 */

async function updatePasswordHandler(req, res) {
  const schema = Yup.object().shape({
    username: loginSchema.username,
    password: loginSchema.password,
    newPassword: regSchema.password,
  });

  if (req.method !== "PATCH") return res.status(405).send("Method not allowed");

  try {
    await schema.validate(req.body);

    const user = await findUser(req.body);

    if (!user || !validatePassword(user, req.body.password)) {
      return res.status(401).send("Invalid username and password combination");
    }

    if (req.body.password === req.body.newPassword) {
      return res
        .status(400)
        .send("New password must be different from old password");
    }

    changeUserPassword(user, req.body.newPassword);

    return res.status(200).json({ done: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send("Error updating password");
  }
}

export default updatePasswordHandler;
