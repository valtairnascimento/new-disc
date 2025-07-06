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
    description: "Você é dominante, confiante e orientado a resultados.",
    strengths: ["Liderança", "Decisão rápida"],
    weaknesses: ["Impaciência", "Falta de empatia"],
  },
  {
    profile: "I",
    description: "Você é influente, carismático e comunicativo.",
    strengths: ["Persuasão", "Entusiasmo"],
    weaknesses: ["Falta de foco", "Impulsividade"],
  },
  {
    profile: "S",
    description: "Você é estável, paciente e colaborativo.",
    strengths: ["Empatia", "Consistência"],
    weaknesses: ["Resistência a mudanças", "Passividade"],
  },
  {
    profile: "C",
    description: "Você é analítico, detalhista e meticuloso.",
    strengths: ["Precisão", "Organização"],
    weaknesses: ["Perfeccionismo", "Rigidez"],
  },
  // Adicione mais perfis conforme necessário
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
    console.log("Perfis pré-cadastrados inseridos com sucesso");

    mongoose.connection.close();
    console.log("Conexão com MongoDB fechada");
  } catch (err) {
    console.error("Erro ao popular o banco:", err);
  }
}

seedDB();
