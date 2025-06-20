const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const discRoutes = require("./src/routes/discRoutes");
const errorHandler = require("./src/middleware/errorHandler");
const connectDB = require("./src/config/db");

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DISC Personality Test API",
      version: "1.0.0",
      description:
        "API para teste de personalidade DISC com perfis pré-cadastrados",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use("/api/disc", discRoutes);

// Middleware de erro
app.use(errorHandler);

// Conexão com MongoDB Atlas
connectDB();

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});
