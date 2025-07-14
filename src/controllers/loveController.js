const Question = require("../models/LoveQuestion");
const Result = require("../models/Result");
const Profile = require("../models/Profile");
const TestLink = require("../models/TestLink");

const loveService = require("../services/loveService");
const pdfService = require("../services/pdfService");
const crypto = require("crypto");

exports.getQuestions = async (req, res) => {
  try {
    const { token } = req.query;
    const testLink = await TestLink.findOne({ token, testType: "love" });
    if (!testLink || testLink.expiresAt < new Date()) {
      throw new Error("Link inválido ou expirado");
    }

    const questions = await Question.find().select("text category");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    const { answers, name, token } = req.body;

    const testLink = await TestLink.findOne({ token, testType: "love" });
    if (!testLink) throw new Error("Link inválido");
    if (testLink.expiresAt < new Date()) throw new Error("Link expirado");
    if (testLink.used) throw new Error("Link já utilizado");

    const { profile, scores } = loveService.calculateLoveProfile(answers);

    const profileData = await Profile.findOne({ profile });
    if (!profileData) throw new Error(`Perfil não encontrado: ${profile}`);

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
      profile: profileData.name,
      scores,
      description: profileData.description,
      resultId: savedResult._id.toString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, profile } = req.query;
    const query = {};
    if (name) query.name = new RegExp(name, "i");
    if (profile && profile !== "all") query.profile = profile;

    const results = await Result.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("name email phone date profile status");

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
      profile: profiles.find((p) => p.profile === result.profile)?.name || result.profile,
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
    res.status(500).json({ error: "Erro ao buscar resultados" });
  }
};

exports.createTestLink = async (req, res) => {
  try {
    const { testName } = req.body;
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    const testLink = await TestLink.create({
      token,
      testType: "love",
      testName: testName || null,
      expiresAt,
      used: false,
    });

    res.json({
      link: `http://localhost:3000/test/love/${token}`,
      token: testLink.token,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar link" });
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

    const testLink = await TestLink.findOne({ token, testType: "love" });
    if (!testLink || testLink.expiresAt < new Date()) {
      return res.status(400).json({ error: "Link inválido ou expirado" });
    }

    testLink.testName = name;
    testLink.email = email;
    testLink.phone = phone;
    await testLink.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar dados do usuário" });
  }
};
