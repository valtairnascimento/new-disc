const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  profile: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  color: { type: String },
});

module.exports = mongoose.model("Profile", profileSchema);
