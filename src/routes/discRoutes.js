const express = require("express");
const router = express.Router();
const discController = require("../controllers/discController");

router.get("/questions", discController.getQuestions);
router.post("/submit", discController.submitAnswers);
router.get("/report/:resultId", discController.generateReport);
router.get("/results", discController.getResults);
router.post("/create-link", discController.createTestLink);

module.exports = router;
