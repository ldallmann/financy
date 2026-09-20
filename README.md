# Financy

Aplicação FullStack de gerenciamento de finanças pessoais: cadastro e login de usuários, gestão de **transações** (receitas e despesas) e **categorias**, com dashboard de resumo.

O layout segue o design do Figma do desafio (Style Guide com Inter + Lucide Icons).

## Estrutura

```
financy/
├── backend/   API GraphQL (Node.js + TypeScript + Apollo Server + Prisma + SQLite)
└── frontend/  Aplicação web (React + Vite + TypeScript + Apollo Client + Tailwind CSS)
```

## Requisitos

- Node.js 22+ (LTS)
- npm

## Back-end

```bash
cd backend
npm install
cp .env.example .env        # preencha JWT_SECRET
npm run prisma:migrate      # cria o banco SQLite e aplica as migrations
npm run dev                 # http://localhost:4000/graphql
```

Variáveis de ambiente (`backend/.env.example`):

| Variável       | Descrição                                          |
| -------------- | -------------------------------------------------- |
| `JWT_SECRET`   | Segredo para assinar os tokens JWT (obrigatório)   |
| `DATABASE_URL` | Caminho do SQLite, ex.: `file:./dev.db`            |
| `PORT`         | Porta HTTP (padrão `4000`)                         |
| `CORS_ORIGIN`  | Origem permitida no CORS (padrão: qualquer origem) |

Dados de demonstração (usuário `conta@teste.com` / senha `12345678`, com categorias e transações):

```bash
npm run seed
```

Outros scripts: `npm run build` / `npm start` (produção), `npm run typecheck`, `npm run prisma:studio`.

### API GraphQL

Autenticação via header `Authorization: Bearer <token>`. Todas as consultas e mutações de categorias e transações são restritas ao usuário autenticado.

- **Queries**: `me`, `categories`, `categoriesSummary`, `transactions(filters)`, `recentTransactions(limit)`, `dashboardSummary(month, year)`
- **Mutations**: `register`, `login`, `updateProfile`, `createCategory`, `updateCategory`, `deleteCategory`, `createTransaction`, `updateTransaction`, `deleteTransaction`

Valores monetários trafegam em **centavos** (`Int`) e datas em ISO 8601.

## Front-end

```bash
cd frontend
npm install
cp .env.example .env        # VITE_BACKEND_URL=http://localhost:4000/graphql
npm run dev                 # http://localhost:5173
```

Variáveis de ambiente (`frontend/.env.example`):

| Variável           | Descrição                        |
| ------------------ | -------------------------------- |
| `VITE_BACKEND_URL` | URL do endpoint GraphQL da API   |

Outros scripts: `npm run build`, `npm run preview`, `npm run typecheck`, `npm run lint`.

### Páginas

| Rota          | Descrição                                              |
| ------------- | ------------------------------------------------------ |
| `/`           | Login (deslogado) ou Dashboard (logado)                |
| `/cadastro`   | Criação de conta                                       |
| `/transacoes` | Listagem com busca, filtros, paginação, edição/exclusão |
| `/categorias` | Cards de categorias com resumo, edição/exclusão        |
| `/perfil`     | Dados do usuário, edição do nome e logout              |

Os formulários de **Nova/Editar transação** e **Nova/Editar categoria** abrem em modais (Dialog).

## Tecnologias

**Back-end**: TypeScript, Express, Apollo Server, GraphQL, Prisma, SQLite, Zod, bcryptjs, jsonwebtoken.

**Front-end**: React 19, Vite, TypeScript, Apollo Client, React Router, Tailwind CSS v4, React Hook Form, Zod, Radix UI (Dialog/Select), Lucide Icons, Sonner.

## Checklist do desafio

**Back-end**

- [x] O usuário pode criar uma conta e fazer login
- [x] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [x] Criar, editar, deletar e listar transações
- [x] Criar, editar, deletar e listar categorias
- [x] TypeScript, GraphQL, Prisma e SQLite; CORS habilitado; `.env.example`

**Front-end**

- [x] O usuário pode criar uma conta e fazer login
- [x] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [x] Criar, editar, deletar e listar transações
- [x] Criar, editar, deletar e listar categorias
- [x] React + Vite + TypeScript consumindo a API via GraphQL
- [x] Layout baseado no Figma; `.env.example`
