import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

const UNVERIFIED_TTL = 60 * 60 * 12; // 12 hours

const UserSchema = new Schema(
  {
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    image: { type: String, required: false },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    verified: { type: Boolean, required: true, index: true },
    lastPasswordChange: { type: Date, required: true },
    verifyEmailSecret: { type: String, required: false },
    carIds: { type: Array, required: false },
    eventIds: { type: Array, required: false },
    subscribedEventIds: { type: Array, required: false },
  },
  { timestamps: true }
);

UserSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: UNVERIFIED_TTL,
    partialFilterExpression: { verified: false },
  }
);

export default models.User || model("User", UserSchema);
