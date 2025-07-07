const mongoose = require("mongoose");

const loveProfileSchema = new mongoose.Schema({
  profile: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
});

module.exports = mongoose.model(
  "LoveProfile",
  loveProfileSchema,
  "loveprofiles"
);
