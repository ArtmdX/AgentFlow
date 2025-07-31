# 🛫 AgentFlow CRM

**Sistema de CRM especializado para Agências de Viagens**

![Status](https://img.shields.io/badge/Status-MVP%20Development-yellow) ![Version](https://img.shields.io/badge/Version-0.1.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎯 Sobre o Projeto

O **AgentFlow** é um CRM desenvolvido especificamente para agências de viagens, focando na gestão eficiente de clientes, cotações e vendas. O sistema visa otimizar o fluxo de trabalho dos agentes e melhorar o acompanhamento de todo o processo de venda.

### ✨ Principais Funcionalidades

- 👥 **Gestão de Clientes** - Cadastro completo com histórico
- ✈️ **Controle de Viagens** - Cotações, status e acompanhamento
- 👤 **Múltiplos Usuários** - Controle de acesso por perfil
- 📊 **Dashboard Intuitivo** - Métricas e KPIs importantes
- 📱 **Interface Responsiva** - Funciona em desktop e mobile
- 🔐 **Autenticação Segura** - Login e controle de sessão

---

## 🛠️ Stack Tecnológica

### Frontend & Backend

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui

### Banco de Dados

- **Database:** PostgreSQL
- **ORM:** Prisma
- **Migrations:** Prisma Migrate

### Autenticação

- **Auth:** NextAuth.js v5
- **Provider:** Credentials + JWT

### Deploy & Infraestrutura

- **Frontend:** Vercel
- **Database:** Neon
- **Storage:** Vercel Blob

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- pnpm/npm/yarn

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/agentflow-crm.git
cd agentflow-crm
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env.local
```

Edite o `env.example` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agentflow"

# NextAuth
NEXTAUTH_SECRET="seu-secret-super-seguro"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Configure o banco de dados**

```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate dev

# Seed inicial (opcional)
npx prisma db seed
```

5. **Execute o projeto**

```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## 🗄️ Modelo de Dados

### Principais Entidades

- **Users** - Agentes e administradores
- **Customers** - Clientes da agência
- **Travels** - Viagens e cotações
- **Passengers** - Passageiros de cada viagem
- **Activities** - Log de atividades
- **Payments** - Controle de pagamentos

### Relacionamentos

- User → Travels (1:N)
- Customer → Travels (1:N)
- Travel → Passengers (1:N)
- Travel → Activities (1:N)
- Travel → Payments (1:N)

---

## 🎨 Design System

### Cores Principais

- **Primary:** Blue (#3B82F6)
- **Secondary:** Slate (#64748B)
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Error:** Red (#EF4444)

### Componentes Base

- Baseado no **Shadcn/ui**
- **Tailwind CSS** para customizações
- **Lucide Icons** para ícones
- **Radix UI** como base dos componentes

---

## 📋 Roadmap MVP

### ✅ Fase 1 - Fundação

- [x] Setup do projeto
- [x] Autenticação básica
- [x] Layout principal

### 🚧 Fase 2 - Core Features (Em andamento)

- [x] CRUD de clientes
- [x] CRUD de viagens
- [x] Dashboard básico

### 📅 Fase 3 - Polish

- [ ] Interface responsiva
- [ ] Relatórios básicos
- [ ] Testes e correções

### 🔮 Futuro (Pós-MVP)

- [ ] Integrações com APIs
- [ ] Notificações por email
- [ ] App mobile
- [ ] Relatórios avançados

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 📦 Deploy

### Vercel (Recomendado)

```bash
# Deploy automático via Git
git push origin main
```

### Manual

```bash
# Build do projeto
npm run build

# Deploy
vercel --prod
```

---

## 🤝 Contribuição

Este é um projeto pessoal/comercial. Para sugestões:

1. Abra uma **Issue** descrevendo o problema/sugestão
2. Para bugs críticos, entre em contato direto

---

## 📄 Licença

Este projeto está sob a licença **MIT**.

---

## 👨‍💻 Autor

**Seu Nome**

- LinkedIn: Arthur Mauricio https://www.linkedin.com/in/arthur-mauricio-214a5323a/
- Email: arthur.mdx1234@gmail.com

---

## 📞 Suporte

Para dúvidas e suporte:

- 📧 Email: arthur.mdx1234@gmail.com
- 💬 WhatsApp: (61)98662-4064
- 📋 Issues: [GitHub Issues](https://github.com/artmdx/agentflow/issues)

---

<div align="center">

**Feito com ❤️ para agilizar o trabalho de agentes de viagem**

[⬆ Voltar ao topo](#-agentflow-crm)

</div>
