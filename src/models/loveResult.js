const mongoose = require("mongoose");

const loveResultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scores: {
    Words: { type: Number, required: true },
    Acts: { type: Number, required: true },
    Gifts: { type: Number, required: true },
    Time: { type: Number, required: true },
    Touch: { type: Number, required: true },
  },
  primaryLanguage: {
    type: String,
    enum: [
      // Linguagens primárias
      "Words",
      "Acts",
      "Gifts",
      "Time",
      "Touch",
      // Combinações (ordem alfabética para consistência)
      "Acts/Gifts",
      "Acts/Time",
      "Acts/Touch",
      "Acts/Words",
      "Gifts/Acts",
      "Gifts/Time",
      "Gifts/Touch",
      "Gifts/Words",
      "Time/Acts",
      "Time/Gifts",
      "Time/Touch",
      "Time/Words",
      "Touch/Acts",
      "Touch/Gifts",
      "Touch/Time",
      "Touch/Words",
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

module.exports = mongoose.model("LoveResult", loveResultSchema);
