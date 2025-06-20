DISC Personality Test Backend
Backend para teste de personalidade DISC, com perguntas, cálculo de perfil e descrições pré-cadastradas.
Pré-requisitos

Node.js (v16 ou superior)
MongoDB (local ou Atlas)
npm

Instalação

Crie a estrutura de pastas e copie os arquivos fornecidos.
Instale as dependências:npm install

Crie um arquivo .env na raiz com:MONGO_URI=mongodb://localhost:27017/disc_test
PORT=3000

Inicie o servidor:npm start

Uso

Acesse a documentação da API em http://localhost:3000/api-docs.
Endpoints:
GET /api/disc/questions: Retorna 24 perguntas.
POST /api/disc/submit: Envia respostas e recebe o perfil DISC com descrição.

Inserir Dados
Perguntas
Insira 24 perguntas (6 por traço) no MongoDB:
db.questions.insertMany([
{ text: "Eu tomo decisões rapidamente", type: "D" },
{ text: "Eu me comunico com entusiasmo", type: "I" },
{ text: "Eu prefiro rotinas previsíveis", type: "S" },
{ text: "Eu analiso detalhes antes de decidir", type: "C" },
// Adicione mais 20 perguntas
]);

Perfis
Insira perfis pré-cadastrados:
db.profiles.insertMany([
{
profile: "D",
description: "Você é assertivo, orientado a resultados e gosta de desafios.",
strengths: ["Liderança", "Decisão rápida"],
weaknesses: ["Impaciência", "Foco excessivo em resultados"]
},
{
profile: "DI",
description: "Você combina liderança com entusiasmo, inspirando equipes.",
strengths: ["Motivação", "Carisma"],
weaknesses: ["Impulsividade", "Falta de foco em detalhes"]
},
// Adicione outros perfis
]);

Como Funciona

O front-end solicita perguntas via GET /api/disc/questions.
O usuário responde 24 perguntas em uma escala de 1 a 5.
O front-end envia respostas via POST /api/disc/submit.
O backend calcula o perfil (primário ou combinado), busca a descrição e salva o resultado.
O resultado é retornado com perfil, pontuações e descrição.

Contribuindo

Faça um fork do repositório.
Crie uma branch: git checkout -b minha-feature.
Commit suas mudanças: git commit -m 'Adiciona feature'.
Push para a branch: git push origin minha-feature.
Abra um Pull Request.
