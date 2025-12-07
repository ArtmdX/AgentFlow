# API de Auditoria - Exemplos de Uso

## Visão Geral

Este documento contém exemplos práticos de uso da API de Auditoria do AgentFlow CRM.

## Endpoints

### 1. GET /api/reports/audit

#### Exemplo 1: Buscar todas as atividades (primeira página)
```bash
curl -X GET 'http://localhost:3000/api/reports/audit?page=1&limit=50' \
  -H 'Cookie: next-auth.session-token=...'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "uuid",
        "activityType": "payment",
        "title": "Pagamento recebido",
        "description": "Pagamento de R$ 1.000,00 via PIX",
        "metadata": {
          "amount": 1000,
          "currency": "BRL",
          "method": "pix"
        },
        "createdAt": "2024-12-06T10:30:00.000Z",
        "user": {
          "id": "uuid",
          "firstName": "João",
          "lastName": "Silva",
          "email": "joao@example.com"
        },
        "travel": {
          "id": "uuid",
          "title": "Paris - Lua de Mel",
          "destination": "Paris"
        },
        "customer": null
      }
    ],
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
      "byType": [
        { "type": "payment", "count": 45 },
        { "type": "status_change", "count": 38 },
        { "type": "created", "count": 30 },
        { "type": "updated", "count": 20 },
        { "type": "note", "count": 10 },
        { "type": "contact", "count": 7 }
      ],
      "byUser": [
        { "userId": "uuid1", "userName": "João Silva", "count": 50 },
        { "userId": "uuid2", "userName": "Maria Santos", "count": 40 },
        { "userId": "uuid3", "userName": "Pedro Costa", "count": 30 }
      ]
    }
  }
}
```

#### Exemplo 2: Filtrar por período
```bash
curl -X GET 'http://localhost:3000/api/reports/audit?startDate=2024-12-01&endDate=2024-12-31' \
  -H 'Cookie: next-auth.session-token=...'
```

#### Exemplo 3: Filtrar por usuário específico
```bash
curl -X GET 'http://localhost:3000/api/reports/audit?userId=550e8400-e29b-41d4-a716-446655440000' \
  -H 'Cookie: next-auth.session-token=...'
```

#### Exemplo 4: Filtrar por tipo de atividade
```bash
curl -X GET 'http://localhost:3000/api/reports/audit?activityType=payment' \
  -H 'Cookie: next-auth.session-token=...'
```

Tipos válidos:
- `status_change` - Mudança de Status
- `payment` - Pagamento
- `contact` - Contato
- `note` - Nota
- `created` - Criação
- `updated` - Atualização

#### Exemplo 5: Filtrar por tipo de entidade
```bash
curl -X GET 'http://localhost:3000/api/reports/audit?entityType=travel' \
  -H 'Cookie: next-auth.session-token=...'
```

Tipos válidos:
- `travel` - Viagem
- `customer` - Cliente
- `payment` - Pagamento

#### Exemplo 6: Busca textual
```bash
curl -X GET 'http://localhost:3000/api/reports/audit?search=pagamento' \
  -H 'Cookie: next-auth.session-token=...'
```

#### Exemplo 7: Filtros combinados
```bash
curl -X GET 'http://localhost:3000/api/reports/audit?startDate=2024-12-01&endDate=2024-12-31&activityType=payment&userId=550e8400-e29b-41d4-a716-446655440000&page=1&limit=50' \
  -H 'Cookie: next-auth.session-token=...'
```

#### Exemplo 8: Usando fetch() em JavaScript
```javascript
// Função para buscar atividades
async function fetchAuditLog(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 50,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
    ),
  });

  const response = await fetch(`/api/reports/audit?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao carregar auditoria');
  }

  return response.json();
}

// Uso
const data = await fetchAuditLog({
  startDate: '2024-12-01',
  endDate: '2024-12-31',
  activityType: 'payment',
  page: 1
});

console.log('Total:', data.data.statistics.total);
console.log('Atividades:', data.data.activities);
```

### 2. POST /api/reports/audit/export

#### Exemplo 1: Exportar para CSV
```bash
curl -X POST 'http://localhost:3000/api/reports/audit/export' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: next-auth.session-token=...' \
  -d '{
    "format": "csv"
  }' \
  --output auditoria.csv
```

#### Exemplo 2: Exportar para PDF
```bash
curl -X POST 'http://localhost:3000/api/reports/audit/export' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: next-auth.session-token=...' \
  -d '{
    "format": "pdf"
  }' \
  --output auditoria.pdf
```

#### Exemplo 3: Exportar com filtros
```bash
curl -X POST 'http://localhost:3000/api/reports/audit/export' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: next-auth.session-token=...' \
  -d '{
    "format": "csv",
    "startDate": "2024-12-01",
    "endDate": "2024-12-31",
    "activityType": "payment"
  }' \
  --output pagamentos_dezembro.csv
```

#### Exemplo 4: Usando fetch() em JavaScript
```javascript
// Função para exportar relatório
async function exportAuditLog(format, filters = {}) {
  const response = await fetch('/api/reports/audit/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      format, // 'csv' ou 'pdf'
      ...filters,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao exportar');
  }

  // Download do arquivo
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `auditoria_${new Date().toISOString().split('T')[0]}.${format}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Uso: Exportar CSV do mês atual
await exportAuditLog('csv', {
  startDate: '2024-12-01',
  endDate: '2024-12-31'
});

// Uso: Exportar PDF de pagamentos
await exportAuditLog('pdf', {
  activityType: 'payment'
});
```

## Erros Comuns

### 401 Unauthorized
```json
{
  "error": "Não autorizado"
}
```
**Solução**: Fazer login e incluir cookie de sessão

### 403 Forbidden
```json
{
  "error": "Sem permissão para visualizar log de auditoria"
}
```
**Solução**: Usuário precisa ser admin

### 400 Bad Request
```json
{
  "error": "Parâmetros inválidos",
  "details": {
    "issues": [
      {
        "code": "invalid_type",
        "path": ["userId"],
        "message": "ID do usuário inválido"
      }
    ]
  }
}
```
**Solução**: Verificar formato dos parâmetros

### 500 Internal Server Error
```json
{
  "error": "Erro ao buscar log de auditoria"
}
```
**Solução**: Verificar logs do servidor

## Casos de Uso

### Caso 1: Dashboard de Administrador
```javascript
// Buscar atividades recentes (últimas 24h)
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const recentActivities = await fetchAuditLog({
  startDate: yesterday.toISOString().split('T')[0],
  limit: 20
});
```

### Caso 2: Relatório Mensal
```javascript
// Exportar relatório mensal de dezembro
await exportAuditLog('pdf', {
  startDate: '2024-12-01',
  endDate: '2024-12-31'
});
```

### Caso 3: Monitorar Pagamentos
```javascript
// Buscar todos os pagamentos do dia
const today = new Date().toISOString().split('T')[0];

const payments = await fetchAuditLog({
  startDate: today,
  endDate: today,
  activityType: 'payment'
});

console.log(`${payments.data.statistics.total} pagamentos hoje`);
```

### Caso 4: Auditoria de Usuário Específico
```javascript
// Ver todas as ações de um usuário
const userActivities = await fetchAuditLog({
  userId: '550e8400-e29b-41d4-a716-446655440000',
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});

// Estatísticas por tipo
userActivities.data.statistics.byType.forEach(stat => {
  console.log(`${stat.type}: ${stat.count} ações`);
});
```

### Caso 5: Exportação Automática Semanal
```javascript
// Script para executar toda segunda-feira
async function weeklyExport() {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  await exportAuditLog('pdf', {
    startDate: lastWeek.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  });

  console.log('Relatório semanal exportado!');
}

// Executar
weeklyExport();
```

## React Query Hooks

### Hook Personalizado
```typescript
// hooks/useAuditLog.ts
import { useQuery } from '@tanstack/react-query';

interface AuditFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  activityType?: string;
  entityType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useAuditLog(filters: AuditFilters) {
  return useQuery({
    queryKey: ['audit', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(filters.page || 1),
        limit: String(filters.limit || 50),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
        ),
      });

      const response = await fetch(`/api/reports/audit?${params}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao carregar log de auditoria');
      }

      return response.json();
    },
    retry: 1,
    staleTime: 30000, // 30 segundos
  });
}

// Uso no componente
function AuditPage() {
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useAuditLog(filters);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h1>Total: {data.data.statistics.total}</h1>
      <ActivityList activities={data.data.activities} />
    </div>
  );
}
```

## Performance Tips

### 1. Use paginação
```javascript
// ✅ BOM - Paginação
await fetchAuditLog({ page: 1, limit: 50 });

// ❌ RUIM - Sem limite
await fetchAuditLog({ limit: 10000 });
```

### 2. Cache com React Query
```javascript
// ✅ BOM - Com cache
const { data } = useQuery({
  queryKey: ['audit', filters],
  queryFn: fetchAuditLog,
  staleTime: 30000 // 30s
});

// ❌ RUIM - Sem cache
useEffect(() => {
  fetchAuditLog().then(setData);
}, [filters]);
```

### 3. Debounce na busca
```javascript
// ✅ BOM - Com debounce
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

useAuditLog({ search: debouncedSearch });

// ❌ RUIM - Sem debounce
useAuditLog({ search });
```

## Conclusão

A API de Auditoria é poderosa e flexível. Use os exemplos acima como referência para implementar suas próprias integrações e automações.
