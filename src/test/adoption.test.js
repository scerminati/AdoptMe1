import app from "../app.js";
import { connectToDatabase } from "../app.js";
import mongoose from "mongoose";

import request from "supertest";
import { expect } from "chai";

import adoptionModel from "../dao/models/Adoption.js";
import userModel from "../dao/models/User.js";
import petModel from "../dao/models/Pet.js";

describe("Adoptions API, prueba de CRUD", () => {
  let createdAdoptions = [];
  let createdPets = [];
  let createdUsers = [];

  before(async () => {
    await connectToDatabase();
  });

  after(async () => {
    if (createdAdoptions.length > 0) {
      await adoptionModel.deleteMany({ _id: { $in: createdAdoptions } });
    }
    if (createdPets.length > 0) {
      await petModel.deleteMany({ _id: { $in: createdPets } });
    }
    if (createdUsers.length > 0) {
      await userModel.deleteMany({ _id: { $in: createdUsers } });
    }
    await mongoose.connection.close();
  });

  describe("GET /api/adoptions", () => {
    it("Debería retornal la lista completa de adopciones", async () => {
      const res = await request(app).get("/api/adoptions");
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array");
    });
  });

  describe("POST /api/adoptions", () => {
    it("Debería crear una nueva adopción", async () => {
      const newPet = {
        name: "Mascota",
        specie: "Nueva",
        birthDate: new Date().toISOString(),
      };

      const res = await request(app).post("/api/pets").send(newPet);

      let idPet = null;
      if (res.body.payload) {
        createdPets.push(res.body.payload._id);
        idPet = res.body.payload._id;
      }
      expect(res.body.status).to.equal("success");

      const newUser = {
        first_name: "Usuario",
        last_name: "Nuevo",
        email: "usuarionuevo@test.com",
        password: "test",
      };
      const res1 = await request(app)
        .post("/api/sessions/register")
        .send(newUser);
      let idUser = null;
      if (res1.body.payload) {
        createdUsers.push(res1.body.payload);
        idUser = res1.body.payload;
      }
      expect(res1.body.status).to.equal("success");

      const res2 = await request(app)
        .post(`/api/adoptions/${idUser}/${idPet}`)
        .send();

      if (res2.body.payload) {
        createdAdoptions.push(res2.body.payload._id);
      }

      expect(res2.body.status).to.equal("success");
      expect(res2.body.payload.owner).to.equal(idUser);
      expect(res2.body.payload.pet).to.equal(idPet);
    });

    it("Debería devolver error al no encontrar usuario", async () => {
      const newPet2 = {
        name: "Mascota",
        specie: "Nueva2",
        birthDate: new Date().toISOString(),
      };

      const res = await request(app).post("/api/pets").send(newPet2);

      let idPet = null;
      if (res.body.payload) {
        createdPets.push(res.body.payload._id);
        idPet = res.body.payload._id;
      }

      let idUser = "000000000000000000000000";

      const res1 = await request(app)
        .post(`/api/adoptions/${idUser}/${idPet}`)
        .send();

      if (res1.body.payload) {
        createdAdoptions.push(res1.body.payload._id);
      }

      expect(res1.status).to.equal(404);
      expect(res1.body.status).to.equal("error");
    });

    it("Debería devolver error al no encontrar mascota", async () => {
      const newUser2 = {
        first_name: "Usuario 2",
        last_name: "Nuevo",
        email: "usuarionuevo2@test.com",
        password: "test",
      };
      const res = await request(app)
        .post("/api/sessions/register")
        .send(newUser2);

      let idUser = null;
      if (res.body.payload) {
        createdUsers.push(res.body.payload);
        idUser = res.body.payload;
      }
      expect(res.body.status).to.equal("success");

      let idPet = "000000000000000000000000";

      const res1 = await request(app)
        .post(`/api/adoptions/${idUser}/${idPet}`)
        .send();

      if (res1.body.payload) {
        createdAdoptions.push(res1.body.payload._id);
      }

      expect(res1.status).to.equal(404);
      expect(res1.body.status).to.equal("error");
    });

    it("Debería devolver error al encontrar mascota adoptada", async () => {
      const newUser3 = {
        first_name: "Usuario 3",
        last_name: "Nuevo",
        email: "usuarionuevo3@test.com",
        password: "test",
      };
      const res = await request(app)
        .post("/api/sessions/register")
        .send(newUser3);

      let idUser = null;
      if (res.body.payload) {
        createdUsers.push(res.body.payload);
        idUser = res.body.payload;
      }
      expect(res.body.status).to.equal("success");

      const newPet3 = {
        name: "Mascota",
        specie: "Nueva2",
        birthDate: new Date().toISOString(),
      };

      const res1 = await request(app).post("/api/pets").send(newPet3);

      let idPet = null;
      if (res1.body.payload) {
        createdPets.push(res1.body.payload._id);
        idPet = res1.body.payload._id;
      }

      const updateBody = {
        adopted: true,
        owner: { _id: "000000000000000000000000" },
      };

      const res2 = await request(app)
        .put(`/api/pets/${idPet}`)
        .send(updateBody);
      expect(res2.body.status).to.equal("success");

      const res3 = await request(app)
        .post(`/api/adoptions/${idUser}/${idPet}`)
        .send();

      if (res3.body.payload) {
        createdAdoptions.push(res3.body.payload._id);
      }

      expect(res3.status).to.equal(400);
      expect(res3.body.status).to.equal("error");
    });
  });

  describe("GET /api/pets/:aid", () => {
    it("Debería traer la adopción por id.", async () => {
      const newPet4 = {
        name: "Mascota 4",
        specie: "Nueva",
        birthDate: new Date().toISOString(),
      };

      const res = await request(app).post("/api/pets").send(newPet4);

      let idPet = null;
      if (res.body.payload) {
        createdPets.push(res.body.payload._id);
        idPet = res.body.payload._id;
      }
      expect(res.body.status).to.equal("success");

      const newUser4 = {
        first_name: "Usuario 4",
        last_name: "Nuevo",
        email: "usuarionuevo4@test.com",
        password: "test",
      };
      const res1 = await request(app)
        .post("/api/sessions/register")
        .send(newUser4);
      let idUser = null;
      if (res1.body.payload) {
        createdUsers.push(res1.body.payload);
        idUser = res1.body.payload;
      }
      expect(res1.body.status).to.equal("success");

      const res2 = await request(app)
        .post(`/api/adoptions/${idUser}/${idPet}`)
        .send();

      let idAdop = null;
      if (res2.body.payload) {
        createdAdoptions.push(res2.body.payload._id);
        idAdop = res2.body.payload._id;
      }
      expect(res2.body.status).to.equal("success");

      const res3 = await request(app).get(`/api/adoptions/${idAdop}`).send();

      expect(res3.body.payload).to.have.property("_id", idAdop);
      expect(res3.body.payload.owner.toString()).to.equal(idUser);
      expect(res3.body.payload.pet.toString()).to.equal(idPet);
    });

    it("Debería arrojar error al ingresar un id incorrecto", async () => {
      const idAdop = "000000000000000000000000";

      const res = await request(app).get(`/api/adoptions/${idAdop}`).send();

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal("error");
    });
  });
});
