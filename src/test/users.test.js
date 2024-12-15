import app from "../app.js";
import { connectToDatabase } from "../app.js";
import mongoose from "mongoose";

import request from "supertest";
import { expect } from "chai";

import userModel from "../dao/models/User.js";

describe("Users API, prueba de CRUD", () => {
  let createdUsers = [];

  before(async () => {
    await connectToDatabase();
  });

  after(async () => {
    if (createdUsers.length > 0) {
      await userModel.deleteMany({ _id: { $in: createdUsers } });
    }
    await mongoose.connection.close();
  });

  describe("GET /api/users", () => {
    it("Debería retornar la lista completa de los usuarios", async () => {
      const res = await request(app).get("/api/users");
      expect(res.body).to.be.an("object");
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array");
    });
  });

  describe("POST /api/sessions/register", () => {
    it("Debería crear un usuario nuevo", async () => {
      const newUser = {
        first_name: "Usuario",
        last_name: "Nuevo",
        email: "usuarionuevo@test.com",
        password: "test",
      };
      const res = await request(app)
        .post("/api/sessions/register")
        .send(newUser);

      if (res.body.payload) {
        createdUsers.push(res.body.payload);
      }
      expect(res.body.status).to.equal("success");
    });

    it("Debería devolver error al repetir el correo", async () => {
      const newUser = {
        first_name: "Test",
        last_name: "Negativo",
        email: "usuarionuevo@testneg.com",
        password: "test",
      };
      const res = await request(app)
        .post("/api/sessions/register")
        .send(newUser);

      if (res.body.payload) {
        createdUsers.push(res.body.payload);
      }

      const res1 = await request(app)
        .post("/api/sessions/register")
        .send(newUser);

      if (res1.body.payload) {
        createdUsers.push(res1.body.payload);
      }
      expect(res1.status).to.equal(406);
      expect(res1.body.status).to.equal("error");
    });

    it("Debería devolver error dar datos incompletos", async () => {
      const newUser1 = {
        first_name: "Test1",
        last_name: "No password",
        email: "Nopasstest@test.com",
        password: "",
      };
      const res1 = await request(app)
        .post("/api/sessions/register")
        .send(newUser1);

      if (res1.body.payload) {
        createdUsers.push(res1.body.payload);
      }
      expect(res1.status).to.equal(400);
      expect(res1.body.status).to.equal("error");

      const newUser2 = {
        first_name: "Test2",
        last_name: "No email",
        email: "",
        password: "test2",
      };
      const res2 = await request(app)
        .post("/api/sessions/register")
        .send(newUser2);

      if (res2.body.payload) {
        createdUsers.push(res2.body.payload);
      }
      expect(res2.status).to.equal(400);
      expect(res2.body.status).to.equal("error");

      const newUser3 = {
        first_name: "Test3",
        last_name: "",
        email: "nolastname@email.com",
        password: "test3",
      };
      const res3 = await request(app)
        .post("/api/sessions/register")
        .send(newUser3);

      if (res3.body.payload) {
        createdUsers.push(res3.body.payload);
      }
      expect(res3.status).to.equal(400);
      expect(res3.body.status).to.equal("error");

      const newUser4 = {
        first_name: "",
        last_name: "Test4",
        email: "nofirstname@email.com",
        password: "test4",
      };
      const res4 = await request(app)
        .post("/api/sessions/register")
        .send(newUser4);

      if (res4.body.payload) {
        createdUsers.push(res4.body.payload);
      }
      expect(res4.status).to.equal(400);
      expect(res4.body.status).to.equal("error");
    });
  });

  describe("GET /api/users/:uid", () => {
    it("Debería devolver un usuario", async () => {
      const newUser0 = {
        first_name: "Usuario GET",
        last_name: "Nuevo",
        email: "usuarionuevoGET@test.com",
        password: "test",
      };
      const res0 = await request(app)
        .post("/api/sessions/register")
        .send(newUser0);

      let id = null;
      if (res0.body.payload) {
        createdUsers.push(res0.body.payload);
        id = res0.body.payload;
      }

      const userId = id;
      const res = await request(app).get(`/api/users/${userId}`);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("_id", userId);
      expect(res.body.payload).to.have.property(
        "first_name",
        newUser0.first_name
      );
      expect(res.body.payload).to.have.property(
        "last_name",
        newUser0.last_name
      );
      expect(res.body.payload).to.have.property("email", newUser0.email);
    });

    it("Debería devolver error al dar un ID equivocado", async () => {
      const userId = "000000000000000000000000";
      const res = await request(app).get(`/api/users/${userId}`);
      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal("error");
    });
  });

  describe("PUT /api/users/:uid", () => {
    it("Debería actualizar los datos del usuario", async () => {
      const newUser0 = {
        first_name: "Usuario PUT",
        last_name: "Nuevo",
        email: "usuarionuevoPUT@test.com",
        password: "test",
      };
      const res0 = await request(app)
        .post("/api/sessions/register")
        .send(newUser0);

      let id = null;
      if (res0.body.payload) {
        createdUsers.push(res0.body.payload);
        id = res0.body.payload;
      }

      const userId = id;
      const updateBody = {
        first_name: "Cambiado",
        last_name: "Numero",
        email: "Tres",
      };
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateBody);
      expect(res.body.status).to.equal("success");

      const updatedUser = res.body.payload;
      expect(updatedUser).to.have.property("_id", userId);
      expect(updatedUser.first_name).to.equal(updateBody.first_name);
      expect(updatedUser.last_name).to.equal(updateBody.last_name);
      expect(updatedUser.email).to.equal(updateBody.email);
    });

    it("Debería devolver error al dar un ID equivocado", async () => {
      const userId = "000000000000000000000000";
      const res = await request(app).put(`/api/users/${userId}`);
      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal("error");
    });
  });

  describe("DELETE /api/users/:uid", () => {
    it("Debería borrar un usuario", async () => {
      const newUser0 = {
        first_name: "Usuario DELETE",
        last_name: "Nuevo",
        email: "usuarionuevoDELETE@test.com",
        password: "test",
      };
      const res0 = await request(app)
        .post("/api/sessions/register")
        .send(newUser0);

      let id = null;
      if (res0.body.payload) {
        createdUsers.push(res0.body.payload);
        id = res0.body.payload;
      }

      const userId = id;
      const res = await request(app).delete(`/api/users/${userId}`);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("_id", userId);

      const res1 = await request(app).get(`/api/users/${userId}`);
      expect(res1.status).to.equal(404);
      expect(res1.body.status).to.equal("error");
    });

    it("Debería devolver error al dar un ID equivocado", async () => {
      const userId = "000000000000000000000000";
      const res = await request(app).delete(`/api/users/${userId}`);
      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal("error");
    });
  });
});
