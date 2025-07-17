const LoveQuestion = require("../models/loveQuestion");
const LoveResult = require("../models/loveResult");
const LoveProfile = require("../models/loveProfile");
const TestLink = require("../models/TestLink");
const loveService = require("../services/loveService");
const pdfService = require("../services/pdfService");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { normalizeProfileName } = require("../utils/normalize");

const profileNameMap = {
  Words: "Palavras de Afirmação",
  Acts: "Atos de Serviço",
  Gifts: "Presentes",
  Time: "Tempo de Qualidade",
  Touch: "Toque Físico",
  "Acts/Gifts": "Atos de Serviço/Presentes",
  "Acts/Time": "Atos de Serviço/Tempo de Qualidade",
  "Acts/Touch": "Atos de Serviço/Toque Físico",
  "Acts/Words": "Atos de Serviço/Palavras de Afirmação",
  "Gifts/Acts": "Presentes/Atos de Serviço",
  "Gifts/Time": "Presentes/Tempo de Qualidade",
  "Gifts/Touch": "Presentes/Toque Físico",
  "Gifts/Words": "Presentes/Palavras de Afirmação",
  "Time/Acts": "Tempo de Qualidade/Atos de Serviço",
  "Time/Gifts": "Tempo de Qualidade/Presentes",
  "Time/Touch": "Tempo de Qualidade/Toque Físico",
  "Time/Words": "Tempo de Qualidade/Palavras de Afirmação",
  "Touch/Acts": "Toque Físico/Atos de Serviço",
  "Touch/Gifts": "Toque Físico/Presentes",
  "Touch/Time": "Toque Físico/Tempo de Qualidade",
  "Touch/Words": "Toque Físico/Palavras de Afirmação",
};

exports.getLoveQuestions = async (req, res) => {
  try {
    const { token } = req.query;
    const testLink = await TestLink.findOne({
      token,
      testType: "love-languages",
    });
    if (!testLink) throw new Error("Link inválido");
    if (testLink.expiresAt < new Date()) throw new Error("Link expirado");
    if (testLink.used) throw new Error("Link já utilizado");

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
    res.status(500).json({ error: err.message });
  }
};

exports.submitLoveAnswers = async (req, res) => {
  try {
    const { answers, name, token } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length !== 20) {
      throw new Error("Deve fornecer exatamente 20 respostas");
    }
    if (!token) throw new Error("Token é obrigatório");
    if (!name) throw new Error("Nome é obrigatório");

    const testLink = await TestLink.findOne({
      token,
      testType: "love-languages",
    });
    if (!testLink) throw new Error("Link inválido");
    if (testLink.expiresAt < new Date()) throw new Error("Link expirado");
    if (testLink.used) throw new Error("Link já utilizado");

    const { scores, primaryLanguage } = await loveService.calculateLoveProfile(
      answers
    );

    const normalizedProfile = normalizeProfileName(primaryLanguage);
    const profileData = await LoveProfile.findOne({
      profile: normalizedProfile,
    });
    if (!profileData) {
      throw new Error(`Perfil não encontrado: ${primaryLanguage}`);
    }

    const savedResult = await LoveResult.create({
      scores,
      primaryLanguage: normalizedProfile,
      name: name || testLink.testName || "Usuário Anônimo",
      date: new Date(),
      status: "completed",
    });

    testLink.used = true;
    await testLink.save();

    try {
      res.json({
        primaryLanguage: profileNameMap[primaryLanguage] || primaryLanguage,
        scores,
        description: profileData.description,
        resultId: savedResult._id.toString(),
      });
    } catch (error) {
      console.error("❌ Erro ao enviar resposta JSON:", {
        error: error.message,
        profileData,
        savedResult,
      });
      res
        .status(500)
        .json({ error: "Erro ao processar a resposta do servidor." });
    }
  } catch (err) {
    console.error("Erro ao submeter teste:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.generateLoveReport = async (req, res) => {
  try {
    const { resultId } = req.params;
    if (!resultId || !mongoose.isValidObjectId(resultId)) {
      throw new Error("ID de resultado inválido");
    }

    const result = await LoveResult.findById(resultId);
    if (!result) throw new Error("Resultado não encontrado");

    const profileData = await LoveProfile.findOne({
      profile: result.primaryLanguage,
    });
    if (!profileData)
      throw new Error(`Perfil não encontrado: ${result.primaryLanguage}`);

    const pdfBuffer = await pdfService.generatePDFContent(result, profileData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=love_report_${resultId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getLoveResults = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, profile } = req.query;
    const query = {};
    if (name) query.name = new RegExp(name, "i");
    if (profile && profile !== "all") {
      const profileKey = Object.keys(profileNameMap).find(
        (key) => profileNameMap[key] === profile
      );
      if (profileKey) query.primaryLanguage = profileKey;
    }

    const results = await LoveResult.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("name email phone primaryLanguage scores date");

    const profiles = await LoveProfile.find({
      profile: { $in: results.map((r) => r.primaryLanguage) },
    });

    const profileColorMap = profiles.reduce((map, p) => {
      map[p.profile] = p.color;
      return map;
    }, {});

    const formattedResults = results.map((result) => ({
      ...result._doc,
      _id: result._id.toString(),
      profile: profileNameMap[result.primaryLanguage] || result.primaryLanguage,
      profileColor: profileColorMap[result.primaryLanguage] || "bg-gray-600",
      status: result.status || "completed",
      email: result.email || "-",
      phone: result.phone || "-",
    }));

    const total = await LoveResult.countDocuments(query);

    res.json({
      results: formattedResults,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("Erro ao buscar resultados:", err);
    res.status(500).json({ error: "Erro ao buscar resultados" });
  }
};

exports.createLoveTestLink = async (req, res) => {
  try {
    const { testName } = req.body;

    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

    const testLink = await TestLink.create({
      token,
      testType: "love-languages",
      testName: testName || null,
      expiresAt,
      used: false,
    });

    res.json({
      link: `http://localhost:3000/test/love-languages/${token}`,
      token: testLink.token,
    });
  } catch (err) {
    console.error("Erro ao criar link:", err);
    res.status(500).json({ error: "Erro ao criar link" });
  }
};

exports.getLoveTestLink = async (req, res) => {
  try {
    const { token } = req.query;
    const testLink = await TestLink.findOne({
      token,
      testType: "love-languages",
    });
    if (!testLink) throw new Error("Link inválido");
    if (testLink.expiresAt < new Date()) throw new Error("Link expirado");

    res.json({ testName: testLink.testName });
  } catch (err) {
    console.error("Erro ao buscar link:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getResultById = async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await LoveResult.findById(resultId);
    if (!result) throw new Error("Resultado não encontrado");

    const profileData = await LoveProfile.findOne({
      profile: result.primaryLanguage,
    });

    res.json({
      name: result.name,
      primaryLanguage:
        profileNameMap[result.primaryLanguage] || result.primaryLanguage,
      scores: result.scores,
      date: result.date,
      description: profileData?.description,
      status: result.status || "completed",
    });
  } catch (err) {
    console.error("Erro ao buscar resultado:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const { token, name, email, phone } = req.body;

    if (!token || !name || !email || !phone) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const testLink = await TestLink.findOne({
      token,
      testType: "love-languages",
    });
    if (!testLink || testLink.expiresAt < new Date()) {
      return res.status(400).json({ error: "Link inválido ou expirado" });
    }

    testLink.testName = name;
    testLink.email = email;
    testLink.phone = phone;

    await testLink.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao atualizar dados do usuário (love):", err);
    res.status(500).json({ error: "Erro ao salvar dados do usuário" });
  }
};
