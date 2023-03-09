import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

const TTL = 60 * 30; // 30 minutes

const RecoverPwdSchema = new Schema(
  {
    id: { type: String, required: true },
    username: { type: String, required: true },
    secret: { type: String, required: true },
  },
  { timestamps: true }
);

RecoverPwdSchema.index({ createdAt: 1 }, { expireAfterSeconds: TTL });

export default models.RecoverPwd || model("RecoverPwd", RecoverPwdSchema);
