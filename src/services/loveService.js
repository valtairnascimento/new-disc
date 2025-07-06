const LoveQuestion = require("../models/loveQuestion");

exports.calculateLoveProfile = async (answers) => {
  const scores = { Words: 0, Acts: 0, Gifts: 0, Time: 0, Touch: 0 };

  for (const answer of answers) {
    const question = await LoveQuestion.findById(answer.questionId);
    if (question) {
      scores[question.type] += answer.value;
    }
  }

  // Normaliza as pontuações (máximo 16 por tipo, já que são 4 perguntas por tipo)
  const maxScore = 20; // 4 perguntas * valor máximo 5
  Object.keys(scores).forEach((key) => {
    scores[key] = (scores[key] / maxScore) * 100;
  });

  // Determina a linguagem primária
  const primaryLanguage = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  return { scores, primaryLanguage };
};
