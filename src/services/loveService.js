const LoveQuestion = require("../models/loveQuestion");

exports.calculateLoveProfile = async (answers) => {
  try {
    console.log("Iniciando cálculo do perfil com respostas:", answers);
    const questionIds = answers.map((a) => a.questionId);
    const questions = await LoveQuestion.find({ _id: { $in: questionIds } });

    const scores = {
      Words: 0,
      Acts: 0,
      Gifts: 0,
      Time: 0,
      Touch: 0,
    };

    answers.forEach((answer) => {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (question && scores.hasOwnProperty(question.type)) {
        scores[question.type] += answer.value;
      }
    });
    console.log("Scores calculados:", scores);

    const maxScore = Math.max(...Object.values(scores));
    const topLanguages = Object.keys(scores).filter(
      (key) => scores[key] === maxScore
    );

    console.log("Linguagens com maior pontuação:", topLanguages);

    let primaryLanguage;
    if (topLanguages.length === 1) {
      primaryLanguage = topLanguages[0];
    } else if (topLanguages.length === 2) {
      primaryLanguage = topLanguages.join("/");
    } else {
      // Em caso de empate entre 3 ou mais, escolher a primeira (ex.: Acts)
      primaryLanguage = topLanguages[0];
      console.log(
        "Empate entre múltiplas linguagens, selecionando a primeira:",
        primaryLanguage
      );
    }

    return { scores, primaryLanguage };
  } catch (err) {
    console.error("Erro ao calcular perfil:", {
      message: err.message,
      stack: err.stack,
    });
    throw err;
  }
};
