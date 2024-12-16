import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";

import swagger from "./utils/swagger.js";

import dotenv from "dotenv";
const env = process.env.NODE_ENV || "dev";

dotenv.config({ path: `.env.${env}` });

const app = express();
const PORT = process.env.PORT || 8080;

configureMiddlewares();
connectToDatabase();
configureRoutes();

//Conexión a la base de datos
export async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("DataBase Connectado");
  } catch (error) {
    console.error("Error al conectar con la base de datos", error);
  }
}

//Middlewares
function configureMiddlewares() {
  app.use(express.json());
  app.use(cookieParser());
}

//Rutas
function configureRoutes() {
  app.use("/api/users", usersRouter);
  app.use("/api/pets", petsRouter);
  app.use("/api/adoptions", adoptionsRouter);
  app.use("/api/sessions", sessionsRouter);
  app.use("/api/mocks", mocksRouter);
}
swagger(app);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

export default app;
