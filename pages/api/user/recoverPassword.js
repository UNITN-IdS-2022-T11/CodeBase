import {
  changeUserPassword,
  deleteRecoverPasswordUser,
  findRecoverPwdUser,
  findUser,
} from "lib/dbUser";
import { regSchema, secretCodeSchema } from "lib/yupSchemas";
import * as Yup from "yup";

/**
 * @swagger
 * /api/user/recoverPassword:
 *   put:
 *     summary: Recovers the password of the user
 *     description: recovers the password of the user
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
 *               newPassword:
 *                 type: string
 *                 description: The new password of the user
 *               recvoverPasswordCode:
 *                 type: string
 *                 description: The secret code sent to the user's email
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       404:
 *         description: User not found
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: error recovering password
 */

async function recoverPasswordHandler(req, res) {
  const schema = Yup.object().shape({
    username: Yup.string().max(24, "Username too long! (max: 24)").required(),
    newPassword: regSchema.password,
    recoverPasswordCode: secretCodeSchema,
  });

  if (req.method !== "PUT") return res.status(405).send("Method not allowed");

  try {
    await schema.validate(req.body);

    const user = await findUser(req.body);
    const recoverPasswordUser = await findRecoverPwdUser(req.body);

    if (!user || !recoverPasswordUser)
      return res.status(404).send("User not found");

    if (user.id !== recoverPasswordUser.id)
      return res.status(500).send("Something very bad happened");

    if (recoverPasswordUser.secret === req.body.recoverPasswordCode) {
      await changeUserPassword(user, req.body.newPassword);
      await deleteRecoverPasswordUser(recoverPasswordUser);
      return res.status(200).json({ done: true });
    }

    return res.status(500).send("Error while changing password");
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send("Error recovering password");
  }
}

export default recoverPasswordHandler;
