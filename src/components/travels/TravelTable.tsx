'use client';

import { useRouter } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { PlaneTakeoff, ShieldAlert, CircleCheck, Hourglass, XCircle, HandCoins } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Loading';
import Pagination, { PaginationInfo } from '@/components/ui/Pagination';

type TravelWithCustomer = Prisma.TravelGetPayload<{
  include: { customer: { select: { firstName: true; lastName: true } } };
}>;

interface TravelTableProps {
  travels: TravelWithCustomer[];
  pagination: PaginationInfo;
  isLoading: boolean;
  error: string | null;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    orcamento: { icon: Hourglass, color: 'text-blue-500', label: 'Orçamento' },
    aguardando_pagamento: { icon: HandCoins, color: 'text-yellow-500', label: 'Aguardando Pagamento' },
    confirmada: { icon: CircleCheck, color: 'text-green-500', label: 'Confirmada' },
    em_andamento: { icon: PlaneTakeoff, color: 'text-indigo-500', label: 'Em Andamento' },
    finalizada: { icon: CircleCheck, color: 'text-gray-500', label: 'Finalizada' },
    cancelada: { icon: XCircle, color: 'text-red-500', label: 'Cancelada' }
  };

  const currentStatus = statusMap[status as keyof typeof statusMap] || {
    icon: ShieldAlert,
    color: 'text-gray-500',
    label: 'Desconhecido'
  };
  const Icon = currentStatus.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.color}`}>
      <Icon className="h-4 w-4 mr-1.5" />
      {currentStatus.label}
    </span>
  );
};

export function TravelTable({ travels, pagination, isLoading, error, onPageChange, onLimitChange }: TravelTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Erro: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {travels.length === 0 ? (
          <p className="text-center text-gray-500 p-6">Nenhuma viagem encontrada.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partida</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {travels.map(travel => (
                <tr
                  key={travel.id}
                  className="hover:bg-indigo-100 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/travels/${travel.id}`)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{travel.title}</div>
                    <div className="text-sm text-gray-500">{travel.destination}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {`${travel.customer.firstName} ${travel.customer.lastName}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(travel.departureDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={travel.status ?? 'Orçamento'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {onPageChange && onLimitChange && pagination.total > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </>
  );
}
