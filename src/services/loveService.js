const LoveQuestion = require("../models/loveQuestion");
const { normalizeProfileName } = require("../utils/normalize");


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

    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentages = {};
    
    Object.entries(scores).forEach(([key, value]) => {
      percentages[key] = total > 0 ? Math.round((value / total) * 100) : 0;
    });

    console.log("Porcentagens calculadas:", percentages);

    const sortedLanguages = Object.entries(percentages)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ language: key, percentage: value }));

    const primary = sortedLanguages[0];
    const secondary = sortedLanguages[1];
    const third = sortedLanguages[2];

    let primaryLanguage;
    let analysisType;

    if (primary.percentage >= 30 && primary.percentage >= secondary.percentage * 1.3) {
      primaryLanguage = primary.language;
      analysisType = "dominant";
    }
    else if (Math.abs(primary.percentage - secondary.percentage) <= 5 && primary.percentage >= 20) {
     primaryLanguage = normalizeProfileName(`${primary.language}/${secondary.language}`);
      analysisType = "balanced_dual";
    }
    else if (primary.percentage <= 25 && secondary.percentage >= 18 && third.percentage >= 15) {
      primaryLanguage = normalizeProfileName(`${primary.language}/${secondary.language}/${third.language}`);

      analysisType = "balanced_multiple";
    }
    else if (primary.percentage >= 25) {
      primaryLanguage = primary.language;
      analysisType = "moderate";
    }
    else {
      primaryLanguage = primary.language;
      analysisType = "balanced";
    }

    console.log("Linguagem primária determinada:", primaryLanguage, "Tipo:", analysisType);

    const analysis = {
      primaryLanguage,
      analysisType,
      dominantPercentage: primary.percentage,
      secondaryLanguage: secondary.language,
      secondaryPercentage: secondary.percentage,
      isBalanced: analysisType.includes("balanced"),
      strengthLevel: getStrengthLevel(primary.percentage),
      recommendations: generateQuickRecommendations(sortedLanguages, analysisType)
    };

    return { 
      scores, 
      primaryLanguage, 
      percentages, 
      analysis 
    };
  } catch (err) {
    console.error("Erro ao calcular perfil:", {
      message: err.message,
      stack: err.stack,
    });
    throw err;
  }
};

function getStrengthLevel(percentage) {
  if (percentage >= 35) return "Muito Forte";
  if (percentage >= 25) return "Forte";
  if (percentage >= 20) return "Moderado";
  if (percentage >= 15) return "Fraco";
  return "Muito Fraco";
}

function generateQuickRecommendations(sortedLanguages, analysisType) {
  const recommendations = [];
  
  switch (analysisType) {
    case "dominant":
      recommendations.push(`Sua linguagem ${sortedLanguages[0].language} é muito clara - comunique isso para pessoas próximas`);
      recommendations.push(`Desenvolva também ${sortedLanguages[1].language} como linguagem secundária`);
      break;
      
    case "balanced_dual":
      recommendations.push(`Você tem um perfil equilibrado entre ${sortedLanguages[0].language} e ${sortedLanguages[1].language}`);
      recommendations.push("Esta versatilidade é uma grande vantagem nos relacionamentos");
      break;
      
    case "balanced_multiple":
      recommendations.push("Você aprecia múltiplas formas de expressar e receber amor");
      recommendations.push("Comunique esta versatilidade para parceiros e familiares");
      break;
      
    case "moderate":
      recommendations.push(`${sortedLanguages[0].language} é sua linguagem principal, mas você também valoriza outras`);
      recommendations.push("Considere comunicar suas preferências de forma clara");
      break;
      
    default:
      recommendations.push("Você tem um perfil muito equilibrado nas linguagens do amor");
      recommendations.push("Experimente conscientemente cada linguagem para descobrir preferências");
  }
  
  return recommendations;
}

exports.getDetailedLoveAnalysis = (scores, primaryLanguage, percentages) => {
  const analysis = {
    profileType: "Linguagens do Amor",
    mainLanguage: primaryLanguage,
    scores,
    percentages,
    interpretation: {},
    recommendations: [],
    strengths: [],
    developmentAreas: []
  };

  Object.entries(percentages).forEach(([language, percentage]) => {
    let interpretation = "";
    let recommendation = "";
    
    if (percentage >= 30) {
      interpretation = "Linguagem muito importante para você";
      recommendation = "Continue expressando e comunicando esta necessidade";
      analysis.strengths.push(language);
    } else if (percentage >= 20) {
      interpretation = "Linguagem moderadamente importante";
      recommendation = "Valorize quando outros expressam amor desta forma";
      analysis.strengths.push(language);
    } else if (percentage >= 15) {
      interpretation = "Linguagem de importância média";
      recommendation = "Considere dar mais atenção a esta forma de amor";
    } else {
      interpretation = "Linguagem menos prioritária";
      recommendation = "Oportunidade de desenvolvimento e crescimento";
      analysis.developmentAreas.push(language);
    }
    
    analysis.interpretation[language] = {
      percentage,
      interpretation,
      recommendation
    };
  });

  return analysis;
};

exports.compareLoveProfiles = (profile1, profile2) => {
  const comparison = {
    compatibility: 0,
    matches: [],
    differences: [],
    recommendations: []
  };

  Object.keys(profile1.percentages).forEach(language => {
    const diff = Math.abs(profile1.percentages[language] - profile2.percentages[language]);
    comparison.compatibility += (100 - diff) / 100;
    
    if (diff <= 10) {
      comparison.matches.push({
        language,
        person1: profile1.percentages[language],
        person2: profile2.percentages[language]
      });
    } else {
      comparison.differences.push({
        language,
        person1: profile1.percentages[language],
        person2: profile2.percentages[language],
        difference: diff
      });
    }
  });

  comparison.compatibility = Math.round((comparison.compatibility / 5) * 100);

  if (comparison.compatibility >= 70) {
    comparison.recommendations.push("Vocês têm preferências muito similares nas linguagens do amor");
  } else if (comparison.compatibility >= 50) {
    comparison.recommendations.push("Vocês têm algumas diferenças que podem ser complementares");
  } else {
    comparison.recommendations.push("Vocês têm diferenças significativas - comunicação será essencial");
  }

  return comparison;
};

module.exports = exports;