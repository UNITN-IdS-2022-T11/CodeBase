import crypto from "crypto";
import dbConnect from "lib/dbConnect";
import RecoverPwdModel from "lib/models/recoverPwd";
import UserModel from "lib/models/user";
import { v4 as uuidv4 } from "uuid";

// CREATE ---------------------------------------------------------------------

export async function createUser({ username, email, password }) {
  const hypoteticUser = await findUser({ username });
  if (hypoteticUser && hypoteticUser.username === username) {
    if (hypoteticUser.verified) throw new Error("Username already exists");
    else throw new Error("Username not available, try again tomorrow");
  }

  await dbConnect();

  const salt = crypto.randomBytes(16).toString("hex");
  const verifyEmail = crypto.randomBytes(16).toString("hex");

  await UserModel.create({
    id: uuidv4(),
    username: username,
    email: email,
    lastPasswordChange: new Date(),
    salt: salt,
    hash: crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex"),
    verified: false,
    verifyEmailSecret: verifyEmail,
  });

  return { username, verifyEmail: verifyEmail };
}

export async function createRecoverPasswordUser(user) {
  await dbConnect();

  const recoverPasswordCode = crypto.randomBytes(16).toString("hex");

  await RecoverPwdModel.create({
    id: user.id,
    username: user.username,
    secret: recoverPasswordCode,
  });

  return { recoverPasswordCode: recoverPasswordCode };
}

// READ -----------------------------------------------------------------------

export async function findUser({ username }, verified = true) {
  await dbConnect();
  return await UserModel.findOne({ username, verified: verified }).exec();
}

export async function findUserById(id) {
  await dbConnect();
  return await UserModel.findOne({ id: id }).exec();
}

export async function findRecoverPwdUser({ username, secret }) {
  await dbConnect();
  if (username) return await RecoverPwdModel.findOne({ username }).exec();
  return await RecoverPwdModel.findOne({ secret }).exec();
}

export function validatePassword(user, inputPassword) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, "sha512")
    .toString("hex");
  return user.hash === inputHash;
}

// UPDATE ---------------------------------------------------------------------

export async function verifyEmail(user) {
  await dbConnect();
  user.verified = true;
  user.verifyEmailSecret = undefined;
  await user.save();
}

export async function changeUserPassword(user, newPassword) {
  await dbConnect();
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(newPassword, salt, 1000, 64, "sha512")
    .toString("hex");
  user.lastPasswordChange = new Date();
  user.salt = salt;
  user.hash = hash;
  await user.save();
}

export async function subscribeUser({ userid, subscribe, eventid }) {
  await dbConnect();
  const user = await findUserById(userid);
  if (subscribe) {
    user.subscribedEventIds.push(eventid);
  } else {
    user.subscribedEventIds = user.subscribedEventIds.filter(
      (id) => id !== eventid
    );
  }
  await user.save();
}

export async function updateUser({ username, email, image }) {
  await dbConnect();
  const user = await findUser({ username });
  user.username = username;
  let verifyEmail = null;
  if (email !== user.email) {
    user.verified = false;
    verifyEmail = crypto.randomBytes(16).toString("hex");
    user.verifyEmailSecret = verifyEmail;
  }
  user.email = email;
  user.image = image;
  await user.save();
  return { username, verifyEmail: verifyEmail };
}

// DELETE ---------------------------------------------------------------------

export async function deleteRecoverPasswordUser(recoverPwdUser) {
  await dbConnect();
  await recoverPwdUser.remove();
}
