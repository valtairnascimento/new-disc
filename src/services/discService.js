const Question = require("../models/Question");

exports.calculateDiscProfile = async (answers) => {
  const scores = { D: 0, I: 0, S: 0, C: 0 };
  const validTypes = ["D", "I", "S", "C"];

  for (const { questionId, value } of answers) {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error(`Questão com ID ${questionId} não encontrada`);
    }
    if (!validTypes.includes(question.type)) {
      throw new Error(
        `Tipo de questão inválido: ${question.type} para questão ${questionId}`
      );
    }
    scores[question.type] += value;
  }

  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primaryProfile = sortedScores[0][0];
  const secondaryProfile = sortedScores[1][0];
  const maxScore = sortedScores[0][1];
  const secondScore = sortedScores[1][1];

  let profile;
  if (maxScore === sortedScores[1][1]) {
    const primary =
      sortedScores[0][0] < sortedScores[1][0]
        ? sortedScores[0][0]
        : sortedScores[1][0];
    profile = primary;
  } else {
    profile =
      secondScore >= maxScore * 0.2
        ? `${primaryProfile}${secondaryProfile}`
        : primaryProfile;
  }

  console.log("Scores calculados:", scores, "Perfil selecionado:", profile);

  return { profile, scores };
};
