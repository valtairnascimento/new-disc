const express = require("express");
const router = express.Router();
const loveController = require("../controllers/loveController");

router.get("/questions", loveController.getLoveQuestions);
router.post("/create-link", loveController.createLoveTestLink);
router.get("/link", loveController.getLoveTestLink);
router.post("/submit", loveController.submitLoveAnswers);
router.get("/report/:resultId", loveController.generateLoveReport);

module.exports = router;
