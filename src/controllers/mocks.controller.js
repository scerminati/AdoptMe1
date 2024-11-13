import { mockPets, mockUsers } from "../utils/mocks.js";
import { petsService, usersService } from "../services/index.js";

const generatePets = async (req, res) => {
  const quantity = parseInt(req.params.q) || 50;

  try {
    const generatedPets = await generateEntities(quantity, mockPets);
    res.send({ status: "success", payload: generatedPets });
  } catch (error) {
    res.status(400).send({ status: "error", error: error.message });
  }
};

const generateUsers = async (req, res) => {
  const quantity = parseInt(req.params.q) || 50;

  try {
    const generatedUsers = await generateEntities(quantity, mockUsers);
    res.send({ status: "success", payload: generatedUsers });
  } catch (error) {
    res.status(400).send({ status: "error", error: error.message });
  }
};

const generateData = async (req, res) => {
  const { petQuantity = 0, userQuantity = 0 } = req.body;


  if (!petQuantity && !userQuantity) {
    return res
      .status(400)
      .send({ status: "error", error: "at least one quantity must be greater than zero" });
  }

  try {
    const generatedData = {};

    if (petQuantity > 0) {
      const pets = await generateEntities(petQuantity, mockPets);
      await Promise.all(pets.map((pet) => petsService.create(pet)));
      generatedData.pets = pets;
    }

    if (userQuantity > 0) {
      const users = await generateEntities(userQuantity, mockUsers);
      await Promise.all(users.map((user) => usersService.create(user)));
      generatedData.users = users;
    }

    res.send({
      status: "success",
      message: "Data generated and saved",
      ...generatedData,
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

export default { generatePets, generateUsers, generateData };

const generateEntities = async (quantity, generatorFunc) => {
  const entities = [];
  for (let i = 0; i < quantity; i++) {
    const entity = await generatorFunc();
    if (!entity) throw new Error("Failed to generate entity");
    entities.push(entity);
  }
  return entities;
};
