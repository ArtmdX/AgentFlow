'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { exportToCSV, exportToPDF } from '@/lib/export';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  columns: Array<{ header: string; dataKey: string }>;
  title?: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function ExportButton({
  data,
  filename,
  columns,
  title,
  variant = 'outline',
  size = 'sm'
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | null>(null);
  const [progress, setProgress] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (data.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    setIsExporting(true);
    setExportFormat(format);
    setProgress(0);
    setShowMenu(false);

    try {
      // Simular progresso para melhor UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Aguardar um pouco para dar tempo de ver o progresso
      await new Promise(resolve => setTimeout(resolve, 500));

      if (format === 'csv') {
        exportToCSV(data, filename);
      } else {
        exportToPDF(data, columns, filename, title);
      }

      clearInterval(progressInterval);
      setProgress(100);

      // Resetar após 1 segundo
      setTimeout(() => {
        setIsExporting(false);
        setExportFormat(null);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar dados. Tente novamente.');
      setIsExporting(false);
      setExportFormat(null);
      setProgress(0);
    }
  };

  return (
    <div className="relative">
      {!isExporting ? (
        <div className="relative">
          <Button
            variant={variant}
            size={size}
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>

          {showMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                >
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">Exportar CSV</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 rounded-b-lg"
                >
                  <FileText className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-700">Exportar PDF</span>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          <div className="flex-1">
            <div className="text-xs text-blue-700 mb-1">
              Exportando {exportFormat?.toUpperCase()}...
            </div>
            <div className="w-32 h-1.5 bg-blue-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-xs font-semibold text-blue-700">{progress}%</div>
        </div>
      )}
    </div>
  );
}
