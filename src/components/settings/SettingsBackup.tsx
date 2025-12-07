'use client';

/**
 * SettingsBackup Component
 * Export and import settings backup
 */

import { useState, useRef, ChangeEvent } from 'react';
import { Download, Upload, AlertTriangle, Database } from 'lucide-react';
import { useExportBackup, useImportBackup } from '@/hooks/useSettings';

export default function SettingsBackup() {
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importData, setImportData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportBackup = useExportBackup();
  const importBackup = useImportBackup();

  const handleExport = async () => {
    try {
      await exportBackup.mutateAsync();
      alert('Backup exportado com sucesso!');
    } catch (error: any) {
      alert('Erro ao exportar backup: ' + error.message);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setImportData(json);
        setShowImportConfirm(true);
      } catch (_error) {
        alert('Arquivo inválido. Selecione um arquivo JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleImportConfirm = async () => {
    try {
      await importBackup.mutateAsync(importData);
      alert('Backup importado com sucesso! As configurações foram restauradas.');
      setShowImportConfirm(false);
      setImportData(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      alert('Erro ao importar backup: ' + error.message);
    }
  };

  const handleImportCancel = () => {
    setShowImportConfirm(false);
    setImportData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Database className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Backup e Restauração</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">Informação</p>
        <p>
          Faça backup das configurações do sistema para restaurá-las posteriormente ou
          transferi-las para outra instalação do AgentFlow.
        </p>
      </div>

      {/* Export Backup */}
      <div className="border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-800 mb-1">
              Exportar Backup
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Baixe um arquivo JSON com todas as configurações atuais do sistema.
              Este arquivo pode ser usado para restaurar as configurações ou
              transferi-las para outra instalação.
            </p>
            <button
              onClick={handleExport}
              disabled={exportBackup.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              {exportBackup.isPending ? 'Exportando...' : 'Exportar Configurações'}
            </button>
          </div>
        </div>
      </div>

      {/* Import Backup */}
      <div className="border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Upload className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-800 mb-1">
              Importar Backup
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Restaure as configurações a partir de um arquivo de backup.
              <strong className="text-red-600"> ATENÇÃO:</strong> Esta ação
              substituirá todas as configurações atuais.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              id="backup-import"
            />
            <label
              htmlFor="backup-import"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              Selecionar Arquivo de Backup
            </label>
          </div>
        </div>
      </div>

      {/* Import Confirmation Modal */}
      {showImportConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Confirmar Importação
                </h3>
                <p className="text-sm text-gray-600">
                  Tem certeza que deseja importar este backup? Todas as
                  configurações atuais serão substituídas.
                </p>
              </div>
            </div>

            {importData?._metadata && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                <p className="text-gray-600">
                  <strong>Backup criado em:</strong>{' '}
                  {new Date(importData._metadata.exportedAt).toLocaleString('pt-BR')}
                </p>
                <p className="text-gray-600">
                  <strong>Versão:</strong> {importData._metadata.version}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleImportCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportConfirm}
                disabled={importBackup.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {importBackup.isPending ? 'Importando...' : 'Confirmar Importação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <p className="font-medium mb-1">Atenção</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Guarde os arquivos de backup em local seguro</li>
          <li>Faça backups regulares, especialmente antes de grandes alterações</li>
          <li>Verifique o arquivo de backup antes de importar</li>
          <li>A importação NÃO pode ser desfeita. Faça backup antes de importar!</li>
        </ul>
      </div>
    </div>
  );
}
