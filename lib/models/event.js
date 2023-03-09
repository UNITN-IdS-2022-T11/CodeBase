import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

const EventSchema = new Schema(
  {
    id: { type: String, required: true },
    ownerId: { type: String, required: true },
    eventName: { type: String, required: true },
    image: { type: String, required: false },
    startDate: { type: Date, required: true },
    finishDate: { type: Date, required: true },
    location: { type: Object, required: true },
    description: { type: String, required: false },
    maxParticipants: { type: Number, required: true },
    participants: { type: Number, required: true },
    participantsIds: { type: Array, required: false },
    price: { type: Number, required: false },
    allowedCars: { type: Object, required: false },
    gpxFile: { type: String, required: false },
    eventState: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Event || model("Event", EventSchema);
