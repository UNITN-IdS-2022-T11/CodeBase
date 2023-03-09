import dbConnect from "lib/dbConnect";
import EventModel from "lib/models/event";
import UserModel from "lib/models/user";
import { v4 as uuidv4 } from "uuid";

// CREATE ---------------------------------------------------------------------

export async function createEvent({
  userId,
  eventName,
  image,
  startDate,
  finishDate,
  location,
  description,
  maxParticipants,
  price,
  allowedCars,
  gpxFile,
  eventState,
}) {
  const newId = uuidv4();

  await dbConnect();
  await EventModel.create({
    id: newId,
    ownerId: userId,
    eventName: eventName,
    image: image,
    startDate: startDate,
    finishDate: finishDate,
    location: location,
    description: description,
    maxParticipants: maxParticipants,
    participants: 1,
    participantsIds: [userId],
    price: price,
    allowedCars: allowedCars,
    gpxFile: gpxFile,
    eventState: eventState,
  });

  await UserModel.updateOne({ id: userId }, { $push: { eventIds: newId } });
  await UserModel.updateOne(
    { id: userId },
    { $push: { subscribedEventIds: newId } }
  );
}

// READ -----------------------------------------------------------------------

export async function findEventById(id) {
  await dbConnect();
  return await EventModel.findOne({ id: id }).exec();
}

export async function findEventByOwnerId(ownerId) {
  await dbConnect();
  return await EventModel.find({ ownerId: ownerId }).exec();
}

export async function findProgrammedEvents() {
  await dbConnect();
  return await EventModel.find({ state: "PROGRAMMATO" }).exec();
}

// UPDATE ---------------------------------------------------------------------

export async function updateEvent({
  id,
  eventName,
  image,
  startDate,
  finishDate,
  location,
  description,
  maxParticipants,
  cost,
  allowedCars,
  gpxFile,
  eventState,
}) {
  await dbConnect();
  const event = await findEventById(id);
  event.eventName = eventName;
  event.image = image;
  event.startDate = startDate;
  event.finishDate = finishDate;
  event.location = location;
  event.description = description;
  event.maxParticipants = maxParticipants;
  event.price = cost;
  event.allowedCars = allowedCars;
  event.gpxFile = gpxFile;
  event.eventState = eventState;
  await event.save();
}

export async function subscribeEvent({ eventid, userid, subscribe }) {
  await dbConnect();
  const event = await findEventById(eventid);
  if (subscribe) {
    if (event.participantsIds.includes(userid)) return false;
    if (event.participants >= event.maxParticipants) return false;
    event.participants += 1;
    event.participantsIds.push(userid);
  } else {
    if (!event.participantsIds.includes(userid)) return;
    event.participants -= 1;
    event.participantsIds = event.participantsIds.filter((id) => id !== userid);
  }
  await event.save();
  return true;
}
