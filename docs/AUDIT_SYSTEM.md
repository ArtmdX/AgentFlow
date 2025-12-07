# Sistema de Relatório de Auditoria - Sprint 6

## Visão Geral

O Sistema de Relatório de Auditoria foi implementado na Sprint 6 para fornecer aos administradores uma visão completa de todas as atividades do sistema AgentFlow CRM.

## Funcionalidades

### 1. Visualização de Atividades
- Lista completa de todas as atividades do sistema
- Paginação com 50 registros por página
- Ordenação por data (mais recentes primeiro)

### 2. Filtros Avançados
- **Data**: Período específico (data início e fim)
- **Usuário**: Filtrar por usuário específico
- **Tipo de Atividade**:
  - Mudança de Status
  - Pagamento
  - Contato
  - Nota
  - Criação
  - Atualização
- **Tipo de Entidade**: Viagem, Cliente ou Pagamento
- **Busca Textual**: Buscar por título ou descrição

### 3. Estatísticas
- Total de atividades no período
- Distribuição por tipo de atividade (gráfico de pizza)
- Top 10 usuários mais ativos (gráfico de barras)
- Cards com informações resumidas

### 4. Detalhes da Atividade
- Modal com informações completas
- Metadados em formato JSON
- Informações do usuário que realizou a ação
- Viagem ou cliente relacionado
- Data e hora completa

### 5. Exportação
- **CSV**: Todos os campos em formato tabular
- **PDF**: Relatório formatado com tabelas e informações do filtro

## Arquitetura

### API Routes

#### GET /api/reports/audit
**Descrição**: Retorna lista paginada de atividades com filtros e estatísticas

**Query Parameters**:
- `page` (number, default: 1): Número da página
- `limit` (number, default: 50, max: 100): Registros por página
- `startDate` (string, optional): Data início (ISO format)
- `endDate` (string, optional): Data fim (ISO format)
- `userId` (UUID, optional): ID do usuário
- `activityType` (enum, optional): Tipo de atividade
- `entityType` (enum, optional): Tipo de entidade
- `search` (string, optional): Busca textual

**Response**:
```json
{
  "success": true,
  "data": {
    "activities": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "totalCount": 150,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "statistics": {
      "total": 150,
      "byType": [...],
      "byUser": [...]
    }
  }
}
```

**Permissão**: `VIEW_AUDIT_LOG` (Admin apenas)

#### POST /api/reports/audit/export
**Descrição**: Exporta log de auditoria em CSV ou PDF

**Body**:
```json
{
  "format": "csv" | "pdf",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "userId": "uuid",
  "activityType": "payment",
  "entityType": "travel",
  "search": "termo"
}
```

**Response**: Binary file (CSV ou PDF)

**Permissão**: `VIEW_AUDIT_LOG` (Admin apenas)

### Componentes

#### AuditFilters
**Localização**: `/src/components/reports/AuditFilters.tsx`

**Props**:
- `onFilterChange`: Callback quando filtros mudam
- `initialFilters`: Filtros iniciais

**Funcionalidades**:
- Busca com debounce de 500ms
- Modo expandido/recolhido
- Indicador de filtros ativos
- Botão de limpar filtros

#### AuditTable
**Localização**: `/src/components/reports/AuditTable.tsx`

**Props**:
- `activities`: Lista de atividades
- `pagination`: Dados de paginação
- `onPageChange`: Callback para mudança de página
- `onExport`: Callback para exportação
- `isExporting`: Estado de exportação

**Funcionalidades**:
- Tabela responsiva
- Click na linha abre modal de detalhes
- Botões de exportar CSV/PDF
- Paginação com navegação

#### AuditDetails
**Localização**: `/src/components/reports/AuditDetails.tsx`

**Props**:
- `activity`: Atividade a ser exibida
- `onClose`: Callback para fechar modal

**Funcionalidades**:
- Modal overlay
- Fechar com ESC ou botão
- Metadados formatados em JSON
- Informações do usuário e entidades

#### AuditStats
**Localização**: `/src/components/reports/AuditStats.tsx`

**Props**:
- `statistics`: Dados estatísticos

**Funcionalidades**:
- Cards com métricas principais
- Gráfico de pizza (Recharts)
- Gráfico de barras (Recharts)
- Cores consistentes com design system

### Página

#### /dashboard/reports/audit
**Localização**: `/src/app/dashboard/reports/audit/page.tsx`

**Funcionalidades**:
- React Query para data fetching
- Estados de loading e erro
- Integração de todos os componentes
- Download automático de arquivos exportados

## Validação

### Schema Zod
**Localização**: `/src/lib/validations.ts`

```typescript
export const auditFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userId: z.string().uuid().optional(),
  activityType: z.enum([...]).optional(),
  entityType: z.enum([...]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});
```

## Permissões

### Nova Permissão
**Localização**: `/src/lib/permissions.ts`

```typescript
Permission.VIEW_AUDIT_LOG = 'view_audit_log'
```

**Roles com Acesso**:
- Admin: ✅ (completo)
- Manager: ❌
- Agent: ❌

## Navegação

### Sidebar
**Localização**: `/src/components/layout/Sidebar.tsx`

Novo item adicionado em "Relatórios":
- **Auditoria**: `/dashboard/reports/audit` (somente admin)

## Banco de Dados

### Model Utilizado
O sistema utiliza o model `Activity` já existente no Prisma schema:

```prisma
model Activity {
  id           String        @id @default(uuid())
  travelId     String?
  customerId   String?
  userId       String
  activityType activity_type
  title        String
  description  String?
  metadata     Json?
  createdAt    DateTime?     @default(now())

  // Relations
  customer     Customer?
  travel       Travel?
  user         User
}
```

### Índices Utilizados
- `idx_activities_created`: Por data de criação
- `idx_activities_type`: Por tipo de atividade
- `idx_activities_user`: Por usuário
- `idx_activities_travel`: Por viagem
- `idx_activities_customer`: Por cliente

## Bibliotecas Utilizadas

- **papaparse**: Exportação CSV
- **jspdf + jspdf-autotable**: Exportação PDF
- **recharts**: Gráficos
- **date-fns**: Formatação de datas
- **@tanstack/react-query**: Data fetching
- **zod**: Validação de schemas

## Performance

### Otimizações
- Paginação server-side (50 registros por página)
- Índices do banco de dados
- Debounce na busca textual (500ms)
- Limite de 10.000 registros na exportação
- React Query cache

## Segurança

### Verificações
- Autenticação obrigatória
- Permissão `VIEW_AUDIT_LOG` verificada em todas as rotas
- Validação Zod de todos os inputs
- Sanitização de queries SQL via Prisma

## Testing

### Casos de Teste Sugeridos
1. Acesso sem autenticação
2. Acesso sem permissão (agent/manager)
3. Filtros individuais e combinados
4. Paginação
5. Exportação CSV/PDF
6. Busca textual
7. Modal de detalhes
8. Gráficos com dados vazios

## Troubleshooting

### Erro: "Sem permissão"
- Verificar se usuário é admin
- Verificar se permissão está no rolePermissions

### Gráficos não aparecem
- Verificar se Recharts está instalado
- Verificar console para erros de dados

### Exportação falha
- Verificar limites de memória (10k registros)
- Verificar se papaparse e jspdf estão instalados

## Próximos Passos (Futuro)

1. **Filtros Avançados**
   - Múltiplos usuários
   - Range de valores
   - Regex em busca

2. **Visualizações**
   - Timeline interativa
   - Heatmap de atividades
   - Comparação entre períodos

3. **Exportação**
   - Excel (.xlsx)
   - Email automático
   - Agendamento de relatórios

4. **Análises**
   - Tendências
   - Anomalias
   - Previsões

## Conclusão

O Sistema de Relatório de Auditoria está completo e pronto para uso. Ele fornece aos administradores uma ferramenta poderosa para monitorar todas as atividades do sistema, identificar padrões e exportar dados para análise externa.
