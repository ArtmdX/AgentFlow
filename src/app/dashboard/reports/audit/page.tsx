'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import AuditFilters, { AuditFilterValues } from '@/components/reports/AuditFilters';
import AuditTable from '@/components/reports/AuditTable';
import AuditStats from '@/components/reports/AuditStats';

export default function AuditReportPage() {
  const [filters, setFilters] = useState<AuditFilterValues>({});
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Buscar dados de auditoria
  const { data, isLoading, error } = useQuery({
    queryKey: ['audit', filters, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '50',
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
  });

  // Handler para mudança de filtros
  const handleFilterChange = (newFilters: AuditFilterValues) => {
    setFilters(newFilters);
    setPage(1); // Reset para primeira página
  };

  // Handler para mudança de página
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler para exportação
  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);

    try {
      const response = await fetch('/api/reports/audit/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          ...filters,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao exportar dados');
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

      toast.success(`Arquivo ${format.toUpperCase()} exportado com sucesso!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao exportar dados');
    } finally {
      setIsExporting(false);
    }
  };

  // Estados de erro
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">
                Erro ao carregar relatório de auditoria
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {error instanceof Error ? error.message : 'Erro desconhecido'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary-600" />
            Relatório de Auditoria
          </h1>
          <p className="text-gray-600 mt-1">
            Visualize e analise todas as atividades do sistema
          </p>
        </div>
      </div>

      {/* Filtros */}
      <AuditFilters
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600" />
          <p className="text-gray-600 mt-4">Carregando dados...</p>
        </div>
      )}

      {/* Conteúdo */}
      {!isLoading && data?.success && (
        <>
          {/* Estatísticas */}
          <AuditStats statistics={data.data.statistics} />

          {/* Tabela */}
          <AuditTable
            activities={data.data.activities}
            pagination={data.data.pagination}
            onPageChange={handlePageChange}
            onExport={handleExport}
            isExporting={isExporting}
          />
        </>
      )}

      {/* Empty State */}
      {!isLoading && data?.success && data.data.activities.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            Nenhuma atividade encontrada
          </h3>
          <p className="text-gray-600 mt-2">
            Ajuste os filtros para ver mais resultados
          </p>
        </div>
      )}
    </div>
  );
}
