import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
  "file:///C:/Users/goere/OneDrive/Escritorio/coderhouse/4-backend/1-desafios/desafio-11/src"
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "API documentation Coderhouse e-commerce developed by Teo Goerens",
      description: "Routes & Details for Products and Carts",
    },
  },
  apis: [`${__filename}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

export { specs, swaggerUiExpress };
