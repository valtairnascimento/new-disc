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
      "C", 
      "DI",
      "DS",
      "DC", 
      "ID",
      "IS",
      "IC", 
      "SD",
      "SI",
      "SC", 
      "CD",
      "CI",
      "CS", 
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
