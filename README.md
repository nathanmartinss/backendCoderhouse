# 🛒 Projeto E-commerce da Coderhouse

Este é um projeto de e-commerce completo desenvolvido com **Node.js**, **Express**, **MongoDB** e **Handlebars**, integrando **WebSocket (Socket.IO)** para atualizações em tempo real, **Passport** para autenticação (local e via GitHub), e **Swagger** para documentação da API.

---

## 🚀 Funcionalidades

### 👤 Autenticação
- Registro e login com e-mail e senha
- Login via GitHub OAuth com passport-github2
- Sessões com express-session
- Middleware de proteção para rotas privadas

### 🛍️ Produtos
- Listagem dinâmica de produtos com Handlebars
- Atualização em tempo real via Socket.IO
- Criação, edição e exclusão de produtos via API REST
- Adição de produtos ao carrinho diretamente da interface

### 🛒 Carrinho de Compras

- Criação e recuperação de carrinhos
- Adição e remoção de produtos no carrinho
- Persistência de carrinhos no MongoDB
- Processo de compra com verificação de estoque
- Geração de Ticket com valor total e e-mail do comprador
- Produtos sem estoque permanecem no carrinho

### 📄 Swagger (Documentação de API)
- Documentação interativa disponível em /api-docs
- Inclui rotas de autenticação, produtos, carrinho, mocking, etc.

### 📦 Logger
- Middleware personalizado de logger via winston
- Logs formatados com níveis: info, warn, error, etc.
- Rota especial /loggerTest para teste de log em diferentes níveis
- Logger global disponível via req.logger

### 💬 WebSocket (Socket.IO)
- Atualização em tempo real da lista de produtos para todos os clientes conectados
- Emissão automática após alteração em produtos

---

## 🛠️ Tecnologias Utilizadas

- Node.js / Express.js
- MongoDB com Mongoose
- Handlebars (engine de templates)
- Socket.IO
- Passport.js + GitHub OAuth
- Swagger (swagger-ui-express)
- Winston (Logger)
- dotenv para variáveis de ambiente

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

## 📁 Estrutura de Pastas
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
