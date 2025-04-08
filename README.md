# 🛒 Projeto E-commerce em Node.js

Este é um projeto de e-commerce desenvolvido com **Node.js**, **Express**, **MongoDB** e **Handlebars**, utilizando **WebSocket (Socket.IO)** para atualizações em tempo real e **autenticação com Passport** (Login local e via GitHub).

---

## 🚀 Funcionalidades

### 👤 Autenticação
- Registro e login com e-mail e senha
- Login com GitHub OAuth
- Sessões autenticadas com `express-session`
- Middleware de proteção para rotas privadas

### 🛍️ Produtos
- Listagem de produtos com `Handlebars`
- Atualização em tempo real com **Socket.IO**
- Criação, edição e remoção de produtos (via API)
- Adição de produtos ao carrinho com clique em botão

### 🛒 Carrinho de Compras
- Adição de produtos ao carrinho
- Integração com MongoDB via Mongoose
- Persistência de dados

### 💬 WebSocket (Socket.IO)
- Atualizações em tempo real da lista de produtos para todos os usuários conectados

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- Express-session
- Passport + Passport-GitHub
- Handlebars
- Socket.IO
- JavaScript (ES6)

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-projeto.git

# Acesse a pasta do projeto
cd seu-projeto

# Instale as dependências
npm install
```

## 🔧 Configuração
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

```ini
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
SESSION_SECRET=sua_chave_secreta
GITHUB_CLIENT_ID=seu_client_id
GITHUB_CLIENT_SECRET=sua_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/sessions/githubcallback
PORT=3000
```

## ▶️ Como Rodar
```bash
npm start
```
Abra no navegador:
```arduino
http://localhost:3000
```

##📁 Estrutura de Pastas
```csharp
├── config/               # Arquivos de configuração (passport, .env)
├── dao/                  # Acesso a dados
├── data/                 # Mock de dados (se necessário)
├── managers/             # Lógica de manipulação (ex: arquivos, banco)
├── middlewares/          # Middlewares personalizados
├── models/               # Modelos Mongoose (Product, Cart, User)
├── public/               # Arquivos estáticos (JS, CSS, imagens)
├── routes/               # Rotas (auth, sessions, products, carts)
├── views/                # Templates Handlebars
├── app.js                # Arquivo principal da aplicação
└── README.md             # Este arquivo
```

## ✅ Funcionalidades Futuras (Roadmap)

- Sistema de pedidos e histórico de compras
- Pagamento integrado (ex: Stripe ou MercadoPago)
- Dashboard administrativo
- Upload de imagens reais para os produtos

## 👨‍💻 Autor
Desenvolvido por Nathan

## 📝 Licença
Este projeto está licenciado sob a licença MIT.
