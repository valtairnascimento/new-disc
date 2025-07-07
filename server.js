const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const discRoutes = require("./src/routes/discRoutes");
const loveRoutes = require("./src/routes/loveRoutes");
const metricsRoutes = require("./src/routes/metricRoutes");

dotenv.config();

const app = express();

// Configurar CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Log de todas as requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Configurar Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Teste DISC e Linguagens do Amor API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use("/api/disc", discRoutes);
app.use("/api/love-languages", loveRoutes);
app.use("/api/metrics", metricsRoutes);

// Middleware de erro
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    body: req.body,
  });
  res.status(500).json({ error: err.message || "Erro interno do servidor" });
});

// Rota de fallback para 404
app.use("*", (req, res) => {
  console.log(`Rota não encontrada: ${req.originalUrl}`);
  res.status(404).json({ error: `Rota não encontrada: ${req.originalUrl}` });
});

// Conectar ao MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://valtairnjr:12345@newdisc.t9dj4vz.mongodb.net/disc_test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Atlas conectado com sucesso"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
