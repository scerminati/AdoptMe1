import app from "../app.js";
import { connectToDatabase } from "../app.js";
import mongoose from "mongoose";

import request from "supertest";
import { expect } from "chai";

import petModel from "../dao/models/Pet.js";

describe("Pets API, prueba de CRUD", () => {
  let createdPets = [];

  before(async () => {
    await connectToDatabase();
  });

  after(async () => {
    if (createdPets.length > 0) {
      await petModel.deleteMany({ _id: { $in: createdPets } });
    }
    await mongoose.connection.close();
  });

  describe("GET /api/pets", () => {
    it("Debería retornal la lista completa de mascotas", async () => {
      const res = await request(app).get("/api/pets");
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array");
    });
  });

  describe("POST /api/pets", () => {
    it("Debería crear una mascota nueva", async () => {
      const newPet = {
        name: "Mascota",
        specie: "Nueva",
        birthDate: new Date().toISOString(),
      };
      const res = await request(app).post("/api/pets").send(newPet);

      if (res.body.payload) {
        createdPets.push(res.body.payload._id);
      }

      expect(res.body.status).to.equal("success");
      expect(res.body.payload.name).to.equal(newPet.name);
      expect(res.body.payload.specie).to.equal(newPet.specie);
      expect(res.body.payload.birthDate).to.equal(newPet.birthDate);
    });

    it("Debería devolver error dar datos incompletos o incorrectos", async () => {
      const newPet1 = {
        name: "Mascota",
        specie: "Error",
        birthDate: "",
      };
      const res1 = await request(app).post("/api/pets").send(newPet1);

      if (res1.body.payload) {
        createdPets.push(res1.body.payload._id);
      }
      expect(res1.status).to.equal(400);
      expect(res1.body.status).to.equal("error");

      const newPet2 = {
        name: "",
        specie: "Error",
        birthDate: new Date().toISOString(),
      };
      const res2 = await request(app).post("/api/pets").send(newPet2);
      if (res2.body.payload) {
        createdPets.push(res2.body.payload._id);
      }
      expect(res2.status).to.equal(400);
      expect(res2.body.status).to.equal("error");

      const newPet3 = {
        name: "Mascota Error",
        specie: "",
        birthDate: new Date().toISOString(),
      };
      const res3 = await request(app).post("/api/pets").send(newPet3);
      if (res3.body.payload) {
        createdPets.push(res3.body.payload._id);
      }
      expect(res3.status).to.equal(400);
      expect(res3.body.status).to.equal("error");
    });
  });

  describe("PUT /api/pets/:pid", () => {
    it("Debería actualizar los datos de la mascota", async () => {
      const newPet0 = {
        name: "Mascota Put",
        specie: "Perro",
        birthDate: new Date().toISOString(),
      };
      const res0 = await request(app).post("/api/pets").send(newPet0);

      let id = null;
      if (res0.body.payload) {
        createdPets.push(res0.body.payload._id);
        id = res0.body.payload._id;
      }

      const updatedFecha = new Date(); 
      updatedFecha.setDate(updatedFecha.getDate() - 1);

      const petId = id;
      const updateBody = {
        name: "Cambiado",
        specie: "Gato",
        birthDate: updatedFecha.toISOString(),
        adopted: true,
        owner: { _id: "000000000000000000000000" },
      };
      const res = await request(app).put(`/api/pets/${petId}`).send(updateBody);
      expect(res.body.status).to.equal("success");

      const updatedPet = res.body.payload;
      expect(updatedPet).to.have.property("_id", petId);
      expect(updatedPet.name).to.equal(updateBody.name);
      expect(updatedPet.specie).to.equal(updateBody.specie);
      expect(updatedPet.birthDate).to.equal(updateBody.birthDate);
      expect(updatedPet.adopted).to.equal(updateBody.adopted);
      expect(updatedPet.owner.toString()).to.equal(updateBody.owner._id);
    });
  });

  describe("DELETE /api/pets/:pid", () => {
    it("Debería borrar una mascota", async () => {
      const newPet0 = {
        name: "Mascota DELETE",
        specie: "Perro",
        birthDate: new Date().toISOString(),
      };
      const res0 = await request(app).post("/api/pets").send(newPet0);

      let id = null;
      if (res0.body.payload) {
        createdPets.push(res0.body.payload._id);
        id = res0.body.payload._id;
      }

      const petId = id;
      const res = await request(app).delete(`/api/pets/${petId}`);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("_id", petId);
    });
  });
});
