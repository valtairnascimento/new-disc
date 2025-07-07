const express = require("express");
const { createTestLinkSchema } = require("../schemas/discSchemas");
const router = express.Router();
const discController = require("../controllers/discController");
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

router.get("/questions", discController.getQuestions);
router.post("/submit", discController.submitAnswers);
router.get("/report/:resultId", discController.generateReport);
router.get("/results", discController.getResults);
router.post(
  "/create-link",
  validate(createTestLinkSchema),
  discController.createTestLink
);
router.get("/test-link", discController.getTestLink);
router.get("/result/:resultId", discController.getResultById);

module.exports = router;
