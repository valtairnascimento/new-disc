const mongoose = require("mongoose");
const LoveQuestion = require("./src/models/loveQuestion");
const LoveProfile = require("./src/models/loveProfile");

const questions = [
  // Palavras de Afirmação - 8 perguntas
  { text: "Gosto de receber elogios ou palavras de carinho.", type: "Words" },
  {
    text: "Aprecio quando alguém me diz o quanto sou importante.",
    type: "Words",
  },
  { text: "Uma mensagem carinhosa me faz sentir amado.", type: "Words" },
  { text: "Ouvir 'eu te amo' é muito importante para mim.", type: "Words" },
  {
    text: "Palavras de encorajamento me motivam profundamente.",
    type: "Words",
  },
  { text: "Gosto quando alguém expressa gratidão por mim.", type: "Words" },
  { text: "Elogios sinceros me fazem sentir valorizado.", type: "Words" },
  {
    text: "Mensagens escritas com afeto me tocam profundamente.",
    type: "Words",
  },

  // Atos de Serviço - 8 perguntas
  {
    text: "Prefiro quando alguém faz algo útil por mim, como cozinhar.",
    type: "Acts",
  },
  { text: "Aprecio quando alguém me ajuda com uma tarefa.", type: "Acts" },
  {
    text: "Sinto-me amado quando alguém resolve um problema por mim.",
    type: "Acts",
  },
  {
    text: "Gosto quando alguém faz algo prático para me ajudar.",
    type: "Acts",
  },
  { text: "Ações como arrumar a casa me fazem sentir amado.", type: "Acts" },
  {
    text: "Gosto quando alguém se oferece para fazer algo por mim.",
    type: "Acts",
  },
  {
    text: "Aprecio quando alguém assume uma responsabilidade por mim.",
    type: "Acts",
  },
  {
    text: "Sinto-me valorizado quando alguém me ajuda sem eu pedir.",
    type: "Acts",
  },

  // Receber Presentes - 8 perguntas
  { text: "Receber um presente me faz sentir especial.", type: "Gifts" },
  {
    text: "Um presente pensado com carinho significa muito para mim.",
    type: "Gifts",
  },
  { text: "Gosto de receber pequenos gestos de presente.", type: "Gifts" },
  { text: "Um presente surpresa me deixa muito feliz.", type: "Gifts" },
  {
    text: "Aprecio quando alguém me dá algo que reflete meus gostos.",
    type: "Gifts",
  },
  { text: "Presentes simbólicos me fazem sentir amado.", type: "Gifts" },
  {
    text: "Gosto de receber algo que mostra que pensaram em mim.",
    type: "Gifts",
  },
  { text: "Um presente, mesmo simples, me deixa emocionado.", type: "Gifts" },

  // Tempo de Qualidade - 8 perguntas
  {
    text: "Passar tempo de qualidade com alguém é o que mais valorizo.",
    type: "Time",
  },
  {
    text: "Gosto de compartilhar momentos sem distrações com quem amo.",
    type: "Time",
  },
  {
    text: "Sinto-me amado quando alguém dedica tempo só para mim.",
    type: "Time",
  },
  { text: "Planejar um momento especial juntos me faz feliz.", type: "Time" },
  {
    text: "Conversas profundas com alguém próximo me fazem sentir amado.",
    type: "Time",
  },
  {
    text: "Gosto de atividades compartilhadas, como passeios ou hobbies.",
    type: "Time",
  },
  {
    text: "Sinto-me valorizado quando alguém prioriza estar comigo.",
    type: "Time",
  },
  { text: "Aprecio momentos de conexão sem pressa.", type: "Time" },

  // Toque Físico - 8 perguntas
  { text: "Abraços e toques físicos me fazem sentir amado.", type: "Touch" },
  {
    text: "Gosto de demonstrações físicas de carinho, como segurar mãos.",
    type: "Touch",
  },
  {
    text: "Sinto-me mais próximo com contato físico frequente.",
    type: "Touch",
  },
  { text: "Um abraço caloroso me faz sentir valorizado.", type: "Touch" },
  {
    text: "Gosto de toques gentis, como um carinho nas costas.",
    type: "Touch",
  },
  {
    text: "Sinto-me amado quando alguém me toca de forma afetuosa.",
    type: "Touch",
  },
  { text: "Beijos e abraços são muito importantes para mim.", type: "Touch" },
  { text: "O contato físico me faz sentir mais conectado.", type: "Touch" },
];

const profiles = [
  {
    profile: "Words",
    description:
      "Você valoriza palavras gentis, elogios e mensagens carinhosas.",
    color: "bg-purple-600",
  },
  {
    profile: "Acts",
    description: "Você se sente amado quando alguém faz algo útil por você.",
    color: "bg-blue-600",
  },
  {
    profile: "Gifts",
    description: "Presentes, mesmo simples, são símbolos importantes de afeto.",
    color: "bg-pink-600",
  },
  {
    profile: "Time",
    description: "Passar momentos significativos juntos é o que mais importa.",
    color: "bg-green-600",
  },
  {
    profile: "Touch",
    description: "Toques físicos, como abraços, fazem você se sentir amado.",
    color: "bg-red-600",
  },
  {
    profile: "Acts/Gifts",
    description: "Você aprecia ações práticas e presentes como formas de amor.",
    color: "bg-blue-500",
  },
  {
    profile: "Acts/Time",
    description: "Você valoriza ações úteis e momentos compartilhados.",
    color: "bg-blue-400",
  },
  {
    profile: "Acts/Touch",
    description: "Você se sente amado por ações práticas e contato físico.",
    color: "bg-blue-700",
  },
  {
    profile: "Acts/Words",
    description: "Você aprecia ações úteis e palavras de carinho.",
    color: "bg-blue-300",
  },
  {
    profile: "Gifts/Acts",
    description:
      "Presentes e ações práticas são suas formas preferidas de amor.",
    color: "bg-pink-500",
  },
  {
    profile: "Gifts/Time",
    description: "Você valoriza presentes e tempo de qualidade juntos.",
    color: "bg-pink-400",
  },
  {
    profile: "Gifts/Touch",
    description: "Presentes e toques físicos são significativos para você.",
    color: "bg-pink-700",
  },
  {
    profile: "Gifts/Words",
    description: "Você aprecia presentes e palavras de afirmação.",
    color: "bg-pink-300",
  },
  {
    profile: "Time/Acts",
    description: "Tempo de qualidade e ações práticas são suas preferências.",
    color: "bg-green-500",
  },
  {
    profile: "Time/Gifts",
    description: "Você valoriza tempo compartilhado e presentes.",
    color: "bg-green-400",
  },
  {
    profile: "Time/Touch",
    description:
      "Tempo de qualidade e toques físicos são importantes para você.",
    color: "bg-green-700",
  },
  {
    profile: "Time/Words",
    description: "Você aprecia tempo juntos e palavras de carinho.",
    color: "bg-green-300",
  },
  {
    profile: "Touch/Acts",
    description: "Toques físicos e ações práticas fazem você se sentir amado.",
    color: "bg-red-500",
  },
  {
    profile: "Touch/Gifts",
    description: "Você valoriza toques físicos e presentes.",
    color: "bg-red-400",
  },
  {
    profile: "Touch/Time",
    description: "Toques físicos e tempo de qualidade são suas preferências.",
    color: "bg-red-700",
  },
  {
    profile: "Touch/Words",
    description: "Você aprecia toques físicos e palavras de afirmação.",
    color: "bg-red-300",
  },
];

async function seedLoveData() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://valtairnjr:12345@newdisc.t9dj4vz.mongodb.net/disc_test?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Conectado ao MongoDB Atlas");

    // Validar perguntas
    const types = ["Words", "Acts", "Gifts", "Time", "Touch"];
    const questionsByType = questions.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {});
    console.log("Contagem de perguntas por tipo:", questionsByType);

    for (const type of types) {
      if (questionsByType[type] !== 8) {
        throw new Error(
          `Número inválido de perguntas para o tipo ${type}: esperado 8, encontrado ${questionsByType[type]}`
        );
      }
    }

    // Validar perfis
    const expectedProfiles = 21;
    if (profiles.length !== expectedProfiles) {
      throw new Error(
        `Número inválido de perfis: esperado ${expectedProfiles}, encontrado ${profiles.length}`
      );
    }

    // Limpar coleções
    await LoveQuestion.deleteMany({});
    console.log("Coleção LoveQuestion limpa");
    await LoveProfile.deleteMany({});
    console.log("Coleção LoveProfile limpa");

    // Inserir perguntas e perfis
    const insertedQuestions = await LoveQuestion.insertMany(questions);
    console.log(`Inseridas ${insertedQuestions.length} perguntas com sucesso`);
    const insertedProfiles = await LoveProfile.insertMany(profiles);
    console.log(`Inseridos ${insertedProfiles.length} perfis com sucesso`);

    // Verificar inserções
    const questionCountByType = await LoveQuestion.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);
    console.log("Verificação de perguntas após inserção:", questionCountByType);

    const profileCount = await LoveProfile.countDocuments();
    console.log("Verificação de perfis após inserção:", {
      totalProfiles: profileCount,
    });

    // Fechar a conexão
    await mongoose.connection.close();
    console.log("Conexão com MongoDB fechada");
  } catch (err) {
    console.error("Erro ao popular dados:", {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
}

seedLoveData();
