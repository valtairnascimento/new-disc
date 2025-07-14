const express = require("express");
const router = express.Router();
const loveController = require("../controllers/loveController");

router.get("/questions", loveController.getLoveQuestions);
router.post("/create-link", loveController.createLoveTestLink);
router.get("/link", loveController.getLoveTestLink);
router.post("/submit", loveController.submitLoveAnswers);
router.get("/report/:resultId", loveController.generateLoveReport);
router.get("/results", loveController.getLoveResults);
router.get("/result/:resultId", loveController.getResultById);
router.post("/update-user-info", loveController.updateUserInfo);


module.exports = router;
