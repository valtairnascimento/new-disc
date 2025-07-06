const mongoose = require("mongoose");
const LoveQuestion = require("./src/models/loveQuestion");

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

async function seedLoveQuestions() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://valtairnjr:12345@newdisc.t9dj4vz.mongodb.net/disc_test?retryWrites=true&w=majority"
    );
    console.log("Conectado ao MongoDB Atlas");

    await LoveQuestion.deleteMany({});
    console.log("Coleção LoveQuestion limpa");

    await LoveQuestion.insertMany(questions);
    console.log("40 perguntas inseridas com sucesso");

    mongoose.connection.close();
    console.log("Conexão com MongoDB fechada");
  } catch (err) {
    console.error("Erro ao popular perguntas:", err);
  }
}

seedLoveQuestions();
