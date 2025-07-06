const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  scores: {
    D: { type: Number, required: true },
    I: { type: Number, required: true },
    S: { type: Number, required: true },
    C: { type: Number, required: true },
  },
  profile: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
