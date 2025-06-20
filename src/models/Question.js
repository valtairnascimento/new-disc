const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ["D", "I", "S", "C"], required: true },
});

module.exports = mongoose.model("Question", questionSchema);
