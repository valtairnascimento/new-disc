const mongoose = require("mongoose");

const loveQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["Words", "Acts", "Gifts", "Time", "Touch"],
  },
});

module.exports = mongoose.model("LoveQuestion", loveQuestionSchema);
