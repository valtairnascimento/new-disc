const Question = require("../models/Question");
const Result = require("../models/Result");
const Profile = require("../models/Profile");
const discService = require("../services/discService");
const pdfService = require("../services/pdfService");

exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find().select("text type");
    res.json(questions);
  } catch (err) {
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
    const result = await Result.findById(resultId);
    if (!result) {
      throw new Error("Resultado não encontrado");
    }

    const profileData = await Profile.findOne({ profile: result.profile });
    if (!profileData) {
      throw new Error("Perfil não encontrado");
    }

    const latexContent = await pdfService.generatePDFContent(
      result,
      profileData
    );

    // O conteúdo LaTeX será compilado automaticamente pelo sistema (latexmk)
    res.setHeader("Content-Type", "application/x-tex");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=disc_report_${resultId}.tex`
    );
    res.send(latexContent);
  } catch (err) {
    next(err);
  }
};
