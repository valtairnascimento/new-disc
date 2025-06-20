const mongoose = require("mongoose");
const Question = require("./src/models/Question");
const Profile = require("./src/models/Profile");
require("dotenv").config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao MongoDB Atlas");

    await Question.deleteMany({});
    await Profile.deleteMany({});
    console.log("Coleções Question e Profile limpas");

    const questions = [
      // Dominância (D)
      { text: "Eu tomo decisões rapidamente, mesmo sob pressão", type: "D" },
      { text: "Eu gosto de liderar projetos e equipes", type: "D" },
      { text: "Eu enfrento desafios diretamente, sem hesitação", type: "D" },
      { text: "Eu sou competitivo e busco alcançar resultados", type: "D" },
      { text: "Eu prefiro focar em resultados do que em processos", type: "D" },
      {
        text: "Eu assumo riscos calculados para alcançar objetivos",
        type: "D",
      },
      // Influência (I)
      { text: "Eu me comunico com entusiasmo e energia", type: "I" },
      { text: "Eu gosto de inspirar e motivar outras pessoas", type: "I" },
      { text: "Eu sou extrovertido em situações sociais", type: "I" },
      { text: "Eu valorizo construir relacionamentos no trabalho", type: "I" },
      { text: "Eu convenço os outros com facilidade", type: "I" },
      {
        text: "Eu mantenho uma atitude otimista em situações difíceis",
        type: "I",
      },
      // Estabilidade (S)
      { text: "Eu prefiro rotinas previsíveis e estáveis", type: "S" },
      { text: "Eu valorizo a consistência no meu trabalho", type: "S" },
      { text: "Eu sou paciente com mudanças graduais", type: "S" },
      { text: "Eu gosto de colaborar em equipe", type: "S" },
      { text: "Eu evito conflitos sempre que possível", type: "S" },
      { text: "Eu sou leal aos meus colegas e organização", type: "S" },
      // Conformidade (C)
      {
        text: "Eu analiso detalhes cuidadosamente antes de decidir",
        type: "C",
      },
      { text: "Eu sigo regras e padrões rigorosamente", type: "C" },
      { text: "Eu valorizo a precisão no meu trabalho", type: "C" },
      { text: "Eu planejo cuidadosamente antes de agir", type: "C" },
      { text: "Eu sou crítico com erros e imprecisões", type: "C" },
      { text: "Eu gosto de processos bem definidos e estruturados", type: "C" },
    ];

    await Question.insertMany(questions);
    console.log("24 perguntas inseridas com sucesso");

    const profiles = [
      {
        profile: "D",
        description:
          "Você é assertivo, orientado a resultados e gosta de assumir o controle em situações desafiadoras. Líder natural, você toma decisões rápidas e enfrenta obstáculos com confiança.",
        strengths: ["Liderança", "Decisão rápida", "Foco em resultados"],
        weaknesses: [
          "Impaciência",
          "Falta de atenção a detalhes",
          "Pode ser percebido como agressivo",
        ],
      },
      {
        profile: "I",
        description:
          "Você é entusiasta, comunicativo e gosta de inspirar outros. Sua energia positiva e habilidades sociais criam ambientes colaborativos e motivadores.",
        strengths: ["Carisma", "Habilidade de persuasão", "Otimismo"],
        weaknesses: [
          "Falta de foco em detalhes",
          "Impulsividade",
          "Pode evitar conflitos",
        ],
      },
      {
        profile: "S",
        description:
          "Você é calmo, leal e valoriza estabilidade. Prefere rotinas previsíveis e trabalha bem em equipe, promovendo harmonia e consistência.",
        strengths: ["Paciência", "Colaboração", "Lealdade"],
        weaknesses: [
          "Resistência a mudanças",
          "Dificuldade em dizer não",
          "Pode ser muito reservado",
        ],
      },
      {
        profile: "C",
        description:
          "Você é analítico, detalhista e segue padrões rigorosos. Valoriza precisão e qualidade, planejando cuidadosamente antes de agir.",
        strengths: ["Precisão", "Planejamento", "Atenção a detalhes"],
        weaknesses: [
          "Perfeccionismo",
          "Resistência a riscos",
          "Pode ser muito crítico",
        ],
      },
      {
        profile: "DI",
        description:
          "Você combina liderança assertiva com entusiasmo, sendo um motivador carismático que inspira equipes a alcançar resultados.",
        strengths: [
          "Liderança inspiradora",
          "Energia positiva",
          "Habilidade de motivar",
        ],
        weaknesses: [
          "Impulsividade",
          "Falta de foco em detalhes",
          "Pode ser dominante",
        ],
      },
      {
        profile: "ID",
        description:
          "Você é extrovertido e inspirador, com um toque de assertividade. Gosta de motivar outros e assumir papéis de liderança em ambientes dinâmicos.",
        strengths: ["Carisma", "Liderança motivacional", "Adaptabilidade"],
        weaknesses: [
          "Falta de organização",
          "Impulsividade",
          "Pode ser distraído",
        ],
      },
      {
        profile: "IS",
        description:
          "Você é sociável e colaborativo, valorizando relacionamentos e estabilidade. Trabalha bem em equipe e promove harmonia.",
        strengths: ["Empatia", "Colaboração", "Estabilidade emocional"],
        weaknesses: [
          "Resistência a mudanças",
          "Dificuldade em liderar",
          "Pode evitar confrontos",
        ],
      },
      {
        profile: "SI",
        description:
          "Você é leal e comunicativo, criando ambientes estáveis e motivadores. Sua paciência e habilidades sociais fortalecem equipes.",
        strengths: ["Lealdade", "Habilidade de conexão", "Paciência"],
        weaknesses: [
          "Falta de assertividade",
          "Resistência a mudanças rápidas",
          "Pode ser muito complacente",
        ],
      },
      {
        profile: "SC",
        description:
          "Você é estável e meticuloso, valorizando consistência e precisão. Trabalha bem em ambientes estruturados e colabora de forma confiável.",
        strengths: ["Confiabilidade", "Atenção a detalhes", "Colaboração"],
        weaknesses: [
          "Resistência a mudanças",
          "Perfeccionismo",
          "Pode evitar conflitos",
        ],
      },
      {
        profile: "CS",
        description:
          "Você é analítico e estável, combinando precisão com consistência. Prefere ambientes estruturados e planeja cuidadosamente.",
        strengths: ["Precisão", "Confiabilidade", "Planejamento"],
        weaknesses: [
          "Perfeccionismo excessivo",
          "Resistência a mudanças",
          "Pode ser reservado",
        ],
      },
      {
        profile: "CD",
        description:
          "Você é analítico e assertivo, combinando precisão com foco em resultados. Gosta de padrões elevados e toma decisões estruturadas.",
        strengths: [
          "Precisão",
          "Foco em resultados",
          "Planejamento estratégico",
        ],
        weaknesses: [
          "Pode ser muito crítico",
          "Falta de paciência",
          "Pode parecer distante",
        ],
      },
      {
        profile: "DC",
        description:
          "Você é assertivo e detalhista, buscando resultados com alta qualidade. Assume o controle com um enfoque analítico.",
        strengths: [
          "Liderança analítica",
          "Atenção a detalhes",
          "Determinação",
        ],
        weaknesses: [
          "Pode ser perfeccionista",
          "Impaciência",
          "Pode ser rígido",
        ],
      },
      {
        profile: "DS",
        description:
          "Você é assertivo e colaborativo, liderando com foco em resultados e harmonia. Equilibra dinamismo com estabilidade.",
        strengths: [
          "Liderança colaborativa",
          "Foco em resultados",
          "Estabilidade",
        ],
        weaknesses: [
          "Resistência a mudanças rápidas",
          "Pode evitar conflitos",
          "Falta de foco em detalhes",
        ],
      },
      {
        profile: "SD",
        description:
          "Você é leal e orientado a resultados, promovendo estabilidade enquanto busca objetivos. Trabalha bem em equipes estruturadas.",
        strengths: ["Confiabilidade", "Foco em metas", "Colaboração"],
        weaknesses: [
          "Resistência a mudanças",
          "Falta de assertividade",
          "Pode ser muito cauteloso",
        ],
      },
      {
        profile: "IC",
        description:
          "Você é comunicativo e analítico, combinando entusiasmo com precisão. Gosta de inspirar outros enquanto mantém padrões elevados.",
        strengths: ["Carisma", "Atenção a detalhes", "Habilidade de persuasão"],
        weaknesses: [
          "Pode ser perfeccionista",
          "Dificuldade com prazos",
          "Pode evitar conflitos",
        ],
      },
      {
        profile: "CI",
        description:
          "Você é analítico e sociável, equilibrando precisão com habilidades sociais. Planeja cuidadosamente e se conecta bem com outros.",
        strengths: ["Planejamento", "Empatia", "Atenção a detalhes"],
        weaknesses: [
          "Perfeccionismo",
          "Resistência a riscos",
          "Pode ser muito reservado",
        ],
      },
    ];

    await Profile.insertMany(profiles);
    console.log("16 perfis pré-cadastrados inseridos com sucesso");

    await mongoose.connection.close();
    console.log("Conexão com MongoDB fechada");
  } catch (err) {
    console.error("Erro ao popular o banco de dados:", err);
  }
}

seedDatabase();
