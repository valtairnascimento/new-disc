const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const discRoutes = require("./src/routes/discRoutes");
const loveRoutes = require("./src/routes/loveRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Teste DISC e Linguagens do Amor API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/disc", discRoutes);
app.use("/api/love-languages", loveRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas conectado com sucesso"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
