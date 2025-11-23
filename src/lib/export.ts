import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Exporta dados para CSV
 */
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exporta dados para PDF
 */
export function exportToPDF(
  data: Record<string, unknown>[],
  columns: { header: string; dataKey: string }[],
  filename: string,
  title?: string
): void {
  const doc = new jsPDF();

  // Adicionar título se fornecido
  if (title) {
    doc.setFontSize(16);
    doc.text(title, 14, 15);
  }

  // Adicionar tabela
  autoTable(doc, {
    startY: title ? 25 : 15,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.dataKey] || '')),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] } // Azul primário
  });

  doc.save(`${filename}.pdf`);
}

/**
 * Formata data para exibição
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata valor monetário para exportação
 */
export function formatCurrencyForExport(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(value);
}
