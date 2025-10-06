# 📊 Backlog Scrum MVP - AgentFlow CRM

**Versão:** 1.0
**Data:** 06/10/2025
**Status:** Em Desenvolvimento

---

## 🔍 RESUMO EXECUTIVO

### ✅ O que já está implementado:
- ✅ **Autenticação completa** (NextAuth.js com credentials)
- ✅ **CRUD de Clientes** (criação, edição, visualização, listagem)
- ✅ **CRUD de Viagens** (criação, edição, visualização, listagem)
- ✅ **Gestão de Passageiros** (adicionar passageiros a viagens)
- ✅ **Sistema de Pagamentos** (CRUD completo + timeline + estatísticas)
- ✅ **Dashboard básico** (cards de estatísticas, viagens recentes)
- ✅ **Layout responsivo** (Header, Sidebar, Footer)
- ✅ **Validações com Zod** (forms validados)
- ✅ **Banco de dados robusto** (PostgreSQL + Prisma)

### ❌ Gaps Críticos para MVP:

1. ❌ Funcionalidades de negócio ausentes
2. ❌ Relatórios e exportações
3. ❌ Sistema de notificações
4. ❌ Gestão de atividades (audit log)
5. ❌ Configurações de usuário
6. ❌ Recuperação de senha
7. ❌ Permissões por role (admin/agent/manager)
8. ❌ Filtros avançados e busca
9. ❌ Validação de dados críticos
10. ❌ Testes automatizados

---

## 🎯 ÉPICOS E USER STORIES

### ÉPICO 1️⃣: Autenticação e Gestão de Usuários
**Objetivo:** Completar o ciclo de autenticação e permitir gestão de perfis

#### 📌 US-1.1: Recuperação de Senha
- **Como:** Usuário que esqueceu a senha
- **Quero:** Poder resetar minha senha via e-mail
- **Para:** Recuperar acesso ao sistema
- **Critérios de Aceitação:**
  - [ ] Página de "Esqueci minha senha" funcional
  - [ ] Geração de token de recuperação
  - [ ] Envio de e-mail com link de reset
  - [ ] Página para criar nova senha
  - [ ] Expiração de token após 24h
- **Estimativa:** 5 pontos
- **Prioridade:** 🔴 Alta
- **Status:** �� To Do

---

#### 📌 US-1.2: Perfil de Usuário
- **Como:** Agente logado
- **Quero:** Visualizar e editar meu perfil
- **Para:** Manter meus dados atualizados
- **Critérios de Aceitação:**
  - [ ] Página de perfil com dados do usuário
  - [ ] Edição de nome, telefone, foto
  - [ ] Alteração de senha
  - [ ] Validações de segurança
- **Estimativa:** 3 pontos
- **Prioridade:** 🟡 Média
- **Status:** 📋 To Do

---

#### 📌 US-1.3: Gestão de Usuários (Admin)
- **Como:** Administrador
- **Quero:** Gerenciar usuários do sistema
- **Para:** Controlar acessos e permissões
- **Critérios de Aceitação:**
  - [ ] Listagem de todos os usuários
  - [ ] Criar novos usuários
  - [ ] Editar usuários existentes
  - [ ] Desativar/ativar usuários
  - [ ] Alterar roles (admin/agent/manager)
- **Estimativa:** 8 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

### ÉPICO 2️⃣: Relatórios e Analytics
**Objetivo:** Fornecer insights de negócio através de relatórios

#### 📌 US-2.1: Relatório de Vendas
- **Como:** Agente ou gestor
- **Quero:** Visualizar relatório de vendas por período
- **Para:** Analisar performance
- **Critérios de Aceitação:**
  - [ ] Filtro por data (início e fim)
  - [ ] Filtro por agente (para gestores)
  - [ ] Exibição de métricas: total de vendas, receita, ticket médio
  - [ ] Gráfico de vendas ao longo do tempo
  - [ ] Exportação para PDF/Excel
- **Estimativa:** 8 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

#### 📌 US-2.2: Relatório de Pagamentos
- **Como:** Agente ou gestor
- **Quero:** Visualizar relatório financeiro detalhado
- **Para:** Acompanhar fluxo de caixa
- **Critérios de Aceitação:**
  - [ ] Filtros: período, método de pagamento, status
  - [ ] Total recebido vs a receber
  - [ ] Breakdown por método de pagamento
  - [ ] Lista de pagamentos pendentes
  - [ ] Exportação para Excel
- **Estimativa:** 8 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

#### 📌 US-2.3: Dashboard Avançado
- **Como:** Gestor
- **Quero:** Dashboard com KPIs detalhados
- **Para:** Tomar decisões estratégicas
- **Critérios de Aceitação:**
  - [ ] Gráficos de performance mensal
  - [ ] Taxa de conversão (orçamentos → vendas)
  - [ ] Top 5 destinos mais vendidos
  - [ ] Ranking de agentes (para admin)
  - [ ] Projeção de receita
- **Estimativa:** 13 pontos
- **Prioridade:** 🟡 Média
- **Status:** 📋 To Do

---

### ÉPICO 3️⃣: Sistema de Notificações e Comunicação
**Objetivo:** Manter usuários informados sobre eventos importantes

#### 📌 US-3.1: Notificações In-App
- **Como:** Agente
- **Quero:** Receber notificações dentro do sistema
- **Para:** Ser alertado sobre eventos importantes
- **Critérios de Aceitação:**
  - [ ] Badge de notificações não lidas no header
  - [ ] Centro de notificações (dropdown)
  - [ ] Tipos: novos pagamentos, viagens próximas, ações pendentes
  - [ ] Marcar como lida/não lida
  - [ ] Limpar todas as notificações
- **Estimativa:** 8 pontos
- **Prioridade:** 🟡 Média
- **Status:** 📋 To Do

---

#### 📌 US-3.2: Envio de E-mails
- **Como:** Sistema
- **Quero:** Enviar e-mails automáticos
- **Para:** Comunicar eventos importantes aos usuários
- **Critérios de Aceitação:**
  - [ ] E-mail de boas-vindas ao criar conta
  - [ ] E-mail de confirmação de pagamento
  - [ ] E-mail de lembrete de viagem próxima (7 dias antes)
  - [ ] Templates HTML responsivos
  - [ ] Configuração SMTP
- **Estimativa:** 8 pontos
- **Prioridade:** 🟢 Baixa (pós-MVP)
- **Status:** 📋 To Do

---

#### 📌 US-3.3: Lembretes e Alertas
- **Como:** Agente
- **Quero:** Receber lembretes sobre tarefas pendentes
- **Para:** Não esquecer ações importantes
- **Critérios de Aceitação:**
  - [ ] Alerta de viagens com partida em 7 dias
  - [ ] Alerta de pagamentos vencidos
  - [ ] Alerta de orçamentos antigos (>30 dias sem atualização)
  - [ ] Dashboard de "Ações Pendentes"
- **Estimativa:** 5 pontos
- **Prioridade:** 🟡 Média
- **Status:** 📋 To Do

---

### ÉPICO 4️⃣: Auditoria e Histórico de Atividades
**Objetivo:** Rastrear todas as ações no sistema para compliance e histórico

#### 📌 US-4.1: Log de Atividades
- **Como:** Sistema
- **Quero:** Registrar todas as ações importantes
- **Para:** Manter histórico completo
- **Critérios de Aceitação:**
  - [ ] Registro automático de criação/edição/exclusão
  - [ ] Campos: quem, o quê, quando, detalhes
  - [ ] Integração com entidades: Customer, Travel, Payment
  - [ ] Metadata JSON para armazenar mudanças
- **Estimativa:** 5 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

#### 📌 US-4.2: Timeline de Atividades
- **Como:** Agente
- **Quero:** Ver histórico de ações em clientes e viagens
- **Para:** Entender o que aconteceu ao longo do tempo
- **Critérios de Aceitação:**
  - [ ] Timeline visual na página de detalhes do cliente
  - [ ] Timeline visual na página de detalhes da viagem
  - [ ] Filtros por tipo de atividade
  - [ ] Ordenação cronológica
  - [ ] Ícones e cores por tipo de ação
- **Estimativa:** 5 pontos
- **Prioridade:** 🟡 Média
- **Status:** 📋 To Do

---

#### 📌 US-4.3: Relatório de Auditoria
- **Como:** Administrador
- **Quero:** Visualizar relatório de todas as atividades
- **Para:** Auditar o sistema e garantir compliance
- **Critérios de Aceitação:**
  - [ ] Filtros: período, usuário, tipo de ação, entidade
  - [ ] Exportação para CSV
  - [ ] Paginação eficiente
  - [ ] Detalhamento de mudanças (before/after)
- **Estimativa:** 8 pontos
- **Prioridade:** 🟢 Baixa (pós-MVP)
- **Status:** 📋 To Do

---

### ÉPICO 5️⃣: Melhorias de UX/UI e Filtros
**Objetivo:** Melhorar navegação e encontrabilidade de informações

#### 📌 US-5.1: Busca Global
- **Como:** Agente
- **Quero:** Buscar clientes, viagens e pagamentos rapidamente
- **Para:** Encontrar informações sem navegar por menus
- **Critérios de Aceitação:**
  - [ ] Campo de busca no header
  - [ ] Busca em: nome de cliente, destino, número de documento
  - [ ] Resultados agrupados por tipo
  - [ ] Navegação com teclado (setas + enter)
  - [ ] Atalho de teclado (Ctrl+K)
- **Estimativa:** 8 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

#### 📌 US-5.2: Filtros Avançados - Viagens
- **Como:** Agente
- **Quero:** Filtrar viagens por múltiplos critérios
- **Para:** Encontrar viagens específicas facilmente
- **Critérios de Aceitação:**
  - [ ] Filtros: status, data de partida, destino, cliente
  - [ ] Combinação de múltiplos filtros
  - [ ] Ordenação: data, valor, cliente
  - [ ] Limpar todos os filtros
  - [ ] URL com query params (compartilhável)
- **Estimativa:** 5 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

#### 📌 US-5.3: Filtros Avançados - Clientes
- **Como:** Agente
- **Quero:** Filtrar clientes por critérios
- **Para:** Segmentar minha base
- **Critérios de Aceitação:**
  - [ ] Filtros: status (ativo/inativo), data de cadastro
  - [ ] Busca por nome, email, documento
  - [ ] Ordenação: nome, data de cadastro, última compra
  - [ ] Clientes sem viagens (leads frios)
- **Estimativa:** 3 pontos
- **Prioridade:** 🟡 Média
- **Status:** 📋 To Do

---

#### 📌 US-5.4: Exportação de Dados
- **Como:** Agente ou gestor
- **Quero:** Exportar listas para Excel/CSV
- **Para:** Trabalhar com dados offline
- **Critérios de Aceitação:**
  - [ ] Botão de exportar em todas as listagens
  - [ ] Formatos: CSV e Excel (.xlsx)
  - [ ] Respeitar filtros ativos
  - [ ] Incluir todas as colunas relevantes
- **Estimativa:** 5 pontos
- **Prioridade:** 🟡 Média
- **Status:** 📋 To Do

---

#### 📌 US-5.5: Loading States e Feedback
- **Como:** Usuário
- **Quero:** Ver indicadores visuais durante operações
- **Para:** Entender que o sistema está processando
- **Critérios de Aceitação:**
  - [ ] Spinners em botões durante submit
  - [ ] Skeleton screens em listagens
  - [ ] Toast notifications para sucesso/erro
  - [ ] Estados vazios com ilustrações
  - [ ] Mensagens de erro claras
- **Estimativa:** 5 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

### ÉPICO 6️⃣: Validações e Regras de Negócio
**Objetivo:** Garantir integridade e consistência dos dados

#### 📌 US-6.1: Validações de Formulário Melhoradas
- **Como:** Agente
- **Quero:** Receber feedback claro sobre erros de preenchimento
- **Para:** Corrigir dados antes de salvar
- **Critérios de Aceitação:**
  - [ ] Validação em tempo real (on blur)
  - [ ] Mensagens de erro específicas por campo
  - [ ] Validação de CPF/CNPJ/Passaporte
  - [ ] Validação de datas (não permitir datas passadas)
  - [ ] Highlight de campos com erro
- **Estimativa:** 5 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

#### 📌 US-6.2: Prevenção de Duplicatas
- **Como:** Sistema
- **Quero:** Evitar cadastros duplicados
- **Para:** Manter base limpa
- **Critérios de Aceitação:**
  - [ ] Verificar documento antes de criar cliente
  - [ ] Sugerir clientes existentes ao digitar
  - [ ] Modal de confirmação se detectar possível duplicata
  - [ ] Busca por similaridade de nome
- **Estimativa:** 8 pontos
- **Prioridade:** 🟡 Média
- **Status:** 📋 To Do

---

#### 📌 US-6.3: Cálculos Automáticos
- **Como:** Sistema
- **Quero:** Calcular automaticamente valores
- **Para:** Evitar erros manuais
- **Critérios de Aceitação:**
  - [ ] Atualizar paidValue ao adicionar pagamento
  - [ ] Atualizar status da viagem baseado em pagamentos
  - [ ] Calcular saldo devedor (totalValue - paidValue)
  - [ ] Validar que paidValue não exceda totalValue
- **Estimativa:** 3 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

#### 📌 US-6.4: Permissões por Role
- **Como:** Sistema
- **Quero:** Restringir ações baseado no role do usuário
- **Para:** Garantir segurança
- **Critérios de Aceitação:**
  - [ ] Agent: só vê seus próprios clientes/viagens
  - [ ] Manager: vê tudo mas não deleta
  - [ ] Admin: acesso total
  - [ ] Middleware de verificação de permissões
  - [ ] Mensagens de "acesso negado" adequadas
- **Estimativa:** 8 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

### ÉPICO 7️⃣: Otimizações e Performance
**Objetivo:** Garantir sistema rápido e responsivo

#### 📌 US-7.1: Paginação em Listagens
- **Como:** Agente
- **Quero:** Navegar por páginas de resultados
- **Para:** Carregar dados rapidamente
- **Critérios de Aceitação:**
  - [ ] Paginação server-side
  - [ ] Controles de página (anterior, próxima, ir para)
  - [ ] Seleção de itens por página (10, 25, 50, 100)
  - [ ] Indicador de total de registros
  - [ ] URL com página atual
- **Estimativa:** 5 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

#### 📌 US-7.2: Cache e Otimização de Queries
- **Como:** Sistema
- **Quero:** Otimizar consultas ao banco
- **Para:** Reduzir tempo de resposta
- **Critérios de Aceitação:**
  - [ ] Uso de includes do Prisma onde necessário
  - [ ] Evitar N+1 queries
  - [ ] Índices nos campos mais consultados
  - [ ] Cache de dados estáticos (enums, etc)
- **Estimativa:** 8 pontos
- **Prioridade:** 🟡 Média
- **Status:** 📋 To Do

---

#### 📌 US-7.3: Responsividade Mobile
- **Como:** Agente mobile
- **Quero:** Usar o sistema no celular/tablet
- **Para:** Trabalhar de qualquer lugar
- **Critérios de Aceitação:**
  - [ ] Layout adaptado para telas pequenas
  - [ ] Menu hamburguer em mobile
  - [ ] Tabelas responsivas (scroll ou cards)
  - [ ] Forms otimizados para mobile
  - [ ] Testado em iOS e Android
- **Estimativa:** 13 pontos
- **Prioridade:** 🟡 Média
- **Status:** 📋 To Do

---

### ÉPICO 8️⃣: Testes e Qualidade
**Objetivo:** Garantir estabilidade e confiabilidade do sistema

#### 📌 US-8.1: Testes Unitários
- **Como:** Desenvolvedor
- **Quero:** Ter cobertura de testes unitários
- **Para:** Garantir que funções críticas funcionam
- **Critérios de Aceitação:**
  - [ ] Setup de Jest + Testing Library
  - [ ] Testes de utils e helpers
  - [ ] Testes de services
  - [ ] Cobertura mínima de 60%
- **Estimativa:** 8 pontos
- **Prioridade:** 🟢 Baixa (pós-MVP)
- **Status:** 📋 To Do

---

#### 📌 US-8.2: Testes de Integração (API)
- **Como:** Desenvolvedor
- **Quero:** Testar endpoints da API
- **Para:** Garantir contratos corretos
- **Critérios de Aceitação:**
  - [ ] Testes de todas as rotas principais
  - [ ] Testes de autenticação
  - [ ] Testes de validações
  - [ ] Testes de permissões
- **Estimativa:** 13 pontos
- **Prioridade:** 🟢 Baixa (pós-MVP)
- **Status:** 📋 To Do

---

#### 📌 US-8.3: Tratamento de Erros
- **Como:** Usuário
- **Quero:** Ver mensagens claras quando algo der errado
- **Para:** Entender o que aconteceu
- **Critérios de Aceitação:**
  - [ ] Página de erro 404 personalizada
  - [ ] Página de erro 500 personalizada
  - [ ] Error boundaries em React
  - [ ] Logs estruturados de erros
  - [ ] Mensagens amigáveis ao usuário
- **Estimativa:** 5 pontos
- **Prioridade:** 🔴 Alta
- **Status:** 📋 To Do

---

### ÉPICO 9️⃣: Configurações e Personalização
**Objetivo:** Permitir customização do sistema

#### 📌 US-9.1: Configurações da Agência
- **Como:** Administrador
- **Quero:** Configurar informações da minha agência
- **Para:** Personalizar o sistema
- **Critérios de Aceitação:**
  - [ ] Nome da agência, logo, cores
  - [ ] Endereço, telefone, e-mail
  - [ ] Configurações de moeda padrão
  - [ ] Termos de serviço personalizados
- **Estimativa:** 8 pontos
- **Prioridade:** 🟢 Baixa (pós-MVP)
- **Status:** 📋 To Do

---

#### 📌 US-9.2: Templates de E-mail
- **Como:** Administrador
- **Quero:** Customizar templates de e-mail
- **Para:** Adequar comunicação à minha marca
- **Critérios de Aceitação:**
  - [ ] Editor de templates
  - [ ] Variáveis dinâmicas (nome, data, etc)
  - [ ] Pré-visualização
  - [ ] Reset para padrão
- **Estimativa:** 13 pontos
- **Prioridade:** 🟢 Baixa (pós-MVP)
- **Status:** 📋 To Do

---

## 📊 RESUMO E MÉTRICAS

### Por Prioridade

| Prioridade | Total de Pontos | % do Total | User Stories |
|-----------|----------------|------------|--------------|
| 🔴 Alta | 78 pontos | 41% | 13 stories |
| 🟡 Média | 60 pontos | 32% | 11 stories |
| 🟢 Baixa | 50 pontos | 27% | 6 stories |
| **TOTAL** | **188 pontos** | **100%** | **30 stories** |

### Por Épico

| Épico | Pontos | Stories | Status |
|-------|--------|---------|--------|
| 1️⃣ Autenticação | 16 pts | 3 | 📋 To Do |
| 2️⃣ Relatórios | 29 pts | 3 | 📋 To Do |
| 3️⃣ Notificações | 21 pts | 3 | 📋 To Do |
| 4️⃣ Auditoria | 18 pts | 3 | 📋 To Do |
| 5️⃣ UX/UI | 26 pts | 5 | 📋 To Do |
| 6️⃣ Validações | 24 pts | 4 | 📋 To Do |
| 7️⃣ Performance | 26 pts | 3 | 📋 To Do |
| 8️⃣ Testes | 26 pts | 3 | 📋 To Do |
| 9️⃣ Configurações | 21 pts | 2 | 📋 To Do |

---

## 🎯 PLANO DE SPRINTS (2 semanas cada)

### **Sprint 1** - Segurança e Permissões
**Objetivo:** Estabelecer base de segurança e controle de acesso

| ID | Story | Pontos |
|----|-------|--------|
| US-1.1 | Recuperação de Senha | 5 pts |
| US-6.4 | Permissões por Role | 8 pts |
| US-8.3 | Tratamento de Erros | 5 pts |
| **TOTAL** | | **18 pts** |

**Entregáveis:**
- ✅ Recuperação de senha funcional
- ✅ Sistema de permissões implementado
- ✅ Páginas de erro customizadas

---

### **Sprint 2** - Relatórios Base
**Objetivo:** Fornecer visibilidade sobre vendas e finanças

| ID | Story | Pontos |
|----|-------|--------|
| US-2.1 | Relatório de Vendas | 8 pts |
| US-2.2 | Relatório de Pagamentos | 8 pts |
| **TOTAL** | | **16 pts** |

**Entregáveis:**
- ✅ Relatório de vendas com filtros
- ✅ Relatório financeiro
- ✅ Exportação para Excel

---

### **Sprint 3** - UX e Busca
**Objetivo:** Melhorar experiência do usuário e navegabilidade

| ID | Story | Pontos |
|----|-------|--------|
| US-5.1 | Busca Global | 8 pts |
| US-5.2 | Filtros Viagens | 5 pts |
| US-5.5 | Loading States | 5 pts |
| **TOTAL** | | **18 pts** |

**Entregáveis:**
- ✅ Busca global com Ctrl+K
- ✅ Filtros avançados em viagens
- ✅ Loading states e feedback visual

---

### **Sprint 4** - Validações e Admin
**Objetivo:** Garantir qualidade de dados e gestão administrativa

| ID | Story | Pontos |
|----|-------|--------|
| US-1.3 | Gestão de Usuários | 8 pts |
| US-6.1 | Validações Melhoradas | 5 pts |
| US-6.3 | Cálculos Automáticos | 3 pts |
| US-4.1 | Log de Atividades | 5 pts |
| **TOTAL** | | **21 pts** |

**Entregáveis:**
- ✅ CRUD de usuários para admin
- ✅ Validações robustas em forms
- ✅ Cálculos automáticos de valores
- ✅ Sistema de auditoria básico

---

### **Sprint 5** - Paginação e Polish
**Objetivo:** Otimizar performance e finalizar MVP

| ID | Story | Pontos |
|----|-------|--------|
| US-7.1 | Paginação | 5 pts |
| US-1.2 | Perfil de Usuário | 3 pts |
| US-5.3 | Filtros Clientes | 3 pts |
| US-5.4 | Exportação de Dados | 5 pts |
| **TOTAL** | | **16 pts** |

**Entregáveis:**
- ✅ Paginação server-side
- ✅ Página de perfil do usuário
- ✅ Filtros avançados em clientes
- ✅ Exportação CSV/Excel

---

## 📈 ROADMAP VISUAL

```
Sprint 1 (18pts) ────▶ Sprint 2 (16pts) ────▶ Sprint 3 (18pts)
[Segurança]           [Relatórios]           [UX/Busca]
    │                      │                      │
    ├─ US-1.1             ├─ US-2.1              ├─ US-5.1
    ├─ US-6.4             └─ US-2.2              ├─ US-5.2
    └─ US-8.3                                    └─ US-5.5
                                                      │
Sprint 4 (21pts) ────▶ Sprint 5 (16pts) ────▶ 🎉 MVP RELEASE
[Admin/Validações]    [Performance]
    │                      │
    ├─ US-1.3             ├─ US-7.1
    ├─ US-6.1             ├─ US-1.2
    ├─ US-6.3             ├─ US-5.3
    └─ US-4.1             └─ US-5.4
```

**Timeline Estimado:** 10 semanas (2.5 meses)

---

## 🎯 DEFINIÇÃO DE PRONTO (DoD)

Para uma User Story ser considerada "Done", ela deve:

- [ ] ✅ Código implementado e revisado
- [ ] ✅ Testes manuais realizados
- [ ] ✅ Documentação atualizada (se aplicável)
- [ ] ✅ Deploy em ambiente de staging
- [ ] ✅ Aprovação do Product Owner
- [ ] ✅ Sem bugs críticos conhecidos
- [ ] ✅ Responsivo (mobile + desktop)
- [ ] ✅ Mensagens de erro/sucesso adequadas

---

## 📝 NOTAS E OBSERVAÇÕES

### Dependências Técnicas
- **US-6.4** (Permissões) deve ser feita antes de **US-1.3** (Gestão de Usuários)
- **US-4.1** (Log) deve ser implementado antes de **US-4.2** (Timeline)
- **US-7.1** (Paginação) impacta todas as listagens

### Riscos Identificados
- ⚠️ Complexidade do sistema de permissões pode aumentar escopo
- ⚠️ Integração de e-mail pode ter bloqueios de infraestrutura
- ⚠️ Responsividade mobile pode demandar mais tempo que estimado

### Tecnologias a Adicionar
- 📦 `nodemailer` - Envio de e-mails
- 📦 `xlsx` - Exportação para Excel
- 📦 `react-to-print` - Exportação para PDF
- 📦 `date-fns` - Manipulação de datas
- 📦 `recharts` ou `chart.js` - Gráficos

---

## 🔄 CONTROLE DE VERSÃO

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | 06/10/2025 | Claude Code | Versão inicial do backlog MVP |

---

## 📞 Contatos

Para dúvidas sobre o backlog:
- **Product Owner:** Arthur Maurício
- **Email:** arthur.mdx1234@gmail.com
- **LinkedIn:** [Arthur Mauricio](https://www.linkedin.com/in/arthur-mauricio-214a5323a/)

---

<div align="center">

**🚀 Vamos construir o melhor CRM para agências de viagem!**

[⬆ Voltar ao topo](#-backlog-scrum-mvp---agentflow-crm)

</div>
