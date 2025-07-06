const mongoose = require("mongoose");

const loveResultSchema = new mongoose.Schema({
  scores: {
    Words: { type: Number, required: true },
    Acts: { type: Number, required: true },
    Gifts: { type: Number, required: true },
    Time: { type: Number, required: true },
    Touch: { type: Number, required: true },
  },
  primaryLanguage: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LoveResult", loveResultSchema);
