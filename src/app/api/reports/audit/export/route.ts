import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { hasPermission, Permission } from '@/lib/permissions';
import { auditFiltersSchema } from '@/lib/validations';
import { activity_type } from '@prisma/client';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * POST /api/reports/audit/export
 * Exporta log de auditoria em CSV ou PDF
 * Permissão: Admin apenas
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar permissão
    if (!hasPermission(session as any, Permission.VIEW_AUDIT_LOG)) {
      return NextResponse.json(
        { error: 'Sem permissão para exportar log de auditoria' },
        { status: 403 }
      );
    }

    // Obter body
    const body = await request.json();
    const { format: exportFormat, ...filterParams } = body;

    // Validar filtros
    const filters = auditFiltersSchema.parse({
      ...filterParams,
      page: 1,
      limit: 10000, // Limite alto para exportação
    });

    // Validar formato
    if (!exportFormat || !['csv', 'pdf'].includes(exportFormat)) {
      return NextResponse.json(
        { error: 'Formato inválido. Use "csv" ou "pdf"' },
        { status: 400 }
      );
    }

    // Construir WHERE clause (mesmo do GET)
    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDate;
      }
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.activityType) {
      where.activityType = filters.activityType as activity_type;
    }

    if (filters.entityType) {
      if (filters.entityType === 'travel') {
        where.travelId = { not: null };
      } else if (filters.entityType === 'customer') {
        where.customerId = { not: null };
        where.travelId = null;
      } else if (filters.entityType === 'payment') {
        where.title = { contains: 'pagamento', mode: 'insensitive' as any };
      }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' as any } },
        { description: { contains: filters.search, mode: 'insensitive' as any } },
      ];
    }

    // Buscar todas as atividades
    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        travel: {
          select: {
            title: true,
            destination: true,
          },
        },
        customer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10000, // Limite de segurança
    });

    // Formatar dados
    const formattedData = activities.map(activity => ({
      data: activity.createdAt ? format(new Date(activity.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '',
      usuario: `${activity.user.firstName} ${activity.user.lastName}`,
      tipo: translateActivityType(activity.activityType),
      titulo: activity.title,
      descricao: activity.description || '',
      viagem: activity.travel ? `${activity.travel.title} - ${activity.travel.destination}` : '',
      cliente: activity.customer ? `${activity.customer.firstName} ${activity.customer.lastName}` : '',
    }));

    // Exportar conforme formato
    if (exportFormat === 'csv') {
      // Gerar CSV
      const csv = Papa.unparse(formattedData, {
        delimiter: ',',
        header: true,
        columns: ['data', 'usuario', 'tipo', 'titulo', 'descricao', 'viagem', 'cliente'],
      });

      // Retornar CSV
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="auditoria_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv"`,
        },
      });

    } else {
      // Gerar PDF
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Título
      doc.setFontSize(18);
      doc.text('Relatório de Auditoria', 14, 15);

      // Informações do filtro
      doc.setFontSize(10);
      let yPos = 25;
      if (filters.startDate || filters.endDate) {
        const dateRange = `Período: ${filters.startDate ? format(new Date(filters.startDate), 'dd/MM/yyyy', { locale: ptBR }) : '...'} até ${filters.endDate ? format(new Date(filters.endDate), 'dd/MM/yyyy', { locale: ptBR }) : '...'}`;
        doc.text(dateRange, 14, yPos);
        yPos += 5;
      }

      doc.text(`Total de registros: ${activities.length}`, 14, yPos);
      yPos += 5;
      doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, yPos);
      yPos += 10;

      // Tabela
      autoTable(doc, {
        startY: yPos,
        head: [['Data/Hora', 'Usuário', 'Tipo', 'Título', 'Descrição', 'Viagem', 'Cliente']],
        body: formattedData.map(row => [
          row.data,
          row.usuario,
          row.tipo,
          row.titulo,
          row.descricao,
          row.viagem,
          row.cliente,
        ]),
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [59, 130, 246], // Primary color
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
        margin: { top: 10, left: 14, right: 14 },
      });

      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Retornar PDF
      const pdfBuffer = doc.output('arraybuffer');

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="auditoria_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.pdf"`,
        },
      });
    }

  } catch (error) {
    console.error('[AUDIT EXPORT API] Error:', error);

    // Erro de validação Zod
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Parâmetros inválidos', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao exportar log de auditoria' },
      { status: 500 }
    );
  }
}

/**
 * Traduz o tipo de atividade para português
 */
function translateActivityType(type: activity_type): string {
  const translations: Record<activity_type, string> = {
    status_change: 'Mudança de Status',
    payment: 'Pagamento',
    contact: 'Contato',
    note: 'Nota',
    created: 'Criação',
    updated: 'Atualização',
  };

  return translations[type] || type;
}
