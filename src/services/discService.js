// const Question = require("../models/Question");

// exports.calculateDiscProfile = async (answers) => {
//   const scores = { D: 0, I: 0, S: 0, C: 0 };
//   const validTypes = ["D", "I", "S", "C"];

//   for (const { questionId, value } of answers) {
//     const question = await Question.findById(questionId);
//     if (!question) {
//       throw new Error(`Questão com ID ${questionId} não encontrada`);
//     }
//     if (!validTypes.includes(question.type)) {
//       throw new Error(
//         `Tipo de questão inválido: ${question.type} para questão ${questionId}`
//       );
//     }
//     scores[question.type] += value;
//   }

//   const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
//   const primaryProfile = sortedScores[0][0];
//   const secondaryProfile = sortedScores[1][0];
//   const maxScore = sortedScores[0][1];
//   const secondScore = sortedScores[1][1];

//   let profile;
//   if (maxScore === sortedScores[1][1]) {
//     const primary =
//       sortedScores[0][0] < sortedScores[1][0]
//         ? sortedScores[0][0]
//         : sortedScores[1][0];
//     profile = primary;
//   } else {
//     profile =
//       secondScore >= maxScore * 0.2
//         ? `${primaryProfile}${secondaryProfile}`
//         : primaryProfile;
//   }

//   console.log("Scores calculados:", scores, "Perfil selecionado:", profile);

//   return { profile, scores };
// };


const Question = require("../models/Question");

exports.calculateDiscProfile = async (answers) => {
  try {
    console.log("Iniciando cálculo do perfil DISC com respostas:", answers);
    
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    const validTypes = ["D", "I", "S", "C"];

    // Calcular scores básicos
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

    console.log("Scores calculados:", scores);

    // Calcular total e porcentagens
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentages = {};
    
    Object.entries(scores).forEach(([key, value]) => {
      percentages[key] = total > 0 ? Math.round((value / total) * 100) : 0;
    });

    console.log("Porcentagens calculadas:", percentages);

    // Análise mais sofisticada para determinar perfil
    const sortedScores = Object.entries(percentages)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ profile: key, percentage: value }));

    const primary = sortedScores[0];
    const secondary = sortedScores[1];
    const third = sortedScores[2];

    let profile;
    let analysisType;

    // Perfil claramente dominante (>= 35% e 1.4x maior que o segundo)
    if (primary.percentage >= 35 && primary.percentage >= secondary.percentage * 1.4) {
      profile = primary.profile;
      analysisType = "dominant";
    }
    // Perfil híbrido balanceado (diferença <= 8% entre os dois primeiros)
    else if (Math.abs(primary.percentage - secondary.percentage) <= 8 && primary.percentage >= 22) {
      profile = `${primary.profile}${secondary.profile}`;
      analysisType = "balanced_hybrid";
    }
    // Perfil híbrido com dominância moderada
    else if (secondary.percentage >= primary.percentage * 0.65 && primary.percentage >= 25) {
      profile = `${primary.profile}${secondary.profile}`;
      analysisType = "moderate_hybrid";
    }
    // Perfil muito equilibrado (três ou mais características fortes)
    else if (primary.percentage <= 30 && secondary.percentage >= 20 && third.percentage >= 18) {
      profile = `${primary.profile}${secondary.profile}${third.profile}`;
      analysisType = "multi_faceted";
    }
    // Perfil com dominância moderada
    else if (primary.percentage >= 28) {
      profile = primary.profile;
      analysisType = "moderate";
    }
    // Perfil equilibrado
    else {
      profile = primary.profile;
      analysisType = "balanced";
    }

    console.log("Perfil determinado:", profile, "Tipo:", analysisType);

    // Análise adicional
    const analysis = {
      profile,
      analysisType,
      dominantPercentage: primary.percentage,
      secondaryProfile: secondary.profile,
      secondaryPercentage: secondary.percentage,
      isHybrid: profile.length > 1,
      adaptability: calculateAdaptability(percentages),
      strengthLevel: getStrengthLevel(primary.percentage),
      recommendations: generateQuickRecommendations(sortedScores, analysisType)
    };

    return { 
      profile, 
      scores, 
      percentages, 
      analysis 
    };
  } catch (err) {
    console.error("Erro ao calcular perfil DISC:", {
      message: err.message,
      stack: err.stack,
    });
    throw err;
  }
};

// Função auxiliar para calcular adaptabilidade
function calculateAdaptability(percentages) {
  const values = Object.values(percentages);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;
  
  // Quanto menor a diferença, maior a adaptabilidade
  if (range <= 15) return "Muito Alta";
  if (range <= 25) return "Alta";
  if (range <= 35) return "Moderada";
  if (range <= 45) return "Baixa";
  return "Muito Baixa";
}

// Função auxiliar para determinar nível de força do perfil
function getStrengthLevel(percentage) {
  if (percentage >= 40) return "Muito Forte";
  if (percentage >= 30) return "Forte";
  if (percentage >= 25) return "Moderado";
  if (percentage >= 20) return "Fraco";
  return "Muito Fraco";
}

// Função auxiliar para gerar recomendações rápidas
function generateQuickRecommendations(sortedScores, analysisType) {
  const recommendations = [];
  
  switch (analysisType) {
    case "dominant":
      recommendations.push(`Seu perfil ${sortedScores[0].profile} é muito claro - use isso como sua principal força`);
      recommendations.push(`Considere desenvolver características ${sortedScores[1].profile} para maior versatilidade`);
      break;
      
    case "balanced_hybrid":
      recommendations.push(`Seu perfil ${sortedScores[0].profile}${sortedScores[1].profile} oferece grande flexibilidade`);
      recommendations.push("Use esta versatilidade para se adaptar a diferentes situações");
      break;
      
    case "moderate_hybrid":
      recommendations.push(`Você tem características ${sortedScores[0].profile} dominantes com influência ${sortedScores[1].profile}`);
      recommendations.push("Esta combinação oferece equilíbrio entre força e adaptabilidade");
      break;
      
    case "multi_faceted":
      recommendations.push("Você tem um perfil muito equilibrado e versátil");
      recommendations.push("Use esta adaptabilidade como uma grande vantagem profissional");
      break;
      
    case "moderate":
      recommendations.push(`Seu perfil ${sortedScores[0].profile} é moderadamente forte`);
      recommendations.push("Considere desenvolver características complementares");
      break;
      
    default:
      recommendations.push("Você tem um perfil equilibrado em todas as dimensões DISC");
      recommendations.push("Foque em desenvolver situações que maximizem seus pontos fortes");
  }
  
  return recommendations;
}

// Função para análise detalhada do perfil
exports.getDetailedDiscAnalysis = (scores, profile, percentages) => {
  const analysis = {
    profileType: "DISC",
    mainProfile: profile,
    scores,
    percentages,
    interpretation: {},
    recommendations: [],
    strengths: [],
    developmentAreas: [],
    workingStyle: getWorkingStyle(profile, percentages),
    leadershipStyle: getLeadershipStyle(profile, percentages),
    communicationStyle: getCommunicationStyle(profile, percentages),
    stressReaction: getStressReaction(profile, percentages)
  };

  // Interpretar cada dimensão
  Object.entries(percentages).forEach(([dimension, percentage]) => {
    let interpretation = "";
    let recommendation = "";
    
    if (percentage >= 35) {
      interpretation = "Característica muito dominante";
      recommendation = "Continue desenvolvendo e usando esta força natural";
      analysis.strengths.push(dimension);
    } else if (percentage >= 25) {
      interpretation = "Característica forte";
      recommendation = "Use esta característica em situações apropriadas";
      analysis.strengths.push(dimension);
    } else if (percentage >= 20) {
      interpretation = "Característica moderada";
      recommendation = "Desenvolva mais esta dimensão para maior versatilidade";
    } else {
      interpretation = "Característica menos desenvolvida";
      recommendation = "Grande oportunidade de crescimento e desenvolvimento";
      analysis.developmentAreas.push(dimension);
    }
    
    analysis.interpretation[dimension] = {
      percentage,
      level: getLevel(percentage),
      interpretation,
      recommendation
    };
  });

  // Gerar recomendações gerais
  analysis.recommendations = generateDetailedRecommendations(analysis);

  return analysis;
};

// Função auxiliar para obter nível baseado na porcentagem
function getLevel(percentage) {
  if (percentage >= 35) return "Muito Alto";
  if (percentage >= 25) return "Alto";
  if (percentage >= 20) return "Moderado";
  if (percentage >= 15) return "Baixo";
  return "Muito Baixo";
}

// Função para determinar estilo de trabalho
function getWorkingStyle(profile, percentages) {
  const dominant = profile.charAt(0);
  const style = {
    approach: "",
    environment: "",
    motivation: "",
    challenges: ""
  };

  switch (dominant) {
    case "D":
      style.approach = "Direto, focado em resultados e tomada de decisão rápida";
      style.environment = "Ambientes desafiadores com autonomia e autoridade";
      style.motivation = "Conquista de objetivos, competição e controle";
      style.challenges = "Pode ser impaciente com detalhes e processos lentos";
      break;
    case "I":
      style.approach = "Colaborativo, entusiasta e orientado para pessoas";
      style.environment = "Ambientes sociais, dinâmicos e com reconhecimento";
      style.motivation = "Interação social, reconhecimento e variedade";
      style.challenges = "Pode ter dificuldade com tarefas detalhadas e solitárias";
      break;
    case "S":
      style.approach = "Estável, cooperativo e orientado para equipe";
      style.environment = "Ambientes harmoniosos, seguros e estruturados";
      style.motivation = "Estabilidade, segurança e ajudar outros";
      style.challenges = "Pode resistir a mudanças e ser muito accommodativo";
      break;
    case "C":
      style.approach = "Analítico, preciso e orientado para qualidade";
      style.environment = "Ambientes organizados, com padrões claros e tempo para análise";
      style.motivation = "Precisão, qualidade e conhecimento técnico";
      style.challenges = "Pode ser perfeccionista e resistir a decisões rápidas";
      break;
  }

  return style;
}

// Função para determinar estilo de liderança
function getLeadershipStyle(profile, percentages) {
  const dominant = profile.charAt(0);
  const style = {
    approach: "",
    strengths: [],
    challenges: [],
    teamManagement: ""
  };

  switch (dominant) {
    case "D":
      style.approach = "Liderança diretiva e orientada para resultados";
      style.strengths = ["Tomada de decisão rápida", "Foco em resultados", "Iniciativa"];
      style.challenges = ["Pode ser autoritário", "Impaciência com detalhes", "Falta de consideração com sentimentos"];
      style.teamManagement = "Prefere equipes eficientes e orientadas para metas";
      break;
    case "I":
      style.approach = "Liderança inspiradora e motivacional";
      style.strengths = ["Comunicação eficaz", "Motivação de equipe", "Otimismo"];
      style.challenges = ["Pode negligenciar detalhes", "Dificuldade com confrontos", "Falta de follow-up"];
      style.teamManagement = "Cria ambiente positivo e colaborativo";
      break;
    case "S":
      style.approach = "Liderança facilitadora e de apoio";
      style.strengths = ["Desenvolvimento de pessoas", "Estabilidade", "Lealdade"];
      style.challenges = ["Evita confrontos", "Resistência a mudanças", "Dificuldade em tomar decisões difíceis"];
      style.teamManagement = "Foca no bem-estar e desenvolvimento da equipe";
      break;
    case "C":
      style.approach = "Liderança técnica e baseada em expertise";
      style.strengths = ["Análise cuidadosa", "Padrões altos", "Expertise técnica"];
      style.challenges = ["Pode ser muito crítico", "Demora na tomada de decisão", "Dificuldade em delegar"];
      style.teamManagement = "Estabelece padrões altos e processos claros";
      break;
  }

  return style;
}

// Função para determinar estilo de comunicação
function getCommunicationStyle(profile, percentages) {
  const dominant = profile.charAt(0);
  const style = {
    approach: "",
    strengths: [],
    preferences: "",
    challenges: ""
  };

  switch (dominant) {
    case "D":
      style.approach = "Comunicação direta e objetiva";
      style.strengths = ["Clareza", "Objetividade", "Assertividade"];
      style.preferences = "Prefere comunicação rápida, direta e focada em resultados";
      style.challenges = "Pode ser muito direto e parecer insensível";
      break;
    case "I":
      style.approach = "Comunicação expressiva e entusiasta";
      style.strengths = ["Persuasão", "Entusiasmo", "Empatia"];
      style.preferences = "Prefere comunicação face a face, interativa e positiva";
      style.challenges = "Pode falar demais e perder o foco";
      break;
    case "S":
      style.approach = "Comunicação paciente e considerada";
      style.strengths = ["Escuta ativa", "Paciência", "Diplomacia"];
      style.preferences = "Prefere comunicação calma, estruturada e não confrontativa";
      style.challenges = "Pode evitar conversas difíceis e ser indireto";
      break;
    case "C":
      style.approach = "Comunicação precisa e factual";
      style.strengths = ["Precisão", "Lógica", "Preparação"];
      style.preferences = "Prefere comunicação escrita, detalhada e bem fundamentada";
      style.challenges = "Pode ser muito técnico e formal";
      break;
  }

  return style;
}

// Função para determinar reação ao estresse
function getStressReaction(profile, percentages) {
  const dominant = profile.charAt(0);
  const reaction = {
    triggers: [],
    behaviors: [],
    management: []
  };

  switch (dominant) {
    case "D":
      reaction.triggers = ["Perda de controle", "Lentidão", "Ineficiência"];
      reaction.behaviors = ["Impaciência", "Autoritarismo", "Crítica excessiva"];
      reaction.management = ["Exercitar controle onde possível", "Focar em soluções", "Buscar desafios"];
      break;
    case "I":
      reaction.triggers = ["Isolamento", "Críticas", "Ambiente negativo"];
      reaction.behaviors = ["Desorganização", "Evitar responsabilidades", "Falar excessivamente"];
      reaction.management = ["Buscar apoio social", "Manter otimismo", "Expressar sentimentos"];
      break;
    case "S":
      reaction.triggers = ["Mudanças súbitas", "Conflitos", "Pressão de tempo"];
      reaction.behaviors = ["Resistência passiva", "Evitar decisões", "Procrastinação"];
      reaction.management = ["Buscar estabilidade", "Planejar mudanças", "Buscar apoio"];
      break;
    case "C":
      reaction.triggers = ["Padrões baixos", "Pressão de tempo", "Ambiguidade"];
      reaction.behaviors = ["Perfeccionismo excessivo", "Crítica", "Isolamento"];
      reaction.management = ["Focar no que é controlável", "Estabelecer prioridades", "Buscar informações"];
      break;
  }

  return reaction;
}

// Função para gerar recomendações detalhadas
function generateDetailedRecommendations(analysis) {
  const recommendations = [];
  const { mainProfile, strengths, developmentAreas, percentages } = analysis;

  // Recomendações baseadas no perfil principal
  recommendations.push({
    category: "Pontos Fortes",
    items: strengths.map(strength => 
      `Continue desenvolvendo suas características ${strength} - são suas principais forças`
    )
  });

  // Recomendações para áreas de desenvolvimento
  if (developmentAreas.length > 0) {
    recommendations.push({
      category: "Desenvolvimento",
      items: developmentAreas.map(area => 
        `Invista no desenvolvimento de características ${area} para maior versatilidade`
      )
    });
  }

  // Recomendações específicas baseadas no perfil
  const specificRecommendations = getSpecificRecommendations(mainProfile, percentages);
  recommendations.push(...specificRecommendations);

  return recommendations;
}

// Função para obter recomendações específicas do perfil
function getSpecificRecommendations(profile, percentages) {
  const recommendations = [];
  const dominant = profile.charAt(0);

  switch (dominant) {
    case "D":
      recommendations.push({
        category: "Carreira",
        items: [
          "Busque posições de liderança e gestão",
          "Procure ambientes desafiadores e competitivos",
          "Desenvolva paciência para processos detalhados"
        ]
      });
      break;
    case "I":
      recommendations.push({
        category: "Carreira",
        items: [
          "Explore áreas que envolvam interação com pessoas",
          "Busque oportunidades de apresentação e comunicação",
          "Desenvolva habilidades de organização e follow-up"
        ]
      });
      break;
    case "S":
      recommendations.push({
        category: "Carreira",
        items: [
          "Procure ambientes estáveis e colaborativos",
          "Desenvolva habilidades de liderança gradualmente",
          "Pratique assertividade e tomada de decisão"
        ]
      });
      break;
    case "C":
      recommendations.push({
        category: "Carreira",
        items: [
          "Busque posições que valorizem análise e precisão",
          "Desenvolva habilidades de comunicação interpessoal",
          "Pratique flexibilidade e adaptação a mudanças"
        ]
      });
      break;
  }

  return recommendations;
}

// Função para obter compatibilidade entre perfis
exports.getProfileCompatibility = (profile1, profile2) => {
  const compatibilityMatrix = {
    "DD": { score: 60, description: "Podem competir, mas compartilham foco em resultados" },
    "DI": { score: 75, description: "Complementam-se: direção e influência" },
    "DS": { score: 70, description: "Boa complementaridade: decisão e estabilidade" },
    "DC": { score: 80, description: "Excelente combinação: visão e execução" },
    "II": { score: 85, description: "Ambiente positivo e colaborativo" },
    "IS": { score: 90, description: "Combinação harmoniosa e estável" },
    "IC": { score: 65, description: "Podem ter conflitos de estilo" },
    "SS": { score: 80, description: "Ambiente muito estável e harmonioso" },
    "SC": { score: 85, description: "Boa combinação: estabilidade e qualidade" },
    "CC": { score: 75, description: "Excelência técnica, mas podem ser lentos" }
  };

  const key = profile1.charAt(0) + profile2.charAt(0);
  const reverseKey = profile2.charAt(0) + profile1.charAt(0);
  
  return compatibilityMatrix[key] || compatibilityMatrix[reverseKey] || {
    score: 70,
    description: "Compatibilidade moderada"
  };
};

// Função para sugerir desenvolvimento baseado no perfil
exports.getDevelopmentSuggestions = (profile, percentages) => {
  const suggestions = {
    shortTerm: [],
    longTerm: [],
    resources: [],
    exercises: []
  };

  const dominant = profile.charAt(0);
  const lowest = Object.entries(percentages)
    .sort((a, b) => a[1] - b[1])[0][0];

  // Sugestões baseadas no perfil dominante
  switch (dominant) {
    case "D":
      suggestions.shortTerm = [
        "Pratique escuta ativa em reuniões",
        "Dedique tempo para planejar antes de agir",
        "Busque feedback da equipe regularmente"
      ];
      suggestions.longTerm = [
        "Desenvolva habilidades de coaching",
        "Estude inteligência emocional",
        "Pratique delegação eficaz"
      ];
      break;
    case "I":
      suggestions.shortTerm = [
        "Use ferramentas de organização",
        "Pratique comunicação escrita",
        "Foque em completar tarefas iniciadas"
      ];
      suggestions.longTerm = [
        "Desenvolva habilidades analíticas",
        "Estude gestão de projetos",
        "Pratique apresentações estruturadas"
      ];
      break;
    case "S":
      suggestions.shortTerm = [
        "Pratique expressar opiniões",
        "Tome pequenas decisões rapidamente",
        "Busque feedback ativo"
      ];
      suggestions.longTerm = [
        "Desenvolva habilidades de liderança",
        "Pratique gestão de mudanças",
        "Estude técnicas de negociação"
      ];
      break;
    case "C":
      suggestions.shortTerm = [
        "Pratique comunicação informal",
        "Estabeleça prazos realistas",
        "Busque interação com colegas"
      ];
      suggestions.longTerm = [
        "Desenvolva habilidades interpessoais",
        "Pratique tomada de decisão rápida",
        "Estude liderança situacional"
      ];
      break;
  }

  // Sugestões específicas para desenvolver a área mais baixa
  const developmentForLowest = getDevelopmentForDimension(lowest);
  suggestions.exercises.push(...developmentForLowest);

  return suggestions;
};

// Função auxiliar para desenvolvimento de dimensão específica
function getDevelopmentForDimension(dimension) {
  const exercises = {
    "D": [
      "Pratique tomar decisões rápidas em situações de baixo risco",
      "Assuma a liderança em projetos pequenos",
      "Pratique comunicação assertiva"
    ],
    "I": [
      "Participe de eventos de networking",
      "Pratique apresentações em público",
      "Busque oportunidades de trabalho em equipe"
    ],
    "S": [
      "Pratique escuta ativa com colegas",
      "Ofereça apoio a membros da equipe",
      "Desenvolva relacionamentos duradouros"
    ],
    "C": [
      "Pratique análise detalhada de problemas",
      "Desenvolva sistemas de organização",
      "Foque na qualidade em suas entregas"
    ]
  };

  return exercises[dimension] || [];
}