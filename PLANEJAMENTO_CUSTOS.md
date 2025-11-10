# Planejamento de Custos - AgentFlow CRM

**Desenvolvedor:** Arthur Mauricio Malizia Davi
**Período:** Julho a Dezembro de 2025 (6 meses)

---

## Sumário Executivo

Este documento apresenta o planejamento de custos para o desenvolvimento do **AgentFlow**, sistema CRM especializado para gestão de agências de viagens, desenvolvido como Projeto Integrador.

**Investimento Total:** R$ 19.435,00

| Categoria                    | Valor           |
| ---------------------------- | --------------- |
| Desenvolvimento (240 horas)  | R$ 19.200,00    |
| Infraestrutura (Após 6 meses)| R$ 235,00       |
| **TOTAL**                    | **R$ 19.435,00**|

---

## 1. Escopo Funcional do Projeto

### 1.1 Módulos Implementados

O sistema possui 8 módulos principais:

1. **Autenticação e Autorização**
   - Login/registro com NextAuth.js
   - Controle de permissões por roles (admin, agent, manager)
   - Recuperação de senha
   - Sessões JWT

2. **Gestão de Clientes**
   - CRUD completo
   - Validação de CPF/CNPJ/Passaporte
   - Integração com API ViaCEP
   - Histórico de atividades

3. **Gestão de Viagens**
   - CRUD com vinculação a clientes
   - Controle de status (orçamento → finalizada)
   - Gestão de datas e destinos
   - Suporte a viagens nacionais e internacionais
   - Autocomplete de cidades brasileiras

4. **Gestão de Passageiros**
   - Cadastro por viagem
   - Validação de documentos
   - Identificação de passageiro principal

5. **Sistema de Pagamentos**
   - CRUD de pagamentos
   - Múltiplas moedas (BRL, USD, EUR, ARS)
   - Métodos variados (cartão, PIX, transferência, dinheiro, cheque)
   - Timeline de pagamentos
   - Dashboard com estatísticas
   - Cálculo automático de status da viagem

6. **Dashboard e Relatórios**
   - Estatísticas em tempo real
   - Gráficos de desempenho
   - Filtros avançados
   - Métricas de vendas

7. **Gestão de Usuários**
   - Perfil de usuário
   - CRUD de usuários (admin)
   - Controle de acesso por roles

8. **Sistema de Auditoria**
   - Log de atividades
   - Rastreamento de alterações
   - Histórico completo por entidade

### 1.2 Stack Tecnológico

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Lucide React (ícones)

**Backend:**
- Next.js API Routes
- Prisma ORM 6
- PostgreSQL
- NextAuth.js 4

**DevOps:**
- Vercel (hosting)
- Neon (database)
- GitHub (versionamento)
- GitHub Actions (CI/CD)
- Docker (desenvolvimento local)

**Qualidade:**
- TypeScript (type safety)
- Zod (validações)
- React Hook Form (formulários)
- ESLint (linting)

---

## 2. Custos de Desenvolvimento

### 2.1 Estimativa de Horas por Módulo

| Módulo                         | Horas  | Valor        |
| ------------------------------ | ------ | ------------ |
| **Infraestrutura e Setup**     | 11h    | R$ 880,00    |
| - Next.js 15 + TypeScript      | 2h     |              |
| - Prisma + PostgreSQL          | 2h     |              |
| - Docker                       | 1h     |              |
| - NextAuth.js                  | 3h     |              |
| - Arquitetura do projeto       | 2h     |              |
|                                |        |              |
| **Autenticação e Autorização** | 21h    | R$ 1.680,00  |
| - Sistema de login/registro    | 5h     |              |
| - Controle de permissões       | 6h     |              |
| - Middleware de autenticação   | 4h     |              |
| - Recuperação de senha         | 5h     |              |
|                                |        |              |
| **Gestão de Clientes**         | 16h    | R$ 1.280,00  |
| - CRUD completo                | 6h     |              |
| - Formulários e validações     | 4h     |              |
| - Listagem e filtros           | 3h     |              |
| - Integração ViaCEP            | 2h     |              |
|                                |        |              |
| **Gestão de Viagens**          | 27h    | R$ 2.160,00  |
| - CRUD de viagens              | 9h     |              |
| - Sistema de status            | 4h     |              |
| - Filtros avançados            | 4h     |              |
| - Relacionamentos complexos    | 6h     |              |
| - Cálculos e validações        | 3h     |              |
|                                |        |              |
| **Gestão de Passageiros**      | 11h    | R$ 880,00    |
| - CRUD de passageiros          | 5h     |              |
| - Validações de documentos     | 3h     |              |
| - Interface de gestão          | 2h     |              |
|                                |        |              |
| **Sistema de Pagamentos**      | 32h    | R$ 2.560,00  |
| - CRUD de pagamentos           | 9h     |              |
| - Sistema multi-moeda          | 6h     |              |
| - Cálculos automáticos         | 5h     |              |
| - Dashboard de pagamentos      | 6h     |              |
| - Timeline e histórico         | 5h     |              |
|                                |        |              |
| **Dashboard e Relatórios**     | 19h    | R$ 1.520,00  |
| - Dashboard principal          | 6h     |              |
| - Estatísticas e métricas      | 5h     |              |
| - Gráficos e visualizações     | 4h     |              |
| - Filtros e exportação         | 3h     |              |
|                                |        |              |
| **Sistema de Auditoria**       | 8h     | R$ 640,00    |
| - Log de atividades            | 4h     |              |
| - Rastreamento de mudanças     | 4h     |              |
|                                |        |              |
| **UI/UX e Componentes**        | 24h    | R$ 1.920,00  |
| - Design system custom         | 6h     |              |
| - Componentes reutilizáveis    | 9h     |              |
| - Responsividade               | 5h     |              |
| - Acessibilidade               | 4h     |              |
|                                |        |              |
| **Integração e APIs**          | 13h    | R$ 1.040,00  |
| - Endpoints REST               | 6h     |              |
| - Validação de dados           | 3h     |              |
| - Tratamento de erros          | 4h     |              |
|                                |        |              |
| **Banco de Dados**             | 16h    | R$ 1.280,00  |
| - Modelagem e schema           | 5h     |              |
| - Migrations                   | 3h     |              |
| - Seeds e dados iniciais       | 2h     |              |
| - Otimizações e índices        | 3h     |              |
| - Queries complexas            | 2h     |              |
|                                |        |              |
| **Testes e QA**                | 21h    | R$ 1.680,00  |
| - Testes de funcionalidade     | 9h     |              |
| - Testes de integração         | 6h     |              |
| - Correção de bugs             | 6h     |              |
|                                |        |              |
| **Documentação**               | 11h    | R$ 880,00    |
| - Documentação técnica         | 4h     |              |
| - CLAUDE.md e guias            | 2h     |              |
| - README e setup               | 2h     |              |
| - Comentários no código        | 2h     |              |
|                                |        |              |
| **Deploy e DevOps**            | 11h    | R$ 880,00    |
| - Configuração de produção     | 4h     |              |
| - CI/CD com GitHub Actions     | 3h     |              |
| - Otimizações finais           | 3h     |              |
|                                |        |              |
| **TOTAL**                      | **240h** | **R$ 19.200,00** |

### 2.2 Cálculo de Custos

| Item                               | Detalhamento     | Valor            |
| ---------------------------------- | ---------------- | ---------------- |
| **Horas Totais**                   | 240 horas        |                  |
| **Valor por Hora**                 | R$ 80,00/h       |                  |
| **Custo Total de Desenvolvimento** | 240h × R$ 80,00  | **R$ 19.200,00** |

**Distribuição Mensal:**
- 40 horas/mês
- R$ 3.200,00/mês
- 6 meses (julho a dezembro 2025)

### 2.3 Ferramentas Utilizadas

Todas as ferramentas de desenvolvimento são gratuitas:

| Ferramenta         | Tipo           | Custo       |
| ------------------ | -------------- | ----------- |
| GitHub             | Versionamento  | R$ 0,00     |
| VS Code            | IDE            | R$ 0,00     |
| Figma              | Design         | R$ 0,00     |
| Docker             | Containers     | R$ 0,00     |
| PostgreSQL (local) | Banco de dados | R$ 0,00     |
| **TOTAL**          |                | **R$ 0,00** |

---

## 3. Custos de Infraestrutura

### 3.1 Infraestrutura de Produção

Configuração: **Vercel Pro + Neon Scale**

| Serviço             | Especificação          | Custo Mensal (USD) | Custo Mensal (BRL) |
| ------------------- | ---------------------- | ------------------ | ------------------ |
| **Vercel Pro**      | Build time ilimitado   | $20                | R$ 100,00          |
|                     | 100GB bandwidth        |                    |                    |
|                     | Deploy automático      |                    |                    |
|                     | SSL incluso            |                    |                    |
|                     | CDN global             |                    |                    |
| **Neon Scale**      | 10GB storage           | $19                | R$ 95,00           |
|                     | Autoscaling            |                    |                    |
|                     | Backups automáticos    |                    |                    |
|                     | Point-in-time recovery |                    |                    |
| **Domínio .com.br** | Registro anual         | -                  | R$ 3,33            |
| **TOTAL MENSAL**    |                        | **$39**            | **R$ 198,33**      |

**Câmbio utilizado:** US$ 1,00 = R$ 5,00

### 3.2 Estratégia de Custos

**Durante desenvolvimento (meses 1-5):**
- Vercel Hobby (gratuito)
- Neon Free (gratuito)
- Desenvolvimento local com Docker
- **Custo:** R$ 0,00/mês

**Produção (mês 6):**
- Upgrade para Vercel Pro
- Upgrade para Neon Scale
- Registro de domínio
- **Custo:** R$ 235,00

### 3.3 Total de Infraestrutura

| Item                      | Custo         |
| ------------------------- | ------------- |
| Desenvolvimento (5 meses) | R$ 0,00       |
| Produção (1 mês)          | R$ 195,00     |
| Domínio .com.br           | R$ 40,00      |
| **TOTAL 6 MESES**         | **R$ 235,00** |

---

## 4. Cronograma de Desenvolvimento

### 4.1 Distribuição Temporal

| Mês             | Módulos                                | Horas   | Custo Dev      | Custo Infra | Total Mensal   |
| --------------- | -------------------------------------- | ------- | -------------- | ----------- | -------------- |
| **Mês 1 (Jul)** | Setup + Autenticação + Database        | 48h     | R$ 3.840,00    | R$ 0,00     | R$ 3.840,00    |
| **Mês 2 (Ago)** | Clientes + Viagens (parte 1)           | 40h     | R$ 3.200,00    | R$ 0,00     | R$ 3.200,00    |
| **Mês 3 (Set)** | Viagens (parte 2) + Passageiros + APIs | 40h     | R$ 3.200,00    | R$ 0,00     | R$ 3.200,00    |
| **Mês 4 (Out)** | Sistema de Pagamentos                  | 40h     | R$ 3.200,00    | R$ 0,00     | R$ 3.200,00    |
| **Mês 5 (Nov)** | Dashboard + Auditoria + UI/UX          | 43h     | R$ 3.440,00    | R$ 0,00     | R$ 3.440,00    |
| **Mês 6 (Dez)** | Testes + Documentação + Deploy         | 29h     | R$ 2.320,00    | R$ 235,00   | R$ 2.555,00    |
| **TOTAL**       |                                        | **240h**| **R$ 19.200,00**| **R$ 235,00**| **R$ 19.435,00**|

### 4.2 Marcos do Projeto

| Data  | Marco              | Entregável                                   |
| ----- | ------------------ | -------------------------------------------- |
| 31/07 | Fundação           | Autenticação funcional + DB configurado      |
| 31/08 | CRUD Principal     | Clientes e Viagens operacionais              |
| 30/09 | Módulos Completos  | Passageiros integrados + APIs                |
| 31/10 | Sistema Financeiro | Pagamentos com dashboard                     |
| 30/11 | Interface Final    | Dashboard completo + Auditoria               |
| 31/12 | Entrega            | Sistema testado e documentado em produção    |

---

## 5. Investimento Total

### 5.1 Resumo Financeiro

| Categoria                  | Valor            | % do Total |
| -------------------------- | ---------------- | ---------- |
| Desenvolvimento (240h)     | R$ 19.200,00     | 98,8%      |
| Infraestrutura (6 meses)   | R$ 235,00        | 1,2%       |
| **INVESTIMENTO TOTAL**     | **R$ 19.435,00** | **100%**   |

### 5.2 Distribuição Temporal

| Período                        | Valor            |
| ------------------------------ | ---------------- |
| Meses 1-5 (Desenvolvimento)    | R$ 16.880,00     |
| Mês 6 (Finalização + Produção) | R$ 2.555,00      |
| **TOTAL**                      | **R$ 19.435,00** |

### 5.3 Custo Médio Mensal

- **Custo médio:** R$ 3.239,17/mês
- **Maior investimento:** Mês 1 (R$ 3.840,00)
- **Menor investimento:** Mês 6 (R$ 2.555,00)

---

## 6. Análise Comparativa

### 6.1 Projeto Acadêmico vs. Mercado

| Aspecto        | Projeto Integrador | Desenvolvimento Comercial |
| -------------- | ------------------ | ------------------------- |
| Investimento   | R$ 19.435,00       | R$ 240.000 - R$ 400.000   |
| Prazo          | 6 meses            | 6-12 meses                |
| Equipe         | 1 desenvolvedor    | 3-5 profissionais         |
| Horas totais   | 240 horas          | 2000-4000 horas           |
| Infraestrutura | R$ 235,00          | R$ 7.200 - R$ 14.400      |
| Valor/hora     | R$ 80,00           | R$ 120 - R$ 250           |

**Diferença:** O projeto acadêmico representa aproximadamente 5-8% do custo de um projeto comercial equivalente.

### 6.2 Competências Desenvolvidas

**Técnicas:**
- Full-stack development (Next.js, React, Node.js)
- Banco de dados (PostgreSQL, Prisma ORM)
- TypeScript avançado
- Autenticação e autorização
- Arquitetura de software
- DevOps e CI/CD

**Produto Final:**
- Sistema CRM completo e funcional
- 8 módulos principais
- Interface responsiva
- Documentação completa
- Código em produção

---

## 7. Especificações Técnicas

### 7.1 Arquitetura do Sistema

**Padrão:** Monolito modular com separação de camadas

**Camadas:**
1. **Apresentação:** React components + Tailwind CSS
2. **Lógica de Negócio:** Next.js API Routes
3. **Acesso a Dados:** Prisma ORM
4. **Persistência:** PostgreSQL

**Padrões Implementados:**
- Repository Pattern
- Service Layer
- Middleware Pattern
- Factory Pattern

### 7.2 Modelo de Dados

**Entidades Principais:**
- Users (agentes, gerentes, admin)
- Customers (clientes das agências)
- Travels (viagens)
- Passengers (passageiros)
- Payments (pagamentos)
- Activities (logs de auditoria)
- Cities (cidades brasileiras)
- PasswordResetTokens (recuperação de senha)

**Relacionamentos:**
- 1:N (User → Travels, Customer → Travels, Travel → Passengers, Travel → Payments)
- N:1 (Activities → User/Customer/Travel)

**Índices Otimizados:**
- Busca por email, documento, data, status
- Performance em queries complexas

### 7.3 Segurança

**Autenticação:**
- JWT tokens com NextAuth.js
- Sessões seguras
- Password hashing com bcrypt

**Autorização:**
- Role-Based Access Control (RBAC)
- Middleware de proteção de rotas
- Validação de permissões por ação

**Validação:**
- Validação client-side com Zod
- Validação server-side em todas as APIs
- Sanitização de inputs

---

## 8. Métricas do Projeto

### 8.1 Estatísticas de Desenvolvimento

| Métrica                  | Valor           |
| ------------------------ | --------------- |
| **Linhas de Código**     | ~15.000 linhas  |
| **Componentes React**    | ~45 componentes |
| **API Endpoints**        | ~25 endpoints   |
| **Tabelas no Banco**     | 8 tabelas       |
| **Páginas da Aplicação** | ~20 páginas     |
| **Formulários**          | ~12 formulários |
| **Migrations**           | ~15 migrations  |

### 8.2 Complexidade por Módulo

| Módulo       | Complexidade | Justificativa                      |
| ------------ | ------------ | ---------------------------------- |
| Autenticação | Alta         | Segurança crítica, múltiplos roles |
| Pagamentos   | Muito Alta   | Multi-moeda, cálculos complexos    |
| Viagens      | Alta         | Relacionamentos múltiplos, status  |
| Dashboard    | Alta         | Agregações, métricas em tempo real |
| Clientes     | Média        | CRUD padrão com validações         |
| Passageiros  | Média        | Validações de documentos           |
| Auditoria    | Média        | Logs automáticos                   |
| Usuários     | Média        | CRUD com controle de acesso        |

---

## Conclusão

O projeto AgentFlow representa um investimento de **R$ 19.435,00**, distribuído ao longo de 6 meses de desenvolvimento (julho a dezembro de 2025), com dedicação de 40 horas mensais, resultando em um sistema CRM completo e funcional para gestão de agências de viagens.

O sistema implementa 8 módulos principais, utiliza tecnologias modernas e segue as melhores práticas de desenvolvimento de software, constituindo um projeto integrador robusto e demonstrativo das competências técnicas adquiridas durante o curso.

---

**Documento elaborado em:** 10/01/2025
**Desenvolvedor:** Arthur Mauricio Malizia Davi
**Contexto:** Projeto Integrador - Curso Superior
**Período de Desenvolvimento:** Julho a Dezembro de 2025
