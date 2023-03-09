import dbConnect from "lib/dbConnect";
import CarModel from "lib/models/car";
import UserModel from "lib/models/user";
import { v4 as uuidv4 } from "uuid";

// CREATE ---------------------------------------------------------------------

export async function createCar({
  userId,
  producer,
  nationality,
  model,
  year,
  image,
  description,
}) {
  await dbConnect();

  const id = uuidv4();

  const car = await CarModel.create({
    id: id,
    ownerId: userId,
    image: image,
    description: description,
    carType: {
      producer: producer,
      nationality: nationality,
      model: model,
      year: year,
    },
  });

  await UserModel.updateOne({ id: userId }, { $push: { carIds: id } });

  return car;
}

// READ -----------------------------------------------------------------------

export async function findCarById(id) {
  await dbConnect();
  return await CarModel.findOne({ id: id }).exec();
}

export async function findCarByUserId(userid) {
  await dbConnect();
  return await CarModel.find({ ownerId: userid }).exec();
}

// UPDATE ---------------------------------------------------------------------

export async function updateCar({
  id,
  producer,
  nationality,
  model,
  year,
  image,
  description,
}) {
  await dbConnect();
  const car = await findCar({ id: id });
  car.carType.producer = producer;
  car.carType.nationality = nationality;
  car.carType.model = model;
  car.carType.year = year;
  car.image = image;
  car.description = description;
  await car.save();
}

// DELETE ---------------------------------------------------------------------

export async function deleteCar(id) {
  await dbConnect();
  const car = await findCarById(id);
  await UserModel.updateOne({ id: car.ownerId }, { $pull: { carIds: id } });
  await car.delete();
}
