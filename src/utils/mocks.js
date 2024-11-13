import { faker } from "@faker-js/faker";
import { createHash } from "../utils/index.js";

export async function mockPets() {
  const adoptableSpecies = [
    "cat",
    "dog",
    "rodent",
    "fish",
    "bird",
    "rabbit",
    "snake",
  ];
  const specieType =
    adoptableSpecies[Math.floor(Math.random() * adoptableSpecies.length)];

  const speciesWithBreed = `${specieType} - ${faker.animal[specieType]()}`;

  const mockedPet = {
    name: faker.animal.petName(),
    specie: speciesWithBreed,
    birthDate: faker.date.birthdate({ mode: "age", min: 0, max: 18 }),
    adopted: false,
    owner: null,
  };
  return mockedPet;
}

export async function mockUsers() {
  const mockedUser = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: await createHash("coder123"),
    role: Math.random() < 0.5 ? "admin" : "user",
    pets: [],
  };

  return mockedUser;
}
