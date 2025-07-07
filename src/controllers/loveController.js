const LoveQuestion = require("../models/loveQuestion");
const LoveResult = require("../models/loveResult");
const LoveProfile = require("../models/loveProfile");
const TestLink = require("../models/TestLink");
const loveService = require("../services/loveService");
const pdfService = require("../services/pdfService");
const crypto = require("crypto");

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

exports.getLoveQuestions = async (req, res, next) => {
  try {
    const { token } = req.query;
    console.log("Buscando perguntas para token:", token);
    const testLink = await TestLink.findOne({
      token,
      testType: "love-languages",
    });
    if (!testLink) {
      console.log("Token não encontrado:", token);
      throw new Error("Link inválido");
    }
    if (testLink.expiresAt < new Date()) {
      console.log("Token expirado:", token, "ExpiresAt:", testLink.expiresAt);
      throw new Error("Link expirado");
    }
    if (testLink.used) {
      console.log("Token já utilizado:", token);
      throw new Error("Link já utilizado");
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
    console.log(
      "Perguntas enviadas:",
      questions.map((q) => ({ id: q._id, type: q.type }))
    );
    res.json(questions);
  } catch (err) {
    console.error("Erro ao buscar perguntas:", {
      message: err.message,
      stack: err.stack,
      token: req.query.token,
    });
    res.status(500).json({ error: err.message });
  }
};

exports.submitLoveAnswers = async (req, res, next) => {
  try {
    const { answers, name, token } = req.body;
    console.log("Recebendo respostas:", { token, name, answers });

    // Validar entrada
    if (!answers || !Array.isArray(answers) || answers.length !== 20) {
      throw new Error("Deve fornecer exatamente 20 respostas");
    }
    if (!token) {
      throw new Error("Token é obrigatório");
    }
    if (!name) {
      throw new Error("Nome é obrigatório");
    }

    // Verificar o TestLink
    const testLink = await TestLink.findOne({
      token,
      testType: "love-languages",
    });
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

    // Calcular o perfil
    console.log("Calculando perfil com loveService...");
    const { scores, primaryLanguage } = await loveService.calculateLoveProfile(
      answers
    );
    console.log("Perfil calculado:", { primaryLanguage, scores });

    // Buscar o perfil no banco
    console.log("Buscando perfil no LoveProfile:", primaryLanguage);
    const profileData = await LoveProfile.findOne({
      profile: profileNameMap[primaryLanguage] || primaryLanguage,
    });
    if (!profileData) {
      console.error("Perfil não encontrado no banco:", primaryLanguage);
      throw new Error(`Perfil não encontrado: ${primaryLanguage}`);
    }
    console.log("Perfil encontrado:", profileData);

    // Salvar o resultado
    console.log("Salvando resultado no LoveResult...");
    const savedResult = await LoveResult.create({
      scores,
      primaryLanguage: profileNameMap[primaryLanguage] || primaryLanguage,
      name,
      date: new Date(),
      status: "completed",
    });
    console.log("Resultado salvo:", savedResult);

    // Marcar o link como usado
    testLink.used = true;
    await testLink.save();
    console.log("TestLink marcado como usado:", testLink);

    // Enviar resposta
    res.json({
      primaryLanguage: profileNameMap[primaryLanguage] || primaryLanguage,
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
    next(err);
  }
};

exports.generateLoveReport = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    console.log("Gerando relatório para resultId:", resultId);

    // Validar resultId
    if (!resultId || !mongoose.isValidObjectId(resultId)) {
      throw new Error("ID de resultado inválido");
    }

    // Buscar o resultado
    const result = await LoveResult.findById(resultId);
    if (!result) {
      console.error(`Resultado não encontrado: ${resultId}`);
      throw new Error("Resultado não encontrado");
    }
    console.log("Resultado encontrado:", result);

    // Validar scores
    if (
      !result.scores ||
      typeof result.scores !== "object" ||
      Object.keys(result.scores).length === 0
    ) {
      console.error("Scores inválidos ou ausentes:", result.scores);
      throw new Error("Dados de scores inválidos");
    }

    // Buscar o perfil
    console.log("Buscando perfil no LoveProfile:", result.primaryLanguage);
    const profileData = await LoveProfile.findOne({
      profile: result.primaryLanguage,
    });
    if (!profileData) {
      console.error(`Perfil não encontrado: ${result.primaryLanguage}`);
      throw new Error(`Perfil não encontrado: ${result.primaryLanguage}`);
    }
    console.log("Perfil encontrado:", profileData);

    // Gerar PDF
    console.log("Gerando PDF com pdfService...");
    const pdfBuffer = await pdfService.generatePDFContent(result, profileData);
    console.log("PDF gerado com sucesso");

    // Enviar PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=love_report_${resultId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Erro ao gerar relatório:", {
      message: err.message,
      stack: err.stack,
      resultId: req.params.resultId,
    });
    res.status(500).json({ error: err.message });
  }
};

exports.getLoveResults = async (req, res, next) => {
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
      .select("name primaryLanguage scores date");

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

exports.createLoveTestLink = async (req, res, next) => {
  try {
    const { testName } = req.body;
    if (!testName) {
      return res.status(400).json({ error: "Nome do usuário é obrigatório" });
    }
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    console.log("Inserindo link para teste: love-languages", {
      testName,
      token,
    });
    const testLink = await TestLink.create({
      token,
      testType: "love-languages",
      testName,
      expiresAt,
      used: false,
    });
    console.log("Link criado com sucesso:", testLink);
    res.json({ link: `http://localhost:3000/test/love-languages/${token}` });
  } catch (err) {
    console.error("Erro ao criar link:", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: "Erro ao criar link" });
  }
};

exports.getLoveTestLink = async (req, res, next) => {
  try {
    const { token } = req.query;
    console.log("Verificando link para token:", token);
    const testLink = await TestLink.findOne({
      token,
      testType: "love-languages",
    });
    if (!testLink) {
      console.log("Token não encontrado:", token);
      throw new Error("Link inválido");
    }
    if (testLink.expiresAt < new Date()) {
      console.log("Token expirado:", token, "ExpiresAt:", testLink.expiresAt);
      throw new Error("Link expirado");
    }
    console.log("Link válido encontrado:", testLink);
    res.json({ testName: testLink.testName });
  } catch (err) {
    console.error("Erro ao buscar link:", {
      message: err.message,
      stack: err.stack,
      token: req.query.token,
    });
    res.status(500).json({ error: err.message });
  }
};
