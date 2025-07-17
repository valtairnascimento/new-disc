const { generateDiscReportPDF } = require("./generateDiscPdfService");
const { generateLoveReportPDF } = require("./generateLovePdfService");
const { DISC_PROFILES } = require("../utils/discData");
const { LOVE_LANGUAGES } = require("../utils/loveData");
const { getDetailedDiscAnalysis } = require("../services/discService");
const { getDetailedLoveAnalysis } = require("../services/loveService");

function calculatePercentages(scores) {
  const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
  const percentages = {};
  Object.entries(scores).forEach(([key, val]) => {
    percentages[key] = total > 0 ? Math.round((val / total) * 100) : 0;
  });
  return percentages;
}

exports.generatePDFContent = async (result, profileData) => {
  const isDisc = result.scores.hasOwnProperty("D");

  const scores = result.scores || {};
  const percentages = calculatePercentages(scores);
  const profile = isDisc ? result.profile : result.primaryLanguage;
  const categoriesSource = isDisc ? DISC_PROFILES : LOVE_LANGUAGES;

  const analysis = isDisc
    ? getDetailedDiscAnalysis(scores, profile, percentages)
    : getDetailedLoveAnalysis(scores, profile, percentages);

  const chartData = Object.entries(percentages).map(([key, percentage]) => ({
    category: categoriesSource[key]?.name || key,
    percentage,
  }));

  const tableData = Object.entries(scores).map(([key, value]) => ({
    category: categoriesSource[key]?.name || key,
    points: value,
    percentage: percentages[key],
    classification: analysis.interpretation[key]?.level || "N/A",
  }));

  const categories = Object.entries(percentages)
    .filter(([_, perc]) => perc >= 15)
    .map(([key, percentage]) => {
      const data = categoriesSource[key] || {};
      return {
        name: data.name || key,
        percentage,
        description: data.description || "Descrição não disponível.",
        strengths: (data.strengths || data.howToShow || []).slice(0, 4),
        challenges: (data.challenges || data.whatToAvoid || []).slice(0, 3),
      };
    });

  const recommendations = (analysis.recommendations || [])
    .flatMap((r) => r.items || r)
    .slice(0, 6);

  const developmentPlan = {
    strengths: (analysis.strengths || []).map(
      (key) =>
        `${categoriesSource[key]?.name || key} (${percentages[key]}%): ${
          analysis.interpretation[key]?.recommendation || ""
        }`
    ),
    growthOpportunities: (analysis.developmentAreas || []).map(
      (key) =>
        `${categoriesSource[key]?.name || key} (${percentages[key]}%): ${
          analysis.interpretation[key]?.recommendation || ""
        }`
    ),
  };

  const conclusion = {
    text: `Seu perfil ${profile} revela características importantes para seu crescimento pessoal e profissional.`,
    nextSteps: [
      "Escolha uma área para focar nos próximos 3 meses.",
      "Compartilhe este relatório com alguém de confiança.",
      "Considere refazer a avaliação após 6 a 12 meses.",
    ],
  };

  const pdfData = {
    profileType: isDisc ? "DISC" : "LOVE",
    name: result.name,
    date: result.date,
    profileName: profile,
    chartData,
    tableData,
    categories,
    recommendations,
    developmentPlan,
    conclusion,
  };

  return isDisc
    ? await generateDiscReportPDF(pdfData)
    : await generateLoveReportPDF(pdfData);
};
