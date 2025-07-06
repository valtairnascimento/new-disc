const Question = require("../models/Question");
const Result = require("../models/Result");
const Profile = require("../models/Profile");
const TestLink = require("../models/TestLink");
const discService = require("../services/discService");
const pdfService = require("../services/pdfService");
const crypto = require("crypto");

exports.getQuestions = async (req, res, next) => {
  try {
    const { token } = req.query;
    const testLink = await TestLink.findOne({ token, testType: "disc" });
    if (!testLink || testLink.expiresAt < new Date()) {
      throw new Error("Link inválido ou expirado");
    }

    const types = ["D", "I", "S", "C"];
    const questionsPerType = 6;
    let questions = [];

    for (const type of types) {
      const typeQuestions = await Question.aggregate([
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

exports.submitAnswers = async (req, res, next) => {
  try {
    const { answers, name } = req.body;
    const { profile, scores } = await discService.calculateDiscProfile(answers);

    const profileData = await Profile.findOne({ profile });
    if (!profileData) {
      throw new Error("Perfil não encontrado");
    }

    const savedResult = await Result.create({
      scores,
      profile,
      name,
      date: new Date(),
    });

    res.json({
      profile,
      scores,
      description: profileData.description,
      resultId: savedResult._id,
    });
  } catch (err) {
    next(err);
  }
};

exports.generateReport = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    console.log("Gerando relatório para resultId:", resultId);
    const result = await Result.findById(resultId);
    if (!result) {
      console.log("Resultado não encontrado:", resultId);
      throw new Error("Resultado não encontrado");
    }

    console.log("Resultado encontrado:", result);
    const profileData = await Profile.findOne({ profile: result.profile });
    if (!profileData) {
      console.log("Perfil não encontrado:", result.profile);
      throw new Error("Perfil não encontrado");
    }

    console.log("Gerando PDF...");
    const pdfBuffer = await pdfService.generatePDFContent(result, profileData);
    console.log("PDF gerado, tamanho:", pdfBuffer.length);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=disc_report_${resultId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    next(err);
  }
};

exports.getResults = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const query = name ? { name: new RegExp(name, "i") } : {};

    const results = await Result.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("name profile scores date");

    const total = await Result.countDocuments(query);

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

exports.createTestLink = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const testLink = await TestLink.create({
      token,
      testType: "disc",
      expiresAt,
    });

    res.json({ link: `http://localhost:3000/test/disc/${token}` });
  } catch (err) {
    console.error("Erro ao criar link:", err);
    next(err);
  }
};
