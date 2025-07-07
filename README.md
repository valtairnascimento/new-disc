# 💖 Teste DISC e Linguagens do Amor - API

Backend completo para testes de personalidade:

- 🧠 **DISC** (Dominância, Influência, Estabilidade, Conformidade)
- 💌 **Linguagens do Amor** (Palavras, Toque, Presentes, Tempo, Serviços)

Inclui perguntas, cálculo de perfil e descrições personalizadas.  
API documentada com Swagger.

---

## 🚀 Pré-requisitos

- [Node.js](https://nodejs.org/) `v16` ou superior
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)
- [npm](https://www.npmjs.com/)

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/disc-backend.git
cd disc-backend

# Instale as dependências
npm install
```

Crie um arquivo `.env` na raiz com:

```env
MONGO_URI=mongodb://localhost:27017/disc_test
PORT=5000
```

Inicie o servidor:

```bash
npm start
```

---

## 📡 Uso da API

Acesse a documentação da API via Swagger:  
📄 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### Endpoints principais:

- `GET /api/disc/questions` – Retorna 24 perguntas do DISC
- `POST /api/disc/submit` – Envia respostas DISC e retorna perfil
- `GET /api/love/questions` – Retorna perguntas das Linguagens do Amor
- `POST /api/love/submit` – Retorna linguagem predominante com descrição

---

## 📝 Inserindo Dados

### 🧠 Perguntas do DISC

Insira 24 perguntas (6 para cada traço: D, I, S, C):

```js
db.questions.insertMany([
  { text: "Eu tomo decisões rapidamente", type: "D" },
  { text: "Eu me comunico com entusiasmo", type: "I" },
  { text: "Eu prefiro rotinas previsíveis", type: "S" },
  { text: "Eu analiso detalhes antes de decidir", type: "C" },
  // ...mais 20 perguntas
]);
```

### 💌 Perguntas das Linguagens do Amor

Insira perguntas que identificam a linguagem predominante:

```js
db.loveQuestions.insertMany([
  {
    text: "Sinto-me amado quando recebo elogios sinceros.",
    type: "Palavras de Afirmação",
  },
  { text: "Prefiro estar abraçado a alguém que amo.", type: "Toque Físico" },
  {
    text: "Fico tocado quando alguém me dá um presente sem motivo.",
    type: "Presentes",
  },
  {
    text: "Gosto quando passam tempo comigo, sem distrações.",
    type: "Tempo de Qualidade",
  },
  {
    text: "Aprecio quando alguém me ajuda com tarefas do dia a dia.",
    type: "Atos de Serviço",
  },
  // ...adicione mais perguntas balanceadas
]);
```

---

## 📊 Como Funciona

### Teste DISC:

1. Front-end consome `GET /api/disc/questions`
2. Usuário responde 24 questões (escala de 1 a 5)
3. Respostas enviadas via `POST /api/disc/submit`
4. Backend calcula o perfil primário ou composto
5. Resultado retorna com pontuação, descrição e características

### Teste Linguagens do Amor:

1. Front-end consome `GET /api/love/questions`
2. Usuário responde identificando o que mais representa seu amor
3. Respostas enviadas via `POST /api/love/submit`
4. Backend retorna linguagem predominante com descrição

---

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma nova branch:
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas mudanças:
   ```bash
   git commit -m "Adiciona minha feature"
   ```
4. Push para sua branch:
   ```bash
   git push origin minha-feature
   ```
5. Abra um **Pull Request**

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

## 💡 Sobre

Este backend foi desenvolvido para fornecer testes comportamentais e emocionais com base em metodologias reconhecidas:

- **DISC** – utilizado em recrutamento, coaching e autoconhecimento
- **Linguagens do Amor** – baseado no modelo de Gary Chapman para melhorar relacionamentos
