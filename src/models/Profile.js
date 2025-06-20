const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  profile: { type: String, required: true, unique: true }, // Ex.: "D", "DI", "SC"
  description: { type: String, required: true },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
});

module.exports = mongoose.model("Profile", profileSchema);
