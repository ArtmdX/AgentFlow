# Planejamento de Sprints - AgentFlow CRM

> **Desenvolvedor**: Arthur Mauricio Malizia Davi
> **Capacidade**: 30 horas/semana
> **Duração das Sprints**: 2 semanas (60 horas por sprint)
> **Total de Itens**: 66 (9 Epics, 31 Features, 25 User Stories)
> **Estratégia**: Fundação primeiro, sprints balanceadas, foco em implementação

---

## Sprint 0: Fundações Críticas

**Duração**: 2 semanas | **Capacidade**: 60 horas
**Objetivo**: Estabelecer infraestrutura base para evitar retrabalho futuro

### Itens do Backlog

#### 1. Permissões por Role (15h)

- **IDs**: Epic 130, Feature 154, US-6.4 (#183)
- **Descrição**: Sistema de controle de acesso baseado em roles (admin, manager, agent)
- **Entregas**:
  - Middleware de autorização no Next.js
  - Guards para rotas protegidas
  - Verificação de permissões em Server Actions
  - Atualização de UI baseada em role do usuário
- **Dependências**: Nenhuma (fundação)

#### 2. Validações de Formulário Melhoradas (12h)

- **IDs**: Epic 130, Feature 151, US-6.1 (#180)
- **Descrição**: Aprimorar validações client-side e server-side
- **Entregas**:
  - Schemas Zod expandidos para todos os formulários
  - Validações assíncronas (duplicatas, disponibilidade)
  - Mensagens de erro contextualizadas
  - Validação em tempo real nos campos
- **Dependências**: Nenhuma (fundação)

#### 3. Tratamento de Erros (18h)

- **IDs**: Epic 132, Feature 160, US-8.3 (#189)
- **Descrição**: Sistema centralizado de tratamento de erros
- **Entregas**:
  - Error boundaries globais e por feature
  - Logging estruturado de erros
  - Página de erro customizada
  - Toast/notifications para erros de API
  - Retry mechanism para operações críticas
- **Dependências**: Nenhuma (fundação)

#### 4. Loading States e Feedback (15h)

- **IDs**: Epic 129, Feature 150, US-5.5 (#179)
- **Descrição**: Estados de carregamento consistentes em toda aplicação
- **Entregas**:
  - Skeleton loaders para listas e cards
  - Loading states para botões e forms
  - Progress indicators para operações longas
  - Feedback visual imediato para ações do usuário
  - Suspense boundaries otimizados
- **Dependências**: Nenhuma (fundação)

### Critérios de Aceite da Sprint

- [ ] Sistema de roles funcional em todas as rotas principais
- [ ] Validações bloqueiam submissões inválidas em todos os formulários
- [ ] Erros são capturados e exibidos de forma user-friendly
- [ ] Toda interação assíncrona tem feedback visual apropriado
- [ ] Build de produção sem erros TypeScript

---

## Sprint 1: Gestão de Usuários + Validações

**Duração**: 2 semanas | **Capacidade**: 60 horas
**Objetivo**: Sistema completo de gestão de usuários e prevenção de dados duplicados

### Itens do Backlog

#### 1. Recuperação de Senha (14h)

- **IDs**: Epic 125, Feature 134, US-1.1 (#163)
- **Descrição**: Fluxo completo de reset de senha
- **Entregas**:
  - API endpoint para solicitação de reset
  - Geração de token seguro com expiração
  - E-mail com link de reset (usando Resend/Nodemailer)
  - Página de redefinição de senha
  - Validação e atualização de senha
- **Dependências**: Tratamento de Erros (Sprint 0)

#### 2. Perfil de Usuário (12h)

- **IDs**: Epic 125, Feature 135, US-1.2 (#164)
- **Descrição**: Página de perfil e edição de dados pessoais
- **Entregas**:
  - Página `/profile` com dados do usuário logado
  - Formulário de edição de perfil
  - Upload/atualização de avatar (opcional)
  - Alteração de senha (autenticada)
  - Preferências de notificação
- **Dependências**: Validações de Formulário (Sprint 0), Permissões (Sprint 0)

#### 3. Gestão de Usuários (Admin) (20h)

- **IDs**: Epic 125, Feature 136, US-1.3 (#165)
- **Descrição**: CRUD completo de usuários para administradores
- **Entregas**:
  - Página `/admin/users` com listagem
  - Criação de novos usuários
  - Edição de dados e roles
  - Desativação/ativação de contas
  - Filtros e busca de usuários
  - Reset de senha por admin
- **Dependências**: Permissões por Role (Sprint 0), Perfil de Usuário

#### 4. Prevenção de Duplicatas (14h)

- **IDs**: Epic 130, Feature 152, US-6.2 (#181)
- **Descrição**: Sistema para detectar e prevenir registros duplicados
- **Entregas**:
  - Validação de CPF/CNPJ único para clientes
  - Validação de e-mail único para usuários
  - Verificação de telefone duplicado
  - Sugestões ao detectar possível duplicata
  - Modal de confirmação para override (admin only)
  - Índices únicos no banco de dados
- **Dependências**: Validações de Formulário (Sprint 0)

### Critérios de Aceite da Sprint

- [ ] Usuários podem recuperar senha via e-mail
- [ ] Usuários podem editar seu próprio perfil
- [ ] Admins podem criar, editar e desativar usuários
- [ ] Sistema previne criação de clientes/usuários duplicados
- [ ] Todas as validações client/server funcionando
- [ ] Build de produção sem erros

---

## Sprint 2: Performance + Auditoria Base

**Duração**: 2 semanas | **Capacidade**: 60 horas
**Objetivo**: Otimizações de performance e sistema básico de auditoria

### Itens do Backlog

#### 1. Paginação em Listagens (12h)

- **IDs**: Epic 131, Feature 155, US-7.1 (#184)
- **Descrição**: Implementar paginação em todas as listagens
- **Entregas**:
  - Server-side pagination para travels, customers, payments
  - Componente de paginação reutilizável
  - Controles de itens por página (10, 25, 50, 100)
  - Persistência de página na URL (query params)
  - Loading states durante mudança de página
- **Dependências**: Loading States (Sprint 0)

#### 2. Cache e Otimização de Queries (18h)

- **IDs**: Epic 131, Feature 156, US-7.2 (#185)
- **Descrição**: Otimização de queries e cache strategies
- **Entregas**:
  - React Query para cache client-side
  - Revalidation strategies adequadas
  - Prisma query optimization (select, include otimizados)
  - Database indexes para queries frequentes
  - Cache de estatísticas do dashboard
  - Prefetch de dados relacionados
- **Dependências**: Paginação

#### 3. Log de Atividades (16h)

- **IDs**: Epic 128, Feature 143, US-4.1 (#172)
- **Descrição**: Sistema de auditoria para ações importantes
- **Entregas**:
  - Tabela `Activity` no schema Prisma
  - Middleware para capturar ações (create, update, delete)
  - Log de login/logout
  - Metadados: usuário, timestamp, IP, ação, entidade
  - API endpoints para consulta de logs
  - Retenção de logs (30/60/90 dias)
- **Dependências**: Nenhuma

#### 4. Timeline de Atividades (14h)

- **IDs**: Epic 128, Feature 144, US-4.2 (#173)
- **Descrição**: Interface visual para histórico de atividades
- **Entregas**:
  - Componente Timeline reutilizável
  - Timeline por viagem (já existe base, expandir)
  - Timeline por cliente
  - Timeline global (admin)
  - Filtros por tipo de ação, usuário, período
  - Ícones e cores por tipo de atividade
- **Dependências**: Log de Atividades

### Critérios de Aceite da Sprint

- [ ] Todas as listagens paginadas e performáticas
- [ ] Cache implementado com invalidação correta
- [ ] Queries otimizadas (redução de N+1)
- [ ] Todas as ações importantes são logadas
- [ ] Timeline visual disponível em viagens e clientes
- [ ] Build de produção sem erros

---

## Sprint 3: Relatórios Essenciais

**Duração**: 2 semanas | **Capacidade**: 60 horas
**Objetivo**: Analytics e relatórios para tomada de decisão

### Itens do Backlog

#### 1. Relatório de Vendas (16h)

- **IDs**: Epic 126, Feature 137, US-2.1 (#166)
- **Descrição**: Relatório detalhado de vendas e conversões
- **Entregas**:
  - Página `/reports/sales` (2h)
  - Filtros: período, agente, status, destino (2h)
  - Métricas: total de viagens, valor total, ticket médio (2h)
  - Gráfico de vendas por período (linha/barra) (3h)
  - Gráfico de vendas por agente (pizza) (2h)
  - Top destinos (1h)
  - Taxa de conversão (leads → vendas) (2h)
  - Exportação para CSV/PDF (2h)
- **Dependências**: Cache (Sprint 2), Paginação (Sprint 2)

#### 2. Relatório de Pagamentos (16h)

- **IDs**: Epic 126, Feature 138, US-2.2 (#167)
- **Descrição**: Análise financeira de pagamentos
- **Entregas**:
  - Página `/reports/payments` (2h)
  - Filtros: período, moeda, método de pagamento, status (2h)
  - Métricas: total recebido, a receber, inadimplência (2h)
  - Gráfico de fluxo de caixa (3h)
  - Pagamentos por método (pizza) (2h)
  - Aging de recebíveis (0-30, 30-60, 60-90 dias) (2h)
  - Lista de pendências (1h)
  - Exportação para CSV/Excel (2h)
- **Dependências**: Cache (Sprint 2), Paginação (Sprint 2)

#### 3. Dashboard Avançado (18h)

- **IDs**: Epic 126, Feature 139, US-2.3 (#168)
- **Descrição**: Dashboard executivo com KPIs principais
- **Entregas**:
  - Refactor do dashboard atual (2h)
  - Cards de KPIs: vendas do mês, crescimento, conversão (3h)
  - Gráfico de vendas últimos 12 meses (3h)
  - Gráfico de pagamentos (realizado vs planejado) (3h)
  - Top 5 clientes (2h)
  - Top 5 destinos (1h)
  - Atividades recentes (1h)
  - Viagens próximas de partida (2h)
  - Filtro por período customizável (1h)
- **Dependências**: Relatório de Vendas, Relatório de Pagamentos

#### 4. Cálculos Automáticos (10h)

- **IDs**: Epic 130, Feature 153, US-6.3 (#182)
- **Descrição**: Automação de cálculos em viagens e pagamentos
- **Entregas**:
  - Cálculo automático de saldo (totalValue - paidValue) (1h)
  - Atualização de status da viagem baseado em pagamentos (2h)
  - Cálculo de juros/multas em atrasos (configurável) (2h)
  - Desconto automático (porcentagem ou valor fixo) (2h)
  - Conversão de moedas (API externa ou taxas manuais) (2h)
  - Recálculo em tempo real no frontend (1h)
- **Dependências**: Validações (Sprint 0)

### Critérios de Aceite da Sprint

- [ ] Relatórios de vendas e pagamentos funcionais e precisos
- [ ] Dashboard exibe KPIs atualizados em tempo real
- [ ] Cálculos automáticos corretos em todas as operações
- [ ] Exportação de dados funcionando
- [ ] Gráficos renderizam corretamente
- [ ] Build de produção sem erros

---

## Sprint 4: UX/UI + Filtros

**Duração**: 2 semanas | **Capacidade**: 60 horas
**Objetivo**: Melhorias de experiência do usuário e capacidades de busca

### Itens do Backlog

#### 1. Busca Global (16h)

- **IDs**: Epic 129, Feature 146, US-5.1 (#175)
- **Descrição**: Busca unificada em toda aplicação
- **Entregas**:
  - Input de busca global no header/navbar (2h)
  - Busca em: clientes, viagens, passageiros, pagamentos (4h)
  - Autocomplete com resultados em tempo real (3h)
  - Destacar termo buscado nos resultados (2h)
  - Navegação por teclado (arrow keys, enter) (2h)
  - Histórico de buscas recentes (2h)
  - Atalho de teclado (Ctrl+K / Cmd+K) (1h)
- **Dependências**: Cache (Sprint 2)

#### 2. Filtros Avançados - Viagens (14h)

- **IDs**: Epic 129, US-5.2 (#176)
- **Descrição**: Sistema de filtros robusto para listagem de viagens
- **Entregas**:
  - Filtros por: status, período de partida, destino, cliente (3h)
  - Filtros por: agente responsável, valor (range), passageiros (3h)
  - Múltiplos filtros simultâneos (2h)
  - Persistência de filtros na URL (2h)
  - Badge de filtros ativos (1h)
  - Botão de limpar filtros (1h)
  - Salvar filtros favoritos (opcional) (2h)
- **Dependências**: Paginação (Sprint 2)

#### 3. Filtros Avançados - Clientes (12h)

- **IDs**: Epic 129, Feature 148, US-5.3 (#177)
- **Descrição**: Filtros para listagem de clientes
- **Entregas**:
  - Filtros por: nome, CPF/CNPJ, e-mail, telefone (3h)
  - Filtros por: cidade, estado, país (2h)
  - Filtros por: data de cadastro, última viagem (2h)
  - Status: ativo, inativo (1h)
  - Ordenação customizável (2h)
  - Persistência na URL (2h)
- **Dependências**: Paginação (Sprint 2)

#### 4. Exportação de Dados (10h)

- **IDs**: Epic 129, Feature 149, US-5.4 (#178)
- **Descrição**: Exportar dados em múltiplos formatos
- **Entregas**:
  - Exportação de viagens para CSV/Excel/PDF (2h)
  - Exportação de clientes para CSV/Excel (1h)
  - Exportação de pagamentos para CSV/Excel (1h)
  - Exportação de relatórios para PDF (2h)
  - Respeitar filtros aplicados na exportação (1h)
  - Formatação adequada (datas, moedas) (1h)
  - Download assíncrono para grandes volumes (1h)
  - Progress bar durante exportação (1h)
- **Dependências**: Filtros Avançados

#### 5. Autocomplete de Cidades com IATA (8h) ✅ CONCLUÍDO

- **IDs**: Epic 129 (UX/UI Improvements)
- **Descrição**: Seleção de cidades com códigos IATA para viagens
- **Entregas**:
  - ✅ Database de 50+ cidades brasileiras com códigos IATA
  - ✅ API endpoint de busca de cidades com debounce
  - ✅ Componente CityAutocomplete com navegação por teclado
  - ✅ Formato padronizado: "CODE - Cidade/Estado" (ex: BSB - Brasília/DF)
  - ✅ Validação de formato IATA em viagens
  - ✅ Integração no TravelForm (cidade de partida + destino)
  - ✅ Busca por código IATA, nome da cidade ou estado
  - ✅ Highlighting de resultados e suporte a autocomplete
- **Dependências**: Validações (Sprint 0)
- **Status**: ✅ Implementado em 2025-01-27

### Critérios de Aceite da Sprint

- [ ] Busca global funciona em todas as entidades principais
- [ ] Filtros avançados em viagens e clientes
- [ ] Filtros persistem na URL e podem ser compartilhados
- [ ] Exportação funciona em CSV, Excel e PDF
- [ ] Performance adequada mesmo com filtros complexos
- [ ] Build de produção sem erros

---

## Sprint 5: Notificações

**Duração**: 2 semanas | **Capacidade**: 60 horas
**Objetivo**: Sistema completo de comunicação e alertas

### Itens do Backlog

#### 1. Notificações In-App (16h)

- **IDs**: Epic 127, Feature 140, US-3.1 (#169)
- **Descrição**: Sistema de notificações dentro da aplicação
- **Entregas**:
  - Tabela `Notification` no schema Prisma (1h)
  - Bell icon com badge de não lidas (2h)
  - Dropdown/modal com lista de notificações (3h)
  - Tipos: info, warning, success, error (1h)
  - Ações: marcar como lida, deletar (2h)
  - Link para entidade relacionada (2h)
  - Tempo relativo ("há 5 minutos") (1h)
  - Notificações em tempo real (polling ou websocket) (4h)
- **Dependências**: Log de Atividades (Sprint 2)

#### 2. Envio de E-mails (18h)

- **IDs**: Epic 127, Feature 141, US-3.2 (#170)
- **Descrição**: Infraestrutura de envio de e-mails transacionais
- **Entregas**:
  - Integração com Resend ou Nodemailer (2h)
  - Templates base em React Email ou MJML (3h)
  - E-mails de: boas-vindas, reset senha, confirmação (3h)
  - E-mails de: nova viagem, pagamento recebido, lembrete (3h)
  - Fila de e-mails (opcional: Bull/Redis) (3h)
  - Retry em caso de falha (1h)
  - Log de e-mails enviados (2h)
  - Configuração de SMTP nas settings (1h)
- **Dependências**: Templates de E-mail, Tratamento de Erros (Sprint 0)

#### 3. Lembretes e Alertas (14h)

- **IDs**: Epic 127, Feature 142, US-3.3 (#171)
- **Descrição**: Sistema de lembretes automáticos
- **Entregas**:
  - Cron jobs para verificações periódicas (2h)
  - Alertas de: viagem próxima (7 dias antes) (2h)
  - Alertas de: pagamento vencendo (3 dias antes) (2h)
  - Alertas de: pagamento atrasado (2h)
  - Alertas de: documentos pendentes (2h)
  - Notificações in-app + e-mail (1h)
  - Configuração de preferências por usuário (2h)
  - Dashboard de lembretes pendentes (1h)
- **Dependências**: Notificações In-App, Envio de E-mails

#### 4. Templates de E-mail (12h)

- **IDs**: Epic 133, Feature 162, US-9.2 (#191)
- **Descrição**: Editor e gestão de templates de e-mail
- **Entregas**:
  - Página `/admin/email-templates` (2h)
  - Templates pré-configurados customizáveis (2h)
  - Editor visual ou markdown (3h)
  - Variáveis dinâmicas ({customerName}, {travelDate}) (2h)
  - Preview de template (1h)
  - Versionamento de templates (1h)
  - Ativação/desativação por tipo de e-mail (1h)
- **Dependências**: Permissões (Sprint 0)

### Critérios de Aceite da Sprint

- [ ] Notificações in-app funcionam em tempo real
- [ ] E-mails são enviados corretamente para eventos chave
- [ ] Lembretes automáticos disparam nos momentos corretos
- [ ] Templates de e-mail são customizáveis
- [ ] Usuários podem configurar preferências de notificação
- [ ] Build de produção sem erros

---

## Sprint 6: Auditoria + Configurações

**Duração**: 2 semanas | **Capacidade**: 60 horas
**Objetivo**: Compliance, configurações e mobile

### Itens do Backlog

#### 1. Relatório de Auditoria (14h)

- **IDs**: Epic 128, Feature 145, US-4.3 (#174)
- **Descrição**: Relatório completo de auditoria para compliance
- **Entregas**:
  - Página `/reports/audit` (2h)
  - Filtros: período, usuário, tipo de ação, entidade (2h)
  - Listagem detalhada de todas as atividades (2h)
  - Detalhes: quem, quando, o quê, onde (IP), antes/depois (2h)
  - Exportação para CSV/PDF (2h)
  - Busca por ID de registro específico (1h)
  - Gráficos de atividade por período (2h)
  - Paginação e performance otimizada (1h)
- **Dependências**: Log de Atividades (Sprint 2), Exportação (Sprint 4)

#### 2. Configurações da Agência (18h)

- **IDs**: Epic 133, Feature 161, US-9.1 (#190)
- **Descrição**: Página de configurações gerais do sistema
- **Entregas**:
  - Página `/admin/settings` (2h)
  - Dados da agência: nome, logo, endereço, contatos (3h)
  - Configurações de e-mail: SMTP, sender (2h)
  - Configurações de moeda padrão (1h)
  - Configurações de juros/multas (2h)
  - Taxas de conversão de moeda (2h)
  - Configurações de notificações (2h)
  - Termos de uso e políticas (2h)
  - Backup de configurações (2h)
- **Dependências**: Permissões (Sprint 0)

#### 3. Responsividade Mobile (20h)

- **IDs**: Epic 131, Feature 157, US-7.3 (#186)
- **Descrição**: Adaptar toda aplicação para dispositivos móveis
- **Entregas**:
  - Layout responsivo em todos os breakpoints (3h)
  - Menu mobile com drawer/hamburger (3h)
  - Tables responsivas (horizontal scroll ou cards) (4h)
  - Formulários otimizados para mobile (3h)
  - Touch-friendly (botões, inputs) (2h)
  - Testes em: iPhone, Android, tablets (2h)
  - PWA manifest (opcional) (2h)
  - Performance em conexões 3G (1h)
- **Dependências**: Todas as features principais implementadas

#### 4. Testes Manuais e Ajustes (8h)

- **Descrição**: Buffer para testes e correções
- **Entregas**:
  - Testes exploratórios em todas as features (3h)
  - Correção de bugs encontrados (3h)
  - Ajustes de UX/UI (1h)
  - Documentação de issues conhecidas (1h)

### Critérios de Aceite da Sprint

- [ ] Relatório de auditoria completo e exportável
- [ ] Configurações da agência funcionais
- [ ] Aplicação totalmente responsiva em mobile
- [ ] Testes manuais realizados
- [ ] Build de produção sem erros

---

## Sprint 7: Qualidade

**Duração**: 2 semanas | **Capacidade**: 60 horas
**Objetivo**: Testes automatizados e estabilização do sistema

### Itens do Backlog

#### 1. Testes Unitários (30h)

- **IDs**: Epic 132, Feature 158, US-8.1 (#187)
- **Descrição**: Suite de testes unitários
- **Entregas**:
  - Setup de Jest + Testing Library (2h)
  - Testes de utils e helpers (100% coverage) (4h)
  - Testes de validações Zod (3h)
  - Testes de componentes críticos (8h)
  - Testes de hooks customizados (3h)
  - Testes de formatters e parsers (3h)
  - Testes de cálculos automáticos (4h)
  - CI pipeline para rodar testes (2h)
  - Coverage report (mínimo 70%) (1h)
- **Dependências**: Todas as features implementadas

#### 2. Testes de Integração (API) (25h)

- **IDs**: Epic 132, Feature 159, US-8.2 (#188)
- **Descrição**: Testes de integração das APIs
- **Entregas**:
  - Setup de testes de API (Jest + Supertest ou similar) (2h)
  - Database de testes (SQLite ou Postgres test) (2h)
  - Testes de endpoints críticos: (12h)
    - `/api/auth/*` (login, logout, session) (3h)
    - `/api/customers` (CRUD) (2h)
    - `/api/travels` (CRUD) (3h)
    - `/api/payments` (CRUD e cálculos) (3h)
    - `/api/dashboard/stats` (1h)
  - Testes de autorização e permissões (3h)
  - Testes de validação server-side (3h)
  - Seed de dados de teste (2h)
  - Teardown após cada teste (1h)
- **Dependências**: Todas as features implementadas

#### 3. Estabilização e Documentação (5h)

- **Descrição**: Últimos ajustes e documentação
- **Entregas**:
  - Atualização do README.md (1h)
  - Documentação de APIs (1h)
  - Guia de deployment (1h)
  - Changelog das sprints (1h)
  - Known issues e roadmap futuro (1h)

### Critérios de Aceite da Sprint

- [ ] Coverage de testes unitários ≥ 70%
- [ ] Testes de integração em todas as APIs principais
- [ ] CI/CD pipeline configurado
- [ ] Documentação atualizada
- [ ] Todos os testes passando
- [ ] Build de produção sem erros

---

## Resumo do Planejamento

| Sprint       | Foco Principal              | Horas    | Itens  |
| ------------ | --------------------------- | -------- | ------ |
| **Sprint 0** | Fundações Críticas          | 60h      | 4      |
| **Sprint 1** | Gestão de Usuários          | 60h      | 4      |
| **Sprint 2** | Performance + Auditoria     | 60h      | 4      |
| **Sprint 3** | Relatórios                  | 60h      | 4      |
| **Sprint 4** | UX/UI + Filtros             | 60h      | 4      |
| **Sprint 5** | Notificações                | 60h      | 4      |
| **Sprint 6** | Auditoria + Config + Mobile | 60h      | 4      |
| **Sprint 7** | Qualidade e Testes          | 60h      | 3      |
| **TOTAL**    | -                           | **420h** | **31** |

### Duração Total

- **8 sprints × 2 semanas = 16 semanas (4 meses)**
- **Estimativa de conclusão**: ~4 meses de desenvolvimento

### Observações Importantes

1. **Flexibilidade**: As estimativas de horas são aproximadas. Ajuste conforme necessário durante as sprints.

2. **Dependências Críticas**:

   - Sprint 0 é FUNDAMENTAL - não pule
   - Respeite as dependências indicadas entre features

3. **Priorização Dinâmica**:

   - Se houver mudanças de negócio, repriorize os itens dentro das sprints
   - Mantenha a regra: fundação antes de features avançadas

4. **Buffer**:

   - Cada sprint tem ~5-10h de buffer implícito para:
     - Code review pessoal
     - Refactoring
     - Bugs não previstos
     - Aprendizado de novas libs

5. **Definição de Pronto**:

   - Código implementado
   - TypeScript sem erros
   - Build de produção funcionando
   - Feature testada manualmente
   - (Testes automatizados apenas na Sprint 7)

6. **Revisão de Sprint**:
   - Ao final de cada sprint, atualize este documento com:
     - Itens concluídos ✅
     - Itens movidos para próxima sprint 🔄
     - Novos itens descobertos ➕
     - Lições aprendidas 📝

---

## Próximos Passos

1. ✅ Planejamento concluído
2. ⏳ Iniciar Sprint 0 - Fundações Críticas
3. ⏳ Configurar ferramenta de tracking (Azure DevOps, Jira, ou Notion)
4. ⏳ Daily review pessoal de progresso
5. ⏳ Retrospectiva ao final de cada sprint

**Última atualização**: 2025-10-20
**Status**: Planejamento inicial aprovado
