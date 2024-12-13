import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Crear __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 8080;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuarios",
      version: "1.0.0",
      description:
        "Una API CRUD para gestionar usuarios en el proyecto AdoptMe",
    },
    servers: [{ url: `http://localhost:${PORT}/` }],
  },

  apis: [`./src/utils/docSwagger.js`],
};

const swaggerDoc = swaggerJSDoc(swaggerOptions);

export default (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
};
