const Question = require("../models/Question");
const Result = require("../models/Result");
const Profile = require("../models/Profile");
const TestLink = require("../models/TestLink");

const discService = require("../services/discService");
const pdfService = require("../services/pdfService");
const crypto = require("crypto");

const profileNameMap = {
  D: "Dominante",
  I: "Influente",
  S: "Estável",
  C: "Consciente",
  DI: "Dominante/Influente",
  DS: "Dominante/Estável",
  DC: "Dominante/Consciente",
  ID: "Influente/Dominante",
  IS: "Influente/Estável",
  IC: "Influente/Consciente",
  SD: "Estável/Dominante",
  SI: "Estável/Influente",
  SC: "Estável/Consciente",
  CD: "Consciente/Dominante",
  CI: "Consciente/Influente",
  CS: "Consciente/Estável",
};

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
    console.log(
      "Perguntas enviadas:",
      questions.map((q) => ({ id: q._id, type: q.type }))
    );
    res.json(questions);
  } catch (err) {
    console.error("Erro ao buscar perguntas:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.submitAnswers = async (req, res, next) => {
  try {
    const { answers, name, token } = req.body;
    console.log("Token recebido:", token);
    console.log("Respostas recebidas:", answers);
    console.log("Nome recebido:", name);
    const testLink = await TestLink.findOne({ token, testType: "disc" });
    console.log("TestLink encontrado:", testLink);

    if (!testLink) {
      throw new Error("Link inválido");
    }
    if (testLink.expiresAt < new Date()) {
      throw new Error("Link expirado");
    }
    if (testLink.used) {
      throw new Error("Link já utilizado");
    }

    const { profile, scores } = await discService.calculateDiscProfile(answers);
    console.log("Perfil calculado:", profile, "Scores:", scores);

    const profileData = await Profile.findOne({ profile });
    if (!profileData) {
      throw new Error(`Perfil não encontrado: ${profile}`);
    }

    const savedResult = await Result.create({
      scores,
      profile: profileData.profile,
      name: name || testLink.testName || "Usuário Anônimo",
      email: testLink.email || "", 
      phone: testLink.phone || "", 
      date: new Date(),
      status: "completed",
    });

    testLink.used = true;
    await testLink.save();

    res.json({
      profile: profileNameMap[profile] || profile,
      scores,
      description: profileData.description,
      resultId: savedResult._id.toString(),
    });
  } catch (err) {
    console.error("Erro ao submeter teste:", {
      message: err.message,
      stack: err.stack,
      body: req.body,
    });
    res.status(500).json({ error: err.message });
  }
};

exports.generateReport = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    console.log("Gerando relatório para resultId:", resultId);
    const result = await Result.findById(resultId);
    if (!result) throw new Error("Resultado não encontrado");

    const profileData = await Profile.findOne({ profile: result.profile });
    if (!profileData) throw new Error("Perfil não encontrado");

    const pdfBuffer = await pdfService.generatePDFContent(result, profileData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=disc_report_${resultId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getResults = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name, profile } = req.query;
    const query = {};
    if (name) query.name = new RegExp(name, "i");
    if (profile && profile !== "all") {
      const profileKey = Object.keys(profileNameMap).find(
        (key) => profileNameMap[key] === profile
      );
      if (profileKey) query.profile = profileKey;
    }

    const results = await Result.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("name email phone date profile status profileColor");

    const profiles = await Profile.find({
      profile: { $in: results.map((r) => r.profile) },
    });
    const profileColorMap = profiles.reduce((map, p) => {
      map[p.profile] = p.color;
      return map;
    }, {});

    const formattedResults = results.map((result) => ({
      ...result._doc,
      _id: result._id.toString(),
      profile: profileNameMap[result.profile] || result.profile,
      profileColor: profileColorMap[result.profile] || "bg-gray-600",
      status: result.status || "completed",
      email: result.email || "-",
      phone: result.phone || "-",
    }));

    const total = await Result.countDocuments(query);

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

exports.createTestLink = async (req, res, next) => {
  try {
    const { testName } = req.body;

    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

    const testLink = await TestLink.create({
      token,
      testType: "disc",
      testName: testName || null, 
      expiresAt,
      used: false,
    });

    res.json({
      link: `http://localhost:3000/test/disc/${token}`,
      token: testLink.token,
    });
  } catch (err) {
    console.error("Erro ao criar link:", err);
    res.status(500).json({ error: "Erro ao criar link" });
  }
};

exports.getTestLink = async (req, res, next) => {
  try {
    const { token } = req.query;
    const testLink = await TestLink.findOne({ token, testType: "disc" });
    if (!testLink || testLink.expiresAt < new Date()) {
      throw new Error("Link inválido ou expirado");
    }
    res.json({ testName: testLink.testName });
  } catch (err) {
    console.error("Erro ao buscar link:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getResultById = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    const result = await Result.findById(resultId);
    if (!result) throw new Error("Resultado não encontrado");

    const profileData = await Profile.findOne({ profile: result.profile });

    res.json({
      name: result.name,
      profile: profileNameMap[result.profile] || result.profile,
      scores: result.scores,
      date: result.date,
      description: profileData?.description,
      status: result.status || "completed",
    });
  } catch (err) {
    console.error("Erro ao buscar resultado:", err);
    res.status(500).json({ error: err.message });
  }
  exports.updateUserInfo = async (req, res) => {
    try {
      const { token, name, email, phone } = req.body;

      if (!token || !name || !email || !phone) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios" });
      }

      const testLink = await TestLink.findOne({ token, testType: "disc" });
      if (!testLink || testLink.expiresAt < new Date()) {
        return res.status(400).json({ error: "Link inválido ou expirado" });
      }

      testLink.testName = name;
      await testLink.save();

      res.json({ success: true });
    } catch (err) {
      console.error("Erro ao atualizar dados do usuário:", err);
      res.status(500).json({ error: "Erro ao salvar dados do usuário" });
    }
  };
};

exports.updateUserInfo = async (req, res) => {
  try {
    const { token, name, email, phone } = req.body;

    if (!token || !name || !email || !phone) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const testLink = await TestLink.findOne({ token, testType: "disc" });
    if (!testLink || testLink.expiresAt < new Date()) {
      return res.status(400).json({ error: "Link inválido ou expirado" });
    }

    testLink.testName = name;
    testLink.email = email;
    testLink.phone = phone;

    await testLink.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao atualizar dados do usuário DISC:", err);
    res.status(500).json({ error: "Erro ao salvar dados do usuário" });
  }
};
