const express = require("express");
const router = express.Router();
const loveController = require("../controllers/loveController");

router.get("/questions", loveController.getLoveQuestions);
router.post("/submit", loveController.submitLoveAnswers);
router.get("/report/:resultId", loveController.generateLoveReport);
router.get("/results", loveController.getLoveResults);
router.post("/create-link", loveController.createLoveTestLink);

module.exports = router;
