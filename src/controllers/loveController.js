const LoveQuestion = require("../models/loveQuestion");
const LoveResult = require("../models/loveResult");
const loveService = require("../services/loveService");
const pdfService = require("../services/pdfService");

exports.getLoveQuestions = async (req, res, next) => {
  try {
    const types = ["Words", "Acts", "Gifts", "Time", "Touch"];
    const questionsPerType = 4;
    let questions = [];

    for (const type of types) {
      const typeQuestions = await LoveQuestion.aggregate([
        { $match: { type } },
        { $sample: { size: questionsPerType } },
        { $project: { text: 1, type: 1 } },
      ]);
      questions = [...questions, ...typeQuestions];
    }

    // Embaralhar as perguntas para evitar ordem fixa por tipo
    questions = questions.sort(() => Math.random() - 0.5);

    res.json(questions);
  } catch (err) {
    console.error("Erro ao buscar perguntas:", err);
    next(err);
  }
};

exports.submitLoveAnswers = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const { scores, primaryLanguage } = await loveService.calculateLoveProfile(
      answers
    );

    const savedResult = await LoveResult.create({
      scores,
      primaryLanguage,
      date: new Date(),
    });

    res.json({
      primaryLanguage,
      scores,
      resultId: savedResult._id,
    });
  } catch (err) {
    next(err);
  }
};

exports.generateLoveReport = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    console.log("Gerando relatório para resultId:", resultId);
    const result = await LoveResult.findById(resultId);
    if (!result) {
      throw new Error("Resultado não encontrado");
    }

    const descriptions = {
      Words: "Você valoriza palavras gentis, elogios e mensagens carinhosas.",
      Acts: "Você se sente amado quando alguém faz algo útil por você.",
      Gifts: "Presentes, mesmo simples, são símbolos importantes de afeto.",
      Time: "Passar momentos significativos juntos é o que mais importa.",
      Touch: "Toques físicos, como abraços, fazem você se sentir amado.",
    };

    const profileData = {
      description: descriptions[result.primaryLanguage],
      strengths: [
        `Você se conecta profundamente com ${result.primaryLanguage.toLowerCase()}.`,
      ],
      weaknesses: [`Pode valorizar menos outras formas de expressão de amor.`],
    };

    const pdfBuffer = await pdfService.generatePDFContent(result, profileData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=love_report_${resultId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    next(err);
  }
};
