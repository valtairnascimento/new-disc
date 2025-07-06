const LoveQuestion = require("../models/loveQuestion");
const LoveResult = require("../models/loveResult");
const TestLink = require("../models/TestLink");
const loveService = require("../services/loveService");
const pdfService = require("../services/pdfService");
const crypto = require("crypto");

exports.getLoveQuestions = async (req, res, next) => {
  try {
    const { token } = req.query;
    const testLink = await TestLink.findOne({
      token,
      testType: "love-languages",
    });
    if (!testLink || testLink.expiresAt < new Date()) {
      throw new Error("Link inválido ou expirado");
    }

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

    questions = questions.sort(() => Math.random() - 0.5);
    res.json(questions);
  } catch (err) {
    console.error("Erro ao buscar perguntas:", err);
    next(err);
  }
};

exports.submitLoveAnswers = async (req, res, next) => {
  try {
    const { answers, name } = req.body;
    const { scores, primaryLanguage } = await loveService.calculateLoveProfile(
      answers
    );

    const savedResult = await LoveResult.create({
      scores,
      primaryLanguage,
      name,
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

exports.getLoveResults = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const query = name ? { name: new RegExp(name, "i") } : {};

    const results = await LoveResult.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("name primaryLanguage scores date");

    const total = await LoveResult.countDocuments(query);

    res.json({
      results,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("Erro ao buscar resultados:", err);
    next(err);
  }
};

exports.createLoveTestLink = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const testLink = await TestLink.create({
      token,
      testType: "love-languages",
      expiresAt,
    });

    res.json({ link: `http://localhost:3000/test/love-languages/${token}` });
  } catch (err) {
    console.error("Erro ao criar link:", err);
    next(err);
  }
};
