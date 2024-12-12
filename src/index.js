import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { usersService } from "./services/index.js"; // Ajusta la ruta según tu proyecto

// Crear __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuarios",
      version: "1.0.0",
      description: "Una API CRUD para gestionar usuarios",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [`${__dirname}/index.js`], // Ruta al propio archivo
};

const swaggerDoc = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *         role:
 *           type: string
 *           description: Rol del usuario
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/users'
 */
app.get("/users", async (req, res) => {
  const users = await usersService.getAll();
  res.send({ status: "success", payload: users });
});

/**
 * @swagger
 * /users/{uid}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       404:
 *         description: Usuario no encontrado
 */
app.get("/users/:uid", async (req, res) => {
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
  res.send({ status: "success", payload: user });
});

/**
 * @swagger
 * /users/{uid}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/users'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */
app.put("/users/:uid", async (req, res) => {
  const updateBody = req.body;
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
  await usersService.update(userId, updateBody);
  res.send({ status: "success", message: "User updated" });
});

/**
 * @swagger
 * /users/{uid}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
app.delete("/users/:uid", async (req, res) => {
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
  await usersService.delete(userId);
  res.send({ status: "success", message: "User deleted" });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
