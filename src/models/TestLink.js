const mongoose = require("mongoose");

const testLinkSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  testType: { type: String, required: true, enum: ["disc", "love-languages"] },
  expiresAt: { type: Date, required: true, index: { expires: "0s" } }, // Expira automaticamente
});

module.exports = mongoose.model("TestLink", testLinkSchema);
