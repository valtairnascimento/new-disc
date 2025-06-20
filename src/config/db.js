const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Atlas conectado com sucesso");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB Atlas:", err);
    process.exit(1);
  }
};
