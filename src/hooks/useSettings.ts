/**
 * React Query hooks for Settings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AgencySettings, SmtpTestData } from '@/lib/validations';

/**
 * Fetch settings
 */
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/settings');
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao buscar configurações');
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Update settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AgencySettings) => {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao atualizar configurações');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

/**
 * Test SMTP connection
 */
export function useTestSmtp() {
  return useMutation({
    mutationFn: async (config: SmtpTestData) => {
      const res = await fetch('/api/settings/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();

      if (!res.ok && !data.success) {
        throw new Error(data.error || data.message || 'Erro ao testar conexão SMTP');
      }

      return data;
    },
  });
}

/**
 * Upload logo
 */
export function useUploadLogo() {
  return useMutation({
    mutationFn: async (file: { file: string; filename: string }) => {
      const res = await fetch('/api/settings/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(file),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao fazer upload do logo');
      }

      return res.json();
    },
  });
}

/**
 * Export backup
 */
export function useExportBackup() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/settings/backup');

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao exportar backup');
      }

      // Download file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agentflow-settings-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true, message: 'Backup exportado com sucesso' };
    },
  });
}

/**
 * Import backup
 */
export function useImportBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (backupData: any) => {
      const res = await fetch('/api/settings/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao importar backup');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}
