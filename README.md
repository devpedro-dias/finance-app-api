# API Financeira

Uma API RESTful para gerenciamento financeiro pessoal, desenvolvida com Node.js e Express.js. A API é testada, documentada, conta com autenticação via JWT e realiza operações vinculadas ao usuário autenticado. Utiliza CI/CD com GitHub Actions e deploy automatizado via Render.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** & **Express.js** – Backend e rotas
- **PostgreSQL** – Banco de dados relacional
- **Prisma ORM** – ORM para integração com o banco de dados
- **Docker** – Containerização da aplicação
- **Zod** – Validação de dados
- **JWT (JSON Web Token)** – Autenticação com access e refresh tokens
- **Jest** & **Supertest** – Testes automatizados
- **Swagger** – Documentação interativa da API
- **GitHub Actions** – Integração e entrega contínua (CI/CD)
- **Render** – Deploy automático com Webhook a partir da branch `master`
- **ESLint** & **Prettier** – Padronização e formatação de código
- **Husky** & **lint-staged** – Gatilhos de pré-commit para garantir qualidade de código

---

## 🔐 Autenticação

A autenticação é baseada em JWT:
- **Access Token**: enviado no header `Authorization: Bearer <token>`
- **Refresh Token**: utilizado para renovar o access token

A maioria dos endpoints está vinculada ao usuário logado, utilizando a convenção `/me` para representar operações referentes ao próprio usuário.

---

## 📦 Endpoints Principais

- `POST /api/auth/login` – Autenticação do usuário
- `POST /api/auth/refresh-token` – Gera um novo access token
- `GET /api/users/me` – Retorna os dados do usuário autenticado
- `POST /api/users` – Cria um novo usuário
- `PATCH /api/users/me` – Atualiza dados do usuário autenticado
- `DELETE /api/users` – Deleta o usuário autenticado
- `GET /api/users/balance/me` – Retorna o saldo do usuário autenticado
- `GET /api/transactions/me` – Lista transações do usuário autenticado
- `POST /api/transactions/me` – Cria uma nova transação
- `PATCH /api/transactions/me/:transactionId` – Atualiza uma transação existente
- `DELETE /api/transactions/me/:transactionId` – Deleta uma transação vinculada ao usuário autenticado

> A documentação interativa com os endpoints pode ser acessada via Swagger, [clique aqui](https://finance-app-api-dsks.onrender.com/docs/) ou no link anexado ao repositório.

---
