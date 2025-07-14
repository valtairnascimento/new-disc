const PDFDocument = require("pdfkit");

const DISC_PROFILES = {
  D: {
    name: "Dominância",
    description:
      "Pessoas com alta dominância são diretas, decisivas e focadas em resultados. Gostam de desafios e assumem riscos calculados.",
    characteristics: [
      "Orientado para resultados",
      "Decisivo e direto",
      "Gosta de desafios",
      "Assume riscos calculados",
      "Foca em objetivos",
      "Independente",
      "Competitivo",
      "Líder natural",
    ],
    strengths: [
      "Capacidade de tomar decisões rápidas",
      "Orientação para resultados",
      "Liderança natural",
      "Iniciativa e proatividade",
      "Coragem para assumir riscos",
      "Foco em objetivos",
      "Determinação e persistência",
    ],
    challenges: [
      "Pode ser impaciente com detalhes",
      "Tendência a ser muito direto",
      "Pode ignorar sentimentos dos outros",
      "Dificuldade em aceitar críticas",
      "Pode ser autoritário",
      "Impaciência com processos lentos",
    ],
    workStyle:
      "Prefere ambientes dinâmicos, com autonomia e desafios constantes. Trabalha bem sob pressão e gosta de liderar projetos.",
    communication:
      "Comunicação direta, objetiva e focada em resultados. Aprecia feedback direto e conversas práticas.",
    motivation:
      "Motivado por desafios, autoridade, reconhecimento por resultados e oportunidades de liderança.",
  },
  I: {
    name: "Influência",
    description:
      "Pessoas com alta influência são entusiasmadas, expressivas e orientadas para pessoas. Gostam de interagir e inspirar outros.",
    characteristics: [
      "Entusiasmado e otimista",
      "Expressivo e comunicativo",
      "Orientado para pessoas",
      "Inspirador e motivador",
      "Flexível e adaptável",
      "Criativo e inovador",
      "Persuasivo",
      "Sociável",
    ],
    strengths: [
      "Habilidades de comunicação",
      "Capacidade de inspirar outros",
      "Otimismo e entusiasmo",
      "Flexibilidade e adaptabilidade",
      "Criatividade e inovação",
      "Networking e relacionamentos",
      "Persuasão e influência",
    ],
    challenges: [
      "Pode ser desorganizado",
      "Tendência a ser impulsivo",
      "Dificuldade com rotinas",
      "Pode ser superficial em análises",
      "Evita confrontos",
      "Pode ser inconsistente",
    ],
    workStyle:
      "Prefere ambientes colaborativos, dinâmicos e com interação social. Trabalha bem em equipe e gosta de variedade.",
    communication:
      "Comunicação expressiva, entusiasmada e focada em pessoas. Aprecia feedback positivo e conversas inspiradoras.",
    motivation:
      "Motivado por reconhecimento público, interação social, variedade e oportunidades de influenciar positivamente.",
  },
  S: {
    name: "Estabilidade",
    description:
      "Pessoas com alta estabilidade são confiáveis, pacientes e orientadas para equipe. Valorizam harmonia e consistência.",
    characteristics: [
      "Confiável e leal",
      "Paciente e calmo",
      "Orientado para equipe",
      "Estável e consistente",
      "Bom ouvinte",
      "Cooperativo",
      "Empático",
      "Metódico",
    ],
    strengths: [
      "Confiabilidade e lealdade",
      "Paciência e estabilidade",
      "Habilidades de trabalho em equipe",
      "Capacidade de ouvir",
      "Empatia e compreensão",
      "Consistência no trabalho",
      "Mediação de conflitos",
    ],
    challenges: [
      "Resistência a mudanças",
      "Dificuldade em tomar decisões rápidas",
      "Pode ser passivo demais",
      "Evita confrontos",
      "Pode ser inflexível",
      "Dificuldade em dizer não",
    ],
    workStyle:
      "Prefere ambientes estáveis, previsíveis e com relacionamentos harmoniosos. Trabalha bem em equipe e gosta de rotinas.",
    communication:
      "Comunicação calma, respeitosa e focada em harmonia. Aprecia feedback construtivo e conversas colaborativas.",
    motivation:
      "Motivado por estabilidade, reconhecimento da equipe, segurança e oportunidades de ajudar outros.",
  },
  C: {
    name: "Conformidade",
    description:
      "Pessoas com alta conformidade são analíticas, precisas e orientadas para qualidade. Valorizam excelência e precisão.",
    characteristics: [
      "Analítico e detalhista",
      "Preciso e exato",
      "Orientado para qualidade",
      "Sistemático e organizado",
      "Cauteloso e prudente",
      "Diplomático",
      "Perfeccionista",
      "Objetivo",
    ],
    strengths: [
      "Atenção aos detalhes",
      "Análise e pensamento crítico",
      "Qualidade e precisão",
      "Organização e sistematização",
      "Planejamento estratégico",
      "Diplomacia e tato",
      "Resolução de problemas",
    ],
    challenges: [
      "Pode ser perfeccionista demais",
      "Tendência a ser crítico",
      "Dificuldade com prazos apertados",
      "Pode ser inflexível",
      "Evita riscos",
      "Pode ser pessimista",
    ],
    workStyle:
      "Prefere ambientes organizados, com processos claros e tempo para análise. Trabalha bem sozinho e gosta de qualidade.",
    communication:
      "Comunicação precisa, factual e focada em dados. Aprecia feedback específico e conversas técnicas.",
    motivation:
      "Motivado por qualidade, reconhecimento da expertise, segurança e oportunidades de especialização.",
  },
};

const LOVE_LANGUAGES = {
  Words: {
    name: "Palavras de Afirmação",
    description:
      "Pessoas com esta linguagem do amor valorizam palavras encorajadoras, elogios sinceros e expressões verbais de amor e apreço.",
    characteristics: [
      "Valoriza elogios sinceros",
      "Aprecia palavras de encorajamento",
      "Gosta de ouvir 'eu te amo'",
      "Sensível às palavras negativas",
      "Expressa amor verbalmente",
      "Gosta de bilhetes e mensagens",
      "Aprecia reconhecimento público",
    ],
    howToShow: [
      "Dar elogios sinceros e específicos",
      "Expressar apreço verbalmente",
      "Enviar mensagens carinhosas",
      "Escrever bilhetes de amor",
      "Reconhecer conquistas",
      "Usar palavras de encorajamento",
      "Expressar gratidão regularmente",
    ],
    whatToAvoid: [
      "Críticas duras ou destrutivas",
      "Palavras depreciativas",
      "Sarcasmo ferino",
      "Ignorar conquistas",
      "Falta de comunicação",
      "Comentários negativos sobre aparência",
      "Palavras ditas na raiva",
    ],
    practicalTips: [
      "Deixe bilhetes carinhosos",
      "Envie mensagens durante o dia",
      "Elogie na frente de outros",
      "Mantenha um diário de gratidão",
      "Use palavras específicas nos elogios",
      "Celebre conquistas verbalmente",
      "Pratique comunicação não-violenta",
    ],
  },
  Acts: {
    name: "Atos de Serviço",
    description:
      "Pessoas com esta linguagem do amor sentem-se amadas quando outros fazem coisas práticas para ajudá-las ou facilitar sua vida.",
    characteristics: [
      "Valoriza ações práticas",
      "Aprecia ajuda com tarefas",
      "Sente amor através de gestos",
      "Gosta de ser cuidado",
      "Expressa amor através de ações",
      "Nota quando outros se esforçam",
      "Valoriza iniciativa",
    ],
    howToShow: [
      "Fazer tarefas domésticas",
      "Preparar refeições especiais",
      "Ajudar com projetos",
      "Cuidar quando está doente",
      "Resolver problemas práticos",
      "Antecipar necessidades",
      "Oferecer ajuda sem ser pedido",
    ],
    whatToAvoid: [
      "Preguiça ou negligência",
      "Quebrar promessas de ajuda",
      "Criar mais trabalho",
      "Ignorar pedidos de ajuda",
      "Ser egoísta com o tempo",
      "Não cumprir compromissos",
      "Esperar sempre ser pedido",
    ],
    practicalTips: [
      "Pergunte como pode ajudar",
      "Observe necessidades não expressas",
      "Crie uma lista de tarefas para dividir",
      "Surpreenda com gestos práticos",
      "Seja consistente nos atos",
      "Aprenda habilidades úteis",
      "Planeje ações antecipadamente",
    ],
  },
  Gifts: {
    name: "Presentes",
    description:
      "Pessoas com esta linguagem do amor valorizam presentes bem pensados como símbolos de amor e consideração.",
    characteristics: [
      "Valoriza presentes significativos",
      "Aprecia o pensamento por trás",
      "Guarda presentes especiais",
      "Gosta de dar presentes",
      "Lembra de datas especiais",
      "Valoriza símbolos de amor",
      "Aprecia surpresas",
    ],
    howToShow: [
      "Dar presentes significativos",
      "Lembrar de datas especiais",
      "Comprar pequenas lembranças",
      "Fazer presentes personalizados",
      "Dar flores sem motivo especial",
      "Escolher presentes pensados",
      "Criar tradições de presentes",
    ],
    whatToAvoid: [
      "Esquecer datas importantes",
      "Presentes sem pensamento",
      "Dar apenas presentes caros",
      "Ignorar preferências",
      "Presentes de última hora",
      "Não dar presentes",
      "Presentes práticos demais",
    ],
    practicalTips: [
      "Mantenha uma lista de ideias",
      "Observe o que a pessoa gosta",
      "Crie um calendário de datas especiais",
      "Invista em presentes personalizados",
      "Dê presentes 'sem motivo'",
      "Guarde embrulhos especiais",
      "Faça cartões artesanais",
    ],
  },
  Time: {
    name: "Tempo de Qualidade",
    description:
      "Pessoas com esta linguagem do amor valorizam atenção total e tempo dedicado exclusivamente a elas.",
    characteristics: [
      "Valoriza atenção total",
      "Gosta de conversas profundas",
      "Aprecia momentos juntos",
      "Sente-se negligenciado facilmente",
      "Prefere qualidade à quantidade",
      "Gosta de atividades compartilhadas",
      "Valoriza presença focada",
    ],
    howToShow: [
      "Dar atenção total",
      "Planejar atividades juntos",
      "Ter conversas profundas",
      "Fazer refeições sem distrações",
      "Criar rituais de conexão",
      "Escutar ativamente",
      "Estar presente mentalmente",
    ],
    whatToAvoid: [
      "Distrações durante momentos juntos",
      "Cancelar planos constantemente",
      "Multitarefas durante conversas",
      "Não dar atenção total",
      "Priorizar outras coisas",
      "Conversas superficiais",
      "Sempre estar ocupado",
    ],
    practicalTips: [
      "Desligue dispositivos eletrônicos",
      "Planeje encontros regulares",
      "Crie rituais de conexão",
      "Faça perguntas profundas",
      "Pratique escuta ativa",
      "Dedique tempo exclusivo",
      "Esteja presente no momento",
    ],
  },
  Touch: {
    name: "Toque Físico",
    description:
      "Pessoas com esta linguagem do amor sentem-se conectadas e amadas através do toque físico apropriado e carinhoso.",
    characteristics: [
      "Valoriza toque físico",
      "Gosta de abraços e carícias",
      "Sente-se conectado pelo toque",
      "Expressa amor fisicamente",
      "Nota falta de toque",
      "Aprecia proximidade física",
      "Gosta de gestos carinhosos",
    ],
    howToShow: [
      "Dar abraços calorosos",
      "Fazer carícias carinhosas",
      "Sentar próximo",
      "Segurar as mãos",
      "Dar massagens",
      "Tocar durante conversas",
      "Expressar carinho fisicamente",
    ],
    whatToAvoid: [
      "Evitar toque físico",
      "Ser fisicamente distante",
      "Toque apenas íntimo",
      "Ignorar necessidade de toque",
      "Ser rude fisicamente",
      "Não respeitar limites",
      "Toque inadequado",
    ],
    practicalTips: [
      "Respeite sempre os limites",
      "Varie os tipos de toque",
      "Seja carinhoso regularmente",
      "Toque de forma apropriada",
      "Observe as preferências",
      "Seja gentil e respeitoso",
      "Comunique sobre preferências",
    ],
  },
};



const COLORS = {
  primary: '#2563EB',
  secondary: '#7C3AED', 
  accent: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  success: '#10B981',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  },
  gradients: {
    blue: ['#3B82F6', '#1D4ED8'],
    red: ['#EF4444', '#B91C1C'],
    green: ['#10B981', '#047857'],
    yellow: ['#F59E0B', '#D97706'],
    purple: ['#8B5CF6', '#7C3AED']
  }
};

function calculatePercentages(scores) {
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const percentages = {};

  Object.entries(scores).forEach(([key, value]) => {
    percentages[key] = total > 0 ? Math.round((value / total) * 100) : 0;
  });

  return { percentages, total };
}

// ... keep existing code (generateCombinedDiscAnalysis function)

function generateCombinedDiscAnalysis(profile, percentages) {
  const analysis = {
    primaryProfile: profile[0],
    secondaryProfile: profile[1] || null,
    description: "",
    combinedTraits: [],
    workingStyle: "",
    leadershipStyle: "",
    communicationStyle: "",
    decisionMaking: "",
    stressReaction: "",
    motivation: "",
    development: [],
  };

  const primary = DISC_PROFILES[analysis.primaryProfile];
  const secondary = analysis.secondaryProfile
    ? DISC_PROFILES[analysis.secondaryProfile]
    : null;

  if (secondary) {
    analysis.description = `Perfil ${primary.name}/${
      secondary.name
    }: Combina características de ${primary.name.toLowerCase()} com elementos de ${secondary.name.toLowerCase()}.`;
    analysis.combinedTraits = [
      ...primary.characteristics.slice(0, 4),
      ...secondary.characteristics.slice(0, 3),
    ];
  } else {
    analysis.description = `Perfil ${primary.name}: ${primary.description}`;
    analysis.combinedTraits = primary.characteristics;
  }

  return analysis;
}

// ... keep existing code (generatePersonalizedRecommendations function)

function generatePersonalizedRecommendations(type, profile, percentages) {
  const recommendations = [];

  if (type === "DISC") {
    const sortedProfiles = Object.entries(percentages)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ profile: key, percentage: value }));

    const dominant = sortedProfiles[0];
    const secondary = sortedProfiles[1];

    if (dominant.percentage >= 40) {
      recommendations.push(
        `Forte ${
          DISC_PROFILES[dominant.profile].name
        }: Desenvolva ainda mais suas características naturais de ${DISC_PROFILES[
          dominant.profile
        ].name.toLowerCase()}.`
      );
    }

    if (secondary.percentage >= 25) {
      recommendations.push(
        `Perfil Híbrido: Sua combinação ${dominant.profile}/${secondary.profile} é uma grande vantagem em situações que requerem flexibilidade.`
      );
    }

    sortedProfiles.forEach(({ profile, percentage }) => {
      if (percentage < 15) {
        recommendations.push(
          `Oportunidade de Crescimento: Considere desenvolver mais características de ${DISC_PROFILES[profile].name} para maior versatilidade.`
        );
      }
    });
  } else {
    const sortedLanguages = Object.entries(percentages)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ language: key, percentage: value }));

    const primary = sortedLanguages[0];
    const secondary = sortedLanguages[1];

    if (primary.percentage >= 35) {
      recommendations.push(
        `Linguagem Principal: ${
          LOVE_LANGUAGES[primary.language].name
        } é claramente sua forma preferida de receber amor.`
      );
    }

    if (secondary.percentage >= 20) {
      recommendations.push(
        `Linguagem Secundária: ${
          LOVE_LANGUAGES[secondary.language].name
        } também é importante para você.`
      );
    }

    const balanced = sortedLanguages.filter(
      (lang) => lang.percentage >= 15 && lang.percentage <= 30
    );
    if (balanced.length >= 3) {
      recommendations.push(
        "Perfil Equilibrado: Você aprecia múltiplas formas de expressar e receber amor, o que é uma grande vantagem nos relacionamentos."
      );
    }
  }

  return recommendations;
}

// Função para adicionar cabeçalho moderno
function addModernHeader(doc, title, subtitle = "", gradient = true) {
  const pageWidth = doc.page.width;
  const headerHeight = 120;
  
  if (gradient) {
    // Simulação de gradiente com retângulos sobrepostos
    for (let i = 0; i < 20; i++) {
      const opacity = 0.8 - (i * 0.04);
      doc
        .rect(0, i * 3, pageWidth, 6)
        .fillColor(COLORS.primary)
        .fillOpacity(opacity)
        .fill();
    }
  }
  
  // Título principal
  doc
    .fillColor('#FFFFFF')
    .fillOpacity(1)
    .fontSize(28)
    .font('Helvetica-Bold')
    .text(title, 50, 40, { align: 'center', width: pageWidth - 100 });
    
  if (subtitle) {
    doc
      .fontSize(16)
      .font('Helvetica')
      .text(subtitle, 50, 75, { align: 'center', width: pageWidth - 100 });
  }
  
  doc.y = headerHeight + 20;
}

// Função para adicionar card com borda colorida
function addCardSection(doc, title, content, color = COLORS.primary, spacing = 0.3) {
  const cardMargin = 50;
  const cardWidth = doc.page.width - (cardMargin * 2);
  const startY = doc.y;
  
  // Verificar espaço para o card
  if (doc.y > doc.page.height - 120) {
    doc.addPage();
  }
  
  // Fundo do card
  doc
    .rect(cardMargin, doc.y, cardWidth, 80)
    .fillColor(COLORS.gray[50])
    .fill();
    
  // Borda colorida à esquerda
  doc
    .rect(cardMargin, doc.y, 6, 80)
    .fillColor(color)
    .fill();
    
  // Título do card
  doc
    .fillColor(COLORS.gray[800])
    .fontSize(14)
    .font('Helvetica-Bold')
    .text(title, cardMargin + 20, doc.y + 12);
    
  // Conteúdo
  doc
    .fontSize(11)
    .font('Helvetica')
    .fillColor(COLORS.gray[600])
    .text(content, cardMargin + 20, doc.y + 32, { 
      width: cardWidth - 40,
      align: 'justify'
    });
    
  doc.y = startY + 80 + (spacing * 20);
}

// Gráfico de barras aprimorado com descrições DISC
function addEnhancedBarChart(doc, data, title, isDiscProfile = false) {
  if (doc.y > doc.page.height - 350) {
    doc.addPage();
  }

  // Título centralizado
  doc
    .fontSize(18)
    .fillColor(COLORS.gray[800])
    .font('Helvetica-Bold')
    .text(title, { align: 'center' })
    .moveDown(1);

  const chartWidth = 400;
  const chartHeight = 250;
  const startX = (doc.page.width - chartWidth) / 2;
  const startY = doc.y;

  // Fundo do gráfico
  doc
    .rect(startX - 20, startY - 10, chartWidth + 40, chartHeight + 100)
    .fillColor(COLORS.gray[50])
    .stroke(COLORS.gray[200])
    .fill();

  const maxValue = Math.max(...Object.values(data));
  const barWidth = chartWidth / Object.keys(data).length;
  const colors = [COLORS.primary, COLORS.danger, COLORS.success, COLORS.warning];

  Object.entries(data).forEach(([key, value], index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = startX + index * barWidth;
    const y = startY + chartHeight - barHeight;

    // Sombra da barra
    doc
      .rect(x + 18, y + 3, barWidth - 30, barHeight)
      .fillColor(COLORS.gray[300])
      .fillOpacity(0.3)
      .fill();

    // Barra principal
    doc
      .rect(x + 15, y, barWidth - 30, barHeight)
      .fillColor(colors[index % colors.length])
      .fill();

    // Badge com valor
    const badgeWidth = 50;
    const badgeHeight = 25;
    const badgeX = x + (barWidth - badgeWidth) / 2;
    const badgeY = y - 35;
    
    // Fundo do badge
    doc
      .roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 12)
      .fillColor(colors[index % colors.length])
      .fill();
      
    // Texto do badge
    doc
      .fontSize(11)
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .text(`${value}%`, badgeX, badgeY + 8, {
        width: badgeWidth,
        align: 'center'
      });

    // Label da categoria (letra DISC)
    doc
      .fontSize(16)
      .fillColor(COLORS.gray[800])
      .font('Helvetica-Bold')
      .text(key, x + (barWidth / 2) - 8, startY + chartHeight + 15);

    // Nome completo da categoria
    if (isDiscProfile) {
      const categoryNames = {
        'D': 'Dominância',
        'I': 'Influência', 
        'S': 'Estabilidade',
        'C': 'Conformidade'
      };
      
      doc
        .fontSize(9)
        .fillColor(COLORS.gray[600])
        .font('Helvetica')
        .text(categoryNames[key] || key, x, startY + chartHeight + 35, {
          width: barWidth,
          align: 'center'
        });
    }
  });

  doc.y = startY + chartHeight + 70;
}

exports.generatePDFContent = async (result, profileData) => {
  try {
    console.log("Gerando PDF otimizado para resultado:", result);

    if (!result || !profileData) {
      throw new Error("Resultado ou dados do perfil ausentes");
    }

    const scores = result.scores;
    const isDiscProfile = scores.hasOwnProperty("D");
    const profileType = isDiscProfile ? "DISC" : "LOVE";

    const { percentages } = calculatePercentages(scores);
    const totalPoints = Object.values(scores).reduce(
      (sum, score) => sum + score,
      0
    );
    const totalAnswers = result.totalAnswers || result.answers?.length || 24;

    const profileName =
      result.profile || result.primaryLanguage || "Desconhecido";
    const profilesData = isDiscProfile ? DISC_PROFILES : LOVE_LANGUAGES;

    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: {
        Title: `Relatório ${profileType} - ${result.name}`,
        Author: "Sistema de Avaliação Profissional",
        Subject: `Análise de Perfil ${profileType}`,
        Keywords: `${profileType}, perfil, análise, ${result.name}`,
      },
    });

    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));

    return new Promise((resolve, reject) => {
      doc.on("end", () => {
        console.log("PDF otimizado finalizado");
        resolve(Buffer.concat(buffers));
      });

      doc.on("error", (err) => {
        console.error("Erro durante a criação do PDF:", err);
        reject(err);
      });

      // === CAPA MODERNA ===
      addModernHeader(
        doc, 
        `RELATÓRIO ${profileType}`,
        "Análise Comportamental Completa"
      );

      // Informações principais em cards
      doc
        .fontSize(20)
        .fillColor(COLORS.gray[800])
        .font('Helvetica-Bold')
        .text(result.name, { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(14)
        .fillColor(COLORS.gray[600])
        .font('Helvetica')
        .text(`Data: ${new Date(result.date).toLocaleDateString("pt-BR")}`, { align: 'center' })
        .text(`Perfil: ${profileName}`, { align: 'center' })
        .text(`${totalAnswers} respostas • ${totalPoints} pontos`, { align: 'center' })
        .moveDown(2);

      // Gráfico principal melhorado com descrições DISC
      addEnhancedBarChart(doc, percentages, 'Distribuição do Perfil', isDiscProfile);

      // === PÁGINA 2: ANÁLISE DETALHADA ===
      doc.addPage();
      
      addCardSection(
        doc,
        'RESUMO EXECUTIVO',
        `Este relatório apresenta uma análise completa do perfil ${profileType} de ${result.name}, baseada em ${totalAnswers} respostas. A avaliação identificou ${profileName} como perfil dominante, oferecendo insights valiosos para desenvolvimento pessoal e profissional.`,
        COLORS.primary
      );

      // Tabela de pontuação estilizada CORRIGIDA
      const sortedData = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .map(([key, value]) => {
          const percentage = percentages[key];
          let classification = "";
          if (percentage >= 35) classification = "Dominante";
          else if (percentage >= 25) classification = "Forte";
          else if (percentage >= 15) classification = "Moderado";
          else classification = "Baixo";

          const categoryName = isDiscProfile
            ? DISC_PROFILES[key]?.name || key
            : LOVE_LANGUAGES[key]?.name || key;

          return [categoryName, value.toString(), `${percentage}%`, classification];
        });

      doc
        .fontSize(16)
        .fillColor(COLORS.gray[800])
        .font('Helvetica-Bold')
        .text('PONTUAÇÃO DETALHADA', 50, doc.y + 20)
        .moveDown(1);

      // Tabela com alinhamento correto
      const tableX = 50;
      const tableWidth = doc.page.width - 100;
      const headers = ['Categoria', 'Pontos', 'Percentual', 'Classificação'];
      const colWidths = [150, 80, 100, 120]; // Larguras fixas para cada coluna
      const rowHeight = 35;

      // Cabeçalho
      doc
        .rect(tableX, doc.y, tableWidth, rowHeight)
        .fillColor(COLORS.primary)
        .fill();

      let currentX = tableX;
      headers.forEach((header, index) => {
        doc
          .fontSize(11)
          .fillColor('#FFFFFF')
          .font('Helvetica-Bold')
          .text(header, currentX + 10, doc.y + 12, {
            width: colWidths[index] - 20
          });
        currentX += colWidths[index];
      });

      doc.y += rowHeight;

      // Linhas de dados
      sortedData.forEach((row, rowIndex) => {
        const bgColor = rowIndex % 2 === 0 ? COLORS.gray[50] : '#FFFFFF';
        
        doc
          .rect(tableX, doc.y, tableWidth, rowHeight)
          .fillColor(bgColor)
          .fill();

        let currentX = tableX;
        row.forEach((cell, cellIndex) => {
          doc
            .fontSize(10)
            .fillColor(COLORS.gray[700])
            .font('Helvetica')
            .text(cell.toString(), currentX + 10, doc.y + 12, {
              width: colWidths[cellIndex] - 20
            });
          currentX += colWidths[cellIndex];
        });

        doc.y += rowHeight;
      });

      // === PÁGINA 3: ANÁLISE POR CATEGORIA ===
      doc.addPage();
      
      doc
        .fontSize(18)
        .fillColor(COLORS.gray[800])
        .font('Helvetica-Bold')
        .text('ANÁLISE DETALHADA POR CATEGORIA', 50, 50)
        .moveDown(1);

      Object.entries(percentages)
        .sort((a, b) => b[1] - a[1])
        .forEach(([key, percentage], index) => {
          const categoryData = profilesData[key];
          if (!categoryData) return;

          const colors = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.warning, COLORS.success];
          
          // Título da categoria com espaçamento reduzido
          doc
            .fontSize(14)
            .fillColor(colors[index % colors.length])
            .font('Helvetica-Bold')
            .text(`${categoryData.name} (${percentage}%)`, 50)
            .moveDown(0.2); // Espaçamento reduzido

          // Descrição
          doc
            .fontSize(11)
            .fillColor(COLORS.gray[600])
            .font('Helvetica')
            .text(categoryData.description, 50, doc.y, { width: doc.page.width - 100 })
            .moveDown(0.3);

          if (percentage >= 15) {
            // Características em lista compacta
            doc
              .fontSize(12)
              .fillColor(COLORS.gray[700])
              .font('Helvetica-Bold')
              .text('Principais Características:', 70)
              .moveDown(0.2);

            categoryData.characteristics.slice(0, 3).forEach(char => {
              doc
                .fontSize(10)
                .fillColor(COLORS.gray[600])
                .font('Helvetica')
                .text(`• ${char}`, 90, doc.y, { width: doc.page.width - 140 })
                .moveDown(0.15);
            });

            doc.moveDown(0.4);
          }
        });

      // === PÁGINA 4: RECOMENDAÇÕES ===
      doc.addPage();

      const recommendations = generatePersonalizedRecommendations(
        profileType,
        profileName,
        percentages
      );

      addCardSection(
        doc,
        'RECOMENDAÇÕES PERSONALIZADAS',
        'Baseadas na sua análise individual, desenvolvemos recomendações específicas para potencializar seus pontos fortes.',
        COLORS.success,
        0.2
      );

      recommendations.forEach(rec => {
        doc
          .fontSize(11)
          .fillColor(COLORS.gray[600])
          .font('Helvetica')
          .text(`• ${rec}`, 70, doc.y, { width: doc.page.width - 140 })
          .moveDown(0.3);
      });

      // === PRÓXIMOS PASSOS SIMPLIFICADOS ===
      doc.moveDown(1);
      
      doc
        .fontSize(16)
        .fillColor(COLORS.gray[800])
        .font('Helvetica-Bold')
        .text('PRÓXIMOS PASSOS', 50)
        .moveDown(0.5);

      const actionItems = [
        'Identifique 2-3 áreas prioritárias para desenvolvimento',
        'Pratique conscientemente novos comportamentos',
        'Busque feedback regular de pessoas de confiança',
        'Acompanhe seu progresso periodicamente'
      ];

      actionItems.forEach((item, index) => {
        doc
          .fontSize(11)
          .fillColor(COLORS.gray[600])
          .font('Helvetica')
          .text(`${index + 1}. ${item}`, 70, doc.y, { width: doc.page.width - 140 })
          .moveDown(0.4);
      });

      // Rodapé final
      doc
        .fontSize(10)
        .fillColor(COLORS.gray[500])
        .font('Helvetica')
        .text(
          `Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} • Sistema de Avaliação Profissional`,
          50,
          doc.page.height - 50,
          { align: 'center', width: doc.page.width - 100 }
        );

      doc.end();
    });
  } catch (err) {
    console.error("Erro ao gerar PDF otimizado:", {
      message: err.message,
      stack: err.stack,
      result,
      profileData,
    });
    throw err;
  }
};

// ... keep existing code (remaining functions)

function calculateHybridDiscProfile(scores) {
  const sortedScores = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({ profile: key, score: value }));

  const primary = sortedScores[0];
  const secondary = sortedScores[1];
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const primaryPercentage = (primary.score / total) * 100;
  const secondaryPercentage = (secondary.score / total) * 100;

  if (secondaryPercentage >= primaryPercentage * 0.6) {
    return `${primary.profile}${secondary.profile}`;
  }

  return primary.profile;
}

function calculateDominantLoveLanguage(scores) {
  const sortedScores = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({ language: key, score: value }));

  const primary = sortedScores[0];
  const secondary = sortedScores[1];
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const primaryPercentage = (primary.score / total) * 100;
  const secondaryPercentage = (secondary.score / total) * 100;

  if (
    primaryPercentage >= 30 &&
    primaryPercentage > secondaryPercentage * 1.3
  ) {
    return primary.language;
  }

  if (Math.abs(primaryPercentage - secondaryPercentage) <= 5) {
    return `${primary.language}/${secondary.language}`;
  }

  return primary.language;
}

exports.calculatePercentages = calculatePercentages;
exports.generatePersonalizedRecommendations = generatePersonalizedRecommendations;
exports.calculateHybridDiscProfile = calculateHybridDiscProfile;
exports.calculateDominantLoveLanguage = calculateDominantLoveLanguage;