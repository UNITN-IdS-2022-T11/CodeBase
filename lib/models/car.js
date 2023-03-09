import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

const CarSchema = new Schema(
  {
    id: { type: String, required: true },
    ownerId: { type: String, required: true },
    image: { type: String, required: false },
    description: { type: String, required: false },
    carType: { type: Object, required: true },
  },
  { timestamps: true }
);

export default models.Car || model("Car", CarSchema);
