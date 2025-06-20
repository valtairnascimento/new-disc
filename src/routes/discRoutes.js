const express = require("express");
const router = express.Router();
const discController = require("../controllers/discController");
const validate = require("../middleware/validate");
const { answerSchema } = require("../schemas/discSchemas");

/**
 * @swagger
 * /api/disc/questions:
 *   get:
 *     summary: Retorna todas as perguntas do teste DISC
 *     responses:
 *       200:
 *         description: Lista de perguntas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   text: { type: string }
 *                   type: { type: string, enum: ['D', 'I', 'S', 'C'] }
 */
router.get("/questions", discController.getQuestions);

/**
 * @swagger
 * /api/disc/submit:
 *   post:
 *     summary: Envia as respostas do teste e retorna o perfil DISC
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId: { type: string }
 *                     value: { type: number, minimum: 1, maximum: 5 }
 *     responses:
 *       200:
 *         description: Resultado do perfil DISC
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile: { type: string }
 *                 scores: { type: object }
 *                 description: { type: string }
 *                 resultId: { type: string }
 */
router.post("/submit", validate(answerSchema), discController.submitAnswers);

/**
 * @swagger
 * /api/disc/report/{resultId}:
 *   get:
 *     summary: Gera um relatório em PDF para o resultado do teste
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conteúdo LaTeX para o relatório
 *         content:
 *           application/x-tex:
 *             schema:
 *               type: string
 */
router.get("/report/:resultId", discController.generateReport);

module.exports = router;
