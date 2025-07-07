const mongoose = require("mongoose");

const testLinkSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  testType: {
    type: String,
    required: true,
    enum: ["disc", "love-languages"], // Inclui ambos os tipos de teste
  },
  testName: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

module.exports = mongoose.model("TestLink", testLinkSchema);
