import { mockPets, mockUsers } from "../utils/mocks.js";
import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";

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
    return res.status(400).send({
      status: "error",
      error: "at least one quantity must be greater than zero",
    });
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

const generateAdoptions = async (req, res) => {
  const generateAdoptions = parseInt(req.params.q) || 50; // Cantidad de adopciones a generar
  let quantityAdoptions = 0; // Contador de adopciones realizadas
  let generatedAdoptions = []; // Lista de adopciones generadas

  try {
    // Obtén todas las mascotas y usuarios
    const pets = await petsService.getAll();
    const users = await usersService.getAll();

    // Verifica que haya usuarios y mascotas disponibles
    if (pets.length === 0 || users.length === 0) {
      return res.status(400).send({
        status: "error",
        error: "Not enough users or pets available",
      });
    }

    // Filtra solo las mascotas no adoptadas
    const availablePets = pets.filter((pet) => !pet.adopted);
    if (availablePets.length === 0) {
      return res.status(400).send({
        status: "error",
        error: "No pets available for adoption",
      });
    }

    // Generar adopciones
    for (let i = 0; i < generateAdoptions && availablePets.length > 0; i++) {
      const randomPetIndex = Math.floor(Math.random() * availablePets.length);
      const randomUserIndex = Math.floor(Math.random() * users.length);

      const selectedPet = availablePets[randomPetIndex];
      const selectedUser = users[randomUserIndex];

      selectedUser.pets.push(selectedPet._id);

      await usersService.update(selectedUser._id, { pets: selectedUser.pets });
      await petsService.update(selectedPet._id, {
        adopted: true,
        owner: selectedUser._id,
      });
      await adoptionsService.create({
        owner: selectedUser._id,
        pet: selectedPet._id,
      });

      generatedAdoptions.push({
        owner: selectedUser._id,
        pet: selectedPet._id,
      });

      availablePets.splice(randomPetIndex, 1);

      quantityAdoptions++;
    }

    res.send({
      status: "success",
      message: `Generated ${quantityAdoptions} adoption(s)`,
      adoptions: generatedAdoptions,
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

export default { generatePets, generateUsers, generateData, generateAdoptions };

const generateEntities = async (quantity, generatorFunc) => {
  const entities = [];
  for (let i = 0; i < quantity; i++) {
    const entity = await generatorFunc();
    if (!entity) throw new Error("Failed to generate entity");
    entities.push(entity);
  }
  return entities;
};
