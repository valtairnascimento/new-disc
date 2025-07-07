const mongoose = require("mongoose");
const Question = require("./src/models/Question");
const Profile = require("./src/models/Profile");

const questions = [
  // Dominância (D) - 12 perguntas
  { text: "Eu tomo decisões rapidamente, mesmo sob pressão.", type: "D" },
  { text: "Eu gosto de assumir a liderança em projetos.", type: "D" },
  { text: "Prefiro dar ordens a receber ordens.", type: "D" },
  { text: "Eu enfrento desafios de frente.", type: "D" },
  { text: "Gosto de resolver problemas complexos rapidamente.", type: "D" },
  { text: "Sou direto ao expressar minhas opiniões.", type: "D" },
  { text: "Eu me sinto confortável em situações competitivas.", type: "D" },
  { text: "Tomo a iniciativa em grupos sem hesitação.", type: "D" },
  { text: "Prefiro resultados rápidos a processos longos.", type: "D" },
  { text: "Eu me adapto bem a mudanças inesperadas.", type: "D" },
  { text: "Gosto de assumir riscos calculados.", type: "D" },
  { text: "Eu sou motivado por alcançar objetivos ambiciosos.", type: "D" },

  // Influência (I) - 12 perguntas
  { text: "Eu me sinto à vontade em grupos sociais.", type: "I" },
  { text: "Gosto de inspirar e motivar outras pessoas.", type: "I" },
  { text: "Eu falo com entusiasmo sobre minhas ideias.", type: "I" },
  { text: "Sou bom em convencer os outros.", type: "I" },
  { text: "Aprecio interagir com pessoas novas.", type: "I" },
  { text: "Eu me expresso de forma otimista.", type: "I" },
  { text: "Gosto de compartilhar histórias e experiências.", type: "I" },
  { text: "Sou energizado por eventos sociais.", type: "I" },
  { text: "Eu me conecto facilmente com pessoas diferentes.", type: "I" },
  { text: "Gosto de trabalhar em ambientes dinâmicos.", type: "I" },
  { text: "Eu me destaco em apresentações públicas.", type: "I" },
  { text: "Prefiro ambientes colaborativos a solitários.", type: "I" },

  // Estabilidade (S) - 12 perguntas
  { text: "Eu valorizo a consistência no meu trabalho.", type: "S" },
  { text: "Prefiro ambientes previsíveis e estáveis.", type: "S" },
  { text: "Eu gosto de ajudar os outros a resolver conflitos.", type: "S" },
  { text: "Sou paciente em situações desafiadoras.", type: "S" },
  { text: "Eu trabalho bem em equipes colaborativas.", type: "S" },
  { text: "Gosto de manter rotinas organizadas.", type: "S" },
  { text: "Eu me sinto confortável com tarefas repetitivas.", type: "S" },
  { text: "Prefiro mudanças graduais a mudanças abruptas.", type: "S" },
  { text: "Eu sou bom em ouvir os outros.", type: "S" },
  { text: "Aprecio um ambiente de trabalho harmonioso.", type: "S" },
  { text: "Eu me esforço para manter a paz no grupo.", type: "S" },
  { text: "Gosto de planejar antes de agir.", type: "S" },

  // Conformidade (C) - 12 perguntas
  { text: "Eu sigo regras e procedimentos cuidadosamente.", type: "C" },
  { text: "Gosto de analisar dados antes de decidir.", type: "C" },
  { text: "Eu me preocupo com a precisão no meu trabalho.", type: "C" },
  { text: "Prefiro planejar detalhadamente antes de agir.", type: "C" },
  { text: "Eu valorizo a qualidade acima da quantidade.", type: "C" },
  { text: "Sou meticuloso com detalhes.", type: "C" },
  { text: "Gosto de trabalhar com padrões claros.", type: "C" },
  { text: "Eu verifico meu trabalho para evitar erros.", type: "C" },
  { text: "Prefiro tomar decisões baseadas em fatos.", type: "C" },
  { text: "Eu me sinto confortável com processos estruturados.", type: "C" },
  { text: "Gosto de seguir instruções precisas.", type: "C" },
  { text: "Eu me esforço para manter altos padrões de qualidade.", type: "C" },
];

const profiles = [
  {
    profile: "D",
    description:
      "Você é dominante, confiante e orientado a resultados, focado em alcançar objetivos com determinação.",
    strengths: [
      "Liderança",
      "Decisão rápida",
      "Iniciativa",
      "Resolução de problemas",
    ],
    weaknesses: [
      "Impaciência",
      "Falta de empatia",
      "Tendência a ser autoritário",
    ],
    color: "bg-red-600",
  },
  {
    profile: "I",
    description:
      "Você é influente, carismático e comunicativo, inspirando outros com entusiasmo e energia.",
    strengths: ["Persuasão", "Entusiasmo", "Habilidade social", "Motivação"],
    weaknesses: ["Falta de foco", "Impulsividade", "Desorganização"],
    color: "bg-yellow-600",
  },
  {
    profile: "S",
    description:
      "Você é estável, paciente e colaborativo, valorizando harmonia e consistência no ambiente.",
    strengths: ["Empatia", "Consistência", "Colaboração", "Paciência"],
    weaknesses: ["Resistência a mudanças", "Passividade", "Evita confrontos"],
    color: "bg-green-600",
  },
  {
    profile: "C",
    description:
      "Você é analítico, detalhista e meticuloso, priorizando precisão e qualidade no trabalho.",
    strengths: [
      "Precisão",
      "Organização",
      "Análise crítica",
      "Atenção aos detalhes",
    ],
    weaknesses: ["Perfeccionismo", "Rigidez", "Dificuldade em delegar"],
    color: "bg-blue-600",
  },
  {
    profile: "DI",
    description:
      "Você combina dominância com influência, sendo assertivo e carismático, liderando com entusiasmo.",
    strengths: [
      "Liderança inspiradora",
      "Tomada de decisão rápida",
      "Habilidade social",
    ],
    weaknesses: [
      "Impaciência com detalhes",
      "Tendência a ser impulsivo",
      "Foco excessivo em resultados",
    ],
    color: "bg-red-500",
  },
  {
    profile: "DS",
    description:
      "Você é dominante com um toque de estabilidade, liderando com firmeza, mas valorizando harmonia.",
    strengths: ["Liderança estável", "Resolução de conflitos", "Determinação"],
    weaknesses: [
      "Resistência a mudanças rápidas",
      "Autoritário em excesso",
      "Falta de flexibilidade",
    ],
    color: "bg-red-400",
  },
  {
    profile: "DC",
    description:
      "Você combina dominância com conformidade, sendo assertivo, mas focado em precisão e padrões elevados.",
    strengths: [
      "Liderança analítica",
      "Foco em resultados de qualidade",
      "Decisão estruturada",
    ],
    weaknesses: [
      "Perfeccionismo",
      "Tendência a ser crítico",
      "Dificuldade em delegar",
    ],
    color: "bg-red-700",
  },
  {
    profile: "ID",
    description:
      "Você é influente com traços de dominância, comunicativo e assertivo, motivando com energia.",
    strengths: [
      "Persuasão carismática",
      "Iniciativa social",
      "Motivação de equipes",
    ],
    weaknesses: [
      "Impulsividade",
      "Falta de atenção aos detalhes",
      "Desorganização",
    ],
    color: "bg-yellow-500",
  },
  {
    profile: "IS",
    description:
      "Você combina influência com estabilidade, sendo sociável, mas buscando harmonia e colaboração.",
    strengths: ["Habilidade social", "Colaboração amigável", "Empatia"],
    weaknesses: [
      "Evita confrontos",
      "Falta de foco em resultados",
      "Resistência a mudanças",
    ],
    color: "bg-yellow-400",
  },
  {
    profile: "IC",
    description:
      "Você é influente com conformidade, comunicativo, mas atento a detalhes e padrões.",
    strengths: [
      "Comunicação estruturada",
      "Persuasão analítica",
      "Organização social",
    ],
    weaknesses: [
      "Perfeccionismo em apresentações",
      "Indecisão em conflitos",
      "Foco excessivo em detalhes",
    ],
    color: "bg-yellow-700",
  },
  {
    profile: "SD",
    description:
      "Você é estável com traços de dominância, colaborativo, mas capaz de liderar quando necessário.",
    strengths: [
      "Liderança colaborativa",
      "Paciência em conflitos",
      "Estabilidade",
    ],
    weaknesses: [
      "Resistência a mudanças rápidas",
      "Passividade excessiva",
      "Evita riscos",
    ],
    color: "bg-green-500",
  },
  {
    profile: "SI",
    description:
      "Você combina estabilidade com influência, sendo paciente e sociável, promovendo harmonia.",
    strengths: ["Empatia social", "Colaboração harmoniosa", "Escuta ativa"],
    weaknesses: [
      "Falta de assertividade",
      "Evita confrontos",
      "Resistência a mudanças",
    ],
    color: "bg-green-400",
  },
  {
    profile: "SC",
    description:
      "Você é estável com conformidade, valorizando harmonia e precisão em processos estruturados.",
    strengths: [
      "Organização colaborativa",
      "Paciência meticulosa",
      "Foco em qualidade",
    ],
    weaknesses: [
      "Perfeccionismo",
      "Resistência a mudanças",
      "Dificuldade em decidir rapidamente",
    ],
    color: "bg-green-700",
  },
  {
    profile: "CD",
    description:
      "Você combina conformidade com dominância, sendo analítico, mas assertivo na busca por resultados.",
    strengths: [
      "Precisão assertiva",
      "Análise crítica",
      "Foco em resultados estruturados",
    ],
    weaknesses: ["Tendência a ser crítico", "Rigidez", "Impaciência com erros"],
    color: "bg-blue-500",
  },
  {
    profile: "CI",
    description:
      "Você é analítico com influência, combinando atenção aos detalhes com habilidades sociais.",
    strengths: [
      "Comunicação analítica",
      "Persuasão estruturada",
      "Organização",
    ],
    weaknesses: [
      "Perfeccionismo social",
      "Indecisão em conflitos",
      "Foco excessivo em detalhes",
    ],
    color: "bg-blue-400",
  },
  {
    profile: "CS",
    description:
      "Você combina conformidade com estabilidade, sendo meticuloso e buscando harmonia em processos.",
    strengths: [
      "Precisão colaborativa",
      "Paciência analítica",
      "Foco em qualidade",
    ],
    weaknesses: ["Perfeccionismo", "Resistência a mudanças", "Evita riscos"],
    color: "bg-blue-700",
  },
];

async function seedDB() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://valtairnjr:12345@newdisc.t9dj4vz.mongodb.net/disc_test?retryWrites=true&w=majority"
    );
    console.log("Conectado ao MongoDB Atlas");

    await Question.deleteMany({});
    await Profile.deleteMany({});
    console.log("Coleções Question e Profile limpas");

    await Question.insertMany(questions);
    console.log("48 perguntas inseridas com sucesso");

    await Profile.insertMany(profiles);
    console.log("16 perfis pré-cadastrados inseridos com sucesso");

    mongoose.connection.close();
    console.log("Conexão com MongoDB fechada");
  } catch (err) {
    console.error("Erro ao popular o banco:", err);
  }
}

seedDB();
