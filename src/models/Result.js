const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  scores: {
    D: { type: Number, required: true },
    I: { type: Number, required: true },
    S: { type: Number, required: true },
    C: { type: Number, required: true },
  },
  profile: {
    type: String,
    enum: [
      "D",
      "I",
      "S",
      "C", // Perfis primários
      "DI",
      "DS",
      "DC", // Combinações com D primário
      "ID",
      "IS",
      "IC", // Combinações com I primário
      "SD",
      "SI",
      "SC", // Combinações com S primário
      "CD",
      "CI",
      "CS", // Combinações com C primário
    ],
    required: true,
  },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["completed", "pending"],
    default: "completed",
  },
});

module.exports = mongoose.model("Result", resultSchema);
