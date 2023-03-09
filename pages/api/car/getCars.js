/**
 * @swagger
 * /api/car/getCars:
 *   get:
 *     summary: Gets all the combinations of cars makes and models
 *     description: Gets all the combinations of cars makes and models
 *     tags:
 *     - car
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Something went wrong, please try again
 */

async function getCarsHandler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Method not allowed");

  try {
    const cars = require("data/cars.json");

    return res.status(200).json(cars.cars);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    return res.status(500).send("Something went wrong, please try again");
  }
}

export default getCarsHandler;
