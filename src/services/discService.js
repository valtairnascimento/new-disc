const Question = require("../models/Question");

exports.calculateDiscProfile = async (answers) => {
  const scores = { D: 0, I: 0, S: 0, C: 0 };

  // Calcula pontuxações por traço
  for (const answer of answers) {
    const question = await Question.findById(answer.questionId);
    if (!question) {
      throw new Error(`Pergunta com ID ${answer.questionId} não encontrada`);
    }
    scores[question.type] += answer.value;
  }

  // Normaliza pontuações (opcional, para comparar com testes padrão)
  const totalQuestionsPerTrait = answers.length / 4; // Assume 6 perguntas por traço
  const normalizedScores = {
    D: scores.D / totalQuestionsPerTrait,
    I: scores.I / totalQuestionsPerTrait,
    S: scores.S / totalQuestionsPerTrait,
    C: scores.C / totalQuestionsPerTrait,
  };

  // Determina traço primário e secundário
  const sortedScores = Object.entries(normalizedScores).sort(
    (a, b) => b[1] - a[1]
  );
  const primaryTrait = sortedScores[0][0];
  const secondaryTrait = sortedScores[1][1] > 0 ? sortedScores[1][0] : null;

  // Define o perfil (primário ou combinação)
  const profile =
    secondaryTrait && sortedScores[1][1] > 2.5
      ? `${primaryTrait}${secondaryTrait}`
      : primaryTrait;

  return {
    profile,
    scores: normalizedScores,
  };
};
