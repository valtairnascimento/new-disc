const Question = require("../models/Question");
const Result = require("../models/Result");
const Profile = require("../models/Profile");
const discService = require("../services/discService");
const pdfService = require("../services/pdfService");

exports.getQuestions = async (req, res, next) => {
  try {
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

    // Embaralhar as perguntas para evitar ordem fixa por tipo
    questions = questions.sort(() => Math.random() - 0.5);

    res.json(questions);
  } catch (err) {
    console.error("Erro ao buscar perguntas:", err);
    next(err);
  }
};

exports.submitAnswers = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const { profile, scores } = await discService.calculateDiscProfile(answers);

    const profileData = await Profile.findOne({ profile });
    if (!profileData) {
      throw new Error("Perfil não encontrado");
    }

    const savedResult = await Result.create({
      scores,
      profile,
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
