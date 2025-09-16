'use client';

import { useState, useEffect, useCallback } from 'react';
import { Filter, CreditCard, Calendar, User, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import PaymentForm from '@/components/forms/PaymentForm';
import { TableSkeleton, CardSkeleton } from '@/components/ui/Loading';
import { formatPaymentMethod, formatCurrency, deletePayment } from '@/services/paymentService';
import { toast } from 'react-toastify';

interface PaymentData {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
  travel: {
    id: string;
    title: string;
    destination: string;
    customer: {
      firstName: string;
      lastName: string;
    };
  };
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

interface PaymentStats {
  totalAmount: number;
  totalCount: number;
  byPaymentMethod: Array<{
    method: string;
    amount: number;
    count: number;
  }>;
  byCurrency: Array<{
    currency: string;
    amount: number;
    count: number;
  }>;
}

interface PaymentsResponse {
  payments: PaymentData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: PaymentStats;
}

export default function PaymentsPage() {
  const [data, setData] = useState<PaymentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentData | null>(null);

  // Filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const { openDialog, ConfirmDialog: ConfirmDialogComponent } = useConfirmDialog();

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (paymentMethodFilter) params.append('paymentMethod', paymentMethodFilter);
      if (startDateFilter) params.append('startDate', startDateFilter);
      if (endDateFilter) params.append('endDate', endDateFilter);

      const response = await fetch(`/api/payments?${params}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar pagamentos');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [currentPage, paymentMethodFilter, startDateFilter, endDateFilter]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await deletePayment(paymentId);
      toast.success('Pagamento excluído com sucesso!');
      loadPayments();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir pagamento');
    }
  };

  const confirmDelete = (payment: PaymentData) => {
    openDialog({
      title: 'Excluir Pagamento',
      message: `Tem certeza que deseja excluir o pagamento de ${formatCurrency(payment.amount, payment.currency)}?`,
      variant: 'danger',
      confirmText: 'Excluir',
      onConfirm: () => handleDeletePayment(payment.id)
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const clearFilters = () => {
    setPaymentMethodFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
          <p className="text-gray-600">Gerencie todos os pagamentos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <TableSkeleton rows={5} cols={6} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
          <p className="text-gray-600">Gerencie todos os pagamentos</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">Erro: {error}</p>
          <button
            onClick={loadPayments}
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
            <p className="text-gray-600">Gerencie todos os pagamentos</p>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-50">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Recebido</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.stats.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Pagamentos</p>
                <p className="text-2xl font-bold text-gray-900">{data.stats.totalCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Método Mais Usado</p>
              <p className="text-lg font-bold text-gray-900">
                {data.stats.byPaymentMethod.length > 0
                  ? formatPaymentMethod(data.stats.byPaymentMethod[0].method)
                  : 'N/A'
                }
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Moeda Principal</p>
              <p className="text-lg font-bold text-gray-900">
                {data.stats.byCurrency.length > 0
                  ? data.stats.byCurrency[0].currency
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </h3>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Método de Pagamento"
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
              >
                <option value="">Todos os métodos</option>
                <option value="cash">Dinheiro</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="debit_card">Cartão de Débito</option>
                <option value="bank_transfer">Transferência Bancária</option>
                <option value="pix">PIX</option>
                <option value="check">Cheque</option>
              </Select>

              <Input
                label="Data Inicial"
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
              />

              <Input
                label="Data Final"
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Lista de Pagamentos */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Pagamentos ({data.pagination.total})
            </h3>
          </div>

          {data.payments.length === 0 ? (
            <div className="p-6 text-center">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum pagamento encontrado</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Viagem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado por
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(payment.paymentDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPaymentMethod(payment.paymentMethod)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/dashboard/travels/${payment.travel.id}`}
                          className="text-sm text-blue-600 hover:text-blue-900"
                        >
                          {payment.travel.title}
                        </Link>
                        <div className="text-xs text-gray-500">
                          {payment.travel.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.travel.customer.firstName} {payment.travel.customer.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {payment.createdBy.firstName} {payment.createdBy.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/dashboard/travels/${payment.travel.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver viagem"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setEditingPayment(payment)}
                            className="text-green-600 hover:text-green-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(payment)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginação */}
          {data.pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Página {data.pagination.page} de {data.pagination.totalPages}
                ({data.pagination.total} total)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= data.pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Editar Pagamento */}
      <Modal
        isOpen={!!editingPayment}
        onClose={() => setEditingPayment(null)}
        title="Editar Pagamento"
        size="lg"
      >
        {editingPayment && (
          <PaymentForm
            travelId={editingPayment.travel.id}
            payment={editingPayment}
            onSuccess={() => {
              setEditingPayment(null);
              loadPayments();
            }}
            onCancel={() => setEditingPayment(null)}
          />
        )}
      </Modal>

      {/* Dialog de Confirmação */}
      <ConfirmDialogComponent />
    </>
  );
}