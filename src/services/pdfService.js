const PDFDocument = require("pdfkit");

// Dados completos dos perfis DISC
const DISC_PROFILES = {
  D: {
    name: "Dominância",
    description: "Pessoas com alta dominância são diretas, decisivas e focadas em resultados. Gostam de desafios e assumem riscos calculados.",
    characteristics: [
      "Orientado para resultados",
      "Decisivo e direto",
      "Gosta de desafios",
      "Assume riscos calculados",
      "Foca em objetivos",
      "Independente",
      "Competitivo",
      "Líder natural"
    ],
    strengths: [
      "Capacidade de tomar decisões rápidas",
      "Orientação para resultados",
      "Liderança natural",
      "Iniciativa e proatividade",
      "Coragem para assumir riscos",
      "Foco em objetivos",
      "Determinação e persistência"
    ],
    challenges: [
      "Pode ser impaciente com detalhes",
      "Tendência a ser muito direto",
      "Pode ignorar sentimentos dos outros",
      "Dificuldade em aceitar críticas",
      "Pode ser autoritário",
      "Impaciência com processos lentos"
    ],
    workStyle: "Prefere ambientes dinâmicos, com autonomia e desafios constantes. Trabalha bem sob pressão e gosta de liderar projetos.",
    communication: "Comunicação direta, objetiva e focada em resultados. Aprecia feedback direto e conversas práticas.",
    motivation: "Motivado por desafios, autoridade, reconhecimento por resultados e oportunidades de liderança."
  },
  I: {
    name: "Influência",
    description: "Pessoas com alta influência são entusiasmadas, expressivas e orientadas para pessoas. Gostam de interagir e inspirar outros.",
    characteristics: [
      "Entusiasmado e otimista",
      "Expressivo e comunicativo",
      "Orientado para pessoas",
      "Inspirador e motivador",
      "Flexível e adaptável",
      "Criativo e inovador",
      "Persuasivo",
      "Sociável"
    ],
    strengths: [
      "Habilidades de comunicação",
      "Capacidade de inspirar outros",
      "Otimismo e entusiasmo",
      "Flexibilidade e adaptabilidade",
      "Criatividade e inovação",
      "Networking e relacionamentos",
      "Persuasão e influência"
    ],
    challenges: [
      "Pode ser desorganizado",
      "Tendência a ser impulsivo",
      "Dificuldade com rotinas",
      "Pode ser superficial em análises",
      "Evita confrontos",
      "Pode ser inconsistente"
    ],
    workStyle: "Prefere ambientes colaborativos, dinâmicos e com interação social. Trabalha bem em equipe e gosta de variedade.",
    communication: "Comunicação expressiva, entusiasmada e focada em pessoas. Aprecia feedback positivo e conversas inspiradoras.",
    motivation: "Motivado por reconhecimento público, interação social, variedade e oportunidades de influenciar positivamente."
  },
  S: {
    name: "Estabilidade",
    description: "Pessoas com alta estabilidade são confiáveis, pacientes e orientadas para equipe. Valorizam harmonia e consistência.",
    characteristics: [
      "Confiável e leal",
      "Paciente e calmo",
      "Orientado para equipe",
      "Estável e consistente",
      "Bom ouvinte",
      "Cooperativo",
      "Empático",
      "Metódico"
    ],
    strengths: [
      "Confiabilidade e lealdade",
      "Paciência e estabilidade",
      "Habilidades de trabalho em equipe",
      "Capacidade de ouvir",
      "Empatia e compreensão",
      "Consistência no trabalho",
      "Mediação de conflitos"
    ],
    challenges: [
      "Resistência a mudanças",
      "Dificuldade em tomar decisões rápidas",
      "Pode ser passivo demais",
      "Evita confrontos",
      "Pode ser inflexível",
      "Dificuldade em dizer não"
    ],
    workStyle: "Prefere ambientes estáveis, previsíveis e com relacionamentos harmoniosos. Trabalha bem em equipe e gosta de rotinas.",
    communication: "Comunicação calma, respeitosa e focada em harmonia. Aprecia feedback construtivo e conversas colaborativas.",
    motivation: "Motivado por estabilidade, reconhecimento da equipe, segurança e oportunidades de ajudar outros."
  },
  C: {
    name: "Conformidade",
    description: "Pessoas com alta conformidade são analíticas, precisas e orientadas para qualidade. Valorizam excelência e precisão.",
    characteristics: [
      "Analítico e detalhista",
      "Preciso e exato",
      "Orientado para qualidade",
      "Sistemático e organizado",
      "Cauteloso e prudente",
      "Diplomático",
      "Perfeccionista",
      "Objetivo"
    ],
    strengths: [
      "Atenção aos detalhes",
      "Análise e pensamento crítico",
      "Qualidade e precisão",
      "Organização e sistematização",
      "Planejamento estratégico",
      "Diplomacia e tato",
      "Resolução de problemas"
    ],
    challenges: [
      "Pode ser perfeccionista demais",
      "Tendência a ser crítico",
      "Dificuldade com prazos apertados",
      "Pode ser inflexível",
      "Evita riscos",
      "Pode ser pessimista"
    ],
    workStyle: "Prefere ambientes organizados, com processos claros e tempo para análise. Trabalha bem sozinho e gosta de qualidade.",
    communication: "Comunicação precisa, factual e focada em dados. Aprecia feedback específico e conversas técnicas.",
    motivation: "Motivado por qualidade, reconhecimento da expertise, segurança e oportunidades de especialização."
  }
};

// Dados completos das Linguagens do Amor
const LOVE_LANGUAGES = {
  Words: {
    name: "Palavras de Afirmação",
    description: "Pessoas com esta linguagem do amor valorizam palavras encorajadoras, elogios sinceros e expressões verbais de amor e apreço.",
    characteristics: [
      "Valoriza elogios sinceros",
      "Aprecia palavras de encorajamento",
      "Gosta de ouvir 'eu te amo'",
      "Sensível às palavras negativas",
      "Expressa amor verbalmente",
      "Gosta de bilhetes e mensagens",
      "Aprecia reconhecimento público"
    ],
    howToShow: [
      "Dar elogios sinceros e específicos",
      "Expressar apreço verbalmente",
      "Enviar mensagens carinhosas",
      "Escrever bilhetes de amor",
      "Reconhecer conquistas",
      "Usar palavras de encorajamento",
      "Expressar gratidão regularmente"
    ],
    whatToAvoid: [
      "Críticas duras ou destrutivas",
      "Palavras depreciativas",
      "Sarcasmo ferino",
      "Ignorar conquistas",
      "Falta de comunicação",
      "Comentários negativos sobre aparência",
      "Palavras ditas na raiva"
    ],
    practicalTips: [
      "Deixe bilhetes carinhosos",
      "Envie mensagens durante o dia",
      "Elogie na frente de outros",
      "Mantenha um diário de gratidão",
      "Use palavras específicas nos elogios",
      "Celebre conquistas verbalmente",
      "Pratique comunicação não-violenta"
    ]
  },
  Acts: {
    name: "Atos de Serviço",
    description: "Pessoas com esta linguagem do amor sentem-se amadas quando outros fazem coisas práticas para ajudá-las ou facilitar sua vida.",
    characteristics: [
      "Valoriza ações práticas",
      "Aprecia ajuda com tarefas",
      "Sente amor através de gestos",
      "Gosta de ser cuidado",
      "Expressa amor através de ações",
      "Nota quando outros se esforçam",
      "Valoriza iniciativa"
    ],
    howToShow: [
      "Fazer tarefas domésticas",
      "Preparar refeições especiais",
      "Ajudar com projetos",
      "Cuidar quando está doente",
      "Resolver problemas práticos",
      "Antecipar necessidades",
      "Oferecer ajuda sem ser pedido"
    ],
    whatToAvoid: [
      "Preguiça ou negligência",
      "Quebrar promessas de ajuda",
      "Criar mais trabalho",
      "Ignorar pedidos de ajuda",
      "Ser egoísta com o tempo",
      "Não cumprir compromissos",
      "Esperar sempre ser pedido"
    ],
    practicalTips: [
      "Pergunte como pode ajudar",
      "Observe necessidades não expressas",
      "Crie uma lista de tarefas para dividir",
      "Surpreenda com gestos práticos",
      "Seja consistente nos atos",
      "Aprenda habilidades úteis",
      "Planeje ações antecipadamente"
    ]
  },
  Gifts: {
    name: "Presentes",
    description: "Pessoas com esta linguagem do amor valorizam presentes bem pensados como símbolos de amor e consideração.",
    characteristics: [
      "Valoriza presentes significativos",
      "Aprecia o pensamento por trás",
      "Guarda presentes especiais",
      "Gosta de dar presentes",
      "Lembra de datas especiais",
      "Valoriza símbolos de amor",
      "Aprecia surpresas"
    ],
    howToShow: [
      "Dar presentes significativos",
      "Lembrar de datas especiais",
      "Comprar pequenas lembranças",
      "Fazer presentes personalizados",
      "Dar flores sem motivo especial",
      "Escolher presentes pensados",
      "Criar tradições de presentes"
    ],
    whatToAvoid: [
      "Esquecer datas importantes",
      "Presentes sem pensamento",
      "Dar apenas presentes caros",
      "Ignorar preferências",
      "Presentes de última hora",
      "Não dar presentes",
      "Presentes práticos demais"
    ],
    practicalTips: [
      "Mantenha uma lista de ideias",
      "Observe o que a pessoa gosta",
      "Crie um calendário de datas especiais",
      "Invista em presentes personalizados",
      "Dê presentes 'sem motivo'",
      "Guarde embrulhos especiais",
      "Faça cartões artesanais"
    ]
  },
  Time: {
    name: "Tempo de Qualidade",
    description: "Pessoas com esta linguagem do amor valorizam atenção total e tempo dedicado exclusivamente a elas.",
    characteristics: [
      "Valoriza atenção total",
      "Gosta de conversas profundas",
      "Aprecia momentos juntos",
      "Sente-se negligenciado facilmente",
      "Prefere qualidade à quantidade",
      "Gosta de atividades compartilhadas",
      "Valoriza presença focada"
    ],
    howToShow: [
      "Dar atenção total",
      "Planejar atividades juntos",
      "Ter conversas profundas",
      "Fazer refeições sem distrações",
      "Criar rituais de conexão",
      "Escutar ativamente",
      "Estar presente mentalmente"
    ],
    whatToAvoid: [
      "Distrações durante momentos juntos",
      "Cancelar planos constantemente",
      "Multitarefas durante conversas",
      "Não dar atenção total",
      "Priorizar outras coisas",
      "Conversas superficiais",
      "Sempre estar ocupado"
    ],
    practicalTips: [
      "Desligue dispositivos eletrônicos",
      "Planeje encontros regulares",
      "Crie rituais de conexão",
      "Faça perguntas profundas",
      "Pratique escuta ativa",
      "Dedique tempo exclusivo",
      "Esteja presente no momento"
    ]
  },
  Touch: {
    name: "Toque Físico",
    description: "Pessoas com esta linguagem do amor sentem-se conectadas e amadas através do toque físico apropriado e carinhoso.",
    characteristics: [
      "Valoriza toque físico",
      "Gosta de abraços e carícias",
      "Sente-se conectado pelo toque",
      "Expressa amor fisicamente",
      "Nota falta de toque",
      "Aprecia proximidade física",
      "Gosta de gestos carinhosos"
    ],
    howToShow: [
      "Dar abraços calorosos",
      "Fazer carícias carinhosas",
      "Sentar próximo",
      "Segurar as mãos",
      "Dar massagens",
      "Tocar durante conversas",
      "Expressar carinho fisicamente"
    ],
    whatToAvoid: [
      "Evitar toque físico",
      "Ser fisicamente distante",
      "Toque apenas íntimo",
      "Ignorar necessidade de toque",
      "Ser rude fisicamente",
      "Não respeitar limites",
      "Toque inadequado"
    ],
    practicalTips: [
      "Respeite sempre os limites",
      "Varie os tipos de toque",
      "Seja carinhoso regularmente",
      "Toque de forma apropriada",
      "Observe as preferências",
      "Seja gentil e respeitoso",
      "Comunique sobre preferências"
    ]
  }
};

// Função para calcular porcentagens
function calculatePercentages(scores) {
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const percentages = {};
  
  Object.entries(scores).forEach(([key, value]) => {
    percentages[key] = total > 0 ? Math.round((value / total) * 100) : 0;
  });
  
  return { percentages, total };
}

// Função para gerar análise combinada DISC
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
    development: []
  };

  const primary = DISC_PROFILES[analysis.primaryProfile];
  const secondary = analysis.secondaryProfile ? DISC_PROFILES[analysis.secondaryProfile] : null;

  if (secondary) {
    analysis.description = `Perfil ${primary.name}/${secondary.name}: Combina características de ${primary.name.toLowerCase()} com elementos de ${secondary.name.toLowerCase()}.`;
    analysis.combinedTraits = [
      ...primary.characteristics.slice(0, 4),
      ...secondary.characteristics.slice(0, 3)
    ];
  } else {
    analysis.description = `Perfil ${primary.name}: ${primary.description}`;
    analysis.combinedTraits = primary.characteristics;
  }

  return analysis;
}

// Função para gerar recomendações específicas
function generatePersonalizedRecommendations(type, profile, percentages) {
  const recommendations = [];
  
  if (type === 'DISC') {
    const sortedProfiles = Object.entries(percentages)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ profile: key, percentage: value }));
    
    // Recomendações baseadas no perfil dominante
    const dominant = sortedProfiles[0];
    const secondary = sortedProfiles[1];
    
    if (dominant.percentage >= 40) {
      recommendations.push(`Forte ${DISC_PROFILES[dominant.profile].name}: Desenvolva ainda mais suas características naturais de ${DISC_PROFILES[dominant.profile].name.toLowerCase()}.`);
    }
    
    if (secondary.percentage >= 25) {
      recommendations.push(`Perfil Híbrido: Sua combinação ${dominant.profile}/${secondary.profile} é uma grande vantagem em situações que requerem flexibilidade.`);
    }
    
    // Recomendações de desenvolvimento
    sortedProfiles.forEach(({ profile, percentage }) => {
      if (percentage < 15) {
        recommendations.push(`Oportunidade de Crescimento: Considere desenvolver mais características de ${DISC_PROFILES[profile].name} para maior versatilidade.`);
      }
    });
  } else {
    // Recomendações para Linguagens do Amor
    const sortedLanguages = Object.entries(percentages)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ language: key, percentage: value }));
    
    const primary = sortedLanguages[0];
    const secondary = sortedLanguages[1];
    
    if (primary.percentage >= 35) {
      recommendations.push(`Linguagem Principal: ${LOVE_LANGUAGES[primary.language].name} é claramente sua forma preferida de receber amor.`);
    }
    
    if (secondary.percentage >= 20) {
      recommendations.push(`Linguagem Secundária: ${LOVE_LANGUAGES[secondary.language].name} também é importante para você.`);
    }
    
    // Recomendações equilibradas
    const balanced = sortedLanguages.filter(lang => lang.percentage >= 15 && lang.percentage <= 30);
    if (balanced.length >= 3) {
      recommendations.push("Perfil Equilibrado: Você aprecia múltiplas formas de expressar e receber amor, o que é uma grande vantagem nos relacionamentos.");
    }
  }
  
  return recommendations;
}

// Função principal para gerar PDF
exports.generatePDFContent = async (result, profileData) => {
  try {
    console.log("Gerando PDF completo para resultado:", result);
    
    if (!result || !profileData) {
      throw new Error("Resultado ou dados do perfil ausentes");
    }
    
    const scores = result.scores;
    const isDiscProfile = scores.hasOwnProperty('D');
    const profileType = isDiscProfile ? 'DISC' : 'LOVE';
    
    // Calcular porcentagens
    const { percentages, total } = calculatePercentages(scores);
    
    // Dados do perfil
    const profileName = result.profile || result.primaryLanguage || "Desconhecido";
    const profilesData = isDiscProfile ? DISC_PROFILES : LOVE_LANGUAGES;
    
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 50,
      info: {
        Title: `Relatório ${profileType} - ${result.name}`,
        Author: "Sistema de Avaliação",
        Subject: `Análise de Perfil ${profileType}`,
        Keywords: `${profileType}, perfil, análise, ${result.name}`
      }
    });
    
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    
    return new Promise((resolve, reject) => {
      doc.on("end", () => {
        console.log("PDF completo finalizado");
        resolve(Buffer.concat(buffers));
      });
      
      doc.on("error", (err) => {
        console.error("Erro durante a criação do PDF:", err);
        reject(err);
      });
      
      // Função auxiliar para adicionar título de seção
      function addSectionTitle(title, fontSize = 16) {
        doc.fontSize(fontSize)
           .fillColor('#2C3E50')
           .text(title, { align: 'left' })
           .moveDown(0.5);
      }
      
      // Função auxiliar para adicionar texto normal
      function addText(text, fontSize = 12) {
        doc.fontSize(fontSize)
           .fillColor('#2C3E50')
           .text(text, { align: 'justify' })
           .moveDown(0.3);
      }
      
      // Função auxiliar para adicionar lista
      function addList(items, bullet = '•') {
        items.forEach(item => {
          doc.fontSize(11)
             .fillColor('#34495E')
             .text(`${bullet} ${item}`, { indent: 20 })
             .moveDown(0.2);
        });
        doc.moveDown(0.3);
      }
      
      // Função auxiliar para adicionar gráfico de barras simples
      function addBarChart(data, title) {
        doc.fontSize(14)
           .fillColor('#2C3E50')
           .text(title, { align: 'center' })
           .moveDown(0.5);
        
        const chartWidth = 400;
        const chartHeight = 200;
        const startX = (doc.page.width - chartWidth) / 2;
        const startY = doc.y;
        
        const maxValue = Math.max(...Object.values(data));
        const barWidth = chartWidth / Object.keys(data).length;
        
        Object.entries(data).forEach(([key, value], index) => {
          const barHeight = (value / maxValue) * chartHeight;
          const x = startX + (index * barWidth);
          const y = startY + chartHeight - barHeight;
          
          // Desenhar barra
          doc.rect(x + 10, y, barWidth - 20, barHeight)
             .fillColor('#3498DB')
             .fill();
          
          // Adicionar label
          doc.fontSize(10)
             .fillColor('#2C3E50')
             .text(key, x, startY + chartHeight + 10, { width: barWidth, align: 'center' });
          
          // Adicionar valor
          doc.fontSize(10)
             .fillColor('#FFFFFF')
             .text(`${value}%`, x, y + barHeight/2, { width: barWidth, align: 'center' });
        });
        
        doc.y = startY + chartHeight + 40;
      }
      
      // PÁGINA 1: CAPA E INFORMAÇÕES GERAIS
      doc.fontSize(28)
         .fillColor('#2C3E50')
         .text(`RELATÓRIO DE PERFIL ${profileType}`, { align: 'center' })
         .moveDown(1);
      
      doc.fontSize(18)
         .fillColor('#7F8C8D')
         .text('Análise Completa e Detalhada', { align: 'center' })
         .moveDown(2);
      
      // Informações básicas
      doc.fontSize(16)
         .fillColor('#2C3E50')
         .text(`Nome: ${result.name}`)
         .moveDown(0.5);
      
      doc.fontSize(16)
         .text(`Data: ${new Date(result.date).toLocaleDateString('pt-BR')}`)
         .moveDown(0.5);
      
      doc.fontSize(16)
         .text(`Perfil Principal: ${profileName}`)
         .moveDown(0.5);
      
      doc.fontSize(16)
         .text(`Total de Respostas: ${total}`)
         .moveDown(2);
      
      // Resumo executivo
      addSectionTitle('RESUMO EXECUTIVO', 18);
      addText(`Este relatório apresenta uma análise completa do perfil ${profileType} de ${result.name}, baseada em ${total} respostas coletadas. O perfil principal identificado é ${profileName}, com características específicas que serão detalhadas ao longo deste documento.`);
      
      // Gráfico de distribuição
      doc.addPage();
      addSectionTitle('DISTRIBUIÇÃO DO PERFIL', 18);
      addBarChart(percentages, 'Porcentagem por Categoria');
      
      // Tabela de scores detalhada
      addSectionTitle('PONTUAÇÃO DETALHADA');
      doc.fontSize(12)
         .fillColor('#2C3E50')
         .text('Categoria', 70, doc.y, { continued: true })
         .text('Pontuação', 200, doc.y, { continued: true })
         .text('Porcentagem', 300, doc.y, { continued: true })
         .text('Classificação', 400, doc.y)
         .moveDown(0.5);
      
      // Linha divisória
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .strokeColor('#BDC3C7')
         .stroke()
         .moveDown(0.5);
      
      // Dados da tabela
      const sortedData = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .map(([key, value], index) => {
          const percentage = percentages[key];
          let classification = '';
          if (percentage >= 35) classification = 'Dominante';
          else if (percentage >= 25) classification = 'Forte';
          else if (percentage >= 15) classification = 'Moderado';
          else classification = 'Baixo';
          
          return { key, value, percentage, classification, rank: index + 1 };
        });
      
      sortedData.forEach(({ key, value, percentage, classification }) => {
        const categoryName = isDiscProfile ? DISC_PROFILES[key].name : LOVE_LANGUAGES[key].name;
        doc.fontSize(11)
           .fillColor('#34495E')
           .text(categoryName, 70, doc.y, { continued: true })
           .text(value.toString(), 200, doc.y, { continued: true })
           .text(`${percentage}%`, 300, doc.y, { continued: true })
           .text(classification, 400, doc.y)
           .moveDown(0.4);
      });
      
      // ANÁLISE DETALHADA POR CATEGORIA
      doc.addPage();
      addSectionTitle('ANÁLISE DETALHADA POR CATEGORIA', 18);
      
      sortedData.forEach(({ key, percentage }, index) => {
        const categoryData = profilesData[key];
        const isSignificant = percentage >= 15;
        
        if (index > 0) doc.addPage();
        
        addSectionTitle(`${categoryData.name} (${percentage}%)`, 16);
        
        if (isSignificant) {
          addText(categoryData.description);
          
          addSectionTitle('Características Principais:', 14);
          addList(categoryData.characteristics);
          
          addSectionTitle('Pontos Fortes:', 14);
          addList(categoryData.strengths || categoryData.howToShow);
          
          addSectionTitle('Desafios e Áreas de Atenção:', 14);
          addList(categoryData.challenges || categoryData.whatToAvoid);
          
          if (isDiscProfile) {
            addSectionTitle('Estilo de Trabalho:', 14);
            addText(categoryData.workStyle);
            
            addSectionTitle('Comunicação:', 14);
            addText(categoryData.communication);
            
            addSectionTitle('Motivação:', 14);
            addText(categoryData.motivation);
          } else {
            addSectionTitle('Como Expressar Esta Linguagem:', 14);
            addList(categoryData.howToShow);
            
            addSectionTitle('Dicas Práticas:', 14);
            addList(categoryData.practicalTips);
          }
        } else {
          addText(`Com ${percentage}% de representação, esta categoria tem baixa influência no seu perfil atual. Isso pode representar uma oportunidade de desenvolvimento ou simplesmente uma característica menos dominante em sua personalidade.`);
          
          addSectionTitle('Potencial de Desenvolvimento:', 14);
          addText(`Considere desenvolver mais características de ${categoryData.name.toLowerCase()} para aumentar sua versatilidade e eficácia em diferentes situações.`);
        }
      });
      
      // ANÁLISE COMBINADA E RECOMENDAÇÕES
      doc.addPage();
      addSectionTitle('ANÁLISE COMBINADA E RECOMENDAÇÕES', 18);
      
      // Gerar recomendações personalizadas
      const recommendations = generatePersonalizedRecommendations(profileType, profileName, percentages);
      
      addSectionTitle('Perfil Integrado:', 14);
      if (isDiscProfile) {
        const combinedAnalysis = generateCombinedDiscAnalysis(profileName, percentages);
        addText(combinedAnalysis.description);
        
        addSectionTitle('Características Combinadas:', 14);
        addList(combinedAnalysis.combinedTraits);
      } else {
        const primaryLanguage = sortedData[0];
        const secondaryLanguage = sortedData[1];
        
        addText(`Sua linguagem principal do amor é ${profilesData[primaryLanguage.key].name} (${primaryLanguage.percentage}%), complementada por ${profilesData[secondaryLanguage.key].name} (${secondaryLanguage.percentage}%). Esta combinação oferece uma rica variedade de formas de dar e receber amor.`);
      }
      
      addSectionTitle('Recomendações Personalizadas:', 14);
      addList(recommendations);
      
      // PLANO DE DESENVOLVIMENTO
      doc.addPage();
      addSectionTitle('PLANO DE DESENVOLVIMENTO PESSOAL', 18);
      
      addSectionTitle('Áreas de Força para Potencializar:', 14);
      const strongAreas = sortedData.filter(item => item.percentage >= 25);
      strongAreas.forEach(({ key, percentage }) => {
        const categoryData = profilesData[key];
        addText(`• ${categoryData.name} (${percentage}%): Continue desenvolvendo estas características naturais, pois representam seus principais pontos fortes.`);
      });
      
      addSectionTitle('Áreas de Oportunidade:', 14);
      const developmentAreas = sortedData.filter(item => item.percentage < 20);
      developmentAreas.forEach(({ key, percentage }) => {
        const categoryData = profilesData[key];
        addText(`• ${categoryData.name} (${percentage}%): Considere desenvolver mais estas características para maior versatilidade e eficácia.`);
      });
      
      addSectionTitle('Estratégias de Desenvolvimento:', 14);
      if (isDiscProfile) {
        addText("Para desenvolvimento do perfil DISC, considere:");
        addList([
          "Participar de atividades que desafiem suas áreas menos desenvolvidas",
          "Buscar feedback de colegas sobre diferentes situações",
          "Praticar flexibilidade comportamental em contextos variados",
          "Estudar e observar pessoas com perfis complementares",
          "Desenvolver autoconsciência sobre seus padrões de comportamento"
        ]);
      } else {
        addText("Para desenvolvimento das linguagens do amor, considere:");
        addList([
          "Experimentar expressar amor através de diferentes linguagens",
          "Comunicar suas necessidades para parceiros e família",
          "Observar como outros preferem receber amor",
          "Praticar linguagens menos desenvolvidas regularmente",
          "Criar um plano de relacionamento baseado nestas descobertas"
        ]);
      }
      
      // APLICAÇÕES PRÁTICAS
      doc.addPage();
      addSectionTitle('APLICAÇÕES PRÁTICAS', 18);
      
      if (isDiscProfile) {
        addSectionTitle('No Ambiente de Trabalho:', 14);
        const primaryProfile = DISC_PROFILES[sortedData[0].key];
        addText(`Com base no seu perfil ${primaryProfile.name}, você provavelmente se destaca em:`);
        addList([
          `Situações que exigem ${primaryProfile.name.toLowerCase()}`,
          "Ambientes alinhados com suas características naturais",
          "Funções que aproveitam seus pontos fortes principais"
        ]);
        
        addSectionTitle('Em Relacionamentos Interpessoais:', 14);
        addText("Para melhorar seus relacionamentos:");
        addList([
          "Identifique os perfis DISC de pessoas próximas",
          "Adapte sua comunicação aos diferentes estilos",
          "Desenvolva empatia por estilos diferentes do seu",
          "Pratique flexibilidade comportamental"
        ]);
        
        addSectionTitle('Em Situações de Liderança:', 14);
        addText("Como líder, considere:");
        addList([
          "Suas tendências naturais de liderança",
          "Como motivar pessoas com perfis diferentes",
          "Estratégias para desenvolver uma liderança mais completa",
          "Formas de compensar possíveis pontos cegos"
        ]);
        
      } else {
        addSectionTitle('Em Relacionamentos Amorosos:', 14);
        const primaryLanguage = LOVE_LANGUAGES[sortedData[0].key];
        addText(`Sua linguagem principal sendo ${primaryLanguage.name}, é importante:`);
        addList([
          "Comunicar esta necessidade para seu parceiro",
          "Reconhecer quando está sendo amado desta forma",
          "Não assumir que outros têm a mesma linguagem",
          "Aprender a linguagem do amor do seu parceiro"
        ]);
        
        addSectionTitle('Em Relacionamentos Familiares:', 14);
        addText("Para melhorar relacionamentos familiares:");
        addList([
          "Identifique as linguagens do amor dos familiares",
          "Pratique expressar amor de formas variadas",
          "Seja paciente com diferenças nas linguagens",
          "Crie tradições que honrem diferentes linguagens"
        ]);
        
        addSectionTitle('Em Relacionamentos de Amizade:', 14);
        addText("Para fortalecer amizades:");
        addList([
          "Observe como seus amigos preferem receber afeto",
          "Varie suas formas de demonstrar carinho",
          "Comunique suas próprias necessidades",
          "Respeite as diferenças individuais"
        ]);
      }
      
      // AUTOCONHECIMENTO E REFLEXÃO
      doc.addPage();
      addSectionTitle('AUTOCONHECIMENTO E REFLEXÃO', 18);
      
      addSectionTitle('Perguntas para Reflexão:', 14);
      if (isDiscProfile) {
        addText("Reflita sobre estas questões para aprofundar seu autoconhecimento:");
        addList([
          "Como seu perfil DISC se manifesta em diferentes situações?",
          "Que situações trazem o melhor e o pior de você?",
          "Como você pode usar seus pontos fortes mais efetivamente?",
          "Que características você gostaria de desenvolver mais?",
          "Como seu perfil afeta seus relacionamentos?",
          "Que estratégias você pode usar para se adaptar a diferentes situações?",
          "Como você pode contribuir melhor em equipes?"
        ]);
      } else {
        addText("Reflita sobre estas questões para aprofundar seu autoconhecimento:");
        addList([
          "Como você prefere receber amor e afeto?",
          "De que formas você naturalmente expressa amor?",
          "Que linguagens do amor você tem dificuldade em compreender?",
          "Como você pode comunicar melhor suas necessidades?",
          "Que padrões você identifica em seus relacionamentos?",
          "Como você pode se tornar mais versátil em expressar amor?",
          "Que tradições você pode criar baseadas nestas descobertas?"
        ]);
      }
      
      addSectionTitle('Exercícios de Desenvolvimento:', 14);
      if (isDiscProfile) {
        addList([
          "Observe seu comportamento em diferentes contextos por uma semana",
          "Peça feedback sobre seu estilo de comunicação",
          "Pratique adaptar seu estilo a diferentes pessoas",
          "Identifique situações onde você se sente mais e menos confortável",
          "Desenvolva estratégias para lidar com seus desafios"
        ]);
      } else {
        addList([
          "Experimente expressar amor através de diferentes linguagens por um mês",
          "Observe as reações das pessoas às suas demonstrações de afeto",
          "Identifique as linguagens do amor de pessoas próximas",
          "Pratique comunicar suas necessidades claramente",
          "Crie um plano de relacionamento baseado nestas descobertas"
        ]);
      }
      
      // CONCLUSÃO E PRÓXIMOS PASSOS
      doc.addPage();
      addSectionTitle('CONCLUSÃO E PRÓXIMOS PASSOS', 18);
      
      addText(`Este relatório apresentou uma análise completa do seu perfil ${profileType}, baseada em ${total} respostas. Seu perfil principal ${profileName} representa ${sortedData[0].percentage}% do seu resultado, seguido por ${profilesData[sortedData[1].key].name} com ${sortedData[1].percentage}%.`);
      
      addSectionTitle('Principais Descobertas:', 14);
      addList([
        `Seu perfil principal é ${profileName} (${sortedData[0].percentage}%)`,
        `Sua segunda característica mais forte é ${profilesData[sortedData[1].key].name} (${sortedData[1].percentage}%)`,
        `Suas características menos desenvolvidas oferecem oportunidades de crescimento`,
        `Seu perfil único oferece tanto pontos fortes quanto áreas de desenvolvimento`
      ]);
      
      addSectionTitle('Recomendações Finais:', 14);
      addList([
        "Use este relatório como base para autoconhecimento contínuo",
        "Compartilhe descobertas relevantes com pessoas próximas",
        "Implemente gradualmente as estratégias sugeridas",
        "Monitore seu progresso e ajuste suas abordagens",
        "Considere fazer nova avaliação em 6-12 meses"
      ]);
      
      addSectionTitle('Próximos Passos:', 14);
      addText("Para maximizar o valor desta análise:");
      addList([
        "Escolha 2-3 áreas específicas para focar nos próximos meses",
        "Crie um plano de desenvolvimento pessoal",
        "Busque feedback regular de pessoas de confiança",
        "Pratique conscientemente novos comportamentos",
        "Mantenha um diário de reflexão sobre seu progresso"
      ]);
      
      // RECURSOS ADICIONAIS
      addSectionTitle('Recursos para Desenvolvimento Contínuo:', 14);
      if (isDiscProfile) {
        addList([
          "Livros sobre perfis comportamentais e liderança",
          "Cursos de desenvolvimento de soft skills",
          "Coaching profissional especializado em DISC",
          "Workshops de trabalho em equipe",
          "Ferramentas de feedback 360 graus"
        ]);
      } else {
        addList([
          "Livros sobre relacionamentos e comunicação",
          "Cursos de comunicação não-violenta",
          "Terapia de casal ou familiar",
          "Workshops sobre inteligência emocional",
          "Grupos de apoio para desenvolvimento pessoal"
        ]);
      }
      
      // RODAPÉ FINAL
      doc.fontSize(10)
         .fillColor('#7F8C8D')
         .text(`Este relatório foi gerado em ${new Date().toLocaleDateString('pt-BR')} e representa uma análise baseada nas respostas fornecidas em ${new Date(result.date).toLocaleDateString('pt-BR')}. Para melhores resultados, recomenda-se revisitar esta avaliação periodicamente.`, { align: 'center' });
      
      doc.end();
    });
  } catch (err) {
    console.error("Erro ao gerar PDF completo:", {
      message: err.message,
      stack: err.stack,
      result,
      profileData,
    });
    throw err;
  }
};

// Função auxiliar para calcular perfis híbridos DISC
function calculateHybridDiscProfile(scores) {
  const sortedScores = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({ profile: key, score: value }));
  
  const primary = sortedScores[0];
  const secondary = sortedScores[1];
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  const primaryPercentage = (primary.score / total) * 100;
  const secondaryPercentage = (secondary.score / total) * 100;
  
  // Determinar se é um perfil híbrido
  if (secondaryPercentage >= primaryPercentage * 0.6) {
    return `${primary.profile}${secondary.profile}`;
  }
  
  return primary.profile;
}

// Função auxiliar para calcular linguagem do amor dominante
function calculateDominantLoveLanguage(scores) {
  const sortedScores = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({ language: key, score: value }));
  
  const primary = sortedScores[0];
  const secondary = sortedScores[1];
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  const primaryPercentage = (primary.score / total) * 100;
  const secondaryPercentage = (secondary.score / total) * 100;
  
  // Se há uma linguagem claramente dominante
  if (primaryPercentage >= 30 && primaryPercentage > secondaryPercentage * 1.3) {
    return primary.language;
  }
  
  // Se há duas linguagens próximas
  if (Math.abs(primaryPercentage - secondaryPercentage) <= 5) {
    return `${primary.language}/${secondary.language}`;
  }
  
  return primary.language;
}

// Exportar funções auxiliares
exports.calculatePercentages = calculatePercentages;
exports.generatePersonalizedRecommendations = generatePersonalizedRecommendations;
exports.calculateHybridDiscProfile = calculateHybridDiscProfile;
exports.calculateDominantLoveLanguage = calculateDominantLoveLanguage;
exports.DISC_PROFILES = DISC_PROFILES;
exports.LOVE_LANGUAGES = LOVE_LANGUAGES;